import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-400 mb-4">404 - Page Not Found</h1>
          <p className="text-lg text-slate-300 mb-6">Sorry, the page you are looking for does not exist.</p>
          <Link to="/" className="px-6 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow transition">Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
} 