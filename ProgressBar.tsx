import React from 'react';
import { formatToRupiah } from '../../utils/formatters';

interface ProgressBarProps {
  label: string;
  current: number;
  target: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ label, current, target }) => {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{`${Math.round(percentage)}%`}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className="bg-sky-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
       <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
         <span>{formatToRupiah(current)}</span>
         <span>{formatToRupiah(target)}</span>
       </div>
    </div>
  );
};

export default ProgressBar;