import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { User } from "../classes/User";
import { AdminUser } from "../classes/AdminUser"; // Import AdminUser
import { Buyer } from "../classes/Buyer"; // Import Buyer
import { Seller } from "../classes/Seller"; // Import Seller

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState(null); // 'buyer' or 'seller'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (role) => {
    setIsLoading(true);
    setError("");

    const storedUsers =
      JSON.parse(localStorage.getItem("campusCartUsers")) || [];

    try {
      // Admin login (unchanged)
      const existingAdmin = storedUsers.find(
        (u) => u.email === formData.email && u.role === "admin"
      );

      if (
        formData.email === "admin@campuscart.com" &&
        formData.password === "admin123"
      ) {
        const adminUser = new AdminUser(
          "Admin User",
          formData.email,
          "9876543210",
          existingAdmin ? existingAdmin.id : null,
          existingAdmin ? existingAdmin.discussionPosts : []
        );
        // Check if admin user already exists to retrieve their ID
        if (existingAdmin) {
          adminUser.id = existingAdmin.id; // Use existing ID
        }
        login(adminUser);
        onClose();
        return;
      }

      // Buyer/Seller login
      if (!selectedRole && !role) {
        throw new Error("Please select a login role (Buyer or Seller).");
      }

      // Add validation for email and password for Buyer/Seller logins
      if (!formData.email || !formData.password) {
        throw new Error("Please enter both email and password.");
      }

      // Validate email format and domain
      if (
        !User.validateEmail(formData.email) ||
        !formData.email.endsWith("@gmail.com")
      ) {
        throw new Error(
          "Please enter a valid Gmail address (e.g., user@gmail.com)."
        );
      }

      const currentRole = role || selectedRole;

      if (currentRole === "buyer") {
        let buyerUser;
        const existingBuyer = storedUsers.find(
          (u) => u.email === formData.email && u.role === "buyer"
        );

        if (existingBuyer) {
          // If buyer exists, use their stored data
          buyerUser = new Buyer(
            existingBuyer.name,
            existingBuyer.email,
            existingBuyer.phone,
            existingBuyer.whatsapp,
            existingBuyer.id, // Pass existing ID
            existingBuyer.discussionPosts || [] // Pass existing discussionPosts
          );
        } else {
          // If new buyer, create a new user
          buyerUser = new Buyer(
            formData.email.split("@")[0], // Use part of email as name
            formData.email,
            "9876543212" // Generic phone
          );
        }
        login(buyerUser);
        onClose();
      } else if (currentRole === "seller") {
        let sellerUser;
        const existingSeller = storedUsers.find(
          (u) => u.email === formData.email && u.role === "seller"
        );

        if (existingSeller) {
          // If seller exists, use their stored data
          sellerUser = new Seller(
            existingSeller.name,
            existingSeller.email,
            existingSeller.phone,
            existingSeller.whatsapp,
            existingSeller.id, // Pass existing ID
            existingSeller.items || [], // Pass existing items
            existingSeller.discussionPosts || [] // Pass existing discussionPosts
          );
        } else {
          // If new seller, create a new user
          sellerUser = new Seller(
            formData.email.split("@")[0], // Use part of email as name
            formData.email,
            "9876543211",
            "9876543211"
          );
        }
        login(sellerUser);
        onClose();
      } else {
        throw new Error("Invalid credentials or role. Please try again.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    handleLogin("admin");
  };

  const handleBuyerLogin = async () => {
    handleLogin("buyer");
  };

  const handleSellerLogin = async () => {
    handleLogin("seller");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 dark:bg-opacity-80 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700 transform scale-95 opacity-0 animate-scale-in transition-all duration-300 ease-out">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Login to CampusCart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-4xl font-light p-2 transition-colors duration-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg text-sm mb-6 animate-fade-in">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email-input"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label
              htmlFor="password-input"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password-input"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>

          {formData.email === "admin@campuscart.com" &&
          formData.password === "admin123" ? (
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Login as Admin"}
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleBuyerLogin}
                disabled={isLoading}
                className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-gray-700 hover:bg-purple-200 dark:hover:bg-gray-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  isLoading && selectedRole === "buyer"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isLoading && selectedRole === "buyer"
                  ? "Logging in..."
                  : "Login as Buyer"}
              </button>
              <button
                type="button"
                onClick={handleSellerLogin}
                disabled={isLoading}
                className={`flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  isLoading && selectedRole === "seller"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isLoading && selectedRole === "seller"
                  ? "Logging in..."
                  : "Login as Seller"}
              </button>
            </div>
          )}
        </form>

        <div className="mt-8 text-center">
          <p className="text-base text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToRegister}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors duration-200"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
