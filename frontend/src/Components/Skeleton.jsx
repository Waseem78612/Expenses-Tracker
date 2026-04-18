// Components/Skeleton.jsx
const Skeleton = ({ type, count = 1, className = "" }) => {
  const skeletons = {
    // Card skeleton (for stats, transaction items)
    card: (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </div>
    ),

    // Chart skeleton
    chart: (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
      </div>
    ),

    // Transaction item skeleton
    transaction: (
      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
        <div className="flex-1 space-y-1">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
      </div>
    ),

    // Table row skeleton
    tableRow: (
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    ),

    // Text line skeleton
    text: (
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
    ),

    // Button skeleton
    button: (
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
    ),

    // Avatar skeleton
    avatar: (
      <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
    ),
  };

  const SkeletonComponent = skeletons[type] || skeletons.card;

  return (
    <>
      {Array(count)
        .fill()
        .map((_, i) => (
          <div key={i} className={className}>
            {SkeletonComponent}
          </div>
        ))}
    </>
  );
};

export default Skeleton;
