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

    this.#validatePrice(price);
    if (file) this.#validateFile(file);
  }

  static generateId() {
    return `item_${Item.#nextId++}`;
  }

  static formatPrice(price) {
    return `₹${price.toFixed(2)}`;
  }

  static getCategories() {
    return ["Education", "Hostel", "Electronics", "Free"];
  }

  updateQuantity(qty) {
    if (qty === undefined) {
      this.quantity += 1;
    } else if (typeof qty === "number") {
      this.quantity = qty;
    } else if (typeof qty === "string") {
      this.quantity = parseInt(qty) || 0;
    }

    this.isOutOfStock = this.quantity <= 0;
  }

  addImage(imageUrl) {
    if (this.#validateImageUrl(imageUrl)) {
      this.images.push(imageUrl);
    }
  }

  removeImage(imageUrl) {
    this.images = this.images.filter((img) => img !== imageUrl);
  }

  getFormattedPrice() {
    return Item.formatPrice(this.price);
  }

  isAvailable() {
    return !this.isOutOfStock && this.quantity > 0;
  }

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

  #validatePrice(price) {
    if (typeof price !== "number" || price < 0) {
      throw new Error("Price must be a non-negative number");
    }
  }

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

  #validateImageUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

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
