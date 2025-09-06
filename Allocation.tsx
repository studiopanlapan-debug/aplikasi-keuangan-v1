import React from 'react';
import { Allocation as AllocationType } from '../types.ts';
import { formatToRupiah } from '../utils/formatters.ts';
import Card from './ui/Card.tsx';

interface AllocationProps {
  allocations: AllocationType[];
  totalAssets: number;
  updateAllocation: (id: string, updatedValues: Partial<AllocationType>) => void;
}

const Allocation: React.FC<AllocationProps> = ({ allocations, totalAssets, updateAllocation }) => {
    const inputClasses = "w-full min-w-[120px] bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-1.5 text-gray-900 dark:text-white focus:ring-sky-500 focus:border-sky-500 transition-colors";

    const handleCategoryChange = (id: string, value: string) => {
        updateAllocation(id, { category: value });
    };

    const handlePercentageChange = (id: string, value: string) => {
        const numValue = parseFloat(value);
        if(!isNaN(numValue)) {
            updateAllocation(id, { targetPercentage: numValue });
        }
    };

    const handleBalanceChange = (id: string, value: string) => {
        const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(numValue)) {
            updateAllocation(id, { actualBalance: numValue });
        } else {
            updateAllocation(id, { actualBalance: 0 });
        }
    };
    
    const handleTargetChange = (id: string, value: string) => {
        const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(numValue)) {
            updateAllocation(id, { specificTarget: numValue });
        } else {
            updateAllocation(id, { specificTarget: 0 });
        }
    };


    return (
        <Card title="Alokasi Persentase Aset">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 min-w-[200px]">Kategori</th>
                            <th scope="col" className="px-6 py-3">% Target</th>
                            <th scope="col" className="px-6 py-3">Nominal Target</th>
                            <th scope="col" className="px-6 py-3">Saldo Aktual</th>
                            <th scope="col" className="px-6 py-3">% Realisasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allocations.map((alloc) => {
                            const nominalTarget = alloc.specificTarget ?? (totalAssets * (alloc.targetPercentage / 100));
                            const realization = nominalTarget > 0 ? (alloc.actualBalance / nominalTarget) * 100 : 0;
                            
                            let realizationColor = 'text-yellow-500 dark:text-yellow-400';
                            if (realization >= 100) realizationColor = 'text-green-500 dark:text-green-400';
                            else if (realization < 50) realizationColor = 'text-red-500 dark:text-red-400';

                            return (
                                <tr key={alloc.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4">
                                        <input
                                            type="text"
                                            value={alloc.category}
                                            onChange={(e) => handleCategoryChange(alloc.id, e.target.value)}
                                            className={`${inputClasses} font-medium`}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <input 
                                                type="number" 
                                                value={alloc.targetPercentage}
                                                onChange={(e) => handlePercentageChange(alloc.id, e.target.value)}
                                                className={`${inputClasses} w-20 text-center`}
                                                step="1"
                                                min="0"
                                                max="100"
                                                disabled={alloc.specificTarget !== undefined}
                                                title={alloc.specificTarget !== undefined ? "Target % dihitung otomatis dari Nominal Target Spesifik" : ""}
                                            />
                                            <span className="ml-2">%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                         {alloc.specificTarget !== undefined ? (
                                            <input 
                                                type="text"
                                                value={formatToRupiah(alloc.specificTarget)}
                                                onChange={(e) => handleTargetChange(alloc.id, e.target.value)}
                                                className={inputClasses}
                                            />
                                        ) : (
                                            formatToRupiah(nominalTarget)
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <input 
                                            type="text"
                                            value={formatToRupiah(alloc.actualBalance)}
                                            onChange={(e) => handleBalanceChange(alloc.id, e.target.value)}
                                            className={inputClasses}
                                        />
                                    </td>
                                    <td className={`px-6 py-4 font-bold text-lg ${realizationColor}`}>
                                        {realization.toFixed(1)}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default Allocation;