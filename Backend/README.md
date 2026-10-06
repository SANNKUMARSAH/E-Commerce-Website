# ShopEase E-Commerce Website

A full-stack e-commerce web application built with:
- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT

This project includes:
- User registration and login
- Product listing and product details
- Search and filtering
- Wishlist management
- Cart management
- Checkout and order creation
- Admin functionality to add products
- Profile management

---

## Project Structure

```txt
E-Commerce Website/
├── backend/
│   ├── .env
│   ├── server.js
│   ├── package.json
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   └── Order.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   └── orderController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── orderRoutes.js
│   └── middleware/
│       └── authMiddleware.js
│
├── frontend/
│   ├── index.html
│   ├── products.html
│   ├── product-details.html
│   ├── cart.html
│   ├── wishlist.html
│   ├── login.html
│   ├── register.html
│   ├── search.html
│   ├── admin.html
│   ├── profile.html
│   ├── checkout.html
│   └── style.css
│
├── README.md
└── .gitignore