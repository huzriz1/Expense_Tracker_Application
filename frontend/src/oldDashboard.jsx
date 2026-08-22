import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const Dashboard = () => {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [txType, setTxType] = useState('expense');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // Recharts Chart Mock Data Framework
  const chartData = [
    { name: 'Mon', Income: 4000, Expenses: 2400 },
    { name: 'Tue', Income: 3000, Expenses: 1398 },
    { name: 'Wed', Income: 9800, Expenses: 2000 },
    { name: 'Thu', Income: 2780, Expenses: 3908 },
    { name: 'Fri', Income: 1890, Expenses: 4800 },
    { name: 'Sat', Income: 2390, Expenses: 3800 },
    { name: 'Sun', Income: 3490, Expenses: 4300 },
  ];

  const allCategories = [
    { id: '1', name: 'Food & Groceries', type: 'expense' },
    { id: '2', name: 'House Rent', type: 'expense' },
    { id: '3', name: 'Bike Fuel', type: 'expense' },
    { id: '4', name: 'Monthly Salary', type: 'income' },
    { id: '5', name: 'Freelance Projects', type: 'income' },
  ];

  const filteredCategories = allCategories.filter(cat => cat.type === txType);
  const stats = { income: 54000, expense: 12500, balance: 41500 };
  const handleSaveTransaction = ()=>{
    return 0
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-background text-foreground transition-colors">
      
      {/* Top Controller Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Assalam-o-Alaikum, {user?.firstName || "User"}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your business wallets and monthly cashflows.</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
  {/* Open Trigger Button */}
  <DialogTrigger className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-sm cursor-pointer border-0 outline-none">
    + New Transaction
  </DialogTrigger>
  
  <DialogContent className="sm:max-w-[425px] bg-card border border-border p-6 rounded-lg text-card-foreground">
    <DialogHeader>
      <DialogTitle className="text-lg font-bold">New Record Form</DialogTitle>
    </DialogHeader>
    
    <form onSubmit={handleSaveTransaction} className="space-y-4 pt-3">
      
      {/* 1. Type Switch Filter Buttons */}
      <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-md">
        <button
          type="button"
          onClick={() => { setTxType('expense'); setSelectedCategory(''); }}
          className={`py-2 text-sm font-semibold rounded-md transition-all cursor-pointer border-0 ${txType === 'expense' ? 'bg-background text-rose-500 shadow-sm' : 'text-muted-foreground'}`}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => { setTxType('income'); setSelectedCategory(''); }}
          className={`py-2 text-sm font-semibold rounded-md transition-all cursor-pointer border-0 ${txType === 'income' ? 'bg-background text-emerald-500 shadow-sm' : 'text-muted-foreground'}`}
        >
          Income
        </button>
      </div>

      {/* 2. Dynamic Select Category Dropdown */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground">Category</label>
        <select
          required
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full bg-background border border-input text-foreground rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
        >
          <option value="">-- Choose Category --</option>
          {filteredCategories.map(cat => (
            <option key={cat.id} value={cat.id} className="bg-card text-foreground">{cat.name}</option>
          ))}
        </select>
      </div>

      {/* 3. Amount Input Field */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground">Amount (PKR)</label>
        <input
          required
          type="number"
          placeholder="e.g. 2500"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-background border border-input text-foreground rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      {/* 4. Short Description Note */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-muted-foreground">Short Note</label>
        <input
          type="text"
          placeholder="Where did you spend this money?"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-background border border-input text-foreground rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
        />
      </div>

      {/* 5. Submit Trigger Button */}
      <button
        type="submit"
        className={`w-full text-white font-semibold py-2.5 rounded-md text-sm transition-all shadow-md mt-2 cursor-pointer border-0 ${txType === 'expense' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
      >
        Save Record
      </button>

    </form>
  </DialogContent>
</Dialog>

      </div>

      {/* 3 Primitives Cards Metrics with Rs. Formatting */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm flex flex-col justify-between h-28">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Income</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Rs. {stats.income.toLocaleString()}</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm flex flex-col justify-between h-28">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Expenses</p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">Rs. {stats.expense.toLocaleString()}</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm flex flex-col justify-between h-28">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Net Balance</p>
          <p className="text-2xl font-bold text-primary">Rs. {stats.balance.toLocaleString()}</p>
        </div>
      </div>

      {/* 📊 Premium Interactive Analytics Charts Layer */}
      <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Weekly Activity Metrics</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Visual representation of daily flow comparison ratios.</p>
        </div>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/><stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fill: 'currentColor' }} className="text-xs text-muted-foreground" stroke="none" />
              <YAxis tick={{ fill: 'currentColor' }} className="text-xs text-muted-foreground" stroke="none" />
              <Tooltip contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' }} />
              <Area type="monotone" dataKey="Income" stroke="#10b981" fillOpacity={1} fill="url(#colorInc)" strokeWidth={2} />
              <Area type="monotone" dataKey="Expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExp)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;