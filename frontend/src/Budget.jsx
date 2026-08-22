import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import api from "./api";

const Budgets = () => {
    useEffect(() => {
    document.title = "Active Budget Guard | Paisa Bachat";
  }, []);

  
  const { user } = useUser();
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  // Frontend UI fields local states aligned to schema contract parameters
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [month, setMonth] = useState("August");

  // Load everything parallelly from your active backend routers
  const fetchBudgetData = async () => {
    try {
      const [budgetsRes, categoriesRes, transactionsRes] = await Promise.all([
        api.get(`/budget/${user?.id}`),
        api.get(`/category/${user?.id}`),
        api.get(`/transaction/${user?.id}`),
      ]);
      setBudgets(budgetsRes.data || []);
      setCategories(categoriesRes.data || []);
      setTransactions(transactionsRes.data || []);
    } catch (err) {
      console.error("Budget initialization setup error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchBudgetData();
  }, [user?.id]);

  // Handle Form Submit (Fully fixed model mapping parameters)
  const handleCreateBudget = async (e) => {
    e.preventDefault();
    try {
      const budgetData = {
        userId: user?.id,
        categoryId: selectedCategory, // Dynamic selected category reference key object id
        maxAmount: Number(maxAmount), // 🎯 FIXED: backend expects exact match "maxAmount" string token
        month: month,
      };

      const response = await api.post("/budget", budgetData);
      if (response.status === 200 || response.status === 201) {
        setMaxAmount("");
        setSelectedCategory("");
        setIsOpen(false);
        fetchBudgetData(); // Realtime state updates pipeline without reload
      }
    } catch (err) {
      console.error("Payload execution crash logs:", err);
    }
  };

  // Group all expense calculations map data
  // const totalExpenses = transactions
  // .filter(tx => tx.type === 'expense')
  //   .reduce((sum, tx) => sum + tx.amount, 0);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center text-sm font-medium animate-pulse">
        Assembling limit thresholds...
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] bg-background text-foreground transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header Management Navigation Wrapper Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Monthly Budgets 🛡️
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Set specific category limits to prevent wallet cross-overspending.
            </p>
          </div>

          {/* Dialog Modal Controller */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="bg-primary text-primary-foreground px-4 py-2.5 rounded-md text-sm font-semibold hover:opacity-90 transition-all shadow-sm cursor-pointer border-0 outline-none">
              + Adjust Limit Cap
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px] bg-card border border-border p-6 rounded-lg text-card-foreground shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold">
                  Configure Target Budget
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreateBudget} className="space-y-4 pt-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Select Target Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-background border border-input text-foreground rounded-md p-2.5 text-sm outline-none"
                  >
                    <option value="August">August</option>
                    <option value="September">September</option>
                    <option value="October">October</option>
                  </select>
                </div>

                {/* Dynamic Category List select container matching model definitions */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Select Target Category
                  </label>
                  <select
                    required
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-background border border-input text-foreground rounded-md p-2.5 text-sm outline-none"
                  >
                    <option value="">-- Select Category --</option>
                    {categories
                      .filter((c) => c.type === "expense")
                      .map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Limit Value (PKR)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="e.g. 15000"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="w-full bg-background border border-input text-foreground rounded-md p-2.5 text-sm outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-white bg-primary font-semibold py-2.5 rounded-md text-sm shadow-md mt-2 cursor-pointer border-0"
                >
                  Deploy Budget Plan
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Dynamic Card Container Box */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {budgets.length > 0 ? budgets.map((b, idx) => {
            // Match corresponding category name labels for representation
            const matchedCategory = categories.find(c => c._id === b.categoryId);
            const currentLimit = b.maxAmount || 0; // 🎯 FIXED: Aligned from limit to maxAmount variable mapping
            const percentage = currentLimit > 0 ? Math.min((totalExpenses / currentLimit) * 100, 100) : 0;
            const isOverBudget = totalExpenses > currentLimit;
            
            return (
              <div key={idx} className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-4 hover:border-muted-foreground/30 transition-all duration-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      {matchedCategory ? matchedCategory.name : "Wallet Expenditure Allocation"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Month Cycle: <span className="font-semibold text-primary">{b.month}</span></p>
                  </div>
                  <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isOverBudget ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                  }`}>
                    {isOverBudget ? '💥 Overspent' : `${percentage.toFixed(0)}% Exhausted`}
                  </span>
                </div>

                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-primary'}`} style={{ width: `${percentage}%` }}></div>
                </div>

                <div className="flex justify-between items-center text-xs pt-3 border-t border-border/60">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground font-medium">Spent Balance</p>
                    <p className={`text-sm font-bold ${isOverBudget ? 'text-rose-500' : 'text-foreground'}`}>Rs. {totalExpenses.toLocaleString()}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-muted-foreground font-medium">Limit Cap</p>
                    <p className="text-sm font-bold text-foreground">Rs. {currentLimit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg bg-card col-span-2">
              🔒 No active budget configurations found. Click "+ Adjust Limit Cap" above to instantiate a dynamic plan.
            </div>
          )}
        </div> */}
        {/* // Budgets.jsx ke return layout grid ko is optimized filter framework par bitha lijiye: */}

        {/* Dynamic Card Container Box */}
                {/* Dynamic Card Container Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {budgets.length > 0 ? budgets.map((b, idx) => {
            // 🎯 FIX 1: Is specific budget category ka total kharcha nikalna
            const categoryExpenses = transactions
              .filter(tx => tx.type === 'expense' && tx.categoryId === b.categoryId)
              .reduce((sum, tx) => sum + tx.amount, 0);

            const matchedCategory = categories.find(c => c._id === b.categoryId);
            const currentLimit = b.maxAmount || 0;
            
            // 🎯 FIX 2: Global variables ki jagah ab categoryExpenses use hoga
            const percentage = currentLimit > 0 ? Math.min((categoryExpenses / currentLimit) * 100, 100) : 0;
            const isOverBudget = categoryExpenses > currentLimit;
            
            return (
              <div key={idx} className="bg-card border border-border p-5 rounded-xl shadow-sm space-y-4 hover:border-muted-foreground/30 transition-all duration-200 relative group">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold tracking-tight text-foreground">
                      {matchedCategory ? matchedCategory.name : "Wallet Expenditure Allocation"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Month Cycle: <span className="font-semibold text-primary">{b.month}</span></p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isOverBudget ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                    }`}>
                      {isOverBudget ? '💥 Overspent' : `${percentage.toFixed(0)}% Used`}
                    </span>
                    
                    {/* Delete for Budgets */}
                    <button
                      onClick={async () => {
                        if(confirm("Remove this target budget plan configuration from database?")) {
                          try {
                            const response = await api.delete(`/budget/${b._id}`);
                            if (response.status === 200) {
                              setBudgets(budgets.filter(bud => bud._id !== b._id));
                            }
                          } catch (err) {
                            console.error("Budget deletion processing error:", err);
                          }
                        }
                      }}
                      className="text-xs opacity-0 group-hover:opacity-100 transition-all hover:text-rose-500 border-0 bg-transparent cursor-pointer"
                    >
                      ❌
                    </button>
                  </div>
                </div>

                <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-rose-500' : 'bg-primary'}`} style={{ width: `${percentage}%` }}></div>
                </div>

                <div className="flex justify-between items-center text-xs pt-3 border-t border-border/60">
                  <div className="space-y-0.5">
                    <p className="text-muted-foreground font-medium">Spent Balance</p>
                    {/* 🎯 FIX 3: Dynamic category targeted amount representation */}
                    <p className={`text-sm font-bold ${isOverBudget ? 'text-rose-500' : 'text-foreground'}`}>
                      Rs. {categoryExpenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-muted-foreground font-medium">Limit Cap</p>
                    <p className="text-sm font-bold text-foreground">Rs. {currentLimit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          }) : (
            <div className="p-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg bg-card col-span-2">
              🔒 No active budget configurations found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Budgets;
