import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Admin = () => {
  const { user, blockedUsers, blockUser, unblockUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [listedItems, setListedItems] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // Mock data for demonstration
  const [analytics, setAnalytics] = useState({
    users: {
      total: 1247,
      buyers: 892,
      sellers: 355,
      activeToday: 89,
      newThisWeek: 45,
    },
    inventory: {
      total: 2341,
      active: 1892,
      outOfStock: 449,
      lowStock: 156,
    },
    popularResources: [
      {
        name: "Advanced Calculus Notes",
        downloads: 234,
        category: "Education",
      },
      {
        name: "Python Programming Guide",
        downloads: 189,
        category: "Education",
      },
      {
        name: "Roommate Agreement Template",
        downloads: 156,
        category: "Hostel",
      },
      { name: "Lab Equipment Set", downloads: 134, category: "Electronics" },
      { name: "Free Study Materials", downloads: 298, category: "Free" },
    ],
    categories: [
      { name: "Education", count: 892, percentage: 38.1 },
      { name: "Hostel", count: 567, percentage: 24.2 },
      { name: "Electronics", count: 445, percentage: 19.0 },
      { name: "Free", count: 437, percentage: 18.7 },
    ],
    freeDownloads: [
      { resource: "Study Guide PDF", downloads: 156, uploader: "Study Group" },
      { resource: "Exam Papers", downloads: 134, uploader: "Academic Dept" },
      { resource: "Tutorial Videos", downloads: 98, uploader: "TAs" },
      { resource: "Practice Problems", downloads: 87, uploader: "Math Club" },
    ],
    blockedSellers: [
      {
        name: "John Doe",
        reason: "Fake items",
        date: "2024-01-15",
        status: "Blocked",
      },
      {
        name: "Jane Smith",
        reason: "Spam posts",
        date: "2024-01-12",
        status: "Blocked",
      },
      {
        name: "Mike Johnson",
        reason: "Inappropriate content",
        date: "2024-01-10",
        status: "Warning",
      },
    ],
    recentActivity: [
      {
        action: "New user registered",
        user: "alice@university.edu",
        time: "2 min ago",
      },
      {
        action: "Item reported",
        item: "Calculus Textbook",
        time: "15 min ago",
      },
      { action: "Seller blocked", user: "spam@fake.com", time: "1 hour ago" },
      {
        action: "New category added",
        category: "Sports Equipment",
        time: "3 hours ago",
      },
    ],
  });

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("listedItems")) || [];
    setListedItems(storedItems);

    const storedUsers =
      JSON.parse(localStorage.getItem("campusCartUsers")) || [];
    setAllUsers(storedUsers);

    setAnalytics((prevAnalytics) => ({
      ...prevAnalytics,
      users: {
        ...prevAnalytics.users,
        total: storedUsers.length,
        buyers: storedUsers.filter((u) => u.role === "buyer").length,
        sellers: storedUsers.filter((u) => u.role === "seller").length,
      },
      inventory: {
        ...prevAnalytics.inventory,
        total: storedItems.length,
        active: storedItems.filter((item) => !item.isOutOfStock).length,
      },
      categories: calculateCategoryCounts(storedItems),
    }));
  }, [listedItems, allUsers]); // Add allUsers to dependency array

  useEffect(() => {
    const storedRecentActivity =
      JSON.parse(localStorage.getItem("campusCartRecentActivity")) || [];
    setAnalytics((prevAnalytics) => ({
      ...prevAnalytics,
      recentActivity: storedRecentActivity,
    }));
  }, []);

  // Check if user is admin
  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-purple-50 dark:bg-gray-900 flex items-center justify-center py-10 transition-colors duration-300 rounded-3xl overflow-hidden">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="text-6xl mb-6 text-red-500">🚫</div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Access Denied
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed">
              You need admin privileges to view this page. Please log in with an
              admin account.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const calculateCategoryCounts = (items) => {
    const categoryCounts = {
      Education: 0,
      Hostel: 0,
      Electronics: 0,
      Free: 0,
    };

    items.forEach((item) => {
      if (categoryCounts.hasOwnProperty(item.category)) {
        categoryCounts[item.category]++;
      }
    });

    const totalItems = items.length;
    return Object.keys(categoryCounts).map((categoryName) => ({
      name: categoryName,
      count: categoryCounts[categoryName],
      percentage:
        totalItems > 0 ? (categoryCounts[categoryName] / totalItems) * 100 : 0,
    }));
  };

  const StatCard = ({ title, value, change, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300 transform hover:scale-[1.02] hover:shadow-xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-gray-900 dark:text-white mt-1 leading-tight">
            {value}
          </p>
          {change && (
            <p
              className={`text-sm mt-2 font-medium flex items-center gap-1 ${
                change > 0
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {change > 0 ? "↗" : "↘"} {Math.abs(change)}% from last week
            </p>
          )}
        </div>
        <div className={`text-4xl ${color}`}>{icon}</div>
      </div>
    </div>
  );

  const MetricCard = ({ title, value, subtitle, trend }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-200 dark:border-gray-700 transition-colors duration-300 hover:shadow-lg">
      <h3 className="text-base font-medium text-gray-600 dark:text-gray-300 mb-2">
        {title}
      </h3>
      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 leading-tight">
        {value}
      </p>
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {subtitle}
        </p>
      )}
      {trend && (
        <div className="flex items-center mt-3">
          <span
            className={`text-sm font-medium flex items-center gap-1 ${
              trend > 0
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {trend > 0 ? "↗" : "↘"} {Math.abs(trend)}%
          </span>
        </div>
      )}
    </div>
  );

  const handleDeleteItem = (itemId) => {
    const updatedItems = listedItems.filter((item) => item.id !== itemId);
    setListedItems(updatedItems);
    localStorage.setItem("listedItems", JSON.stringify(updatedItems));
    alert("Item deleted successfully!");
  };

  return (
    <div className="min-h-screen bg-purple-50 dark:bg-gray-900 transition-colors duration-300 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 transition-colors duration-300">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                📊 Admin Dashboard
              </h1>
              <p className="text-base text-gray-700 dark:text-gray-300 mt-1">
                Welcome back,{" "}
                <span className="font-semibold text-purple-600 dark:text-purple-400">
                  {user.name}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 shadow-sm">
                Admin
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: Just now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6">
            {[
              // Added a "Dashboard" tab for consistency and better navigation
              { id: "overview", name: "Overview", icon: "📊" },
              { id: "users", name: "Users", icon: "👥" },
              { id: "inventory", name: "Inventory", icon: "📦" },
              { id: "listed-items", name: "Listed Items", icon: "📝" },
              { id: "analytics", name: "Analytics", icon: "📈" },
              { id: "moderation", name: "Moderation", icon: "🛡️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-4 px-1 border-b-2 font-medium text-base group transition-colors duration-200 ease-in-out
                  ${
                    activeTab === tab.id
                      ? "border-purple-600 text-purple-700 dark:border-purple-400 dark:text-purple-300"
                      : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">{tab.icon}</span>
                  {tab.name}
                </span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-purple-600 dark:bg-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 ease-out"></span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={analytics.users.total.toLocaleString()}
                change={12}
                icon="👥"
                color="text-purple-600 dark:text-purple-400"
              />
              <StatCard
                title="Active Listings"
                value={analytics.inventory.active.toLocaleString()}
                change={8}
                icon="📦"
                color="text-green-600 dark:text-green-400"
              />
              <StatCard
                title="Total Resources"
                value={analytics.inventory.total.toLocaleString()}
                change={-3}
                icon="📚"
                color="text-blue-600 dark:text-blue-400"
              />
              <StatCard
                title="Blocked Users"
                value={blockedUsers.length}
                change={-15}
                icon="🚫"
                color="text-red-600 dark:text-red-400"
              />
            </div>

            {/* Charts and Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Distribution */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  📊 Category Distribution
                </h3>
                <div className="space-y-4">
                  {analytics.categories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between group py-2 px-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500 dark:bg-purple-400 group-hover:scale-125 transition-transform duration-200"></div>
                        <span className="font-medium text-gray-900 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-200">
                          {category.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 dark:bg-purple-400 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-400 w-12 text-right font-semibold">
                          {category.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Resources */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  🔥 Most Popular Resources
                </h3>
                <div className="space-y-3">
                  {analytics.popularResources
                    .slice(0, 5)
                    .map((resource, index) => (
                      <div
                        key={resource.name}
                        className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg group hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">
                            {index === 0
                              ? "🥇"
                              : index === 1
                              ? "🥈"
                              : index === 2
                              ? "🥉"
                              : "📄"}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-200 text-base group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors duration-200">
                              {resource.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {resource.category}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                          {resource.downloads} downloads
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                🕒 Recent Activity
              </h3>
              <div className="space-y-4">
                {analytics.recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-900 dark:text-gray-200 font-medium">
                      {activity.action}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      •
                    </span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 italic">
                      {activity.user || activity.item || activity.category}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-auto font-light">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                title="Total Users"
                value={analytics.users.total.toLocaleString()}
                subtitle="All registered users"
                trend={12}
              />
              <MetricCard
                title="Buyers"
                value={analytics.users.buyers.toLocaleString()}
                subtitle="Users who purchase items"
                trend={8}
              />
              <MetricCard
                title="Sellers"
                value={analytics.users.sellers.toLocaleString()}
                subtitle="Users who list items"
                trend={15}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                👥 User Growth
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-5 bg-white dark:bg-gray-700 rounded-lg border border-purple-200 dark:border-gray-600 shadow-sm">
                  <p className="text-3xl font-extrabold text-purple-700 dark:text-purple-300">
                    {analytics.users.activeToday}
                  </p>
                  <p className="text-base text-purple-800 dark:text-purple-200 mt-2">
                    Active Today
                  </p>
                </div>
                <div className="text-center p-5 bg-green-50 dark:bg-gray-700 rounded-lg border border-green-200 dark:border-gray-600 shadow-sm">
                  <p className="text-3xl font-extrabold text-green-700 dark:text-green-300">
                    {analytics.users.newThisWeek}
                  </p>
                  <p className="text-base text-green-800 dark:text-green-200 mt-2">
                    New This Week
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="space-y-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <MetricCard
                title="Total Items"
                value={analytics.inventory.total.toLocaleString()}
                subtitle="All listed resources"
                trend={10}
              />
              <MetricCard
                title="Active Listings"
                value={analytics.inventory.active.toLocaleString()}
                subtitle="Currently available for purchase"
                trend={8}
              />
              <MetricCard
                title="Out of Stock"
                value={analytics.inventory.outOfStock.toLocaleString()}
                subtitle="Temporarily unavailable"
                trend={-5}
              />
              <MetricCard
                title="Low Stock"
                value={analytics.inventory.lowStock.toLocaleString()}
                subtitle="Less than 5 items remaining"
                trend={12}
              />
            </div>

            {/* No Inventory Status section now */}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Free Resource Downloads */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  📥 Free Resource Downloads
                </h3>
                <div className="space-y-4">
                  {analytics.freeDownloads.map((resource) => (
                    <div
                      key={resource.resource}
                      className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg group hover:shadow-md transition-shadow duration-200"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-200 text-base group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200">
                          {resource.resource}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          by {resource.uploader}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {resource.downloads} downloads
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Most Searched Categories */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  🔍 Most Active Categories
                </h3>
                <div className="space-y-4">
                  {analytics.categories.map((category, index) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg group hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {index === 0
                            ? "🥇"
                            : index === 1
                            ? "🥈"
                            : index === 2
                            ? "🥉"
                            : "📁"}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors duration-200">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {category.count} items
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Moderation Tab */}
        {activeTab === "moderation" && (
          <div className="space-y-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                🛡️ Blocked Users (Sellers/Buyers)
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        User Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {allUsers.map((u, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {u.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {u.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                              blockedUsers.includes(u.id)
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }`}
                          >
                            {blockedUsers.includes(u.id) ? "Blocked" : "Active"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {blockedUsers.includes(u.id) ? (
                            <button
                              onClick={() => unblockUser(u.id)}
                              className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 font-medium transition-colors duration-200"
                            >
                              Unblock
                            </button>
                          ) : (
                            <button
                              onClick={() => blockUser(u.id)}
                              className={`text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium transition-colors duration-200 ${
                                user.id === u.id
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              disabled={user.id === u.id} // Disable if it's the current admin
                            >
                              Block
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Listed Items Tab */}
        {activeTab === "listed-items" && (
          <div className="space-y-6 bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                📝 All Listed Items
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Seller Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {listedItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          ₹{item.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                          {item.sellerName || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
