
import React, { useState, useEffect } from 'react';
import { Assets } from '../types.ts';
import { formatToRupiah } from '../utils/formatters.ts';
import Card from './ui/Card.tsx';
import { PencilIcon, CheckIcon } from '@heroicons/react/24/solid';

interface MainBalanceProps {
  assets: Assets;
  totalAssets: number;
  lastUpdated: string | null;
  updateAllAssets: (newAssets: Assets, date: string) => void;
}

const assetLabels: { [key in keyof Assets]: string } = {
  bankA: 'Bank A',
  bankB: 'Bank B',
  cash: 'Cash',
  reksadana: 'Reksadana',
  eWallet: 'E-Wallet',
};

const MainBalance: React.FC<MainBalanceProps> = ({ assets, totalAssets, lastUpdated, updateAllAssets }) => {
  const [isEditing, setIsEditing] = useState(totalAssets === 0);
  const [formData, setFormData] = useState<Assets>(assets);
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (totalAssets === 0) {
      setIsEditing(true);
    }
    setFormData(assets);
  }, [assets, totalAssets]);

  const handleInputChange = (key: keyof Assets, value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ''), 10);
    setFormData(prev => ({
      ...prev,
      [key]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  const handleSave = () => {
    updateAllAssets(formData, formDate);
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
        <Card title={totalAssets === 0 ? "Masukkan Saldo Awal Anda" : "Update Saldo Utama"}>
            <div className="space-y-6">
                <div className="p-4 bg-sky-100 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-700 rounded-lg">
                    <p className="text-sm text-sky-800 dark:text-sky-200">
                        {totalAssets === 0
                            ? "Silakan masukkan saldo Anda saat ini di semua aset untuk memulai. Tanggal bisa disesuaikan jika Anda ingin mencatat saldo dari hari sebelumnya."
                            : "Ubah nilai saldo di bawah ini dan tentukan tanggal pencatatan, lalu simpan perubahan."
                        }
                    </p>
                </div>

                <div>
                    <label htmlFor="balance-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tanggal Pencatatan Saldo
                    </label>
                    <input
                        type="date"
                        id="balance-date"
                        value={formDate}
                        onChange={(e) => setFormDate(e.target.value)}
                        className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.keys(formData).map((key) => (
                        <div key={key}>
                            <label htmlFor={key} className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-1">
                                {assetLabels[key as keyof Assets]}
                            </label>
                            <input
                                type="text"
                                id={key}
                                value={formatToRupiah(formData[key as keyof Assets])}
                                onChange={(e) => handleInputChange(key as keyof Assets, e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-lg font-semibold rounded-md p-2 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>
                    ))}
                </div>
                
                <div className="flex justify-end gap-4 mt-4">
                     {totalAssets > 0 && (
                        <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 font-semibold transition-colors">
                            Batal
                        </button>
                     )}
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 font-semibold transition-colors">
                        <CheckIcon className="h-5 w-5" />
                        Simpan Saldo
                    </button>
                </div>
            </div>
        </Card>
    );
  }

  return (
    <Card>
        <div className="flex justify-between items-start mb-6">
            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Rincian Saldo Utama</h3>
                {lastUpdated && <p className="text-sm text-gray-500 dark:text-gray-400">Terakhir update: {new Date(lastUpdated).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>}
            </div>
            <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 font-semibold transition-colors text-sm">
                <PencilIcon className="h-4 w-4" />
                Update Saldo
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(assets).map(([key, value]) => (
                <div key={key} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {assetLabels[key as keyof Assets]}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatToRupiah(value)}</p>
                </div>
            ))}
        </div>
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-lg text-gray-600 dark:text-gray-400">Total Aset Keseluruhan</h3>
            <p className="text-4xl font-bold text-sky-500 dark:text-sky-400 mt-2">{formatToRupiah(totalAssets)}</p>
        </div>
    </Card>
  );
};

export default MainBalance;