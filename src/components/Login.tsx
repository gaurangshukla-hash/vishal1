import React, { useState } from 'react';
import { Lock, User as UserIcon, AlertCircle, Shield, Globe, Activity, ArrowRight } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const MOCK_USERS: { [key: string]: { name: string; role: UserRole } } = {
  'admin': { name: 'System Admin', role: 'Admin' },
  'saleshead': { name: 'Sales Head', role: 'SalesHead' },
  'salesexec': { name: 'Sales Executive', role: 'SalesExecutive' },
  'noc': { name: 'NOC Lead', role: 'NOC' },
};

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    setTimeout(() => {
      const mockUser = MOCK_USERS[username.toLowerCase()];
      
      if (mockUser && password === 'admin123') {
        onLogin({
          id: username,
          name: mockUser.name,
          role: mockUser.role,
        });
      } else {
        setError('Invalid username or password');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-night-bg flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-night-bg rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-black/5 border border-zinc-200 dark:border-zinc-900">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-500 rounded-3xl shadow-xl shadow-brand-500/20 mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white mb-2">Welcome Back</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Username</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                    placeholder="Username (e.g. admin, noc)"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 group-focus-within:text-brand-500 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-900 border-none rounded-2xl py-4 pl-12 pr-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-brand-500/20 transition-all font-medium"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-2xl py-4 font-black uppercase tracking-widest shadow-xl shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <Activity className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Access Dashboard
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <p className="text-center mt-8 text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
          Powered by TeleOSS Enterprise v2.4.0
        </p>
      </div>
    </div>
  );
}
