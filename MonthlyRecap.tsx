
import React from 'react';
import { MonthlyRecapData } from '../types.ts';
import { formatToRupiah } from '../utils/formatters.ts';
import Card from './ui/Card.tsx';

interface MonthlyRecapProps {
  monthlyRecap: MonthlyRecapData[];
}

const MonthlyRecap: React.FC<MonthlyRecapProps> = ({ monthlyRecap }) => {
  return (
    <Card title="Rekapitulasi Bulanan">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
          <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">Bulan</th>
              <th scope="col" className="px-6 py-3">Saldo Awal</th>
              <th scope="col" className="px-6 py-3">Masuk (Job Luar)</th>
              <th scope="col" className="px-6 py-3">Masuk (Studio)</th>
              <th scope="col" className="px-6 py-3">Total Keluar</th>
              <th scope="col" className="px-6 py-3">Investasi</th>
              <th scope="col" className="px-6 py-3">Saldo Akhir</th>
            </tr>
          </thead>
          <tbody>
            {monthlyRecap.map((recap) => (
              <tr key={recap.month} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">{recap.month}</td>
                <td className="px-6 py-4">{formatToRupiah(recap.initialBalance)}</td>
                <td className="px-6 py-4 text-green-500 dark:text-green-400">{formatToRupiah(recap.totalIncomeSideJob)}</td>
                <td className="px-6 py-4 text-green-500 dark:text-green-400">{formatToRupiah(recap.totalIncomeStudio)}</td>
                <td className="px-6 py-4 text-red-500 dark:text-red-400">{formatToRupiah(recap.totalExpense)}</td>
                <td className="px-6 py-4 text-yellow-500 dark:text-yellow-400">{formatToRupiah(recap.investment)}</td>
                <td className="px-6 py-4 font-bold text-sky-600 dark:text-sky-400">{formatToRupiah(recap.finalBalance)}</td>
              </tr>
            ))}
             {monthlyRecap.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    Belum ada data untuk ditampilkan. Silakan tambah mutasi terlebih dahulu.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default MonthlyRecap;