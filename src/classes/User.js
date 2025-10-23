export class User {
  static #nextId = 1;

  constructor(
    name,
    email,
    role,
    phone = null,
    whatsapp = null,
    id = null,
    discussionPosts = []
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
    this.discussionPosts = discussionPosts;

    this.#validateRole(role);
    if (phone) this.#validatePhone(phone);
    if (whatsapp) this.#validateWhatsApp(whatsapp);
  }

  static generateId() {
    return `user_${User.#nextId++}`;
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  displayInfo() {
    return `User ID: ${this.id}, Name: ${this.name}, Email: ${this.email}, Role: ${this.role}`;
  }

  updateContact(phone, whatsapp) {
    if (phone && whatsapp) {
      this.#validatePhone(phone);
      this.#validateWhatsApp(whatsapp);
      this.phone = phone;
      this.whatsapp = whatsapp;
    } else if (phone) {
      
      this.#validatePhone(phone);
      this.phone = phone;
    } else if (whatsapp) {
      
      this.#validateWhatsApp(whatsapp);
      this.whatsapp = whatsapp;
    }
  }

  addDiscussionPost(post) {
    this.discussionPosts.push(post);
  }

  removeDiscussionPost(postId) {
    this.discussionPosts = this.discussionPosts.filter(
      (post) => post.id !== postId
    );
  }

  canPostDiscussions() {
    return !this.isBlocked;
  }

  getSummary() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      isBlocked: this.isBlocked,
      postCount: this.discussionPosts.length,
      createdAt: this.createdAt,
    };
  }

  #validateRole(role) {
    const allowedRoles = ["buyer", "seller", "admin"];
    if (!allowedRoles.includes(role)) {
      throw new Error(
        `Invalid role. Must be one of: ${allowedRoles.join(", ")}`
      );
    }
  }

  #validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error("Phone number must be 10 digits");
    }
  }

  #validateWhatsApp(whatsapp) {
    if (typeof whatsapp !== "string" || whatsapp.length < 10) {
      throw new Error("WhatsApp must be a valid contact string");
    }
  }

  clone() {
    return new User(
      this.name,
      this.email,
      this.role,
      this.phone,
      this.whatsapp,
      this.discussionPosts
    );
  }
}
