# 🛒 ShopEase – E-Commerce Website

Full-stack e-commerce app with user accounts, cart, wishlist, orders, online payments (Razorpay) and an admin page.

**Live demo:** _add your Vercel link here_  
**API:** _add your Render link here_  
**Demo admin login:** _add a demo email/password here (do not reuse a real password)_

## Features
- Sign up / login with JWT authentication and hashed passwords
- Product listing, search, categories and product details
- Cart and wishlist (saved per user)
- Checkout with **Cash on Delivery** or **online payment (UPI / card / net banking via Razorpay)**
- Server-side payment signature verification
- My Orders with order cancellation (stock is restored)
- Atomic stock handling (prevents overselling)
- Admin page (`/admin.html`) to add, update and remove products (admin role enforced on the server)
- Security basics: Helmet, CORS allow-list, rate limiting on login/signup

## Tech stack
| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, vanilla JavaScript |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| Payments | Razorpay (test mode) |

## Project structure
```
Backend/    API: models, controllers, routes, middleware, scripts/seed.js
Frontend/   Static site: HTML pages, style.css, config.js, payment.js, image/
```

## Run locally
**1. Backend**
```bash
cd Backend
npm install
cp .env.example .env        # fill in MONGO_URI, JWT_SECRET, Razorpay test keys
npm run seed                # creates admin user + demo products
npm run dev                 # http://localhost:5000
```
**2. Frontend**  
Open `Frontend/index.html` with the VS Code *Live Server* extension (port 5500).  
`config.js` automatically uses `http://localhost:5000` when running on localhost.

## Environment variables (`Backend/.env`)
See `Backend/.env.example`. Never commit your real `.env`.

## Deploy (free tier)
**Database – MongoDB Atlas**
1. Create a free cluster, add a database user, and allow network access (`0.0.0.0/0` for a demo).
2. Copy the connection string into `MONGO_URI`.

**Backend – Render**
1. New → Web Service → connect the GitHub repo.
2. Root Directory: `Backend` · Build: `npm install` · Start: `npm start`
3. Add all variables from `.env.example`. Set `NODE_ENV=production`.
4. After the frontend is live, set `CLIENT_URL` to the Vercel URL (no trailing slash).
5. Run the seed once (Render Shell, or locally with the Atlas `MONGO_URI`): `npm run seed`

**Frontend – Vercel**
1. Import the repo, set **Root Directory** to `Frontend`, framework preset **Other** (no build command).
2. Open `Frontend/config.js` and replace `https://YOUR-BACKEND-NAME.onrender.com` with your Render URL, then push.

> Render's free plan sleeps after inactivity, so the first request can take 30–60 seconds.

## Test online payment
Use Razorpay **test mode** keys. Test card: `4111 1111 1111 1111`, any future expiry, any CVV. Test UPI ID: `success@razorpay`.

## API overview
| Method | Route | Access |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | Public |
| GET | `/api/auth/me` | User |
| GET | `/api/products`, `/api/products/:id` | Public |
| POST / PUT / DELETE | `/api/products` | **Admin** |
| GET / POST / PUT / DELETE | `/api/cart` | User |
| GET / POST / DELETE | `/api/wishlist` | User |
| POST / GET / PUT | `/api/orders`, `/api/orders/:id/cancel` | User |
| POST | `/api/payment/create`, `/api/payment/verify` | User |

## Screenshots
_Add 3–4 screenshots here (home, product page, checkout, admin)._
