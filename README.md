# ShopHub - Full-Stack E-Commerce Application

## 📌 Overview
ShopHub is a complete full-stack e-commerce web application that allows users to browse products, search and filter items, manage a shopping cart, and complete checkout orders. The platform includes JWT authentication and an admin dashboard for product management.

## 🛠️ Technologies Used
| Category | Technologies |
|----------|--------------|
| **Frontend** | React 19, Redux Toolkit, React Router, Axios, Vite |
| **Backend** | Node.js, Express.js, TypeORM, JWT, bcrypt |
| **Database** | PostgreSQL |
| **Styling** | Glassmorphism, CSS Modules |

## ✨ Features
- ✅ User Authentication (JWT with bcrypt password hashing)
- ✅ Product browsing with search and category filter
- ✅ Shopping cart for both guest and logged-in users
- ✅ Checkout process with order placement
- ✅ Admin dashboard (add/delete products, view users and orders)
- ✅ First registered user becomes admin automatically
- ✅ Premium glassmorphism UI design
- ✅ Fully responsive layout

## 📁 Project Structure
│   ├── src/
│   │   ├── entities/      # Database models (User, Product, Cart, Order)
│   │   ├── routes/        # API endpoints
│   │   └── index.js       # Main server file
│   └── package.json
├── ecommerce-frontend/    # React + Redux frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # All pages (Home, Products, Cart, Checkout, Admin)
│   │   ├── store/         # Redux store (cartSlice, authSlice)
│   │   └── App.jsx        # Main app with routes
│   └── package.json
└── README.md

### Prerequisites
- Node.js (v18+)
- PostgreSQL (v15+)

## 👥 Team Members
| Name | Roll Number |
|------|-------------|
| Abdullah Bin Fazal | RC-582 |
| M.Talha Qamar | RC-603 |
| M.Ahsan | RC-601 |
| Eman Atiq | RC-577 |

## 📚 Course Information
- **Course:** Web Engineering
- **Instructor:** Mr. Emad
- **Semester:** 5th
- **Section:** A
- **Year:** 2026

## 🙏 Credits
- Our Instructor
- React Documentation
- Redux Toolkit Docs
- Node.js/Express Docs
- TypeORM Documentation
- Lab PDFs 1-12
- Google Stitch for UI design inspiration
