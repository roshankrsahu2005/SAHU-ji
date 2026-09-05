# 🛒 The Daily Mart — E-Commerce Grocery Application

A high-performance, responsive e-commerce web application for everyday groceries and essential supplies. Built with pure Vanilla HTML, CSS, JavaScript, Node.js/Express backend API, and real-time Supabase cloud synchronization.

---

## 🌟 Key Features

### 🛍️ Customer Storefront & Catalog
- **80+ Products Catalog**: Comprehensive grocery catalog across 8 categories (Dairy & Cheese, Bakery & Bread, Fresh Produce, Chips & Snacks, Biscuits & Cookies, Instant Foods, Atta & Staples, Beverages).
- **Flipkart Grocery-Style Category Shelves**: Interactive homepage shelves with dynamic pop-out grocery bag animations and live background product tickers.
- **Instant Search Modal**: Real-time product search modal accessible from any page.
- **Dynamic Shopping Basket**: Interactive cart calculations with bundle discounts (10% OFF on 3+ items), free delivery progress indicator (orders > ₹499), and coupon code validation (`DAILY10`, `WELCOME50`).

### 📱 Responsive Mobile & Tablet UX
- **Mobile Bottom Navigation Bar**: Fixed bottom navigation bar (**Home**, **Shop**, **Search**, **Basket**, **Account**) for small screens (`<= 768px`).
- **Collision-Free Floating Basket Bar**: Floating basket notification bar positioned at `bottom: 74px` cleanly above the mobile bottom nav bar.
- **Touch-Friendly Layouts**: 2-column responsive product grid on mobile phones and 3-column grid on tablets.

### 🔑 Dual-Option Authentication (Login & Sign-Up)
- **Flexible Sign-In**: Login or Sign-Up using **Email Address OR 10-digit Phone Number**.
- **Account Existence Validation**: Automatic check for existing accounts during sign-up and missing accounts during login with instant tab switching.
- **Seamless Redirection**: Automatic redirect to the Home Page (`index.html`) upon successful login or registration.

### 🔒 Secured Admin Console
- **PIN Lock Security**: Admin console protected by a 4-digit PIN (`1234` or `admin`).
- **Secret Access Gestures**:
  - `Ctrl + Shift + A` keyboard shortcut.
  - Triple-click on the brand logo (`DM`).
- **Live Stock Control**: Real-time stock quantity adjustment with automatic **OUT OF STOCK** badges and disabled purchasing when stock reaches zero.
- **Printable Tax Invoices**: One-click printable GST Tax Order Invoices formatted for thermal & standard printers.

---

## ⚡ Performance Architecture

- **Ultra-Fast In-Memory Cache**: Backend API responds in **~7ms** by serving data directly from memory.
- **Supabase Cloud Sync**: Background real-time database synchronization with Supabase Cloud PostgreSQL.
- **Local Fallback Storage**: Full offline capability using LocalStorage fallback if backend or cloud services are disconnected.

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System, HSL Color Palettes, Glassmorphism), Vanilla JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **Cloud Database**: Supabase PostgreSQL Cloud.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher) installed on your system.

### Running the Application

1. **Navigate to the project directory**:
   ```bash
   cd "d:\SAHU ji"
   ```

2. **Start the Backend Server**:
   ```bash
   cd backend
   node server.js
   ```

3. **Open the Application in Browser**:
   Visit [http://localhost:5000](http://localhost:5000) in your web browser.

---

## 📁 Project Directory Structure

```
d:\SAHU ji\
├── index.html              # Storefront Homepage
├── shop.html               # All Products Catalog Page
├── basket.html             # Shopping Basket & Checkout Summary
├── profile.html            # User Account Profile & Order History
├── login.html              # Dual-Option Login & Sign-Up Page
├── admin.html              # Admin Management Console (PIN Protected)
├── about_us.html           # About Us & Company Info
├── script.js               # Core Frontend Application Logic
├── backend/
│   ├── server.js           # Express API Server & Supabase Cloud Sync
│   ├── package.json        # Server Dependencies
│   └── data/
│       └── db.json         # Local Database Backup
└── frontend/
    ├── css file/
    │   ├── style.css       # Core Design System & Global Styles
    │   ├── shop.css        # Shop Page Styles
    │   ├── basket.css      # Basket Page Styles
    │   ├── profile.css     # Profile Page Styles
    │   └── about_us.css    # About Us Page Styles
    └── images/             # Product Visual Assets & SVG Icons
```

---

## 🔑 Admin Credentials & Shortcuts

- **Admin URL**: Hidden route accessible at `/admin.html`.
- **Default PIN**: `1234` (or `admin`).
- **Secret Gestures**:
  - Press `Ctrl + Shift + A` anywhere on the site.
  - Triple-click the brand logo `DM` in the top header.

---

## 📄 License

© 2025 **The Daily Mart**. All rights reserved.
