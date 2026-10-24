# Design Document

## 1. Authentication and Roles

The application has two user roles:

- Customer
- Admin

Users register and log in using their email and password.

Passwords are hashed using bcryptjs before being stored in MongoDB.

After successful login, the server creates a JWT containing the user's ID and role.

The client stores the JWT and sends it with protected API requests.

The server uses authentication middleware to verify the JWT.

Role-based middleware is used to restrict admin-only operations.

### Access Rules

- Unauthenticated users receive `401 Unauthorized`.
- Authenticated users without the required role receive `403 Forbidden`.
- Customers can access only their own orders, bookings, and pottery requests.
- If a customer requests another customer's record, the server returns `404 Not Found`.

---

## 2. Database Choice

MongoDB was selected because the application contains several related but flexible types of data, such as:

- Users
- Paintings
- Orders
- Wall painting bookings
- Pottery requests

MongoDB works well with Node.js and provides simple integration through Mongoose.

Mongoose schemas are used to define the structure and validation rules for the application's data.

---

## 3. Preventing Two Customers from Buying the Same Painting

Each painting has an `available` field.

When a customer purchases a painting, the server performs an atomic database update:

- Find the painting by its ID.
- Check that `available` is `true`.
- Change `available` to `false`.

Only one request can successfully change the painting from available to unavailable.

If another customer tries to buy the same painting after it has been sold, the update does not find an available painting and the purchase is rejected.

When an order is cancelled, the painting is made available again.

This prevents the same one-of-a-kind painting from being sold twice.

---

## 4. Preventing Two Customers from Booking the Same Wall Painting Date

The server checks for an existing active booking before creating a new booking.

A booking is considered active when its status is not `cancelled`.

Therefore:

- `requested` → date is occupied
- `confirmed` → date is occupied
- `declined` → date remains occupied according to the current booking record
- `cancelled` → date becomes available again

The server rejects a new booking when another active booking already exists for the selected date.

The date is checked on the server rather than relying only on frontend validation.

---

## 5. Customer Data Protection

Customer records are filtered using the authenticated user's ID.

For example, when retrieving orders, the server uses the logged-in user's ID to find orders.

This prevents customers from viewing another customer's orders or requests.

For operations such as cancellation, the server checks both:

- The requested record ID
- The authenticated user's ID

This ensures that a customer cannot cancel another customer's record simply by knowing its ID.

---

## 6. Painting Management

Customers can:

- View available paintings.
- Purchase paintings.
- Cancel their own orders.

Admins can:

- View all paintings.
- Add new paintings.
- Edit paintings while they are available.

Sold paintings cannot be edited.

---

## 7. Wall Painting Workflow

The customer provides:

- Painting date
- Wall size
- Address

The server validates the booking date and wall size.

The date must be between 7 and 90 days from the current date.

The wall size must be between 10 and 500 square feet.

The price is calculated using:

`Wall Size × ₹150`

The booking starts with the `requested` status.

The admin can then:

- Confirm the booking
- Decline the booking

Customers can cancel their booking if at least 3 days remain before the booking date.

---

## 8. Custom Pottery Workflow

The customer selects:

- Pottery item
- Glaze
- Quantity
- Needed-by date

The quantity must be between 1 and 12.

The needed-by date must be at least 14 days away.

A new pottery request starts with the `requested` status.

While the request is still requested, the customer can:

- Edit it
- Cancel it

The admin can:

- Accept the request
- Decline the request

Once the request is accepted or declined, the customer can no longer edit it.

---

## 9. Finished Features

The following required features are implemented:

- Customer registration and login
- Admin login
- JWT authentication
- Password hashing
- Role-based authorization
- Painting browsing
- One-of-a-kind painting purchase
- Painting order cancellation
- Wall painting booking
- Wall painting date validation
- Wall size validation
- Wall painting price calculation
- Admin wall booking confirmation and decline
- Wall booking cancellation
- Custom pottery requests
- Pottery editing and cancellation while requested
- Admin pottery acceptance and decline
- Customer-specific data access
- Loading, empty, and error states
- MongoDB database integration
- Seed data

---

## 10. Intentionally Left Out

The following features are outside the scope of the assignment:

- Real payment processing
- Password reset
- Email verification
- Social login
- Studio signup
- Reviews
- Coupons
- Delivery tracking
- Email and SMS notifications
- Image uploads
- Deployment
- Docker
- CI/CD
- Advanced responsive design
- Advanced animations

These features can be added in a future version.

---

## 11. Future Improvements

Possible future improvements include:

- Online payment integration
- Image upload and cloud storage
- Email notifications
- Password reset
- Improved responsive UI
- Advanced admin dashboard and analytics
- Cloud deployment
- Better concurrency handling for high-traffic booking scenarios

## 12. Summary

The application uses a React frontend, Node.js and Express backend, and MongoDB database.

Authentication is handled using JWT and passwords are protected using bcryptjs.

Server-side validation and role-based authorization are used to enforce the application's business rules and protect customer data.

The main focus of the project is implementing the required Art Studio functionality with clear separation between customer and admin operations.