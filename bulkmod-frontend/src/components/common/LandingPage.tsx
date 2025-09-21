import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Footer from "./Footer";

export default function LandingPage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-2xl w-full">
          <section className="bg-slate-800/70 border border-green-500/30 rounded-lg p-6 shadow-xl">
            <h1 className="text-5xl font-bold mb-4 text-green-300 text-center">BulkMod</h1>
            <p className="text-lg text-green-100 mb-8 text-center">
              The easiest way to search, discover, and bulk download Minecraft mods from Modrinth.
            </p>
            
            {!isLoading && (
              <>
                {user ? (
                  // User is logged in - show access to features
                  <div className="text-center">
                    <p className="text-green-200 mb-6 text-lg">
                      Welcome back, <span className="text-green-300 font-semibold">{user.username}</span>! 
                      You're all set to start downloading mods.
                    </p>
                    <div className="flex justify-center gap-6">
                      <Link to="/search" className="px-6 py-3 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow transition">
                        🔍 Search Mods
                      </Link>
                      <Link to="/download" className="px-6 py-3 rounded bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow transition">
                        ⬇️ Bulk Download
                      </Link>
                    </div>
                  </div>
                ) : (
                  // User is not logged in - show login/register options
                  <div className="text-center">
                    <div className="bg-slate-800/50 border border-green-500/30 rounded-lg p-6 mb-6">
                      <h2 className="text-2xl font-semibold text-green-300 mb-3">🔒 Authentication Required</h2>
                      <p className="text-green-200 mb-4">
                        To access BulkMod's features, you need to create an account or sign in.
                      </p>
                      <p className="text-sm text-green-300/80">
                        This ensures secure access and helps us provide better service.
                      </p>
                    </div>
                    <div className="flex justify-center gap-6">
                      <Link to="/login" className="px-6 py-3 rounded bg-green-600 hover:bg-green-700 text-white font-bold text-lg shadow transition">
                        🔑 Sign In
                      </Link>
                      <Link to="/register" className="px-6 py-3 rounded bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow transition">
                        ✨ Create Account
                      </Link>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {isLoading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400 mx-auto mb-4"></div>
                <p className="text-green-200">Loading...</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
} 