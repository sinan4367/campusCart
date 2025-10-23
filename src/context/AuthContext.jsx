import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../classes/User";
import { Buyer } from "../classes/Buyer";
import { Seller } from "../classes/Seller";
import { AdminUser } from "../classes/AdminUser";

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
    
    const savedUser = localStorage.getItem("campusCartUser");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      let rehydratedUser = null;

      if (userData.role === "buyer") {
        rehydratedUser = new Buyer(
          userData.name,
          userData.email,
          userData.phone,
          userData.whatsapp,
          userData.id,
          userData.discussionPosts
        );
      } else if (userData.role === "seller") {
        rehydratedUser = new Seller(
          userData.name,
          userData.email,
          userData.phone,
          userData.whatsapp,
          userData.id,
          userData.items,
          userData.discussionPosts
        );
      } else if (userData.role === "admin") {
        rehydratedUser = new AdminUser(
          userData.name,
          userData.email,
          userData.phone,
          userData.id,
          userData.discussionPosts
        );
      }
      setUser(rehydratedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    
    if (blockedUsers.includes(userData.id)) {
      alert("This account has been blocked by an administrator.");
      return;
    }

    let rehydratedUser = userData; 
    if (!(userData instanceof User)) {
      
      if (userData.role === "buyer") {
        rehydratedUser = new Buyer(
          userData.name,
          userData.email,
          userData.phone,
          userData.whatsapp,
          userData.id,
          userData.discussionPosts
        );
      } else if (userData.role === "seller") {
        rehydratedUser = new Seller(
          userData.name,
          userData.email,
          userData.phone,
          userData.whatsapp,
          userData.id,
          userData.items,
          userData.discussionPosts
        );
      } else if (userData.role === "admin") {
        rehydratedUser = new AdminUser(
          userData.name,
          userData.email,
          userData.phone,
          userData.id,
          userData.discussionPosts
        );
      }
    }

    setUser(rehydratedUser);
    localStorage.setItem("campusCartUser", JSON.stringify(rehydratedUser));

    
    const existingUsers =
      JSON.parse(localStorage.getItem("campusCartUsers")) || [];
    const userExists = existingUsers.some((u) => u.id === rehydratedUser.id);

    if (!userExists) {
      existingUsers.push(rehydratedUser);
      localStorage.setItem("campusCartUsers", JSON.stringify(existingUsers));
    }

    
    const recentActivity =
      JSON.parse(localStorage.getItem("campusCartRecentActivity")) || [];
    const newActivity = {
      action: `${rehydratedUser.name} logged in as ${rehydratedUser.role}`,
      user: rehydratedUser.name,
      time: new Date().toLocaleString(),
    };
    recentActivity.unshift(newActivity); 
    localStorage.setItem(
      "campusCartRecentActivity",
      JSON.stringify(recentActivity.slice(0, 10))
    ); 
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
