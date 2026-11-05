# FITZONE – Full-Stack Fitness Website

FITZONE is a full-stack fitness studio website built using React, Vite, Node.js, Express and PostgreSQL. The website allows users to register, log in, explore fitness classes, view membership plans and purchase memberships using Stripe test payments.

## Live Project

- **Frontend:** https://fitzonee-azure.vercel.app/
- **Backend:** https://fitzon-backend.onrender.com/
- **GitHub Repository:** https://github.com/mzvovumba-Dev/Fitzon-website

---

## Technologies Used

### Frontend
- React – Building the user interface.
- Vite – Frontend development and build tool.
- JavaScript – Application functionality.
- Tailwind CSS – Website styling and responsive layouts.

### Backend
- Node.js – Running the backend application.
- Express.js – Creating the backend server and API routes.
- REST API – Communication between the frontend and backend.
- CORS – Allowing frontend and backend communication.

### Database
- PostgreSQL – Relational database.
- Neon – Cloud-hosted PostgreSQL database.
- pg – Connecting the backend to PostgreSQL.

### Authentication and Security
- bcryptjs – Hashing user passwords.
- JSON Web Token (JWT) – User authentication.
- dotenv – Managing environment variables.

### Payment Integration
- Stripe Checkout – Processing test payments.
- Stripe Webhooks – Receiving payment confirmation and updating orders.

### Deployment and Version Control
- GitHub – Source code management and version control.
- Vercel – Hosting the frontend.
- Render – Hosting the backend.

---

## Project Structure

```text
Fitzon-website/
│
├── public/
│
├── images/
│
├── server/
│   ├── server.js
│   ├── db.js
│   └── package.json
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Classes.jsx
│   │   ├── Trainers.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Timetable.jsx
│   │   ├── Pricing.jsx
│   │   └── PaymentSuccess.jsx
│   │
│   └── App.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Main Features

### 1. Home Page
- Responsive fitness website.
- Hero section.
- About section.
- Fitness classes.
- Trainer information.
- Contact section.

### 2. User Registration and Login
- New users can create an account.
- Existing users can log in.
- User information is saved in PostgreSQL.
- Passwords are protected using bcryptjs.
- JWT is used for authentication.
- Members can access their dashboard.

### 3. Dashboard
- Provides access to the member area.
- Allows logged-in users to access their website features.
- Includes logout functionality.

### 4. Fitness Classes
- Displays available fitness classes.
- Retrieves class information from the backend API.
- Class information is stored in PostgreSQL.

### 5. Timetable
- Displays a weekly fitness timetable.
- Shows sample class schedules, mentors and trainee groups.

### 6. Membership Pricing
FITZONE provides three membership plans:

| Membership | Price |
|---|---:|
| Basic | R199 |
| Standard | R349 |
| Premium | R499 |

- Membership plans are retrieved from the database.
- Users can view membership descriptions and prices.
- Each plan includes a Buy Now option.

### 7. Stripe Payment Integration
- Stripe Checkout integration.
- Test-mode payments.
- Stripe webhook payment verification.
- Customer orders saved in PostgreSQL.
- Payment confirmation page.
- Displays membership name, amount, order number and payment status.

---

## Database Structure

The project uses Neon PostgreSQL to store application information.

The main database tables are:

| Table | Purpose |
|---|---|
| users | Stores registered user information. |
| classes | Stores fitness class information. |
| membership_plans | Stores membership names, descriptions and prices. |
| orders | Stores customer orders and payment information. |
| order_items | Stores the membership details associated with each order. |

The backend uses the database connection in `server/db.js` to communicate with PostgreSQL.

---

## Backend API Routes

| Method | API Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Registers a new user. |
| POST | `/api/auth/login` | Authenticates an existing user. |
| GET | `/api/classes` | Retrieves fitness classes. |
| GET | `/api/membership-plans` | Retrieves available membership plans. |
| POST | `/api/stripe/webhook` | Receives Stripe payment events. |
| GET | `/api/orders/session/:sessionId` | Checks a customer's payment order. |
| GET | `/api/db-test` | Tests the database connection. |
| GET | `/` | Checks that the backend is running. |

---

## How the Payment Process Works

1. The user logs in to FITZONE.
2. The user selects a membership plan.
3. The user clicks Buy Now.
4. The customer is redirected to Stripe Checkout.
5. The customer completes the test payment.
6. Stripe sends a payment confirmation event to the backend through a webhook.
7. The backend verifies the payment and checks the customer and membership details.
8. The backend saves the order in the `orders` and `order_items` tables.
9. The customer returns to FITZONE.
10. The Payment Success page checks the order with the backend and displays the confirmed payment details.

---

## Running the Project Locally

### Requirements
- Node.js
- npm
- PostgreSQL database or Neon account.

### 1. Install Frontend Dependencies

From the project root:

```bash
npm install
```

### 2. Start the Frontend

```bash
npm run dev
```

Vite will display the local development address in the terminal.

### 3. Install Backend Dependencies

Open another terminal:

```bash
cd server
npm install
```

### 4. Configure Backend Environment Variables

Create a `server/.env` file locally with your own credentials:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_long_random_secret
STRIPE_SECRET_KEY=your_stripe_test_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_signing_secret
PORT=5000
```

### 5. Configure Frontend API URL

Configure the frontend environment variable to point to your backend:

```env
VITE_API_URL=http://localhost:5000
```

For the deployed frontend, use the deployed Render backend address.

### 6. Start the Backend

From the server directory:

```bash
npm start
```

The backend will run on the configured port.

---

## Building for Production

From the project root, run:

```bash
npm run build
```

Vite generates the production build inside the `dist/` folder.

---

## Deployment

The FITZONE frontend and backend are deployed separately.

- **Vercel:** Hosts the React frontend.
- **Render:** Hosts the Node.js and Express backend.
- **Neon:** Hosts the PostgreSQL database.
- **GitHub:** Stores the project source code.

Environment variables are configured securely in the deployment platforms.

---

## Security Notes

- User passwords are hashed using bcryptjs.
- JWT is used to authenticate users.
- Protected API routes check the user's authentication token.
- Stripe webhook signatures are verified before processing payment events.
- Payment amounts are checked against the membership price stored in the database.
- Database queries use parameterized values.
- Environment variables and secret keys are not committed to GitHub.

---

## Payment Testing

FITZONE uses Stripe Test Mode for testing the checkout and payment confirmation process. Test payments do not represent real-money transactions.

## Project Goal

The goal of FITZONE is to provide a functional full-stack fitness website where users can register, log in, explore fitness classes, view membership plans and purchase memberships through an integrated test payment system.

The project demonstrates frontend development, backend development, database integration, user authentication, payment processing and deployment.