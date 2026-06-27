# UaMed Backend

Backend for the **UaMed** medical service platform.

This project provides the server-side API for the [UaMed Frontend](https://github.com/Kutsiy/ua-med-frontend).
The backend is built with **NestJS**, **Fastify**, **Prisma**, **PostgreSQL**, **Redis**, and **GraphQL**.

---

## About

UaMed Backend is responsible for handling core server-side logic for the medical platform, including authentication, user management, database access, API layer, and infrastructure integrations.

The project is focused on a modular backend architecture with clean separation between application logic, infrastructure, database layer, and shared common utilities.

---

## Tech Stack

This project was built with the following technologies:

* **NestJS** — backend framework
* **Fastify** — HTTP adapter
* **GraphQL** — API layer
* **Prisma** — ORM and database access
* **PostgreSQL** — main database
* **Redis** — caching/session-related infrastructure
* **TypeScript** — main programming language

---

## Related Repositories

Frontend repository:

[UaMed Frontend](https://github.com/Kutsiy/ua-med-frontend)

---

## Requirements

Before running the project, make sure you have installed:

* Node.js
* npm
* PostgreSQL
* Redis

Docker support will be added later.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Kutsiy/ua-med-backend.git
```

Go to the project directory:

```bash
cd ua-med-backend
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the root directory.

You can use `.env.example` as a reference:

```bash
cp .env.example .env
```

---  

## Prisma Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Optional: open Prisma Studio:

```bash
npx prisma studio
```

---

## How to Run

### Development Mode

Use this command during development:

```bash
npm run start:dev
```

The application will start in watch mode and reload after code changes.

---

### Production Mode

For production or deployment-like launch, first build the project:

```bash
npm run build
```

Then start the compiled application:

```bash
npm run start
```

Or, if your project uses a separate production script:

```bash
npm run start:prod
```

---

## Available Scripts

```bash
npm run start:dev
```

Runs the project in development mode.

```bash
npm run build
```

Builds the project.

```bash
npm run start
```

Starts the application.

```bash
npm run start:prod
```

Starts the built application in production mode.

```bash
npm run lint
```

Runs linter checks.

```bash
npm run test
```

Runs tests.

```bash
npm run test:e2e
```

Runs end-to-end tests.

---

## Main Features

* Authentication and authorization
* Access and refresh token flow
* OAuth integration
* User management
* GraphQL API
* PostgreSQL database integration
* Prisma ORM layer
* Redis integration
* Global error handling
* Modular NestJS architecture

---

## Project Structure

The project follows a modular backend structure.

```txt
src/
├── common/        # shared utilities, services, filters, guards, decorators
├── modules/       # feature modules
├── main.ts        # application entry point
└── app.module.ts  # root application module
```

Common backend responsibilities such as filters, guards, shared services, and infrastructure-related utilities are separated from feature modules.

---

## API

The backend uses GraphQL as the main API layer.

After starting the project, GraphQL Playground or Apollo Sandbox may be available depending on the current project configuration.

Default local backend URL:

```txt
http://localhost:3000
```

---

## Development Notes

For local development:

1. Install dependencies.
2. Configure `.env`.
3. Start PostgreSQL and Redis.
4. Run Prisma migrations.
5. Generate Prisma client.
6. Start the app with:

```bash
npm run start:dev
```

For deployment-like launch:

1. Configure environment variables.
2. Build the project:

```bash
npm run build
```

3. Start the application:

```bash
npm run start
```

Docker setup will be added later.

---

## Status

The project is currently in active development.

Planned improvements:

* Docker configuration
* Improved testing coverage
* CI/CD pipeline
* Better documentation
* Deployment configuration

---

## Author

Created by [Kutsiy](https://github.com/Kutsiy)
