import { User } from "./User";

export class AdminUser extends User {
  constructor(name, email, phone = null, id = null) {
    super(name, email, "admin", phone, null, id);
  }

  displayInfo() {
    return `Admin User ID: ${this.id}, Name: ${this.name}, Email: ${this.email}, Role: ${this.role}, Admin Specific: True`;
  }
}
