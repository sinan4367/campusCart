# CampusCart - Student Resource Sharing Platform

A comprehensive web application built with React, Vite, and Tailwind CSS that enables college students to buy, sell, and share academic and hostel-related resources.

## 🚀 Features

### Core Functionality
- **Multi-Role Support**: Buyer, Seller, and Admin roles
- **Resource Management**: Upload, browse, and manage items
- **WhatsApp Integration**: Direct communication between buyers and sellers
- **Discussion Forum**: Community interaction with file uploads
- **Admin Dashboard**: Analytics and content moderation
- **Shopping Cart**: Complete e-commerce experience

### Categories
- 📚 **Education**: Books, Notes, Lab Records
- 🏠 **Hostel**: Mugs, Buckets, Bedsheets
- 💻 **Electronics**: Calculators, Chargers, Devices
- 🆓 **Free**: PDFs, Question Papers, Study Materials

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Storage**: Local Storage (Frontend) / Firestore (Optional)
- **JavaScript Classes**: Implementing Java concepts

## 🔧 Java Concepts in JavaScript

The project demonstrates Java programming concepts using JavaScript classes:

### Method Overloading
```javascript
// updateQuantity can be called with or without parameters
updateQuantity(qty) {
  if (qty === undefined) this.quantity += 1;
  else this.quantity = qty;
}
```

### Constructor Overloading
```javascript
// Multiple constructor patterns
constructor(name, category, price = 0, quantity = 1, file = null)
```

### Static Methods
```javascript
static formatPrice(price) {
  return `₹${price.toFixed(2)}`;
}
```

### Public/Private Methods
```javascript
// Public method
addImage(imageUrl) { /* ... */ }

// Private method
#validateFile(file) { /* ... */ }
```

## 📁 Project Structure

```
src/
├── classes/           # JavaScript classes with Java concepts
│   ├── Item.js       # Item management class
│   ├── User.js       # User management class
│   └── Cart.js       # Shopping cart class
├── components/        # Reusable UI components
│   └── Navbar.jsx    # Navigation component
├── context/          # React Context providers
│   ├── AuthContext.jsx   # Authentication context
│   └── CartContext.jsx   # Shopping cart context
├── pages/            # Page components
│   ├── Home.jsx      # Landing page
│   ├── Browse.jsx    # Item browsing
│   ├── Sell.jsx      # Item selling
│   ├── Discussion.jsx # Community forum
│   ├── Admin.jsx     # Admin dashboard
│   └── Cart.jsx      # Shopping cart
├── App.jsx           # Main application component
├── main.jsx          # Application entry point
└── index.css         # Global styles and Tailwind imports
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd campus_cart_0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎯 Usage

### For Students (Buyers)
1. Browse items by category
2. Search and filter resources
3. Add items to cart
4. Contact sellers via WhatsApp
5. Download free resources

### For Sellers
1. Upload items with descriptions
2. Add images and file attachments
3. Set prices and manage inventory
4. Communicate with buyers

### For Admins
1. Monitor platform activity
2. Moderate content and users
3. View analytics dashboard
4. Manage user accounts

## 🔐 Authentication

- **Local Storage**: User sessions stored locally
- **Role-Based Access**: Different permissions for different user types
- **Admin Credentials**: Static admin login (configurable)

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS for responsive layouts
- Optimized for all device sizes

## 🎨 Customization

### Colors
The project uses a custom color palette defined in `tailwind.config.js`:
- Primary colors: Blue shades
- Secondary colors: Gray shades

### Components
Custom component classes in `src/index.css`:
- `.btn-primary` - Primary button styling
- `.btn-secondary` - Secondary button styling
- `.card` - Card container styling
- `.input-field` - Form input styling

## 🚧 Development Status

- ✅ Project setup and structure
- ✅ Core classes with Java concepts
- ✅ Basic routing and navigation
- ✅ Home page with responsive design
- 🚧 Item browsing and management
- 🚧 User authentication system
- 🚧 Shopping cart functionality
- 🚧 Discussion forum
- 🚧 Admin dashboard
- 🚧 File upload system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- [ ] Real-time chat system
- [ ] Payment gateway integration
- [ ] Advanced search and filters
- [ ] User reviews and ratings
- [ ] Mobile app development
- [ ] AI-powered recommendations
- [ ] Social media integration

---

**CampusCart** - Making campus resource sharing simple and efficient! 🎓✨
