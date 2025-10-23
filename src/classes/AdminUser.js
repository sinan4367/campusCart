import { User } from "./User";

export class AdminUser extends User {
  constructor(name, email, phone = null, id = null, discussionPosts = []) {
    super(name, email, "admin", phone, null, id, discussionPosts);
  }

  displayInfo() {
    return `Admin User ID: ${this.id}, Name: ${this.name}, Email: ${this.email}, Role: ${this.role}, Admin Specific: True`;
  }

  
  blockUser(reason) {
    this.isBlocked = true;
    this.blockReason = reason;
  }

  
  unblockUser() {
    this.isBlocked = false;
    this.blockReason = null;
  }
}
