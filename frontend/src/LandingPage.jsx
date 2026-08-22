import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, useUser, UserButton } from '@clerk/clerk-react';

// Animated writer component: types lines like a human, then reveals a scripted signature svg.
function AnimatedWriter({ lines = [], reduceMotion = false }) {
  const [display, setDisplay] = React.useState('');
  const [lineIndex, setLineIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const [done, setDone] = React.useState(false);

  React.useEffect(() => {
    if (reduceMotion) {
      setDisplay(lines.join('\n'));
      setDone(true);
      return;
    }
    if (lineIndex >= lines.length) {
      setDone(true);
      return;
    }

    const currentLine = lines[lineIndex] || '';
    if (charIndex <= currentLine.length - 1) {
      const delay = 18 + Math.floor(Math.random() * 45); // human-like jitter
      const t = setTimeout(() => {
        setDisplay((s) => s + currentLine.charAt(charIndex));
        setCharIndex((c) => c + 1);
      }, delay);
      return () => clearTimeout(t);
    }

    // line complete -> pause, then move to next line
    const pause = setTimeout(() => {
      setDisplay((s) => s + '\n');
      setLineIndex((i) => i + 1);
      setCharIndex(0);
    }, 500);
    return () => clearTimeout(pause);
  }, [charIndex, lineIndex, lines, reduceMotion]);

  React.useEffect(() => {
    if (done && !reduceMotion) {
      const path = document.getElementById('signature-path');
      if (path) {
        // animate stroke draw
        path.style.transition = 'stroke-dashoffset 900ms ease-in-out 120ms';
        path.style.strokeDashoffset = '0';
      }
    }
  }, [done, reduceMotion]);

  return (
    <div className="writer font-mono text-sm text-muted-foreground whitespace-pre-wrap">
      <div className="inline-block align-top">{display}</div>
      {!done && !reduceMotion ? (
        <span className="inline-block w-1 h-5 bg-primary align-middle ml-1 animate-pulse" aria-hidden="true" />
      ) : null}

      <svg className="mt-4" width="220" height="60" viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          id="signature-path"
          d="M6 42 C40 10, 80 12, 110 42 C132 66, 170 34, 210 44"
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 500, strokeDashoffset: reduceMotion ? 0 : 500 }}
        />
      </svg>
    </div>
  );
}

const LandingPage = () => {
  const { isSignedIn } = useUser();
  const [demoAmount, setDemoAmount] = useState(2500);
  const [mounted, setMounted] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  React.useEffect(() => {
    document.title = "Paisa Bachat — Expense Tracker for Small Businesses";
    try {
      const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
      const prefersReduced = mq ? mq.matches : false;
      setReduceMotion(prefersReduced);
      if (prefersReduced) {
        setMounted(true);
        return;
      }
    } catch {
      // ignore in non-browser environments
    }
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <div className="min-h-screen bg-background grid-mesh-pattern text-foreground flex flex-col font-sans transition-colors duration-300">
      
      {/* 🌐 CUSTOM BRAND NAVBAR */}
      <nav aria-label="Primary navigation" className="w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
                      <span className="text-lg font-black tracking-tight text-foreground">
                                                Paisa Bachat
            </span>
                      <span className="text-[10px] font-bold bg-muted-foreground/10 text-muted-foreground px-2 py-0.5 rounded-full">v1.0</span>
          </div>

          <div className="flex items-center gap-3">
            <button 
                          type="button"
                          onClick={toggleTheme}
                          aria-label="Toggle theme"
                          className="p-2 rounded-lg hover:bg-muted text-sm transition-colors border-0 bg-transparent cursor-pointer"
                          title="Toggle Theme"
                        >
                          <span aria-hidden="true">🌓</span>
                        </button>

            {isSignedIn ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/dashboard" 
                  className="text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm"
                >
                  Dashboard
                </Link>
                <div className="h-8 w-8 flex items-center justify-center">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="text-xs font-bold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all shadow-sm cursor-pointer border-0">
                  Launch App
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </nav>

      {/* 🚀 REAL HUZAIFA PORTFOLIO HERO SECTION */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center py-12 lg:py-16 space-y-6">
        <div className={`transform transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                  <div className="w-full lg:grid lg:grid-cols-2 lg:items- lg:gap-8">

            <div className="lg:pr-6 space-y-5 text-center lg:text-left">
              {/* 🔥 DEVELOPER CREDIT BADGE */}
              <div className="inline-flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-xs font-medium text-muted-foreground">
                Designed and built by Huzaifa — BSCS, NED University
              </div>

              {/* Real Human Title */}
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-2xl leading-tight text-foreground">
                Take full control over your{' '}
                <span className="text-primary font-semibold">
                  daily cashflows & business budgets.
                </span>
              </h1>

              {/* Clean, Non-AI Subtitle */}
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                A student-built MERN project demonstrating practical expense tracking features, an interactive demo, and clean, usable UI — ideal for a portfolio showcasing engineering and design skills.
              </p>

              {/* Tech Stack Badges to prove MERN credentials */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-[11px] text-muted-foreground pt-2">
                <span className="px-2 py-1 border rounded text-xs text-muted-foreground">MongoDB</span>
                <span className="px-2 py-1 border rounded text-xs text-muted-foreground">Express</span>
                <span className="px-2 py-1 border rounded text-xs text-muted-foreground">React</span>
                <span className="px-2 py-1 border rounded text-xs text-muted-foreground">Node</span>
                <span className="px-2 py-1 border rounded text-xs text-muted-foreground">Clerk</span>
              </div>

              {/* Call to Actions */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center lg:justify-start">
                {isSignedIn ? (
                  <Link 
                    to="/dashboard" 
                    className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-md hover:opacity-95 transition-all text-center"
                  >
                    Go to Workspace Console
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <button className="px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl text-sm shadow-md hover:opacity-95 transition-all text-center cursor-pointer border-0 w-full sm:w-auto">
                      Explore Project
                    </button>
                  </SignInButton>
                )}
              </div>
            </div>

            <aside className="mt-8 lg:mt-0">
              <div className="h-40 lg:h-44 w-full mb-4 flex items-center justify-center border border-border rounded-lg bg-muted/5 p-4">
                <AnimatedWriter
                  lines={[
                    "Built by Huzaifa — MERN Stack Engineer",
                    "My Personal Project Portfolio",
                    "BSCS @ NED University, Karachi"
                  ]}
                  reduceMotion={reduceMotion}
                />
              </div>
              {/* 💻 INTERACTIVE LIVE MOCK SIMULATOR WRAPPER (Proof of Engineering!) */}
              <div className="w-full max-w-sm mx-auto border border-border rounded-xl bg-card shadow-xl overflow-hidden text-left">
                <div className="bg-muted/50 border-b border-border px-4 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-muted"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-muted"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-muted"></div>
                    <span className="text-[11px] text-muted-foreground font-mono ml-2">sandbox-preview-terminal:~</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-bold px-2 py-0.5 rounded">MERN Sandbox</span>
                </div>

                <div className="p-4 bg-card space-y-4">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Interactive Live Test Component</p>

                  {/* Input simulator area */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center bg-muted/30 p-4 rounded-lg border border-border/60">
                    <div className="flex-1 w-full space-y-1">
                      <label htmlFor="demoAmountRange" className="text-[11px] font-bold text-muted-foreground uppercase">Simulate Expense Amount (PKR)</label>
                      <input 
                        id="demoAmountRange"
                        type="range" 
                        min="500" 
                        max="10000" 
                        step="500"
                        value={demoAmount} 
                        onChange={(e) => setDemoAmount(Number(e.target.value))}
                        aria-label="Simulate expense amount"
                        className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-muted-foreground block font-medium">Live Input</span>
                      <span className="text-lg font-black text-rose-500" role="status" aria-live="polite">Rs. {demoAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Response Simulation Calculation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-border p-4 rounded-lg bg-muted/10 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold">August Internet Budget</span>
                        <span className={demoAmount > 5000 ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                          {demoAmount > 5000 ? '⚠️ Overspent' : '✅ Safe'}
                        </span>
                      </div>
                      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${demoAmount > 5000 ? 'bg-rose-500' : 'bg-indigo-500'}`}
                          style={{ width: mounted ? `${Math.min((demoAmount / 5000) * 100, 100)}%` : '0%' }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Spent: Rs. {demoAmount}</span>
                        <span>Cap Limit: Rs. 5,000</span>
                      </div>
                    </div>

                    <div className="border border-border p-4 rounded-lg bg-muted/10 flex flex-col justify-between">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Dynamic Runway Calculation</span>
                      <div>
                        <span className="text-2xl font-black tracking-tight text-foreground">
                          Rs. {(15000 - demoAmount).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted-foreground block mt-0.5">Remaining from Rs. 15,000 total safe stash</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

          </div>
        </div>
      </main>

      {/* 🧳 UNIFIED STUDENT-PORTFOLIO FOOTER */}
      <footer className="w-full border-t border-border bg-card mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-center sm:text-left text-xs text-muted-foreground font-medium">
          
          <div className="space-y-1">
            <p className="text-foreground font-bold text-sm">Designed & Maintained by Huzaifa</p>
            <p className="text-xs">BSCS Department • NED University of Engineering and Technology.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 font-mono font-bold">
            <span className="text-emerald-500">MDB</span>
            <span className="text-gray-400">EXPR</span>
            <span className="text-indigo-500">REACT</span>
            <span className="text-green-600">NODE</span>
          </div>

          <p className="font-mono text-[11px]">
            &copy; {new Date().getFullYear()} Paisa Bachat.
          </p>

        </div>
      </footer>

    </div>
  );
};

export default LandingPage;

