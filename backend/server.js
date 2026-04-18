// Import Express framework for building web server
import express from 'express';

// Import CORS to allow frontend (different port) to call this backend
import cors from 'cors';

// Import dotenv to load environment variables from .env file
import dotenv from 'dotenv';

// Import JWT for creating and verifying authentication tokens
import jwt from 'jsonwebtoken';

// Import database connection function
import connectDB from './config/db.js';

// Import Transaction model for database operations
import Transaction from './models/Transaction.js';

// Import User model for authentication
import User from './models/user.js';

// Import middleware to protect routes (checks JWT token)
import authMiddleware from './middleware/auth.js';

// Load environment variables from .env file into process.env
dotenv.config();

// Connect to MongoDB database
connectDB();

// Create Express application
const app = express();

// ========== GLOBAL MIDDLEWARE ==========

// Enable CORS - allows frontend (localhost:5173) to call backend (localhost:5000)
app.use(cors());

// Parse JSON request bodies - automatically converts JSON to JavaScript object
app.use(express.json());

// ========== TRANSACTION ROUTES ==========

// GET /api/transactions - Fetch all transactions for logged-in user with optional filters
app.get('/api/transactions', authMiddleware, async (req, res) => {
  try {
    // Extract query parameters from URL (e.g., ?type=expense&limit=10)
    const { startDate, endDate, type, category, limit } = req.query;

    // Build MongoDB query - only get transactions belonging to this user
    const query = { user: req.userId };

    // Add date range filter if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate); // Greater than or equal
      if (endDate) query.date.$lte = new Date(endDate);     // Less than or equal
    }

    // Add type filter if provided (income/expense)
    if (type) query.type = type;

    // Add category filter if provided (Food, Rent, etc.)
    if (category) query.category = category;

    // Build query - find matching docs, sort by newest first
    let transactionsQuery = Transaction.find(query).sort({ date: -1 });

    // Apply limit if provided (e.g., show only 5 recent transactions)
    if (limit) {
      const limitNum = parseInt(limit);
      // Validate limit is a positive number
      if (isNaN(limitNum) || limitNum <= 0) {
        return res.status(400).json({ message: 'Invalid limit parameter' });
      }
      transactionsQuery = transactionsQuery.limit(limitNum);
    }

    // Execute query and get transactions
    const transactions = await transactionsQuery;
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/transactions/stats - Get financial statistics (income, expense, balance)
app.get('/api/transactions/stats', authMiddleware, async (req, res) => {
  try {
    // Get period from query (week, month, year) - default to month
    const { period = 'month' } = req.query;
    const now = new Date();
    let startDate;

    // Calculate start date based on selected period
    if (period === 'week') {
      startDate = new Date(now.setDate(now.getDate() - 7)); // 7 days ago
    } else if (period === 'month') {
      startDate = new Date(now.setMonth(now.getMonth() - 1)); // 1 month ago
    } else if (period === 'year') {
      startDate = new Date(now.setFullYear(now.getFullYear() - 1)); // 1 year ago
    } else {
      startDate = new Date(now.setMonth(now.getMonth() - 1)); // Default to month
    }

    // Get all transactions for this user in the date range
    const transactions = await Transaction.find({
      user: req.userId,
      date: { $gte: startDate }
    });

    // Calculate total income - sum all income transactions
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate total expense - sum all expense transactions
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate net balance (income - expense)
    const balance = totalIncome - totalExpense;

    // Calculate category breakdown - group by category
    const categoryStats = {};
    transactions.forEach(t => {
      if (!categoryStats[t.category]) {
        categoryStats[t.category] = { income: 0, expense: 0 };
      }
      categoryStats[t.category][t.type] += t.amount;
    });

    // Send statistics back to frontend
    res.json({
      totalIncome,
      totalExpense,
      balance,
      categoryStats,
      transactionCount: transactions.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/transactions - Create a new transaction
app.post('/api/transactions', authMiddleware, async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;

    // === VALIDATION CHECKS ===

    // Check required fields exist
    if (!type) {
      return res.status(400).json({ message: 'Transaction type is required (income or expense)' });
    }
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }
    if (!amount && amount !== 0) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    // Validate type is either 'income' or 'expense'
    if (type !== 'income' && type !== 'expense') {
      return res.status(400).json({ message: 'Type must be either "income" or "expense"' });
    }

    // Validate amount is a positive number
    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ message: 'Amount must be a positive number' });
    }

    // Validate amount has at most 2 decimal places
    if (!/^\d+(\.\d{1,2})?$/.test(amountNum.toString())) {
      return res.status(400).json({ message: 'Amount can have at most 2 decimal places' });
    }

    // Validate category length
    if (category.length > 50) {
      return res.status(400).json({ message: 'Category name is too long (max 50 characters)' });
    }

    // Validate description length (if provided)
    if (description && description.length > 200) {
      return res.status(400).json({ message: 'Description is too long (max 200 characters)' });
    }

    // Validate date format (if provided)
    let validDate = date ? new Date(date) : new Date();
    if (date && isNaN(validDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Create new transaction document
    const transaction = new Transaction({
      user: req.userId, // Link to logged-in user
      type,
      category,
      amount: amountNum,
      description: description || '',
      date: validDate
    });

    // Save to database
    await transaction.save();
    res.status(201).json(transaction); // 201 = Created
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/transactions/:id - Update an existing transaction
app.put('/api/transactions/:id', authMiddleware, async (req, res) => {
  try {
    const { type, category, amount, description, date } = req.body;
    const updateData = {}; // Empty object to collect fields to update

    // Validate MongoDB ObjectId format (24 hex characters)
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }

    // Only update fields that are provided (partial updates)
    // Check if type was sent in request body
    if (type !== undefined) {
      if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ message: 'Type must be either "income" or "expense"' });
      }
      updateData.type = type; // Add type to update object
    }

    // Check if category was sent in request body
    if (category !== undefined) {
      if (category.length > 50) {
        return res.status(400).json({ message: 'Category name is too long (max 50 characters)' });
      }
      updateData.category = category; // Add category to update object
    }

    // Check if amount was sent in request body
    if (amount !== undefined) {
      const amountNum = Number(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        return res.status(400).json({ message: 'Amount must be a positive number' });
      }
      if (!/^\d+(\.\d{1,2})?$/.test(amountNum.toString())) {
        return res.status(400).json({ message: 'Amount can have at most 2 decimal places' });
      }
      updateData.amount = amountNum; // Add amount to update object
    }

    // Check if description was sent in request body
    if (description !== undefined) {
      if (description.length > 200) {
        return res.status(400).json({ message: 'Description is too long (max 200 characters)' });
      }
      updateData.description = description; // Add description to update object
    }

    // Check if date was sent in request body
    if (date !== undefined) {
      const validDate = new Date(date);
      if (isNaN(validDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
      }
      updateData.date = validDate; // Add date to update object
    }

    // Find and update - only if transaction belongs to this user (security)
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // Both conditions must match
      updateData, // Only update the fields that were provided
      { new: true, runValidators: true } // Return updated doc, run schema validators
    );

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/transactions/:id - Delete a transaction
app.delete('/api/transactions/:id', authMiddleware, async (req, res) => {
  try {
    // Validate MongoDB ObjectId format (24 hex characters)
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid transaction ID format' });
    }

    // Find and delete - only if transaction belongs to this user (security)
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== AUTHENTICATION ROUTES ==========

// POST /api/auth/register - Create new user account
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // === VALIDATION CHECKS ===

    // Check required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Validate name length (2-50 characters)
    if (name.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters' });
    }
    if (name.length > 50) {
      return res.status(400).json({ message: 'Name cannot exceed 50 characters' });
    }

    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate password length (6-100 characters)
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    if (password.length > 100) {
      return res.status(400).json({ message: 'Password cannot exceed 100 characters' });
    }

    // Check if user already exists (prevent duplicate emails)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password will be hashed by pre('save') middleware)
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token for automatic login after registration
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Data to store in token
      process.env.JWT_SECRET, // Secret key for signing
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Send token and user info back (excluding password)
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/auth/login - Authenticate existing user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    // Find user by email in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with stored hash using custom method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token for authenticated session
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send token and user info back (excluding password)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, currency: user.currency }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/auth/me - Get current logged-in user's profile
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    // Find user by ID from token, exclude password field from response
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/auth/settings - Update user settings (name, currency)
app.put('/api/auth/settings', authMiddleware, async (req, res) => {
  try {
    const { currency, name } = req.body;
    const updateData = {}; // Empty object to collect fields to update

    // Validate and update name if provided in request
    if (name !== undefined) {
      if (name.length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters' });
      }
      if (name.length > 50) {
        return res.status(400).json({ message: 'Name cannot exceed 50 characters' });
      }
      updateData.name = name; // Add name to update object
    }

    // Validate and update currency if provided in request
    if (currency !== undefined) {
      const validCurrencies = ['USD', 'EUR', 'GBP', 'PKR', 'INR'];
      if (!validCurrencies.includes(currency)) {
        return res.status(400).json({ message: 'Invalid currency. Supported: USD, EUR, GBP, PKR, INR' });
      }
      updateData.currency = currency; // Add currency to update object
    }

    // Find and update user, exclude password from response
    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData, // Only update the fields that were provided
      { new: true, runValidators: true } // Return updated doc, run validators
    ).select('-password'); // Exclude password from response

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== START SERVER ==========

// Get port from environment variable or use 5000 as default
const PORT = process.env.PORT || 5000;

// Start listening for incoming requests on specified port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});