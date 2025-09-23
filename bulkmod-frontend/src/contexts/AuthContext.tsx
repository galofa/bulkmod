import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Add a new state for fatal errors
  const [fatalError, setFatalError] = useState<string | null>(null);

  // Use environment variable for API URL, fallback to proxy for development
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('token');
    console.log('AuthContext useEffect - savedToken:', savedToken ? 'present' : 'missing');
    console.log('AuthContext useEffect - API_BASE:', API_BASE);
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    } else {
      setIsLoading(false);
    }

    // Listen for logout events from other parts of the app
    const handleLogoutEvent = (event: CustomEvent) => {
      console.log('AuthContext - received logout event:', event.detail);
      setUser(null);
      setToken(null);
      setFatalError(null);
    };

    window.addEventListener('auth:logout', handleLogoutEvent as EventListener);
    
    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent as EventListener);
    };
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      console.log('AuthContext.fetchUserProfile - API_BASE:', API_BASE);
      console.log('AuthContext.fetchUserProfile - token:', authToken ? 'present' : 'missing');
      
      const response = await fetch(`${API_BASE}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('AuthContext.fetchUserProfile - response status:', response.status);
      console.log('AuthContext.fetchUserProfile - response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('AuthContext.fetchUserProfile - user data received:', data.user);
        setUser(data.user);
      } else {
        console.log('AuthContext.fetchUserProfile - response not ok, clearing token');
        // Token is invalid, remove it
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setFatalError(null); // Not a fatal error, just unauthenticated
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setFatalError('Could not connect to backend. Please check your server and try again.');
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        
        let errorMessage = 'Login failed';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || 'Login failed';
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Login failed (${response.status}): ${text}`;
        }
        
        throw new Error(errorMessage);
      }

      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        
        let errorMessage = 'Registration failed';
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || 'Registration failed';
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Registration failed (${response.status}): ${text}`;
        }
        
        throw new Error(errorMessage);
      }

      const text = await response.text();
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Failed to parse success response:', parseError);
        throw new Error('Invalid response format from server');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
    
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
