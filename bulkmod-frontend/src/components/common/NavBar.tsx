import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui";

export default function NavBar() {
  const { user, logout, isLoading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    // Redirect to landing page after logout
    navigate('/');
  };

  return (
    <nav className="fixed w-full bg-slate-900 border-b border-green-700 py-3 px-6 flex items-center justify-between z-50">
      <Link to="/" className="text-2xl font-bold text-green-300">BulkMod</Link>
      
      <div className="flex items-center gap-4">
        {/* Only show Download and Search links when user is authenticated */}
        {!isLoading && user && (
          <>
            <Link to="/search" className="text-green-200 hover:text-green-400 font-medium">Search</Link>
            <Link to="/download" className="text-green-200 hover:text-green-400 font-medium">Download</Link>
            <Link to="/modlists" className="text-green-200 hover:text-green-400 font-medium">Mod Lists</Link>
          </>
        )}
        
        {!isLoading && (
          <>
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-green-200 hover:text-green-400 font-medium focus:outline-none"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-slate-900 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.username}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-green-600 rounded-lg shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-green-600">
                      <p className="text-sm text-green-200">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-green-200 hover:bg-slate-700 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="text-green-200 hover:text-green-400 font-medium"
                >
                  Sign in
                </Link>
                <Button 
                  asChild
                  variant="primary"
                  size="sm"
                >
                  <Link to="/register">
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </nav>
  );
} 