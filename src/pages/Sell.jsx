import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Item } from "../classes/Item";

const Sell = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "Education",
    price: "",
    quantity: "1",
    description: "",
    whatsapp: "",
    phone: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [whatsappQrCode, setWhatsappQrCode] = useState(null);

  const categories = ["Education", "Hostel", "Electronics", "Free"];

  // Redirect if not logged in or not a seller
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 transition-colors duration-300">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 transition-colors duration-300">
            <div className="text-6xl mb-6 text-purple-500 dark:text-purple-400">
              🔒
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Login Required
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              You need to be logged in to sell items on CampusCart. Please log
              in to continue.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === "buyer") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 transition-colors duration-300">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 transition-colors duration-300">
            <div className="text-6xl mb-6 text-red-500">🚫</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Seller Account Required
            </h2>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              You need a seller account to list items. Please log in as a seller
              or contact an admin to upgrade your account.
            </p>
            <button
              onClick={() => navigate("/browse")}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Browse Items Instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);

    // Create preview URLs for images
    const newPreviews = files
      .map((file) => {
        if (file.type.startsWith("image/")) {
          return URL.createObjectURL(file);
        }
        return null;
      })
      .filter(Boolean);

    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleWhatsappQrCodeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setWhatsappQrCode(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeWhatsappQrCode = () => {
    setWhatsappQrCode(null);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name || !formData.description || !formData.price) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.price < 0) {
        throw new Error("Price cannot be negative");
      }

      // Create new item
      const newItem = new Item(
        formData.name,
        formData.category,
        parseFloat(formData.price),
        parseInt(formData.quantity),
        selectedFiles.length > 0 ? selectedFiles[0] : null,
        formData.description,
        user.id,
        user.name, // Pass seller's username
        whatsappQrCode // Add QR code to item
      );

      // Add images if any
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          if (file.type.startsWith("image/")) {
            newItem.addImage(URL.createObjectURL(file));
          }
        });
      }

      // Retrieve existing items from local storage or initialize an empty array
      const existingItems =
        JSON.parse(localStorage.getItem("listedItems")) || [];

      // Add the new item to the array
      existingItems.push(newItem);

      // Save the updated items array back to local storage
      localStorage.setItem("listedItems", JSON.stringify(existingItems));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success
      alert("Item listed successfully!");
      navigate("/browse");
      setWhatsappQrCode(null); // Clear QR code state after submission
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 md:py-12 transition-colors duration-300 rounded-3xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-blue-600 mb-4 leading-tight tracking-tight">
            List Your Item
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Fill out the form below to list your item for sale or share within
            the campus community.
          </p>
        </div>

        {/* Seller Info */}
        <div className="bg-white rounded-xl p-8 mb-10 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-black mb-6">
            Seller Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Name
              </label>
              <input
                type="text"
                value={user.name}
                disabled
                className="w-full px-4 py-3 border border-black rounded-lg bg-white text-gray-900 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 border border-black rounded-lg bg-white text-gray-900 cursor-not-allowed focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Item Form */}
        <div className="bg-white rounded-xl p-8 mb-10 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-black mb-8">
            Item Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="item-name"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="item-name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-black rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 placeholder-gray-700"
                  placeholder="e.g., Data Structures Textbook"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  id="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-black rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-black rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 placeholder-gray-700"
                  placeholder="0.00"
                />
                {formData.category === "Free" && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Free items will be marked as ₹0
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 border border-black rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 placeholder-gray-700"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="5"
                className="w-full px-4 py-3 border border-black rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 placeholder-gray-700"
                placeholder="Describe your item in detail, including condition, features, and any unique selling points."
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  name="whatsapp"
                  id="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-black rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 placeholder-gray-700"
                  placeholder="e.g., +91 9876543210 (optional)"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-800 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-black rounded-lg bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 placeholder-gray-700"
                  placeholder="e.g., +91 9876543210 (optional)"
                />
              </div>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Upload Images/Files (Max 4 images, up to 10MB each)
              </label>
              <div className="border-2 border-dashed border-black rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200 cursor-pointer bg-gray-50">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="text-5xl mb-3 text-gray-400">📁</div>
                  <p className="text-lg font-medium text-purple-700 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-700">
                    PNG, JPG, PDF, DOCX, TXT up to 10MB per file
                  </p>
                </label>
              </div>

              {/* File Previews */}
              {selectedFiles.length > 0 && (
                <div className="mt-6 bg-gray-100 rounded-xl shadow-inner p-4 border border-gray-200">
                  <h4 className="text-base font-semibold text-gray-900 mb-3">
                    Selected Files:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative bg-white rounded-lg shadow-sm overflow-hidden border border-black p-2"
                      >
                        {file.type.startsWith("image/") ? (
                          <img
                            src={previewImages[index]}
                            alt={file.name}
                            className="w-full h-24 object-cover rounded-md mb-2"
                          />
                        ) : (
                          <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center mb-2">
                            <span className="text-3xl text-gray-500">📄</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute top-0 right-0 m-1 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition-colors duration-200 z-10"
                          aria-label="Remove file"
                        >
                          ×
                        </button>
                        <p className="text-xs text-gray-800 mt-1 truncate font-medium">
                          {file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* WhatsApp QR Code Upload */}
            <div>
              <label
                htmlFor="whatsapp-qr-upload"
                className="block text-sm font-medium text-gray-800 mb-2"
              >
                WhatsApp QR Code Image (Optional)
              </label>
              <div className="border-2 border-dashed border-black rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200 cursor-pointer bg-gray-50">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleWhatsappQrCodeUpload}
                  className="hidden"
                  id="whatsapp-qr-upload"
                />
                <label
                  htmlFor="whatsapp-qr-upload"
                  className="cursor-pointer block"
                >
                  {whatsappQrCode ? (
                    <img
                      src={whatsappQrCode}
                      alt="WhatsApp QR Code"
                      className="max-h-40 h-auto mx-auto mb-3 rounded-lg shadow-md border border-black"
                    />
                  ) : (
                    <div className="text-5xl mb-3 text-blue-700 bg-gray-100 rounded-lg p-4">
                      📷
                    </div>
                  )}
                  <p className="text-lg font-medium text-purple-700 mb-1">
                    Click to upload WhatsApp QR code image
                  </p>
                  <p className="text-sm text-gray-700">PNG, JPG up to 5MB</p>
                </label>
                {whatsappQrCode && (
                  <button
                    type="button"
                    onClick={removeWhatsappQrCode}
                    className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-600 bg-transparent hover:bg-red-50 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Remove QR Code
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-black mt-8">
              <button
                type="button"
                onClick={() => navigate("/browse")}
                className="inline-flex items-center justify-center px-6 py-3 border border-black text-base font-medium rounded-lg text-gray-800 bg-white hover:bg-gray-100 shadow-sm transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-lg font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-md transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Listing Item..." : "List Item"}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-10 bg-white rounded-xl p-8 transition-colors duration-300 border border-black">
          <h3 className="text-xl font-bold text-purple-700 mb-4">
            💡 Tips for Better Listings
          </h3>
          <ul className="text-gray-900 text-base space-y-2 list-disc pl-5">
            <li>
              Use clear, descriptive titles that accurately reflect your item.
            </li>
            <li>
              Include high-quality images from multiple angles to showcase your
              item.
            </li>
            <li>
              Provide detailed descriptions, including condition, features, and
              any unique selling points.
            </li>
            <li>
              Set competitive prices that reflect the item's value and
              condition.
            </li>
            <li>
              Keep your contact information updated to ensure smooth
              communication with buyers.
            </li>
            <li>
              Respond quickly to buyer inquiries to facilitate faster
              transactions.
            </li>
            <li>
              For free resources, clearly mention any prerequisites or usage
              instructions.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sell;
