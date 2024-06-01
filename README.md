Sure, here is the README in a `.md` format.

---

# Fastify Application with MongoDB

This repository contains a Fastify application integrated with MongoDB, orchestrated using Docker Compose. The application provides basic user authentication and transaction management functionalities.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup](#setup)
  - [Environment Variables](#environment-variables)
  - [Docker Compose](#docker-compose)
- [Running the Application](#running-the-application)
- [Resetting Containers](#resetting-containers)
- [Endpoints](#endpoints)
- [Utilities](#utilities)
- [Troubleshooting](#troubleshooting)

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

## Resetting Containers

To stop and remove old containers, networks, and volumes, and rebuild the application, run the provided `reset-containers.sh` script.

### `reset-containers.sh`

```sh
#!/bin/bash

# Stop and remove old containers, networks, and volumes
docker-compose down

# Remove unused images
docker image prune -a -f

# Remove unused volumes
docker volume prune -f

# Build and start new containers
docker-compose up --build
```

Make the script executable:

```sh
chmod +x reset-containers.sh
```

Run the script:

```sh
./reset-containers.sh
```

## Endpoints

### Authentication Endpoints

- **Login**: `POST /login`
- **Sign Up**: `POST /signup`

### Transaction Endpoints

- **Send**: `POST /transaction/send`
- **Withdraw**: `POST /transaction/withdraw`

## Utilities

### Account Number Generator

The application includes a utility to generate unique account numbers for payment accounts.

### Currency Converter

Utility function to convert amounts between USD, VND, and EUR.

```typescript
import axios from 'axios';

const exchangeRates = {
  USD: { VND: 23000, EUR: 0.85 },
  VND: { USD: 0.000043, EUR: 0.000037 },
  EUR: { USD: 1.18, VND: 27000 },
};

type Currency = 'USD' | 'VND' | 'EUR';

export const convertCurrency = (amount: number, from: Currency, to: Currency): number => {
  if (from === to) {
    return amount;
  }

  const rate = exchangeRates[from][to];
  return amount * rate;
};
```

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
```

---

Save the above content as `README.md` in the root directory of your project. This document provides comprehensive instructions for setting up, running, and troubleshooting your Fastify application with MongoDB, using Docker Compose. Adjust any parts to fit your project's specific details as needed.