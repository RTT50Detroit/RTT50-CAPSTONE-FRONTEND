# Frontend Project - The Social Match Game
https://socialmatchapp.onrender.com/
<!-- https://socialmatchmaker.netlify.app/

[![Netlify Status](https://api.netlify.com/api/v1/badges/f5360ea0-66c1-4688-a689-85154619cb05/deploy-status)](https://app.netlify.com/projects/socialmatch/deploys) -->

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Application Routes](#application-routes)
- [Sitemap](#sitemap)
- [Scripts](#scripts)
- [License](#license)

---

## Overview

The frontend for **The Social Match Game** is a React-based application designed for user registration, login, protected user dashboards, and other core features. This project utilizes **React Router** for navigation and includes both public and protected routes to distinguish between authenticated and unauthenticated user flows.

---

## Features

- **Responsive Navigation Bar** with React Router's `NavLink`.
- Public routes:
  - Home, Login, Registration.
- Protected routes (authenticated access only):
  - Members Dashboard.
  - Profile Dashboard.
  - Create and manage user Notes.
- Protected routes secured using a custom `ProtectedRoute` component.
- Client-side storage of JWT tokens for authentication (e.g., using `localStorage`).
- Dynamic logout button visible only when logged in.

---

## Tech Stack

- **React.js** - Frontend framework.
- **React Router v7** - Client-side routing.
- **CSS** - For styling components and pages.
- **localStorage** - To handle user session data.

---

## Getting Started

### Prerequisites

Make sure you have the following installed on your system:
- **Node.js** (v24.0.0 or above)
- **npm** (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <project_folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the application:

   ```bash
   npm run dev
   ```

4. Access the app in your browser at:

   ```bash
   http://localhost:5173
   ```

### Environment Variables

You can set environment-specific variables in a `.env` file at the root of your project:

```plaintext
VITE_API_BASE_URL=<base_url_for_backend>   # Base URL of the backend server
```

---

## Folder Structure

Here's the typical folder structure for the frontend:

```plaintext
project-folder/
│
├── src/
│   ├── components/              # Reusable and functional components
│   │   ├── LogoutButton.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── Dashboard/           # Dashboard-related components
│   │       ├── ProfileDashboard.jsx
│   │       └── note/
│   │           └── CreateNote.jsx
│   │
│   ├── pages/                   # Pages for routing
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Registration.jsx
│   │   └── MembersDashboard.jsx
│   │
│   ├── App.jsx                  # Application entry
│   ├── App.css                  # Core CSS
│   └── pages/css/styles.css     # Styles for pages
│
├── public/                      # Static files
├── .env                         # Environment variables
├── .gitignore                   # Ignored files for Git
├── README.md                    # Documentation (this file)
├── package.json                 # Project metadata and dependencies
└── vite.config.js               # Vite configuration (if applicable)
```

---

## Application Routes

Here’s an overview of the application routes, divided into **public** and **protected** routes:

### Public Routes

| Path           | Component       | Description                   |
|----------------|-----------------|-------------------------------|
| `/`            | Home            | Home page.                    |
| `/register`    | Registration    | User registration page.       |
| `/login`       | Login           | User login page.              |

### Protected Routes

| Path                 | Component           | Description                       |
|----------------------|---------------------|-----------------------------------|
| `/dashboard`         | MembersDashboard   | Protected members' dashboard.    |
| `/dashboard/profile` | ProfileDashboard   | User profile dashboard.           |
| `/notes`             | CreateNote         | Create and manage user notes.     |

- Protected routes require the user to be logged in. Guests are redirected to the login page.
- Protected routes use the `ProtectedRoute` component for authentication checks.

---

## Sitemap

The public routes are listed in [`public/sitemap.xml`](public/sitemap.xml). Keep
this file updated whenever an indexable public route is added, removed, or
renamed. Authenticated routes are intentionally excluded.

## Scripts

Available npm scripts:

- **Start the development server**:
  ```bash
  npm run dev
  ```

- **Build for production**:
  ```bash
  npm run build
  ```

- **Preview the production build**:
  ```bash
  npm run preview
  ```

---

## License

This project is licensed under the [MIT License](LICENSE).
