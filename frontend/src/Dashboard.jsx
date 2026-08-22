import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import api from "./api"; // Jo Axios instance humne banaya tha

const Dashboard = () => {
    useEffect(() => {
    document.title = "Console Workspace | Paisa Bachat";
  }, []);

  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [txType, setTxType] = useState("expense");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // States for Backend Data
  const [allCategories, setAllCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Categories and Transactions from Backend
  // useEffect(() => {
  //   const fetchInitialData = async () => {
  //     try {
  //       setLoading(true);

  //       // Dono APIs ko parallel call kar rahe hain efficiency ke liye
  //         const [categoriesRes, transactionsRes] = await Promise.all([
  //           api.get('/category'), // Tumhara backend endpoint: /api/category
  //           api.get(`/transaction?userId=${user?.id}`) // User-specific transactions backend endpoint
  //         ]);

  //       setAllCategories(categoriesRes.data || []);
  //       setTransactions(transactionsRes.data || []);
  //     } catch (error) {
  //       console.error("Error fetching data from database:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (user?.id) {
  //     fetchInitialData();
  //   }
  // }, [user?.id]);
  // 1. Fetch Categories and Transactions from Backend (Updated with Dynamic Path Parameters)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        // Dono paths par slice dynamic path variables bitha diye hain standard routing ke liye
        const [categoriesRes, transactionsRes] = await Promise.all([
          api.get(`/category/${user?.id}`), // Ab hit karega: http://localhost:3000/api/category/user_2...
          api.get(`/transaction/${user?.id}`), // Ab hit karega: http://localhost:3000/api/transaction/user_2...
        ]);

        setAllCategories(categoriesRes.data || []);
        setTransactions(transactionsRes.data || []);
      } catch (error) {
        console.error("Error fetching data from database:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchInitialData();
    }
  }, [user?.id]);

  // 2. Smart Category Filtering based on Income/Expense type
  const filteredCategories = allCategories.filter((cat) => cat.type === txType);

  // 3. Dynamic Live Stats Calculation (Database values ke mutabik)
  const stats = transactions.reduce(
    (acc, tx) => {
      if (tx.type === "income") acc.income += tx.amount;
      if (tx.type === "expense") acc.expense += tx.amount;
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 },
  );

  // 4. Form Submit - Save Transaction to MongoDB Database
  // const handleSaveTransaction = async (e) => {
  //   e.preventDefault();

  //   const transactionData = {
  //     userId: user?.id, // Clerk ki solid User ID
  //     type: txType,
  //     categoryId: selectedCategory,
  //     amount: Number(amount),
  //     note: note,
  //     date: new Date().toISOString().split('T')[0] // 'YYYY-MM-DD' format
  //   };

  //   try {
  //     // Backend par POST request bhej rahe hain
  //     const response = await api.post('/transaction', transactionData);

  //     if (response.status === 200 || response.status === 201) {
  //       // UI list mein nayi transaction instantly add karein taaki refresh na karna pade
  //       setTransactions([response.data, ...transactions]);

  //       // Form states clear aur modal close
  //       setAmount('');
  //       setNote('');
  //       setSelectedCategory('');
  //       setIsOpen(false);
  //     }
  //   } catch (error) {
  //     console.error("Failed to save transaction in MongoDB:", error);
  //     alert("Error saving record. Check terminal logs.");
  //   }
  // };
  // Form Submit - Save Transaction to MongoDB Database
  const handleSaveTransaction = async (e) => {
    e.preventDefault();

    const transactionData = {
      userId: user?.id,
      type: txType,
      categoryId: selectedCategory,
      amount: Number(amount),
      note: note,
      date: new Date().toISOString().split("T")[0], // Safely extract date
    };

    try {
      const response = await api.post("/transaction", transactionData);

      if (response.status === 200 || response.status === 201) {
        // 🎯 response.data ke bajaye response.data.data kiya kyunki aapka backend data key mein object bhej raha hai
        setTransactions([response.data.data, ...transactions]);

        setAmount("");
        setNote("");
        setSelectedCategory("");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("Failed to save transaction in MongoDB:", error);
      alert("Error saving record. Check terminal logs.");
    }
  };

  // Recharts Chart Format Converter (Live data ko graph mein badalne ke liye)
  const chartData = transactions
    .slice(0, 7)
    .reverse()
    .map((tx) => ({
      name: new Date(tx.date).toLocaleDateString("en-US", { weekday: "short" }),
      Income: tx.type === "income" ? tx.amount : 0,
      Expenses: tx.type === "expense" ? tx.amount : 0,
    }));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <p className="text-sm font-semibold tracking-wider animate-pulse">
          Connecting to Database...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-background text-foreground transition-colors">
      {/* Top Welcome Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Assalam-o-Alaikum, {user?.firstName || "User"}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your business wallets and monthly cashflows.
          </p>
        </div>

        {/* Dialog System */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-sm cursor-pointer border-0 outline-none">
            + New Transaction
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] bg-card border border-border p-6 rounded-lg text-card-foreground">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                New Record Form
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveTransaction} className="space-y-4 pt-3">
              {/* Type Switch Filter Buttons */}
              <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-md">
                <button
                  type="button"
                  onClick={() => {
                    setTxType("expense");
                    setSelectedCategory("");
                  }}
                  className={`py-2 text-sm font-semibold rounded-md transition-all cursor-pointer border-0 ${txType === "expense" ? "bg-background text-rose-500 shadow-sm" : "text-muted-foreground"}`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTxType("income");
                    setSelectedCategory("");
                  }}
                  className={`py-2 text-sm font-semibold rounded-md transition-all cursor-pointer border-0 ${txType === "income" ? "bg-background text-emerald-500 shadow-sm" : "text-muted-foreground"}`}
                >
                  Income
                </button>
              </div>

              {/* Dynamic Categories Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-background border border-input text-foreground rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                >
                  <option value="">-- Choose Category --</option>
                  {filteredCategories.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                      className="bg-card text-foreground"
                    >
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Amount (PKR)
                </label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 2500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-background border border-input text-foreground rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">
                  Short Note
                </label>
                <input
                  type="text"
                  placeholder="Where did you spend this money?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-background border border-input text-foreground rounded-md p-2.5 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className={`w-full text-white font-semibold py-2.5 rounded-md text-sm transition-all shadow-md mt-2 cursor-pointer border-0 ${txType === "expense" ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
              >
                Save Record
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {/* 3 Metrics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm flex flex-col justify-between h-28">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Income
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            Rs. {stats.income.toLocaleString()}
          </p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm flex flex-col justify-between h-28">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Expenses
          </p>
          <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">
            Rs. {stats.expense.toLocaleString()}
          </p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm flex flex-col justify-between h-28">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Net Balance
          </p>
          <p className="text-2xl font-bold text-primary">
            Rs. {stats.balance.toLocaleString()}
          </p>
        </div>
      </div>
      {/* Analytics Graph */}
      <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight">
            Recent Activity Metrics
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Live visualization of your last transactions.
          </p>
        </div>
        <div className="h-72 w-full pt-2">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                  strokeOpacity={0.4}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "currentColor" }}
                  className="text-xs text-muted-foreground"
                  stroke="none"
                />
                {/* <YAxis tick={{ fill: 'currentColor' }} className="text-xs text-muted-foreground" stroke="none" /> */}
                <YAxis
                  stroke="none"
                  className="text-xs text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                  tickFormatter={(value) =>
                    value === 0 ? "0" : `${value / 1000}k`
                  }
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    borderColor: "var(--color-border)",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="Income"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorInc)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="Expenses"
                  stroke="#f43f5e"
                  fillOpacity={1}
                  fill="url(#colorExp)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No records to display on graph yet.
            </div>
          )}
        </div>
      </div>
      {/* Transaction Passbook Ledger */}
      {/* <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Transaction Passbook
          </h3>
        </div>
        <div className="divide-y divide-border">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {tx.note || "No details provided"}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
                <p
                  className={`text-base font-bold ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}
                >
                  {tx.type === "income" ? "+" : "-"} Rs.{" "}
                  {tx.amount.toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Your passbook ledger is currently empty. Add entries above!
            </div>
          )}
        </div>
      </div> */}
      
      {/* Transaction Passbook Ledger */}
      <div className="bg-card text-card-foreground rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted/30">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Transaction Passbook
          </h3>
        </div>
        <div className="divide-y divide-border">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx._id}
                className="flex items-center justify-between px-6 py-4 hover:bg-muted/20 transition-colors group"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {tx.note || "No details provided"}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p
                    className={`text-base font-bold ${tx.type === "income" ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {tx.type === "income" ? "+" : "-"} Rs.{" "}
                    {tx.amount.toLocaleString()}
                  </p>

                  {/* 🗑️ Virtual Delete Action Trigger */}
                  {/* <button
                  onClick={() => {
                    if(confirm("Are you sure you want to delete this transaction?")) {
                      const hidden = JSON.parse(localStorage.getItem('del_tx') || '[]');
                      hidden.push(tx._id);
                      localStorage.setItem('del_tx', JSON.stringify(hidden));
                      // Instantly remove from dynamic screen state
                      setTransactions(transactions.filter(t => t._id !== tx._id));
                    }
                  }}
                  className="p-1.5 text-muted-foreground hover:text-destructive rounded-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-0 bg-transparent"
                  title="Delete Entry"
                >
                  ❌
                </button> */}
                  <button
                    onClick={async () => {
                      if (
                        confirm(
                          "Are you sure you want to permanently delete this transaction from database?",
                        )
                      ) {
                        try {
                          // Axios se backend delete query trigger ho rahi hai
                          const response = await api.delete(
                            `/transaction/${tx._id}`,
                          );
                          if (response.status === 200) {
                            // Instantly filter out from UI local rendering screen layout state arrays
                            setTransactions(
                              transactions.filter((t) => t._id !== tx._id),
                            );
                          }
                        } catch (err) {
                          console.error(
                            "Database endpoint execution logs error:",
                            err,
                          );
                          alert(
                            "Failed to delete records from remote server instance.",
                          );
                        }
                      }
                    }}
                    className="p-1.5 text-muted-foreground hover:text-destructive rounded-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer border-0 bg-transparent"
                    title="Delete Entry"
                  >
                    ❌
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-muted-foreground">
              Your passbook ledger is currently empty.
            </div>
          )}
        </div>
      </div>
    </div> // Main div wrapper closing tag
  ); // Return statement closing tag
}; // Component main closing tag

export default Dashboard;
