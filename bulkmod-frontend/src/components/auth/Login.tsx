import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Card, CardContent, Alert } from '../ui';
import Footer from '../common/Footer';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect to landing page after successful login
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900 text-white">
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-green-300">Welcome Back</h2>
                <p className="mt-2 text-green-200">Sign in with your username or email</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <Alert variant="error">
                    {error}
                  </Alert>
                )}

                <div className="space-y-4">
                  <Input
                    label="Username or Email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your username or email"
                  />

                  <Input
                    label="Password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </Button>

                <div className="text-center">
                  <p className="text-green-200">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-green-400 hover:text-green-300 font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
