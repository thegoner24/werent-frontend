# WeRent Frontend

A modern Next.js application for a rental marketplace platform, allowing users to browse, list, and rent items.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [API Integration](#api-integration)
- [Authentication](#authentication)
- [Components](#components)
- [Deployment](#deployment)
  - [Live Demo](#live-demo)
- [TypeScript and ESLint](#typescript-and-eslint)
- [Contributing](#contributing)

## Overview

WeRent is a platform that connects people who want to rent items with those who have items to rent. This repository contains the frontend application built with Next.js, React, and TypeScript.

## Features

- **User Authentication**: Secure login, signup, and token-based authentication
- **Product Listings**: Browse, search, and filter available rental items
- **Product Details**: View detailed information about rental items including images, descriptions, and reviews
- **User Dashboard**: Manage rentals, profile, and account settings
- **Admin Dashboard**: Moderate reviews and manage platform content
- **Review System**: Leave and read reviews for products with ratings and comments
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15.4.2
- **Language**: TypeScript
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS 4.x
- **State Management**: React Context API
- **Data Fetching**: Custom fetch API with authentication middleware
- **Animation**: Framer Motion
- **Linting**: ESLint 9.x
- **Date Handling**: date-fns 4.1.0

## Project Structure

```
src/
├── api/                  # API integration modules
├── app/                  # Next.js App Router pages
│   ├── admin-dashboard/  # Admin dashboard pages
│   ├── dashboard/        # User dashboard pages
│   ├── login/            # Authentication pages
│   ├── products/         # Product listing and details
│   └── shop/             # Shop browsing interface
├── components/           # Reusable React components
│   ├── Reviews/          # Review system components
│   ├── Solution/         # Solution showcase components
│   ├── Testimonials/     # Testimonial components
│   └── ui/               # UI components (buttons, inputs, etc.)
├── contexts/             # React Context providers
│   └── AuthContext.tsx   # Authentication context
├── hooks/                # Custom React hooks
│   └── useAuthenticatedApi.ts # API hook with auth
└── utils/                # Utility functions
    └── authMiddleware.ts # Authentication middleware
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thegoner24/werent-frontend.git
   cd werent-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Application

#### Development Mode

```bash
npm run dev
# or
yarn dev
```

This will start the development server with Turbopack at `http://localhost:3000`.

#### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## API Integration

The application connects to a backend API at `https://werent-backend-api.onrender.com`. API integration is handled through modules in the `src/api` directory:

- `items.ts`: Product-related API calls
- `profile.ts`: User profile management
- `testimonial.ts`: Testimonial data

The application uses a custom authentication middleware (`src/utils/authMiddleware.ts`) that handles token refresh automatically.

## Authentication

Authentication is implemented using JWT tokens with automatic refresh. The system includes:

- Login and signup flows
- Token storage in localStorage
- Automatic token refresh
- Protected routes
- Role-based access control

The `AuthContext` provides authentication state and methods throughout the application.

## Components

### Reviews System

The reviews system allows users to view and submit reviews for products. Key components:

- `Reviews.tsx`: Main component for displaying product reviews
- `ReviewsTab.tsx`: Dashboard component for managing reviews

### UI Components

The application includes reusable UI components for consistent design:

- Container layouts
- Buttons and form elements
- Modal dialogs
- Image galleries with Next.js Image optimization

## Deployment

The application is configured for deployment on platforms that support Next.js applications. The production build process:

1. Runs TypeScript type checking
2. Performs ESLint validation (with warnings ignored during build)
3. Builds optimized production assets

### Live Demo

A live version of the application is deployed at:

**[Click Here!](https://werent-frontend.vercel.app/)**

This deployment is automatically updated whenever changes are pushed to the main branch of the repository. The application is hosted on Vercel, which provides seamless integration with Next.js projects.

## TypeScript and ESLint

The project uses TypeScript for type safety and ESLint for code quality. Key configurations:

- Strict TypeScript checking
- ESLint with Next.js recommended rules
- Custom ESLint configuration in `eslint.config.mjs`

To run type checking manually:

```bash
npm run build -- --typecheck
```

To run linting manually:

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request