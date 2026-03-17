import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getUser, logout } from '@/lib/auth';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold">
            OLX
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
            <Link href="/post-ad" className="hover:text-secondary transition-colors">
              Post Ad
            </Link>
            {user ? (
              <>
                <Link href="/my-ads" className="hover:text-secondary transition-colors">
                  My Ads
                </Link>
                <Link href="/profile" className="hover:text-secondary transition-colors">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-secondary text-primary px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-secondary transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-secondary text-primary px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/" className="block py-2 hover:text-secondary">
              Home
            </Link>
            <Link href="/post-ad" className="block py-2 hover:text-secondary">
              Post Ad
            </Link>
            {user ? (
              <>
                <Link href="/my-ads" className="block py-2 hover:text-secondary">
                  My Ads
                </Link>
                <Link href="/profile" className="block py-2 hover:text-secondary">
                  Profile
                </Link>
                <button onClick={handleLogout} className="block py-2 w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 hover:text-secondary">
                  Login
                </Link>
                <Link href="/register" className="block py-2 hover:text-secondary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
