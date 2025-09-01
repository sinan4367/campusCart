/**
 * User class implementing Java concepts in JavaScript
 * - Constructor overloading (multiple constructors)
 * - Static methods (generateId, validateEmail, getRoles)
 * - Private methods (#validatePhone, #validateRole)
 */
export class User {
  static #nextId = 1;

  constructor(
    name,
    email,
    role = "buyer",
    phone = null,
    whatsapp = null,
    id = null
  ) {
    this.id = id || User.generateId();
    this.name = name;
    this.email = email;
    this.role = role;
    this.phone = phone;
    this.whatsapp = whatsapp;
    this.createdAt = new Date();
    this.isBlocked = false;
    this.blockReason = null;
    this.items = [];
    this.discussionPosts = [];

    // Validate inputs
    this.#validateRole(role);
    if (phone) this.#validatePhone(phone);
    if (whatsapp) this.#validateWhatsApp(whatsapp);
  }

  // Static method to generate unique user ID
  static generateId() {
    return `user_${User.#nextId++}`;
  }

  // Static method to validate email format
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Static method to get available roles
  static getRoles() {
    return ["buyer", "seller", "admin"];
  }

  // Static method to create admin user
  static createAdmin(name, email, phone = null, id = null) {
    return new User(name, email, "admin", phone, null, id);
  }

  // Static method to create seller user
  static createSeller(name, email, phone, whatsapp, id = null) {
    return new User(name, email, "seller", phone, whatsapp, id);
  }

  // Method overloading - updateContact can be called with different parameters
  updateContact(phone, whatsapp) {
    if (phone && whatsapp) {
      // Both parameters provided
      this.#validatePhone(phone);
      this.#validateWhatsApp(whatsapp);
      this.phone = phone;
      this.whatsapp = whatsapp;
    } else if (phone) {
      // Only phone provided
      this.#validatePhone(phone);
      this.phone = phone;
    } else if (whatsapp) {
      // Only WhatsApp provided
      this.#validateWhatsApp(whatsapp);
      this.whatsapp = whatsapp;
    }
  }

  // Public method to add item
  addItem(item) {
    if (this.role === "seller" || this.role === "admin") {
      this.items.push(item);
      item.sellerId = this.id;
    }
  }

  // Public method to remove item
  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  // Public method to add discussion post
  addDiscussionPost(post) {
    this.discussionPosts.push(post);
  }

  // Public method to remove discussion post
  removeDiscussionPost(postId) {
    this.discussionPosts = this.discussionPosts.filter(
      (post) => post.id !== postId
    );
  }

  // Public method to block user
  blockUser(reason) {
    this.isBlocked = true;
    this.blockReason = reason;
  }

  // Public method to unblock user
  unblockUser() {
    this.isBlocked = false;
    this.blockReason = null;
  }

  // Public method to check if user can sell
  canSell() {
    return (this.role === "seller" || this.role === "admin") && !this.isBlocked;
  }

  // Public method to check if user can post discussions
  canPostDiscussions() {
    return !this.isBlocked;
  }

  // Public method to get user summary
  getSummary() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      isBlocked: this.isBlocked,
      itemCount: this.items.length,
      postCount: this.discussionPosts.length,
      createdAt: this.createdAt,
    };
  }

  // Public method to get user statistics
  getStats() {
    const activeItems = this.items.filter((item) => item.isAvailable());
    const blockedItems = this.items.filter((item) => item.isOutOfStock);

    return {
      totalItems: this.items.length,
      activeItems: activeItems.length,
      blockedItems: blockedItems.length,
      totalPosts: this.discussionPosts.length,
    };
  }

  // Private method for role validation
  #validateRole(role) {
    if (!User.getRoles().includes(role)) {
      throw new Error(
        `Invalid role. Must be one of: ${User.getRoles().join(", ")}`
      );
    }
  }

  // Private method for phone validation
  #validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error("Phone number must be 10 digits");
    }
  }

  // Private method for WhatsApp validation
  #validateWhatsApp(whatsapp) {
    if (typeof whatsapp !== "string" || whatsapp.length < 10) {
      throw new Error("WhatsApp must be a valid contact string");
    }
  }

  // Method to clone user (useful for admin operations)
  clone() {
    return new User(
      this.name,
      this.email,
      this.role,
      this.phone,
      this.whatsapp
    );
  }
}
