import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CategoriesProps {
    categories: string[];
    addCategory: (category: string) => void;
    updateCategory: (oldCategory: string, newCategory: string) => void;
    deleteCategory: (category: string) => void;
}

const EditCategoryModal: React.FC<{
    category: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (newCategory: string) => void;
}> = ({ category, isOpen, onClose, onSave }) => {
    const [newCategoryName, setNewCategoryName] = useState(category);
    const inputClasses = "w-full bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 text-gray-900 dark:text-white";

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(newCategoryName);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <Card title="Edit Kategori" className="w-full max-w-md">
                <div>
                    <label htmlFor="edit-category" className="block text-sm font-medium mb-1">Nama Kategori</label>
                    <input
                        type="text"
                        id="edit-category"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className={inputClasses}
                        aria-label="New category name"
                    />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                    <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 font-bold py-2 px-4 rounded-md">Batal</button>
                    <button type="button" onClick={handleSave} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md">Simpan</button>
                </div>
            </Card>
        </div>
    );
};

const Categories: React.FC<CategoriesProps> = ({ categories, addCategory, updateCategory, deleteCategory }) => {
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<string | null>(null);

    const handleAddCategory = () => {
        addCategory(newCategory.trim());
        setNewCategory('');
    };

    const handleUpdateCategory = (newCategoryName: string) => {
        if (editingCategory) {
            updateCategory(editingCategory, newCategoryName.trim());
        }
    };

    return (
        <div className="space-y-6">
            <Card title="Tambah Kategori Baru">
                <form onSubmit={(e) => { e.preventDefault(); handleAddCategory(); }} className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="cth: Belanja Bulanan"
                        className="flex-grow bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md p-2 text-gray-900 dark:text-white focus:ring-sky-500 focus:border-sky-500"
                        aria-label="New category name"
                    />
                    <button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Tambah</button>
                </form>
            </Card>

            <Card title="Daftar Kategori">
                <div className="space-y-3">
                    {categories.length > 0 ? categories.map(category => (
                        <div key={category} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-md">
                            <span className="text-gray-800 dark:text-white">{category}</span>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setEditingCategory(category)} className="text-yellow-500 hover:text-yellow-400" aria-label={`Edit category ${category}`}>
                                    <PencilIcon className="h-5 w-5" />
                                </button>
                                <button onClick={() => deleteCategory(category)} className="text-red-500 hover:text-red-400" aria-label={`Delete category ${category}`}>
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">Belum ada kategori kustom.</p>
                    )}
                </div>
            </Card>

            {editingCategory && (
                <EditCategoryModal
                    isOpen={!!editingCategory}
                    category={editingCategory}
                    onClose={() => setEditingCategory(null)}
                    onSave={handleUpdateCategory}
                />
            )}
        </div>
    );
};

export default Categories;