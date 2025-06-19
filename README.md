# Calvin Real Estate

A full-stack real estate application with client, server, and admin interfaces.

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Email service account (Ethereal Email recommended for development)
- React.js
- Nodemailer

## ⚙️ Setup

### 1. Install Dependencies

First, install root dependencies:

```bash
npm i
```

### 2. Environment Configuration

Create a `.env` file in the server directory with the following variables:

```env
ENV=development
PORT=5000
SERVER_URL=http://localhost:5000

# Database
DATABASE_URL=your-mongo-db-url

# Client Configuration
CLIENT_PORT=5173
CLIENT_URL=http://localhost:5173

# Admin Configuration
ADMIN_PORT=3000
ADMIN_URL=http://localhost:3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Email Configuration (Use Ethereal Email for development)
EMAIL_SERVICE=smtp
EMAIL_PORT=587
EMAIL_USER=your-ethereal-email
EMAIL_PASSWORD=your-ethereal-password
EMAIL_FROM=your-ethereal-email
SMTP_HOST=smtp.ethereal.email

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

### 3. Get Email Credentials

1. Go to [Ethereal Email](https://ethereal.email/)
2. Create a new account to get SMTP credentials
3. Update the email variables in your `.env` file with the generated credentials

---

## 🚀 Run the Project

### Run the whole project

```bash
npm run dev
```

> Runs client, server, and admin together concurrently.

---

## 🔧 Individual Dev Scripts

### Run only client (Vite)

```bash
npm run dev:client
```

> **URL:** [http://localhost:5173](http://localhost:5173)

### Run only server (Backend)

```bash
npm run dev:server
```

> **URL:** [http://localhost:5000](http://localhost:5000)

### Run only admin

```bash
npm run dev:admin
```

> **URL:** [http://localhost:3000](http://localhost:3000)
