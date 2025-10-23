import { User } from "./User";

export class Seller extends User {
  constructor(
    name,
    email,
    phone = null,
    whatsapp = null,
    id = null,
    items = [],
    discussionPosts = []
  ) {
    super(name, email, "seller", phone, whatsapp, id, discussionPosts);
    this.items = items;
  }

  addItem(item) {
    this.items.push(item);
    item.sellerId = this.id;
  }

  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
  }

  canSell() {
    return !this.isBlocked;
  }

  getStats() {
    const activeItems = this.items.filter((item) => item.isAvailable());
    const blockedItems = this.items.filter((item) => item.isOutOfStock);

    return {
      totalItems: this.items.length,
      activeItems: activeItems.length,
      blockedItems: blockedItems.length,
    };
  }
}
