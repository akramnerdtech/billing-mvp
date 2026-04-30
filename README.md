# Billing and Inventory System MVP

A complete beginner-friendly full-stack application built with React.js, Express, Node.js, and MongoDB. 

## Features
1. **Product Management**: Add, List, and Delete products with their quantities and prices.
2. **Billing System**: Select products, specify quantities, calculate totals, and create orders seamlessly. Features strict inventory constraint checks.
3. **Inventory Logic**: Automatically reduces available quantity upon order creation and prevents order creation if stock is insufficient.
4. **Dashboard**: Live updates displaying Total Products Count, Total Orders Count, and Total Revenue generated.

## Tech Stack
* **Frontend**: React.js (Vite), React Router, Axios, Tailwind CSS + Lucide Icons
* **Backend**: Node.js, Express, Mongoose
* **Database**: MongoDB

## Folder Structure
```text
billing-mpv/
├── backend/               # Node.js backend project
│   ├── config/            # DB connection logic
│   ├── controllers/       # Controller abstractions (Product & Order)
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routing layer
│   └── server.js          # Main entry point (Runs on port 5000)
├── src/                   # React.js frontend project
│   ├── api/               # Axios utilities
│   ├── components/        # Layout and navigation components
│   ├── pages/             # Dashboard, Products, Billing
│   ├── App.jsx            # Routing bindings
│   └── main.jsx           # Frontend entry point (Runs via Vite)
```

## Step-By-Step Instructions to Run the Project

1. **Install Dependencies**
   - In the root folder (`billing-mpv`), run:
     ```bash
     npm install
     ```
   - In the backend directory (`billing-mpv/backend`), run:
     ```bash
     cd backend
     npm install
     ```

2. **Database Setup**
   - Ensure MongoDB is installed and running either locally (port 27017) or retrieve a MongoDB URI.
   - The backend runs by default at `mongodb://localhost:27017/billing-mvp` unless you define a `.env` variable inside `backend/.env`.

3. **Start the Backend**
   - Navigate to the `backend` folder via terminal:
     ```bash
     cd backend
     node server.js
     ```
   - *Message should appear: "Server running on port 5000"*

4. **Start the Frontend**
   - Open a separate terminal inside the root folder (`billing-mpv`), and run:
     ```bash
     npm run dev
     ```
   - Visit the Vite domain provided (usually `http://localhost:5173/`).

## Future Improvements
- **Authentication**: Add JWT tokens to protect specific routes.
- **Edit Functionality**: Allow editing of product names and prices without deleting.
- **Reporting**: Export orders data to CSV / PDF formats.
- **History View**: Dedicated page to see historic orders line-by-line.
