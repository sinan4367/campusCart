import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState(() => {
    const savedBlockedUsers = localStorage.getItem("campusCartBlockedUsers");
    return savedBlockedUsers ? JSON.parse(savedBlockedUsers) : [];
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check localStorage for existing user session
    const savedUser = localStorage.getItem("campusCartUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    // Check if the user is blocked
    if (blockedUsers.includes(userData.id)) {
      alert("This account has been blocked by an administrator.");
      return;
    }

    setUser(userData);
    localStorage.setItem("campusCartUser", JSON.stringify(userData));

    // Save all users to local storage
    const existingUsers =
      JSON.parse(localStorage.getItem("campusCartUsers")) || [];
    const userExists = existingUsers.some((u) => u.id === userData.id);

    if (!userExists) {
      existingUsers.push(userData);
      localStorage.setItem("campusCartUsers", JSON.stringify(existingUsers));
    }

    // Record login activity
    const recentActivity =
      JSON.parse(localStorage.getItem("campusCartRecentActivity")) || [];
    const newActivity = {
      action: `${userData.name} logged in as ${userData.role}`,
      user: userData.name,
      time: new Date().toLocaleString(),
    };
    recentActivity.unshift(newActivity); // Add to the beginning
    localStorage.setItem(
      "campusCartRecentActivity",
      JSON.stringify(recentActivity.slice(0, 10))
    ); // Keep last 10 activities
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campusCartUser");
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isSeller = () => {
    return user?.role === "seller";
  };

  const isBuyer = () => {
    return user?.role === "buyer";
  };

  const blockUser = (userId) => {
    if (!blockedUsers.includes(userId)) {
      const updatedBlockedUsers = [...blockedUsers, userId];
      setBlockedUsers(updatedBlockedUsers);
      localStorage.setItem(
        "campusCartBlockedUsers",
        JSON.stringify(updatedBlockedUsers)
      );
    }
  };

  const unblockUser = (userId) => {
    const updatedBlockedUsers = blockedUsers.filter((id) => id !== userId);
    setBlockedUsers(updatedBlockedUsers);
    localStorage.setItem(
      "campusCartBlockedUsers",
      JSON.stringify(updatedBlockedUsers)
    );
  };

  const value = {
    user,
    login,
    logout,
    isAdmin,
    isSeller,
    isBuyer,
    isLoading,
    blockedUsers,
    blockUser,
    unblockUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
