# Bitespeed Backend Task: Identity Reconciliation

## Introduction

This project is a backend service for [Bitespeed Backend Task: Identity Reconciliation](https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-53392ab01fe149fab989422300423199). The service identifies and tracks customer identities across multiple purchases based on provided email and phone number information. It links different contact details to the same customer and provides a consolidated view.

### Features

- Create and link customer contacts based on email and phone number
- Handle primary and secondary contact relationships
- Consolidate contact information and respond with a unified customer view

### Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- PostgreSQL
- Docker (for containerization)

### Live Link

The live service is available at: [https://mangocharger-shoulder.toystack.dev/](https://mangocharger-shoulder.toystack.dev/) [http://4.188.105.88/](http://4.188.105.88/)

### Local Setup

#### Prerequisites

Ensure you have the following installed on your machine:

- Node.js (for non-Docker setup)
- Docker (for Docker setup)
- Docker Compose (for Docker setup)
- PostgreSQL (for non-Docker setup)

#### Steps for Docker Setup

1. **Clone the Repository**

   ```sh
   git clone https://github.com/shashankpal1909/bitespeed-identity-reconciliation.git
   cd bitespeed-identity-reconciliation
   ```

2. **Set Up Environment Variables**

   Create a environment file in the root directory: `.env`

   ```env
   DATABASE_URL="postgresql://user:password@db:5432/bitespeed"
   PORT=3000
   ```

3. **Build and Run Docker Containers**

   For development:

   ```sh
   docker compose -f docker-compose.dev.yaml up --build
   ```

   For production:

   ```sh
   docker compose -f docker-compose.prod.yaml up --build
   ```

   The server will start on `http://localhost:3000`.

#### Steps for Non-Docker Setup

1. **Clone the Repository**

   ```sh
   git clone https://github.com/shashankpal1909/bitespeed-identity-reconciliation.git
   cd bitespeed-identity-reconciliation
   ```

2. **Set Up Environment Variables**

   Create a environment file in the root directory: `.env`

   ```env
   DATABASE_URL="postgresql://user:password@db:5432/bitespeed"
   PORT=3000
   ```

3. **Install Dependencies**

   ```sh
   npm install
   ```

4. **Set Up the Database**

   Make sure you have PostgreSQL installed and running.

   ```sh
   npx prisma db push
   ```

5. **Start the Application**

   For development:

   ```sh
   npm run dev
   ```

   For production:

   ```sh
   npm run build
   npm start
   ```

   The server will start on `http://localhost:3000`.

### Usage

#### cURL

   ```curl
   curl --location 'https://mangocharger-shoulder.toystack.dev/identify' \
   --header 'Content-Type: application/json' \
   --data-raw '{
   "email":"george@hillvalley.edu",
   "phoneNumber": "717171"
   }'
   ```
