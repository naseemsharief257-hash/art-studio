# Art Studio

A full-stack Art Studio web application built using React, Node.js, Express, and MongoDB.

The application supports two roles:

- Customer
- Admin

## Features

### Customer

- Register and login
- Browse available paintings
- Purchase one-of-a-kind paintings
- Cancel painting orders
- Book wall painting services
- Select wall size and painting date
- View and cancel wall painting bookings
- Request custom pottery
- Edit or cancel pottery requests while they are pending
- View only their own orders and requests

### Admin

- Login as admin
- View all paintings
- Add new paintings
- Edit available paintings
- View all wall painting bookings
- Confirm or decline wall painting bookings
- View all pottery requests
- Accept or decline pottery requests

## Technologies Used

### Frontend

- React
- Vite
- React Router

### Backend

- Node.js
- Express.js
- JWT authentication
- bcryptjs

### Database

- MongoDB
- Mongoose

## Business Rules

### Paintings

- Each painting is one-of-a-kind and can only be purchased once.
- When a customer purchases a painting, it becomes unavailable.
- When a customer cancels an order, the painting becomes available again.
- Admins can edit paintings only while they are available.

### Wall Painting

- Booking date must be 7 to 90 days from today.
- Wall size must be between 10 and 500 sq ft.
- Price is calculated at ₹150 per sq ft.
- A date cannot have more than one active booking.
- A cancelled date can be booked again.
- Customers can cancel a booking only when at least 3 days remain.
- Admin confirms or declines booking requests.

### Custom Pottery

- Items and glazes are selected from predefined options.
- Quantity must be between 1 and 12.
- Needed-by date must be at least 14 days away.
- Customers can edit or cancel requests only while they are in the requested state.
- Admin accepts or declines pottery requests.

## Authentication and Authorization

JWT is used for authentication.

Passwords are hashed using bcryptjs before being stored.

Role-based access control is implemented for customer and admin operations.

The server checks authentication and authorization on protected requests.

The server returns:

- `401` when the user is not authenticated.
- `403` when the authenticated user does not have the required role.
- `404` when a customer tries to access a record that does not belong to them.

## Project Structure

```text
art-studio/
├── client/
│   ├── public/
│   │   └── images/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── data/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── .env.example
│   ├── seed.js
│   └── server.js
│
├── .gitignore
├── README.md
└── DESIGN.md
```

## How to Run

### 1. Start MongoDB

Make sure MongoDB is running locally.

### 2. Start the Backend

Open a terminal in the `server` folder:

```bash
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5002
```

### 3. Start the Frontend

Open another terminal in the `client` folder:

```bash
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Environment Variables

Create a `.env` file inside the `server` folder.

Use `.env.example` as a template.

Required variables:

```text
PORT=5002
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

The actual `.env` file is not included in the repository.

## Demo Account

An admin account is available for testing.

```text
Email: admin@artstudio.com
Password: Admin@123
```

Customers can create their own account using the registration page.

## Database Seeding

The project includes seed data for paintings and predefined options.

To seed the paintings:

```bash
cd server
node seed.js
```

## Error and Data States

The application includes:

- Loading states while data is being fetched
- Empty states when there is no data
- Error messages when requests fail
- Protected routes for authenticated users
- Role-based access for customer and admin features

## Security

- Passwords are stored using bcrypt hashing.
- JWT tokens are used for authentication.
- Protected API routes require authentication.
- Admin operations require the admin role.
- Customers can access only their own records.

## Future Improvements

The current project focuses on the required assignment functionality.

Possible future improvements include:

- More polished and responsive UI
- Online payments
- Image uploads
- Email notifications
- Password reset
- Advanced admin analytics
- Deployment to a cloud platform

## Scope

The following features are intentionally outside the scope of this assignment:

- Real payment processing
- Password reset
- Email verification
- Social login
- Studio signup
- Reviews
- Coupons
- Delivery tracking
- Email/SMS notifications
- Image upload
- Deployment
- Docker
- CI/CD