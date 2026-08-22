import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";

import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import DashboardNavbar from "./components/ui/DashboardNavbar";
import Analytics from "./Analytics";
import Budgets from "./Budget";

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <DashboardNavbar />
                <main className="w-full">
                  <Dashboard />
                </main>
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/analytics"
          element={
            <>
              <SignedIn>
                <DashboardNavbar />
                <main className="w-full">
                  <Analytics />
                </main>
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          }
        />
        <Route
          path="/budgets"
          element={
            <>
              <SignedIn>
                <DashboardNavbar />
                <main className="w-full">
                  <Budgets />
                </main>
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          }
        />

        {/* 🎯 Yeh login route aapke code se delete ho gaya tha, ise wapas add kar rahe hain */}
        <Route
          path="/login/*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-background">
              <SignIn routing="path" path="/login" signUpUrl="/signup" />
            </div>
          }
        />
        <Route
          path="/signup/*"
          element={
            <div className="flex min-h-screen items-center justify-center bg-background">
              <SignUp routing="path" path="/signup" signInUrl="/login"/>
            </div>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
