# FITZON

FITZON is a fitness website built with React and Vite, with an Express API and PostgreSQL database.

## Features

- Home page with the existing Hero, About, Classes, Trainers, and Contact sections.
- Login and registration on the same page, separate from Contact.
- Registration and login connected to the backend API.
- Member dashboard after successful login.
- Existing fitness classes loaded from the classes API.
- Weekly timetable display showing sample class times, mentors, and trainee groups.
- Responsive layouts using the project's existing Tailwind styles.

## Requirements

- Node.js (a current LTS release is recommended)
- npm
- PostgreSQL database

## Run the frontend locally

From the project root:

```bash
npm install
npm run dev
```

Vite prints the local development address in the terminal.

## Run the backend locally

```bash
cd server
npm install
```

Create a `server/.env` file locally with your own values:

```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

Then start the API:

```bash
npm run dev
```

Do not commit `.env` files, database connection strings, passwords, JWT secrets, or other credentials.

## API routes currently used

- `POST /api/auth/register` — creates a user account.
- `POST /api/auth/login` — checks credentials and returns a JWT.
- `GET /api/classes` — returns fitness classes from PostgreSQL.
- `GET /api/db-test` — checks the database connection.

The frontend currently uses the deployed API URL in the login and classes components. For local development, update those URLs to your local API address only if you intend to test against the local backend.

## Timetable note

The timetable currently contains example schedule entries for display purposes. Real bookings, trainee assignment, and mentor scheduling need corresponding database tables and API endpoints before they can be treated as live data.

## Build the frontend

From the project root:

```bash
npm run build
```

The generated `dist/` folder is build output; the source files are in `src/`.
