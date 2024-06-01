# Fastify Application with MongoDB

This repository contains a Fastify application integrated with MongoDB, orchestrated using Docker Compose. The application provides basic user authentication and transaction management functionalities.

## Table of Contents

- [Hardships](#hardships)
- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Docker Compose](#docker-compose)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Endpoints](#endpoints)
- [Troubleshooting](#troubleshooting)

## Hardships
### Things I was not able to do:
- Implementing Prisma into the system.
- Reason: Couldn't be able to make a replica set for mongodb.
### Things that can be improved:
- Code implementation on the transfering money side can be broken down to smaller parts.
- Better way to handle swagger. Couldn't set up body params and such for Swaggers.
- A lot of magical numbers and strings can be placed somewhere else.
- Handle schema errors. I haven't figured out how to block and handle it.
- Need quite some efforts to refactor codes.
## Prerequisites

Make sure you have the following installed on your machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js v21.5.0](https://nodejs.org/)

## Setup

### Environment Variables

Create a `.env` file in the root of the project directory and add the following environment variables:

```dotenv
DATABASE_URL="mongodb://admin:admin@mongo:27017/saola-crypto?retryWrites=true&w=majority&authSource=admin"
PORT=8080
SECRET_KEY="y4kXCSAHfluj3iOfd8uakdoakojv"
```

### Docker Compose

The `docker-compose.yml` file sets up the Fastify application and MongoDB services.

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: mongo
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db

  fastify-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: fastify-app
    restart: always
    ports:
      - '8080:8080'
    environment:
      DATABASE_URL: mongodb://admin:admin@mongo:27017/saola-crypto?retryWrites=true&w=majority&authSource=admin
      PORT: 8080
      SECRET_KEY: y4kXCSAHfluj3iOfd8uakdoakojv
    depends_on:
      - mongodb

volumes:
  mongo-data:
```

## Running the Application

To build and start the containers, run the following command:

```sh
docker-compose up --build
```

This command will build the Docker images and start the containers for both the Fastify application and MongoDB.

## Project Structure
```bash
├── .env
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── src/
    ├── config/
    │   ├── index.ts
    ├── controllers/
    |   ├── index.ts
    │   ├── user.controller.ts
    │   ├── payment-account.controller.ts
    │   ├── transaction.controller.ts
    ├── interfaces/
    │   ├── index.ts
    ├── models/
    │   ├── user.model.ts
    │   ├── payment-account.model.ts
    │   ├── transaction.model.ts
    │   ├── payment-history.model.ts
    ├── plugins/
    │   ├── mongoose.ts
    ├── routes/
    │   ├── users.ts
    │   ├── paymentAccounts.ts
    │   ├── transactions.ts
    ├── schema/
    │   ├── index.ts
    │   ├── user.schema.ts
    ├── utils/
    │   ├── auth.ts
    │   ├── constants.ts
    │   ├── errors.ts
    │   ├── utils.ts
    └── index.ts
```
## Endpoints

### General

- **GET /docs: Swaggers endpoint.
- **GET /health**: Health check endpoint to ensure the server is running.

### User Authentication

- **POST /api/user/login**: Endpoint for user login.
- **POST /api/user/signup**: Endpoint for user signup.

### Payment Account Management

- **POST /api/payment-account/createPaymentAccount**: Endpoint to create a new payment account.
- **POST /api/payment-account/editPaymentAccount**: Endpoint to edit an existing payment account.
- **GET /api/payment-account/getPaymentAccounts**: Endpoint to retrieve all payment accounts for a user.

### Transaction Management

- **POST /api/transaction/withdraw**: Endpoint to withdraw money from an account.
- **POST /api/transaction/send**: Endpoint to send money to another account.


## Troubleshooting

### Common Issues

- **Port Conflicts**: Ensure that the ports `8080` and `27017` are not being used by other applications.
- **Environment Variables**: Verify that the `.env` file is correctly set up and accessible.
- **Container Logs**: Check the logs for the Fastify application container to diagnose issues.

```sh
docker-compose logs fastify-app
```

### Checking MongoDB Connection

Ensure that MongoDB is running and accessible from the Fastify application. You can verify this by connecting to MongoDB using a MongoDB client or checking the logs.

```sh
docker-compose logs mongodb
```

If you encounter any issues, please open an issue on the GitHub repository or contact the maintainers for assistance.
