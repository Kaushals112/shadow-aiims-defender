
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, User } from 'lucide-react';
import { logActivity, generateSessionId, obfuscateJavaScript } from '../utils/securityLogger';

const LoginPage = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  React.useEffect(() => {
    // Log page visit
    logActivity('page_visit', { page: 'login', timestamp: new Date().toISOString() });
    
    // Initialize session tracking
    if (!localStorage.getItem('session_id')) {
      localStorage.setItem('session_id', generateSessionId());
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAttempts(prev => prev + 1);

    // Log brute force attempt
    logActivity('login_attempt', {
      username: credentials.username,
      password: credentials.password,
      attempt_number: attempts + 1,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent
    });

    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Vulnerable SQL injection simulation (log the attempt)
    if (credentials.username.includes("'") || credentials.username.includes('"') || 
        credentials.password.includes("'") || credentials.password.includes('"')) {
      logActivity('sql_injection_attempt', {
        field: credentials.username.includes("'") || credentials.username.includes('"') ? 'username' : 'password',
        payload: credentials.username.includes("'") || credentials.username.includes('"') ? credentials.username : credentials.password,
        timestamp: new Date().toISOString()
      });
    }

    // Simulate successful login for demonstration
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      const token = btoa(JSON.stringify({
        username: credentials.username,
        role: 'admin',
        exp: Date.now() + 3600000,
        session_id: localStorage.getItem('session_id')
      }));
      
      localStorage.setItem('auth_token', token);
      logActivity('login_success', { username: credentials.username });
      onLogin(token);
    } else {
      setError('Invalid credentials. Please try again.');
      logActivity('login_failure', { 
        username: credentials.username,
        reason: 'invalid_credentials'
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* AIIMS Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AIIMS Admin Portal</h1>
          <p className="text-gray-600 mt-2">All India Institute of Medical Sciences</p>
          <p className="text-sm text-gray-500">Secure Administrative Access</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-blue-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Administrative Login
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username / Employee ID
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className="pl-10"
                    value={credentials.username}
                    onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={credentials.password}
                    onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </Button>

              <div className="text-center text-sm text-gray-600">
                <p>Forgot password? Contact IT Support</p>
                <p className="mt-1">Ext: 1234 | support@aiims.edu</p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>⚠️ This is a secure government portal. Unauthorized access is prohibited.</p>
          <p>All activities are monitored and logged for security purposes.</p>
        </div>

        {/* Attempt counter for brute force detection */}
        {attempts > 3 && (
          <Alert className="mt-4 border-yellow-200 bg-yellow-50">
            <AlertDescription className="text-yellow-800">
              Multiple failed attempts detected. Account may be temporarily locked.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
