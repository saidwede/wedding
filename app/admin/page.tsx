'use client';

import { useState } from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import { verifyPassword } from './actions';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const isValid = await verifyPassword(password);
    
    if (isValid) {
      setIsAuthenticated(true);
    } else {
      setError('Mot de passe incorrect');
    }
    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
          <h1 className="text-2xl font-bold mb-6 text-center text-primary">Accès Admin</h1>
          
          {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">{error}</div>}
          
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary mb-4"
            placeholder="Mot de passe"
            required
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-xl transition"
          >
            {isLoading ? 'Vérification...' : 'Se connecter'}
          </button>
        </form>
      </div>
    );
  }

  return <AdminDashboard adminPassword={password} />;
}
