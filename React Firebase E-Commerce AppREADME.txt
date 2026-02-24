React Firebase E-Commerce App

A full-stack E-Commerce web application built with React (Vite) and Firebase.
This project demonstrates authentication, product management, and order processing using Firebase Authentication and Firestore.

 Features
Authentication (Firebase Auth)

User Registration (Email & Password)

User Login

Logout

Auth state persistence using Context API

 User Management (Firestore)

Automatically creates a user document upon registration

Stores:

Name

Address

Email

UID

Created timestamp

Product Management (Firestore CRUD)

Create new products

Read all products

Update product information

Delete products

Products stored in Firestore

🛍 Orders System

Checkout creates an order in Firestore

Order contains:

userId

items

total

status

createdAt

Order history page

Order detail view (line totals + images)

Tech Skills

React (Vite)

Firebase Authentication

Firebase Firestore

Context API (Auth state)

JavaScript (ES6+)

Project Structure
src/
│
├── firebase.js              # Firebase configuration & initialization
├── auth.js                  # Auth functions (register, login, logout)
├── AuthProvider.jsx         # Global auth context
├── productsService.js       # Firestore CRUD for products
├── ordersService.js         # Firestore order creation & fetching
├── Products.jsx             # Product management UI
├── Orders.jsx               # Order history + details
├── CheckoutButton.jsx       # Creates order from cart
└── App.jsx                  # Main application UI
 Setup Instructions
 Clone the repository
git clone <your-repo-url>
cd ReactFirebaseApp
 Install dependencies
npm install
 Create Firebase Project

Go to Firebase Console

Create a new project

Enable:

Authentication → Email/Password

Firestore Database (Test Mode)

 Add Firebase Web App

In Firebase Console:

Project Settings → Your Apps → Add Web App

Copy the Firebase config values

 Create .env file (IMPORTANT)

Create a .env file in the root of the project (same level as package.json):

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

After editing .env, restart the dev server.

Run the app
npm run dev

Open:

http://localhost:5173
Firestore Collections
Users Collection
users/{uid}
  - uid
  - email
  - name
  - address
  - createdAt
Products Collection
products/{productId}
  - title
  - price
  - category
  - image
  - description
  - createdAt
  - updatedAt
Orders Collection
orders/{orderId}
  - userId
  - items[]
  - total
  - status
  - createdAt
 Firestore Rules (Development Mode)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{id} {
      allow read, write: if true;
    }
    match /orders/{id} {
      allow read, write: if true;
    }
    match /users/{uid} {
      allow read, write: if true;
    }
  }
}

 Testing Flow

Register a new user

Confirm user appears in:

Firebase Authentication

Firestore → users collection

Create products

Place checkout order

Confirm order appears in Firestore → orders

View order history

