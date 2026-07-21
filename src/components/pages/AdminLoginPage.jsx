import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { authService } from '../../services/authService';
import useSupabaseSession from '../../hooks/useSupabaseSession';

/**
 * AdminLoginPage (/admin)
 *
 * Minimal Supabase email/password login for the site admin. Not linked from
 * the UI — direct URL only. Once logged in, managed images on the home page
 * show a "Move" button for in-place repositioning (see AdjustableImage).
 */
const AdminLoginPage = ({ language }) => {
  const navigate = useNavigate();
  const { session } = useSupabaseSession();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const isRo = language === 'ro';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await authService.signIn(email, password);
    setLoading(false);
    if (error) {
      setError(isRo ? 'Autentificare eșuată. Verifică emailul și parola.' : 'Login failed. Check email and password.');
    } else {
      navigate('/');
    }
  };

  const handleSignOut = async () => {
    await authService.signOut();
  };

  return (
    <div className="min-h-[70vh] bg-[#dce6f5] flex items-center justify-center px-4 py-16">
      <div className="bg-[#f7f4ec] rounded-lg shadow-md p-8 w-full max-w-md">
        <h1 className="font-serif font-bold text-[#1e3a8a] text-2xl md:text-3xl mb-6 text-center">
          Admin
        </h1>

        {session ? (
          <div className="text-center">
            <p className="text-[#1e3a8a] mb-2">
              {isRo ? 'Autentificat ca' : 'Logged in as'}{' '}
              <span className="font-semibold">{session.user?.email}</span>
            </p>
            <p className="text-[#1e3a8a]/70 text-sm mb-6">
              {isRo
                ? 'Mergi pe pagina principală și folosește butonul de mutare de pe imagini pentru a le repoziționa.'
                : 'Go to the home page and use the move button on images to reposition them.'}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="bg-[#1e3a8a] text-white px-6 py-2 rounded-full font-semibold hover:opacity-90 transition"
              >
                {isRo ? 'Pagina principală' : 'Home page'}
              </button>
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 border border-[#1e3a8a] text-[#1e3a8a] px-6 py-2 rounded-full font-semibold hover:bg-[#1e3a8a]/5 transition"
              >
                <LogOut size={16} />
                {isRo ? 'Deconectare' : 'Sign out'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1e3a8a] mb-1" htmlFor="admin-email">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1e3a8a] mb-1" htmlFor="admin-password">
                {isRo ? 'Parolă' : 'Password'}
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              <LogIn size={18} />
              {loading ? (isRo ? 'Se conectează...' : 'Signing in...') : (isRo ? 'Conectare' : 'Sign in')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
