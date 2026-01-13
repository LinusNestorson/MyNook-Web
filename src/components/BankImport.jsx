import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function BankImport() {
  const { token } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([
    'Groceries',
    'Entertainment',
    'Income',
    'Transport',
    'Dining Out',
    'Household'
  ]);

  const [transactions, setTransactions] = useState([]);
  const API_URL = 'http://localhost:5042/api/BankImport';

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const fetchTransactions = async () => {
    try {
        const res = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
            const data = await res.json();
            // Format date for display if needed
            setTransactions(data.map(t => ({
                ...t,
                date: new Date(t.date).toLocaleDateString('sv-SE')
            })));
        }
    } catch (err) {
        console.error("Failed to fetch transactions", err);
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const updateCategory = async (id, newCategory) => {
      // Optimistic update
      const oldTransactions = [...transactions];
      setTransactions(transactions.map(t => t.id === id ? { ...t, category: newCategory } : t));

      try {
          // We need the full object or just patch. Backend expects PUT with full object currently (my bad implementation above)
          // Actually, I implemented PUT with body `Transaction`.
          // Let's find the transaction
          const tx = transactions.find(t => t.id === id);
          if (!tx) return;

          const res = await fetch(`${API_URL}/${id}`, {
              method: 'PUT',
              headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ ...tx, category: newCategory, date: new Date(tx.date) }) // Ensure date format is correct for backend
          });
          
          if (!res.ok) {
              setTransactions(oldTransactions); // Revert
              console.error("Failed to update");
          }
      } catch (err) {
           setTransactions(oldTransactions);
           console.error(err);
      }
  };

  // Import simulation
  const simulateImport = async () => {
       const newTx = [
        { id: crypto.randomUUID(), date: '2023-10-25', description: 'ICA SUPERMARKET', category: 'Groceries', amount: -450.00 },
        { id: crypto.randomUUID(), date: '2023-10-24', description: 'SPOTIFY', category: 'Entertainment', amount: -119.00 },
       ];

       try {
           const res = await fetch(`${API_URL}/import`, {
               method: 'POST',
               headers: { 
                   'Authorization': `Bearer ${token}`,
                   'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTx)
           });
           if (res.ok) {
               fetchTransactions();
           }
       } catch (err) {
           console.error("Import failed", err);
       }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-100px)]">
      {/* Main Content */}
      <div className="flex-1 space-y-6 overflow-hidden flex flex-col">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Bank Import</h2>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 border transition-colors ${showSettings ? 'bg-gray-100 border-gray-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
              Settings
            </button>
            <button 
                onClick={simulateImport}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              Import CSV (Demo)
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-700">Account Statements</h3>
          </div>
          <div className="overflow-auto flex-1">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr className="border-b border-gray-100 text-gray-500 text-sm">
                  <th className="p-4 font-medium">Date</th>
                  <th className="p-4 font-medium">Description</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                    <tr><td colSpan="4" className="p-4 text-center text-gray-500">No transactions found. Click Import.</td></tr>
                ) : transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{tx.date}</td>
                    <td className="p-4 font-medium text-gray-800">{tx.description}</td>
                    <td className="p-4">
                      <select 
                        className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        value={tx.category}
                        onChange={(e) => updateCategory(tx.id, e.target.value)}
                      >
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </td>
                    <td className={`p-4 text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                      {tx.amount.toLocaleString('sv-SE', { style: 'currency', currency: 'SEK' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Settings Sidebar */}
      {showSettings && (
        <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="p-4 border-b">
            <h3 className="font-bold text-gray-800">Customization</h3>
          </div>
          
          <div className="p-4 space-y-6 overflow-auto flex-1">
            <div>
              <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Manage Categories</h4>
              
              <form onSubmit={handleAddCategory} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="New category..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={!newCategory.trim()}
                  className="bg-gray-900 text-white p-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                  </svg>
                </button>
              </form>

              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg group">
                    <span className="text-sm text-gray-700">{cat}</span>
                    <button 
                      onClick={() => setCategories(categories.filter(c => c !== cat))}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove category"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
