/**
 * Item class implementing Java concepts in JavaScript
 * - Constructor overloading (multiple constructors)
 * - Method overloading (updateQuantity with different signatures)
 * - Static methods (formatPrice, generateId)
 * - Private methods (#validateFile, #validatePrice)
 */
export class Item {
  static #nextId = 1;

  constructor(
    name,
    category,
    price = 0,
    quantity = 1,
    file = null,
    description = "",
    sellerId = null,
    sellerName = null,
    whatsappQrCode = null
  ) {
    this.id = Item.generateId();
    this.name = name;
    this.category = category;
    this.price = price;
    this.quantity = quantity;
    this.file = file;
    this.description = description;
    this.sellerId = sellerId;
    this.sellerName = sellerName;
    this.createdAt = new Date();
    this.isOutOfStock = false;
    this.whatsappQrCode = whatsappQrCode;
    this.images = [];

    // Validate inputs
    this.#validatePrice(price);
    if (file) this.#validateFile(file);
  }

  // Static method - can be called without instantiating the class
  static generateId() {
    return `item_${Item.#nextId++}`;
  }

  // Static method for price formatting
  static formatPrice(price) {
    return `₹${price.toFixed(2)}`;
  }

  // Static method to get category options
  static getCategories() {
    return ["Education", "Hostel", "Electronics", "Free"];
  }

  // Method overloading - updateQuantity can be called with or without parameters
  updateQuantity(qty) {
    if (qty === undefined) {
      // No parameter - increment by 1
      this.quantity += 1;
    } else if (typeof qty === "number") {
      // Number parameter - set to specific quantity
      this.quantity = qty;
    } else if (typeof qty === "string") {
      // String parameter - parse and set quantity
      this.quantity = parseInt(qty) || 0;
    }

    this.isOutOfStock = this.quantity <= 0;
  }

  // Public method to add images
  addImage(imageUrl) {
    if (this.#validateImageUrl(imageUrl)) {
      this.images.push(imageUrl);
    }
  }

  // Public method to remove images
  removeImage(imageUrl) {
    this.images = this.images.filter((img) => img !== imageUrl);
  }

  // Public method to get formatted price
  getFormattedPrice() {
    return Item.formatPrice(this.price);
  }

  // Public method to check if item is available
  isAvailable() {
    return !this.isOutOfStock && this.quantity > 0;
  }

  // Public method to get item summary
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      price: this.price,
      quantity: this.quantity,
      isAvailable: this.isAvailable(),
      hasFile: !!this.file,
      imageCount: this.images.length,
    };
  }

  // Private method for price validation
  #validatePrice(price) {
    if (typeof price !== "number" || price < 0) {
      throw new Error("Price must be a non-negative number");
    }
  }

  // Private method for file validation
  #validateFile(file) {
    if (!file || typeof file !== "object") {
      throw new Error("File must be a valid file object");
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(
        "File type not supported. Only PDF and images are allowed."
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error("File size too large. Maximum size is 10MB.");
    }
  }

  // Private method for image URL validation
  #validateImageUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Method to clone item (useful for cart operations)
  clone() {
    return new Item(
      this.name,
      this.category,
      this.price,
      this.quantity,
      this.file,
      this.description,
      this.sellerId,
      this.sellerName,
      this.whatsappQrCode
    );
  }
}
