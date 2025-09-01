import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LoginModal from "./LoginModal";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { getCartItemCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:from-purple-600 group-hover:to-indigo-700 transition-all duration-300 ease-in-out">
                C
              </div>
              <span className="ml-3 text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300 ease-in-out">
                CampusCart
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ease-in-out"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ease-in-out"
            >
              Browse
            </Link>
            {user && (user.role === "seller" || user.role === "admin") && (
              <Link
                to="/sell"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ease-in-out"
              >
                Sell
              </Link>
            )}
            <Link
              to="/discussion"
              className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ease-in-out"
            >
              Discussion
            </Link>
            {isAdmin() && (
              <Link
                to="/admin"
                className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ease-in-out"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Right side - Cart and User */}
          <div className="flex items-center space-x-3">
            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-200 ease-in-out"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
                  {getCartItemCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative flex items-center space-x-3">
                <span className="text-base font-medium text-gray-700 dark:text-gray-200">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-gray-700 hover:bg-purple-200 dark:hover:bg-gray-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-colors duration-220 ease-in-out"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-inner">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse
            </Link>
            {user && (user.role === "seller" || user.role === "admin") && (
              <Link
                to="/sell"
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sell
              </Link>
            )}
            <Link
              to="/discussion"
              className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Discussion
            </Link>
            {isAdmin() && (
              <Link
                to="/admin"
                className="text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-purple-700 dark:hover:text-purple-300 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => setIsLoginModalOpen(false)} // This also closes the login modal
      />
    </nav>
  );
};

export default Navbar;
