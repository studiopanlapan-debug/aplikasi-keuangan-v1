import React, { useState, FormEvent, useEffect } from 'react';
import { Transaction, TransactionType, TransactionSource } from '../types.ts';
import { InitialTransactionData } from '../App.tsx';
import { formatToRupiah } from '../utils/formatters.ts';
import Card from './ui/Card.tsx';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-600 dark:text-gray-400">
      <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-50 dark:bg-gray-700">
        <tr>
          <th scope="col" className="px-6 py-3">Tanggal</th>
          <th scope="col" className="px-6 py-3">Jenis</th>
          <th scope="col" className="px-6 py-3">Nominal</th>
          <th scope="col" className="px-6 py-3">Kategori</th>
          <th scope="col" className="px-6 py-3">Keterangan</th>
          <th scope="col" className="px-6 py-3 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? transactions.map((t) => (
          <tr key={t.id} className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4 text-gray-900 dark:text-white whitespace-nowrap">{new Date(t.date).toLocaleDateString('id-ID')}</td>
            <td className={`px-6 py-4 font-semibold ${t.type === TransactionType.INCOME ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
              {t.type}
            </td>
            <td className="px-6 py-4">{formatToRupiah(t.amount)}</td>
            <td className="px-6 py-4">{t.category}</td>
            <td className="px-6 py-4">{t.description}</td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-center gap-4">
                <button onClick={() => onEdit(t)} className="text-yellow-500 hover:text-yellow-400">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button onClick={() => onDelete(t.id)} className="text-red-500 hover:text-red-400">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
              Belum ada data mutasi.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const AddTransactionForm: React.FC<{ 
    addTransaction: (source: TransactionSource, transaction: Omit<Transaction, 'id'>) => void;
    categories: string[];
    initialData: InitialTransactionData | null;
    onInitialDataConsumed: () => void;
}> = ({ addTransaction, categories, initialData, onInitialDataConsumed }) => {
    const [source, setSource] = useState<TransactionSource>(TransactionSource.SIDE_JOB);
    const [type, setType] = useState<TransactionType>(TransactionType.INCOME);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const inputClasses = "w-full bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-sky-500 focus:border-sky-500";

    useEffect(() => {
        if (initialData) {
            setSource(initialData.source || TransactionSource.SIDE_JOB);
            setType(initialData.type || TransactionType.INCOME);
            setAmount(initialData.amount || '');
            setCategory(initialData.category || '');
            setDescription(initialData.description || '');
            setDate(initialData.date || new Date().toISOString().split('T')[0]);
            onInitialDataConsumed(); // Signal that data has been used
        }
    }, [initialData, onInitialDataConsumed]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!amount || !category || !description || !date) return;
        
        addTransaction(source, {
            date,
            type,
            amount: parseFloat(amount),
            category,
            description
        });
        
        // Reset form
        setAmount('');
        setCategory('');
        setDescription('');
    };

    return (
        <Card title="Tambah Mutasi Baru" className="mt-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="source" className="block text-sm font-medium mb-1">Sumber Dana</label>
                    <select id="source" value={source} onChange={(e) => setSource(e.target.value as TransactionSource)} className={inputClasses}>
                        <option value={TransactionSource.SIDE_JOB}>Job Luar</option>
                        <option value={TransactionSource.STUDIO}>Studio</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="type" className="block text-sm font-medium mb-1">Jenis</label>
                    <select id="type" value={type} onChange={(e) => setType(e.target.value as TransactionType)} className={inputClasses}>
                        <option value={TransactionType.INCOME}>Masuk</option>
                        <option value={TransactionType.EXPENSE}>Keluar</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">Tanggal</label>
                    <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} className={inputClasses}/>
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium mb-1">Nominal</label>
                    <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} placeholder="cth: 500000" className={inputClasses}/>
                </div>
                 <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1">Kategori</label>
                    <input 
                        type="text" 
                        id="category" 
                        list="categories"
                        value={category} 
                        onChange={e => setCategory(e.target.value)} 
                        placeholder="cth: Project A" 
                        className={inputClasses}
                    />
                    <datalist id="categories">
                        {categories.map(c => <option key={c} value={c} />)}
                    </datalist>
                </div>
                <div className="sm:col-span-2 md:col-span-1">
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Keterangan</label>
                    <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="cth: Pembayaran DP" className={inputClasses}/>
                </div>
                <div className="sm:col-span-2 md:col-span-3 flex items-end">
                    <button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Tambah</button>
                </div>
            </form>
        </Card>
    );
};

interface EditModalProps {
    transaction: Transaction;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: Omit<Transaction, 'id'>) => void;
    categories: string[];
}

const EditTransactionModal: React.FC<EditModalProps> = ({ transaction, isOpen, onClose, onSave, categories }) => {
    const [formData, setFormData] = useState<Omit<Transaction, 'id'>>(transaction);
    const inputClasses = "w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2";

    useEffect(() => {
        setFormData({
            date: transaction.date,
            type: transaction.type,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description
        });
    }, [transaction]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <Card title="Edit Mutasi" className="w-full max-w-2xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium mb-1">Tanggal</label>
                        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={inputClasses}/>
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium mb-1">Jenis</label>
                        <select id="type" name="type" value={formData.type} onChange={handleChange} className={inputClasses}>
                            <option value={TransactionType.INCOME}>Masuk</option>
                            <option value={TransactionType.EXPENSE}>Keluar</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium mb-1">Nominal</label>
                        <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className={inputClasses}/>
                    </div>
                    <div>
                        <label htmlFor="category-edit" className="block text-sm font-medium mb-1">Kategori</label>
                        <input 
                            type="text" 
                            id="category-edit" 
                            name="category"
                            list="categories-edit" 
                            value={formData.category} 
                            onChange={handleChange} 
                            className={inputClasses}
                        />
                        <datalist id="categories-edit">
                            {categories.map(c => <option key={c} value={c} />)}
                        </datalist>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium mb-1">Keterangan</label>
                        <input type="text" id="description" name="description" value={formData.description} onChange={handleChange} className={inputClasses}/>
                    </div>
                    <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md">Batal</button>
                        <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md">Simpan Perubahan</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};


interface TransactionsProps {
  sideJobTransactions: Transaction[];
  studioTransactions: Transaction[];
  addTransaction: (source: TransactionSource, transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string, source: TransactionSource) => void;
  updateTransaction: (id: string, source: TransactionSource, updatedData: Omit<Transaction, 'id'>) => void;
  categories: string[];
  initialData: InitialTransactionData | null;
  onInitialDataConsumed: () => void;
}

const Transactions: React.FC<TransactionsProps> = ({ 
    sideJobTransactions, 
    studioTransactions, 
    addTransaction, 
    deleteTransaction, 
    updateTransaction, 
    categories,
    initialData,
    onInitialDataConsumed
}) => {
  const [activeMutationTab, setActiveMutationTab] = useState<TransactionSource>(TransactionSource.SIDE_JOB);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleEditClick = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };
  
  const handleDeleteClick = (id: string) => {
    if (window.confirm('Anda yakin ingin menghapus mutasi ini?')) {
        deleteTransaction(id, activeMutationTab);
    }
  };
  
  const handleSaveEdit = (updatedData: Omit<Transaction, 'id'>) => {
    if (editingTransaction) {
        updateTransaction(editingTransaction.id, activeMutationTab, updatedData);
        setIsModalOpen(false);
        setEditingTransaction(null);
    }
  };

  return (
    <div>
        <div className="mb-4">
            <div className="flex border-b border-gray-300 dark:border-gray-700">
                <button onClick={() => setActiveMutationTab(TransactionSource.SIDE_JOB)} className={`py-2 px-4 font-medium ${activeMutationTab === TransactionSource.SIDE_JOB ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Mutasi Job Luar
                </button>
                <button onClick={() => setActiveMutationTab(TransactionSource.STUDIO)} className={`py-2 px-4 font-medium ${activeMutationTab === TransactionSource.STUDIO ? 'border-b-2 border-sky-500 text-sky-600 dark:text-sky-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    Mutasi Studio
                </button>
            </div>
        </div>
        
        <Card>
            {activeMutationTab === 'sideJob' ? (
                <TransactionTable transactions={sideJobTransactions} onEdit={handleEditClick} onDelete={handleDeleteClick} />
            ) : (
                <TransactionTable transactions={studioTransactions} onEdit={handleEditClick} onDelete={handleDeleteClick} />
            )}
        </Card>
        
        <AddTransactionForm 
            addTransaction={addTransaction} 
            categories={categories} 
            initialData={initialData}
            onInitialDataConsumed={onInitialDataConsumed}
        />

        {isModalOpen && editingTransaction && (
            <EditTransactionModal
                isOpen={isModalOpen}
                transaction={editingTransaction}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveEdit}
                categories={categories}
            />
        )}
    </div>
  );
};

export default Transactions;