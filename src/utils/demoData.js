import { Item } from "../classes/Item";
import { User } from "../classes/User";
import { Cart } from "../classes/Cart";

// Demo data to showcase Java concepts in JavaScript

// Create sample users
export const demoUsers = [
  User.createAdmin("Admin User", "admin@campuscart.com", "9876543210"),
  User.createSeller(
    "John Doe",
    "john@campuscart.com",
    "9876543211",
    "9876543211"
  ),
  new User("Jane Smith", "jane@campuscart.com", "buyer", "9876543212"),
  new User(
    "Mike Johnson",
    "mike@campuscart.com",
    "seller",
    "9876543213",
    "9876543213"
  ),
];

// Create sample items
export const demoItems = [
  new Item(
    "Data Structures Textbook",
    "Education",
    250,
    2,
    null,
    "Complete guide to data structures and algorithms",
    "user_2"
  ),
  new Item(
    "Hostel Bucket",
    "Hostel",
    150,
    5,
    null,
    "New plastic bucket for hostel use",
    "user_2"
  ),
  new Item(
    "Scientific Calculator",
    "Electronics",
    800,
    1,
    null,
    "Casio scientific calculator, barely used",
    "user_2"
  ),
  new Item(
    "Previous Year Papers",
    "Free",
    0,
    10,
    null,
    "Computer Science previous year question papers",
    "user_2"
  ),
  new Item(
    "Lab Manual",
    "Education",
    100,
    3,
    null,
    "Complete lab manual for Computer Science",
    "user_3"
  ),
  new Item(
    "Bed Sheet Set",
    "Hostel",
    300,
    2,
    null,
    "Cotton bed sheet set, hostel size",
    "user_3"
  ),
  new Item(
    "Phone Charger",
    "Electronics",
    200,
    4,
    null,
    "Fast charging USB-C charger",
    "user_3"
  ),
];

// Create sample cart
export const demoCart = new Cart();

// Add some items to cart
demoCart.addItem(demoItems[0], 1);
demoCart.addItem(demoItems[2], 1);

// Export demo data for use in components
export default {
  users: demoUsers,
  items: demoItems,
  cart: demoCart,
};
