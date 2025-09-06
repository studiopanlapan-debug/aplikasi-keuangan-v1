import React from 'react';
import Card from './Card.tsx';

const SkeletonCard: React.FC<{className?: string}> = ({ className }) => {
  return (
    <Card className={className}>
      <div className="animate-pulse flex flex-col space-y-4 p-2">
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-48 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
      </div>
    </Card>
  );
};

export default SkeletonCard;
