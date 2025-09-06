import { useState, useMemo, useCallback, useEffect } from 'react';
import { Transaction, TransactionType, TransactionSource, Assets, Allocation, MonthlyRecapData } from '../types.ts';

// Helper to get item from localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

// Helper to set item in localStorage
const saveToStorage = <T,>(key: string, value: T) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key “${key}”:`, error);
  }
};


// Data transaksi awal dikosongkan sesuai permintaan
const initialSideJobTransactions: Transaction[] = [];
const initialStudioTransactions: Transaction[] = [];

const initialAllocations: Allocation[] = [
    { id: 'a1', category: 'Tabungan Target 85jt', targetPercentage: 40, actualBalance: 20000000, specificTarget: 85000000 },
    { id: 'a2', category: 'Investasi Alat', targetPercentage: 20, actualBalance: 12000000, specificTarget: 30000000 },
    { id: 'a3', category: 'Kebutuhan Harian', targetPercentage: 15, actualBalance: 5000000 },
    { id: 'a4', category: 'Operasional', targetPercentage: 10, actualBalance: 3500000 },
    { id: 'a5', category: 'Dana Darurat', targetPercentage: 10, actualBalance: 8000000 },
    { id: 'a6', category: 'Tunangan 5jt', targetPercentage: 5, actualBalance: 4000000, specificTarget: 5000000 },
];

// Menghitung total aset awal berdasarkan jumlah saldo alokasi
// untuk memastikan konsistensi data sejak awal.
const totalInitialAllocationBalance = initialAllocations.reduce((sum, alloc) => sum + alloc.actualBalance, 0);

const initialAssets: Assets = {
  bankA: totalInitialAllocationBalance, // Semua dana awal ditempatkan di Bank A untuk sederhana
  bankB: 0,
  cash: 0,
  reksadana: 0,
  eWallet: 0,
};

const initialCategories: string[] = [
    'Project A', 'Project B', 'Gaji', 'Makan', 'Transportasi', 'Investasi', 'Hiburan', 'Lain-lain'
];

export const useFinanceData = () => {
  // --- STATE MANAGEMENT with LocalStorage ---
  const [assets, setAssets] = useState<Assets>(() => getFromStorage('finance_assets', initialAssets));
  const [assetUpdateDate, setAssetUpdateDate] = useState<string | null>(() => getFromStorage('finance_assetUpdateDate', null));
  const [sideJobTransactions, setSideJobTransactions] = useState<Transaction[]>(() => getFromStorage('finance_sideJobTransactions', initialSideJobTransactions));
  const [studioTransactions, setStudioTransactions] = useState<Transaction[]>(() => getFromStorage('finance_studioTransactions', initialStudioTransactions));
  const [allocations, setAllocations] = useState<Allocation[]>(() => getFromStorage('finance_allocations', initialAllocations));
  const [categories, setCategories] = useState<string[]>(() => getFromStorage('finance_categories', initialCategories));

  // --- PERSISTENCE EFFECTS ---
  useEffect(() => { saveToStorage('finance_assets', assets); }, [assets]);
  useEffect(() => { saveToStorage('finance_assetUpdateDate', assetUpdateDate); }, [assetUpdateDate]);
  useEffect(() => { saveToStorage('finance_sideJobTransactions', sideJobTransactions); }, [sideJobTransactions]);
  useEffect(() => { saveToStorage('finance_studioTransactions', studioTransactions); }, [studioTransactions]);
  useEffect(() => { saveToStorage('finance_allocations', allocations); }, [allocations]);
  useEffect(() => { saveToStorage('finance_categories', categories); }, [categories]);


  const totalAssets = useMemo(() => {
    return Object.values(assets).reduce((sum, value) => sum + value, 0);
  }, [assets]);

  const addTransaction = useCallback((source: TransactionSource, transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: new Date().toISOString() + Math.random() };
    if (source === TransactionSource.SIDE_JOB) {
      setSideJobTransactions(prev => [newTransaction, ...prev]);
    } else {
      setStudioTransactions(prev => [newTransaction, ...prev]);
    }
  }, []);
  
  const deleteTransaction = useCallback((id: string, source: TransactionSource) => {
    if (source === TransactionSource.SIDE_JOB) {
        setSideJobTransactions(prev => prev.filter(t => t.id !== id));
    } else {
        setStudioTransactions(prev => prev.filter(t => t.id !== id));
    }
  }, []);

  const updateTransaction = useCallback((id: string, source: TransactionSource, updatedData: Omit<Transaction, 'id'>) => {
    const transactionToUpdate = { ...updatedData, id };
    if (source === TransactionSource.SIDE_JOB) {
        setSideJobTransactions(prev => prev.map(t => t.id === id ? transactionToUpdate : t));
    } else {
        setStudioTransactions(prev => prev.map(t => t.id === id ? transactionToUpdate : t));
    }
  }, []);

  const updateAllAssets = useCallback((newAssets: Assets, date: string) => {
    setAssets(newAssets);
    setAssetUpdateDate(date);
  }, []);

  const updateAllocation = useCallback((id: string, updatedValues: Partial<Allocation>) => {
    setAllocations(prev => prev.map(alloc => alloc.id === id ? { ...alloc, ...updatedValues } : alloc));
  }, []);

  const addCategory = useCallback((category: string) => {
    if (category && !categories.find(c => c.toLowerCase() === category.toLowerCase())) {
        setCategories(prev => [...prev, category].sort());
    } else {
        alert('Kategori sudah ada atau input kosong.');
    }
  }, [categories]);

  const deleteCategory = useCallback((categoryToDelete: string) => {
    const isUsed = [...sideJobTransactions, ...studioTransactions].some(t => t.category === categoryToDelete);
    if (isUsed) {
        alert('Kategori tidak bisa dihapus karena sedang digunakan dalam mutasi.');
        return;
    }
    setCategories(prev => prev.filter(c => c !== categoryToDelete));
  }, [sideJobTransactions, studioTransactions]);

  const updateCategory = useCallback((oldCategory: string, newCategory: string) => {
    if (!newCategory || (newCategory.toLowerCase() !== oldCategory.toLowerCase() && categories.find(c => c.toLowerCase() === newCategory.toLowerCase()))) {
        alert('Nama kategori baru tidak valid atau sudah ada.');
        return;
    }
    setCategories(prev => prev.map(c => c === oldCategory ? newCategory : c).sort());
    
    setSideJobTransactions(prev => prev.map(t => t.category === oldCategory ? { ...t, category: newCategory } : t));
    setStudioTransactions(prev => prev.map(t => t.category === oldCategory ? { ...t, category: newCategory } : t));
  }, [categories]);
  
  const monthlyRecap = useMemo<MonthlyRecapData[]>(() => {
    const allTransactions = [...sideJobTransactions, ...studioTransactions];
    const recaps: { [key: string]: Omit<MonthlyRecapData, 'month' | 'finalBalance' | 'initialBalance'> } = {};
  
    allTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
    for (const trans of allTransactions) {
      const month = new Date(trans.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!recaps[month]) {
        recaps[month] = {
          totalIncomeSideJob: 0,
          totalIncomeStudio: 0,
          totalExpense: 0,
          investment: 0,
        };
      }
      
      const isSideJob = sideJobTransactions.some(t => t.id === trans.id);
  
      if (trans.type === TransactionType.INCOME) {
        if (isSideJob) {
          recaps[month].totalIncomeSideJob += trans.amount;
        } else {
          recaps[month].totalIncomeStudio += trans.amount;
        }
      } else {
        recaps[month].totalExpense += trans.amount;
        if (trans.category.toLowerCase().includes('investasi')) {
            recaps[month].investment += trans.amount;
        }
      }
    }
  
    const sortedMonths = Object.keys(recaps).sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
    });
    
    // Calculate total change from transactions to find the starting balance
    const netTransactionChange = allTransactions.reduce((acc, t) => {
        return t.type === TransactionType.INCOME ? acc + t.amount : acc - t.amount;
    }, 0);

    let lastMonthBalance = totalAssets - netTransactionChange;

    return sortedMonths.map(month => {
        const data = recaps[month];
        const initialBalance = lastMonthBalance;
        const finalBalance = initialBalance + data.totalIncomeSideJob + data.totalIncomeStudio - data.totalExpense;
        lastMonthBalance = finalBalance;
        return {
            month,
            initialBalance,
            ...data,
            finalBalance,
        };
    });
  }, [sideJobTransactions, studioTransactions, totalAssets]);
  

  return {
    assets,
    assetUpdateDate,
    totalAssets,
    sideJobTransactions,
    studioTransactions,
    allocations,
    monthlyRecap,
    categories,
    addTransaction,
    updateAllAssets,
    updateAllocation,
    deleteTransaction,
    updateTransaction,
    addCategory,
    deleteCategory,
    updateCategory,
  };
};