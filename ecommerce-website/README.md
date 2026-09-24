# ShopEase — E-commerce Website

A full-stack e-commerce starter project: product catalog with search/filter/sort,
shopping cart, JWT authentication, order history, product reviews & ratings, and
a Stripe payment-intent hookup — ready to push to GitHub and build on.

## Stack

- **Frontend:** HTML, CSS, vanilla JavaScript (no build step required)
- **Backend:** Node.js + Express
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (JSON Web Tokens) + bcrypt password hashing
- **Payments:** Stripe (PaymentIntents API)

## Project structure

```
ecommerce-website/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # auth, product, cart, order, review logic
│   ├── middleware/auth.js  # JWT verification + admin guard
│   ├── models/             # User, Product, Cart, Order, Review
│   ├── routes/             # /api/auth, /api/products, /api/cart, /api/orders
│   ├── seed/seedProducts.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── index.html          # product catalog (search, filter, sort, pagination)
    ├── product-detail.html # single product + reviews
    ├── cart.html
    ├── login.html
    ├── signup.html
    ├── orders.html
    ├── css/style.css
    └── js/                 # api.js, auth.js, products.js, cart.js, orders.js
```

## 1. Prerequisites

- [Node.js](https://nodejs.org) v18+ installed
- A MongoDB database — either:
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier, cloud-hosted), or
  - MongoDB installed locally
- A free [Stripe](https://dashboard.stripe.com/register) account (only needed for real payments)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:

```
MONGO_URI=your MongoDB connection string
JWT_SECRET=any long random string
PORT=5000
STRIPE_SECRET_KEY=your Stripe secret key
CLIENT_ORIGIN=http://127.0.0.1:5500
```

Seed some sample products (optional but recommended):

```bash
npm run seed
```

Start the API server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`. Visit `http://localhost:5000/` — you
should see `{"message":"E-commerce API is running"}`.

## 3. Frontend setup

The frontend is plain static HTML/CSS/JS, so it doesn't need a build step —
just needs to be served (opening the files directly with `file://` will break
some fetch calls in certain browsers, so use a simple local server):

**Option A — VS Code Live Server extension:** right-click `frontend/index.html` → "Open with Live Server".

**Option B — Node's `serve` package:**

```bash
cd frontend
npx serve .
```

**Option C — Python:**

```bash
cd frontend
python3 -m http.server 5500
```

Then open `http://localhost:5500` (or whatever port is shown) in your browser.

If your backend runs on a different host/port, update `API_BASE` at the top of
`frontend/js/api.js`.

## 4. Using the app

1. Sign up for an account (`signup.html`).
2. Browse products, use search/category filter/sort on the home page.
3. Add items to your cart, adjust quantities on `cart.html`.
4. Click "Proceed to Checkout" — this creates an order via `/api/orders`.
5. View past orders on `orders.html`.
6. Leave a star rating + comment on any product's detail page.

## 5. Connecting real Stripe payments

The backend already exposes:

- `POST /api/orders/:id/create-payment-intent` — creates a Stripe PaymentIntent for an order
- `PUT /api/orders/:id/pay` — marks an order as paid once payment succeeds

To finish the integration, add [Stripe.js / Stripe Elements](https://stripe.com/docs/payments/accept-a-payment)
to the checkout flow in `frontend/js/cart.js`: call `create-payment-intent`,
confirm the card payment client-side with the returned `clientSecret`, then
call `pay` once Stripe confirms success. PayPal or Razorpay can be swapped in
the same way using their respective SDKs.

## 6. Making a user an admin

Admins can create/edit/delete products. There's no admin UI included yet — the
simplest way to promote a user is directly in MongoDB:

```js
// in mongosh, or MongoDB Compass
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

Then use a tool like Postman/Insomnia to call the admin-only product routes
with your JWT in the `Authorization: Bearer <token>` header.

## 7. Pushing to GitHub

```bash
cd ecommerce-website
git init
git add .
git commit -m "Initial commit: e-commerce site (frontend + backend)"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

`.env` is already excluded via `.gitignore`, so your secrets won't be committed —
just remember to set the same environment variables in whatever hosting
platform you deploy to.

## 8. Deployment options

- **Backend:** [Render](https://render.com), [Railway](https://railway.app), or Heroku — set the env vars from `.env` in the platform's dashboard, and use MongoDB Atlas for the database.
- **Frontend:** [Netlify](https://netlify.com), [Vercel](https://vercel.com), GitHub Pages, or Firebase Hosting — just deploy the `frontend/` folder as a static site, and point `API_BASE` in `js/api.js` to your deployed backend URL.

## Notes & next steps

- Passwords are hashed with bcrypt; never store plain-text passwords.
- Product images in the seed data use placeholder URLs — swap in real image
  links or wire up file uploads (e.g. Cloudinary/AWS S3) for production use.
- There's no admin dashboard UI yet — product management currently happens via
  the API directly (Postman) or you can build simple `admin.html` pages that
  call the existing `POST/PUT/DELETE /api/products` routes.
- Add express-validator or Joi for stricter input validation before going to production.
