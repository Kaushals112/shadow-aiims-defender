
import React, { useState, useEffect } from 'react';
import LoginPage from '../components/LoginPage';
import AdminDashboard from '../components/AdminDashboard';
import AttackMonitor from '../components/AttackMonitor';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMonitor, setShowMonitor] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token));
        if (decoded.exp > Date.now()) {
          setIsAuthenticated(true);
          setAuthToken(token);
        } else {
          localStorage.removeItem('auth_token');
        }
      } catch (error) {
        localStorage.removeItem('auth_token');
      }
    }
  }, []);

  const handleLogin = (token: string) => {
    setAuthToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('session_id');
  };

  if (showMonitor) {
    return (
      <div>
        <div className="fixed top-4 right-4 z-50">
          <Button 
            onClick={() => setShowMonitor(false)}
            variant="outline"
            className="bg-white"
          >
            Back to Honeypot
          </Button>
        </div>
        <AttackMonitor />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Monitor Toggle Button - Hidden from attackers */}
      <div className="fixed top-4 left-4 z-50">
        <Button 
          onClick={() => setShowMonitor(true)}
          variant="ghost"
          size="sm"
          className="opacity-10 hover:opacity-100 transition-opacity bg-black text-white"
          title="View Attack Monitor"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Honeypot Interface */}
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default Index;
