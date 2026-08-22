import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import api from './api';

const Analytics = () => {
  const { user } = useUser();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get(`/transaction/${user?.id}`);
        setTransactions(res.data || []);
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.id) fetchTransactions();
  }, [user?.id]);

  // Grouping expenses cleanly by transaction notes (description labels)
  const expenseData = transactions
    .filter(tx => tx.type === 'expense')
    .reduce((acc, tx) => {
      const label = tx.note || "General Expense";
      const found = acc.find(item => item.name === label);
      if (found) {
        found.value += tx.amount;
      } else {
        acc.push({ name: label, value: tx.amount });
      }
      return acc;
    }, []);

  // 🎯 Fixed: Real Hex strings for accurate Recharts rendering color mapping engine
  const PIE_COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#ec4899'];

  if (loading) {
    return <div className="flex h-96 items-center justify-center text-sm font-medium animate-pulse">Calculating metrics layout...</div>;
  }

  return (
    // 🎯 Full layout canvas scale adjustments
    <div className="w-full min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-background text-foreground transition-colors duration-200">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Expense Analytics 📊</h1>
        <p className="text-sm text-muted-foreground mt-1">Detailed visual breakdown of your wallet expenditures.</p>
      </div>

      {/* Grid stretched over full screen width */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">
        
        {/* Graphical Representation Card Box (Stretched) */}
        <div className="xl:col-span-2 bg-card border border-border p-6 rounded-lg shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Distribution Chart</h3>
          <div className="h-96 w-full flex items-center justify-center">
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={expenseData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={80} 
                    outerRadius={120} 
                    paddingAngle={4} 
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: 'var(--radius)' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-sm text-muted-foreground">No expense metrics to display.</div>
            )}
          </div>
        </div>

        {/* Text Ledger Distribution List (Full Height matched) */}
        <div className="bg-card border border-border p-6 rounded-lg shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Breakdown List</h3>
          <div className="divide-y divide-border overflow-y-auto pr-1 flex-1 max-h-[22rem]">
            {expenseData.map((item, idx) => (
              <div key={idx} className="flex justify-between py-3.5 items-center">
                <span className="text-sm font-medium flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></span>
                  <span className="truncate max-w-[180px] sm:max-w-none">{item.name}</span>
                </span>
                <span className="text-sm font-bold text-rose-500 ml-2 shrink-0">Rs. {item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;
