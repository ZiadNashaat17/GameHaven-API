# GameHaven API

A robust, production-ready REST API for a game e-commerce platform built with Node.js, Express, and MongoDB. Featuring advanced caching with Redis, secure authentication, and comprehensive game management capabilities.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Security Features](#security-features)
- [Performance Optimization](#performance-optimization)
- [Development](#development)
- [License](#license)

## Overview

GameHaven API is a modular and scalable backend designed for a comprehensive game e-commerce platform. It provides a complete ecosystem for managing games, user accounts, shopping carts, wishlists, reviews, and administrative operations with enterprise-level security and performance optimization.

## Features

### Core Functionality

- **User Management**: Registration, authentication, profile management, and role-based access control
- **Game Catalog**: Browse, filter, search, and manage games with detailed information
- **Shopping Cart**: Add/remove items, manage quantities, and persistent cart management
- **Wishlist**: Save favorite games for later purchase
- **Reviews & Ratings**: User reviews with rating system for games
- **Order Management**: Complete order lifecycle from cart to fulfillment

### Security & Performance

- **JWT Authentication**: Secure token-based authentication with configurable expiration
- **Data Validation**: Input sanitization and XSS protection
- **Rate Limiting**: API rate limiting to prevent abuse
- **Security Headers**: Helmet.js integration for HTTP security headers
- **Password Encryption**: bcrypt-based password hashing
- **Redis Caching**: Advanced caching layer for improved performance
- **MongoDB Sanitization**: Protection against NoSQL injection attacks

### Developer Experience

- **Modular Architecture**: Separation of concerns with controllers, models, routes, and services
- **Error Handling**: Centralized error management with custom error classes
- **Async/Await Patterns**: Modern async handling with catch-async middleware
- **Environment Configuration**: Easy configuration management with .env files
- **Logging**: Request logging with Morgan

## Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB 8.19.2 (Mongoose ODM)
- **Caching**: Redis 5.9.0
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Email**: SendGrid API

### Security & Middleware

- **helmet**: ^8.1.0 - Security headers
- **bcrypt**: ^6.0.0 - Password hashing
- **express-mongo-sanitize**: ^2.2.0 - NoSQL injection prevention
- **express-rate-limit**: ^8.2.1 - Rate limiting
- **hpp**: ^0.2.3 - HTTP parameter pollution protection
- **xss-clean**: ^0.1.4 - XSS attack prevention
- **validator**: ^13.15.20 - Data validation

### Utilities

- **morgan**: ^1.10.1 - HTTP request logging
- **dotenv**: ^16.4.5 - Environment variable management
- **slugify**: ^1.6.6 - URL-friendly string generation

### Development

- **nodemon**: ^3.1.10 - Auto-restart during development

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas account)
- Redis (local or cloud instance)
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ZiadNashaat17/GameHaven-API.git
cd GameHaven-API
```

2. **Install dependencies**

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/gamehaven

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=90

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_email@example.com

# Redis Cache
REDIS_URL=redis://localhost:6379
```

### Running the Application

**Development Mode** (with auto-reload):

```bash
npm start
```

The API will be available at `http://localhost:3000`

**Using Docker Compose**:

```bash
docker-compose up -d
```

This will start:

- Backend service on port 3000
- MongoDB on port 27017
- Redis on port 6379

## Project Structure

```
GameHaven-API/
├── controllers/          # Request handlers and business logic
│   ├── authController.js
│   ├── gameController.js
│   ├── userController.js
│   ├── cartController.js
│   ├── wishlistController.js
│   ├── reviewController.js
│   └── errorController.js
├── models/              # Database schemas and models
│   ├── userModel.js
│   ├── gameModel.js
│   ├── cartModel.js
│   ├── wishlistModel.js
│   └── reviewModel.js
├── routes/              # API endpoint definitions
│   ├── userRoutes.js
│   ├── gameRoutes.js
│   ├── cartRoutes.js
│   ├── wishlistRoutes.js
│   └── reviewRoutes.js
├── middlewares/         # Custom middleware functions
│   └── cleanCache.js
├── services/            # Business logic and external integrations
│   └── cache.js
├── utils/               # Utility functions and helpers
│   ├── apiFeatures.js   # Filtering, sorting, pagination
│   ├── appError.js      # Custom error class
│   ├── catchAsync.js    # Async error wrapper
│   └── email.js         # Email service
├── dev-data/            # Development data and scripts
│   ├── games.json
│   └── import-dev-data.js
├── app.js               # Express app configuration
├── server.js            # Server entry point
├── Dockerfile           # Docker container definition
├── docker-compose.yml   # Multi-container orchestration
├── package.json         # Dependencies and scripts
└── config.env          # Environment variables
```

## API Endpoints

### Authentication Routes (`/api/v1/auth`)

- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user profile

### Users Routes (`/api/v1/users`)

- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Games Routes (`/api/v1/games`)

- `GET /games` - Get all games with filtering, sorting, pagination
- `GET /games/:id` - Get game details
- `POST /games` - Create game (admin)
- `PATCH /games/:id` - Update game (admin)
- `DELETE /games/:id` - Delete game (admin)

### Cart Routes (`/api/v1/cart`)

- `GET /cart` - Get user's cart
- `POST /cart/add` - Add item to cart
- `PATCH /cart/:itemId` - Update item quantity
- `DELETE /cart/:itemId` - Remove item from cart

### Wishlist Routes (`/api/v1/wishlist`)

- `GET /wishlist` - Get user's wishlist
- `POST /wishlist/add` - Add game to wishlist
- `DELETE /wishlist/:gameId` - Remove from wishlist

### Reviews Routes (`/api/v1/reviews`)

- `GET /reviews` - Get all reviews
- `POST /reviews` - Create review
- `PATCH /reviews/:id` - Update review
- `DELETE /reviews/:id` - Delete review

## Architecture

### Request Flow

1. **Request Arrives** → Express middleware stack
2. **Authentication** → JWT verification (if required)
3. **Validation** → Input sanitization and validation
4. **Cache Check** → Redis cache lookup
5. **Database Query** → MongoDB operation (if not cached)
6. **Caching** → Store result in Redis
7. **Response** → JSON response to client

### Database Design

- **User Model**: Authentication, profile, roles
- **Game Model**: Game details, pricing, inventory
- **Cart Model**: User cart items with quantities
- **Wishlist Model**: Favorite games references
- **Review Model**: User reviews with ratings

### Caching Strategy

- Game listings and details cached in Redis
- Cache invalidation on game updates
- User-specific data not cached for security

## Security Features

### Authentication & Authorization

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control (admin/user)
- ✅ Protected routes and endpoints

### Data Protection

- ✅ MongoDB injection prevention (express-mongo-sanitize)
- ✅ XSS attack prevention (xss-clean)
- ✅ HTTP parameter pollution protection (hpp)
- ✅ HTTP security headers (Helmet.js)

### Rate Limiting & Abuse Prevention

- ✅ API rate limiting enabled
- ✅ Request logging and monitoring
- ✅ Input validation on all endpoints

## Performance Optimization

### Caching Layer

- Redis integration for high-speed caching
- Automatic cache invalidation on data updates
- Reduced database queries and improved response times

### Database Optimization

- Indexed MongoDB collections
- Efficient query patterns with Mongoose
- Pagination support for large datasets

### API Features

- **Filtering**: Query by multiple criteria
- **Sorting**: Customize result ordering
- **Pagination**: Limit results per page
- **Field Selection**: Request only needed fields

## Development

### Available Scripts

```bash
# Start development server with auto-reload
npm start

# Run with Docker
docker-compose up -d

# Stop Docker containers
docker-compose down
```

### Code Style & Conventions

- ES6+ module syntax
- Async/await for asynchronous operations
- Consistent error handling with custom AppError class
- Modular controller and route organization

### Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is licensed under the ISC License - see the package.json for details.

---

**Author**: Ziad Nashaat

For issues, questions, or suggestions, please create an issue on the GitHub repository.
