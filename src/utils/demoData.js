import { Item } from '../classes/Item';
import { User } from '../classes/User';
import { Cart } from '../classes/Cart';

// Demo data to showcase Java concepts in JavaScript

// Create sample users
export const demoUsers = [
  User.createAdmin('Admin User', 'admin@campuscart.com', '9876543210'),
  User.createSeller('John Doe', 'john@campuscart.com', '9876543211', '9876543211'),
  new User('Jane Smith', 'jane@campuscart.com', 'buyer', '9876543212'),
  new User('Mike Johnson', 'mike@campuscart.com', 'seller', '9876543213', '9876543213')
];

// Create sample items
export const demoItems = [
  new Item('Data Structures Textbook', 'Education', 250, 2, null, 'Complete guide to data structures and algorithms', 'user_2'),
  new Item('Hostel Bucket', 'Hostel', 150, 5, null, 'New plastic bucket for hostel use', 'user_2'),
  new Item('Scientific Calculator', 'Electronics', 800, 1, null, 'Casio scientific calculator, barely used', 'user_2'),
  new Item('Previous Year Papers', 'Free', 0, 10, null, 'Computer Science previous year question papers', 'user_2'),
  new Item('Lab Manual', 'Education', 100, 3, null, 'Complete lab manual for Computer Science', 'user_3'),
  new Item('Bed Sheet Set', 'Hostel', 300, 2, null, 'Cotton bed sheet set, hostel size', 'user_3'),
  new Item('Phone Charger', 'Electronics', 200, 4, null, 'Fast charging USB-C charger', 'user_3')
];

// Create sample cart
export const demoCart = new Cart();

// Add some items to cart
demoCart.addItem(demoItems[0], 1);
demoCart.addItem(demoItems[2], 1);

// Demo function to showcase Java concepts
export const demonstrateJavaConcepts = () => {
  console.log('=== Java Concepts in JavaScript Demo ===\n');

  // 1. Constructor Overloading
  console.log('1. Constructor Overloading:');
  const item1 = new Item('Book', 'Education', 100);
  const item2 = new Item('Book', 'Education', 100, 5, null, 'Description');
  console.log('Item 1:', item1);
  console.log('Item 2:', item2);
  console.log('');

  // 2. Method Overloading
  console.log('2. Method Overloading:');
  console.log('Original quantity:', item1.quantity);
  item1.updateQuantity(); // No parameter - increment by 1
  console.log('After updateQuantity():', item1.quantity);
  item1.updateQuantity(10); // Number parameter - set to specific value
  console.log('After updateQuantity(10):', item1.quantity);
  item1.updateQuantity('5'); // String parameter - parse and set
  console.log('After updateQuantity("5"):', item1.quantity);
  console.log('');

  // 3. Static Methods
  console.log('3. Static Methods:');
  console.log('Formatted price:', Item.formatPrice(150.75));
  console.log('Available categories:', Item.getCategories());
  console.log('Generated ID:', Item.generateId());
  console.log('');

  // 4. Public vs Private Methods
  console.log('4. Public vs Private Methods:');
  console.log('Public method - isAvailable():', item1.isAvailable());
  console.log('Public method - getSummary():', item1.getSummary());
  // Note: Private methods like #validateFile cannot be called externally
  console.log('');

  // 5. Cart Static Methods
  console.log('5. Cart Static Methods:');
  console.log('Tax calculation:', Cart.calculateTax(1000));
  console.log('Discount calculation:', Cart.calculateDiscount(1000, 10));
  console.log('Currency formatting:', Cart.formatCurrency(1234.56));
  console.log('');

  // 6. User Static Methods
  console.log('6. User Static Methods:');
  console.log('Email validation:', User.validateEmail('test@example.com'));
  console.log('Available roles:', User.getRoles());
  console.log('Generated user ID:', User.generateId());
  console.log('');

  // 7. Method Overloading in User class
  console.log('7. Method Overloading in User:');
  const user = new User('Test User', 'test@example.com');
  console.log('Original contact:', { phone: user.phone, whatsapp: user.whatsapp });
  user.updateContact('9876543210'); // Only phone
  console.log('After updateContact(phone):', { phone: user.phone, whatsapp: user.whatsapp });
  user.updateContact('9876543210', '9876543210'); // Both
  console.log('After updateContact(phone, whatsapp):', { phone: user.phone, whatsapp: user.whatsapp });
  console.log('');

  console.log('=== Demo Complete ===');
};

// Export demo data for use in components
export default {
  users: demoUsers,
  items: demoItems,
  cart: demoCart,
  demonstrateJavaConcepts
};
