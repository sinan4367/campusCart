/**
 * Cart class implementing Java concepts in JavaScript
 * - Static methods (getTotal, getItemCount, calculateTax)
 * - Private methods (#saveToStorage, #loadFromStorage, #validateItem)
 */
export class Cart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.tax = 0;
    this.discount = 0;
    this.finalTotal = 0;

    // Load cart from storage
    this.#loadFromStorage();
  }

  // Static method to calculate tax
  static calculateTax(subtotal, taxRate = 0.18) {
    return subtotal * taxRate;
  }

  // Static method to calculate discount
  static calculateDiscount(subtotal, discountPercent = 0) {
    return (subtotal * discountPercent) / 100;
  }

  // Static method to format currency
  static formatCurrency(amount) {
    return `₹${amount.toFixed(2)}`;
  }

  // Static method to get cart summary
  static getCartSummary(cartItems) {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueItems = cartItems.length;

    return {
      total,
      itemCount,
      uniqueItems,
      formattedTotal: Cart.formatCurrency(total),
    };
  }

  // Public method to add item
  addItem(item, quantity = 1) {
    if (this.#validateItem(item)) {
      const existingItem = this.items.find(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.items.push({ ...item, quantity });
      }

      this.#updateTotals();
      this.#saveToStorage();
    }
  }

  // Public method to remove item
  removeItem(itemId) {
    this.items = this.items.filter((item) => item.id !== itemId);
    this.#updateTotals();
    this.#saveToStorage();
  }

  // Public method to update quantity
  updateQuantity(itemId, quantity) {
    if (quantity <= 0) {
      this.removeItem(itemId);
      return;
    }

    const item = this.items.find((cartItem) => cartItem.id === itemId);
    if (item) {
      item.quantity = quantity;
      this.#updateTotals();
      this.#saveToStorage();
    }
  }

  // Public method to clear cart
  clearCart() {
    this.items = [];
    this.#updateTotals();
    this.#saveToStorage();
  }

  // Public method to get cart items
  getItems() {
    return [...this.items];
  }

  // Public method to get cart total
  getTotal() {
    return this.finalTotal;
  }

  // Public method to get item count
  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Public method to check if cart is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Public method to apply discount
  applyDiscount(discountPercent) {
    this.discount = Cart.calculateDiscount(this.total, discountPercent);
    this.#updateTotals();
  }

  // Public method to remove discount
  removeDiscount() {
    this.discount = 0;
    this.#updateTotals();
  }

  // Public method to get cart summary
  getSummary() {
    return {
      items: this.items,
      subtotal: this.total,
      tax: this.tax,
      discount: this.discount,
      finalTotal: this.finalTotal,
      itemCount: this.getItemCount(),
      uniqueItems: this.items.length,
      formattedSubtotal: Cart.formatCurrency(this.total),
      formattedTax: Cart.formatCurrency(this.tax),
      formattedDiscount: Cart.formatCurrency(this.discount),
      formattedFinalTotal: Cart.formatCurrency(this.finalTotal),
    };
  }

  // Public method to checkout
  checkout() {
    if (this.isEmpty()) {
      throw new Error("Cannot checkout empty cart");
    }

    const order = {
      id: `order_${Date.now()}`,
      items: this.getItems(),
      total: this.getTotal(),
      summary: this.getSummary(),
      checkoutDate: new Date(),
    };

    // Clear cart after successful checkout
    this.clearCart();

    return order;
  }

  // Private method to update totals
  #updateTotals() {
    this.total = this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    this.tax = Cart.calculateTax(this.total);
    this.finalTotal = this.total + this.tax - this.discount;
  }

  // Private method to validate item
  #validateItem(item) {
    if (!item || !item.id || !item.name || typeof item.price !== "number") {
      console.error("Invalid item data");
      return false;
    }

    if (item.price < 0) {
      console.error("Item price cannot be negative");
      return false;
    }

    return true;
  }

  // Private method to save cart to storage
  #saveToStorage() {
    try {
      const cartData = {
        items: this.items,
        total: this.total,
        tax: this.tax,
        discount: this.discount,
        finalTotal: this.finalTotal,
        timestamp: Date.now(),
      };
      localStorage.setItem("campusCart", JSON.stringify(cartData));
    } catch (error) {
      console.error("Failed to save cart to storage:", error);
    }
  }

  // Private method to load cart from storage
  #loadFromStorage() {
    try {
      const savedCart = localStorage.getItem("campusCart");
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        this.items = cartData.items || [];
        this.total = cartData.total || 0;
        this.tax = cartData.tax || 0;
        this.discount = cartData.discount || 0;
        this.finalTotal = cartData.finalTotal || 0;
      }
    } catch (error) {
      console.error("Failed to load cart from storage:", error);
      this.items = [];
      this.#updateTotals();
    }
  }
}
