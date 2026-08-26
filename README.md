# Stock Tracker Frontend App

A modern, responsive, and robust inventory management web application designed to track stock levels, manage categories and companies, and generate detailed reports. Built with React, TypeScript, Vite, and Tailwind CSS, this frontend communicates seamlessly with backend services to provide real-time updates and an intuitive user experience.

## 📸 Project Showcase

[Project Design & UI Images](https://drive.google.com/drive/folders/1xmlsep-MzvbVvAtem5HCZKUorklUfA7p?usp=sharing)

## ✨ Features

- **Authentication:** Secure user login and session management.
- **Dashboard:** At-a-glance overview of inventory metrics and recent activities.
- **Master Data Management:**
  - Manage **Categories** (Add, Edit, View, Delete).
  - Manage **Companies** and suppliers.
  - Manage **Items** under various categories and companies.
- **Stock Operations:**
  - **Stock In:** Easily record incoming stock quantities.
  - **Stock Out:** Process outbound stock, issue items, or record sales.
- **Reporting & Exports:** Generate comprehensive stock reports with the ability to export data (powered by `jspdf`).
- **Modern UI/UX:** Clean, accessible, and responsive interface using `shadcn/ui`, `lucide-react` icons, and Tailwind CSS.
- **Data Validation & Fetching:** Robust client-side validation with `Zod` and efficient data fetching/caching with `TanStack React Query`.

## 🛠️ Tech Stack

- **Framework:** React 19, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v4), `shadcn/ui`, `clsx`, `tailwind-merge`
- **Routing:** React Router v7
- **State Management & Data Fetching:** TanStack React Query, Axios
- **Form Handling & Validation:** TanStack Form, Zod
- **Icons:** Lucide React
- **PDF Generation:** jsPDF, jsPDF-AutoTable

## 📂 Project Structure

```text
src/
├── assets/         # Static assets like images and global CSS
├── components/     # Reusable UI components (buttons, modals, tables, shadcn UI)
├── config/         # Application configuration files (e.g., API base URLs)
├── constants/      # App-wide constants
├── context/        # React Context API providers for global state
├── hooks/          # Custom React hooks
├── lib/            # Utility libraries and integrations
├── pages/          # Main application views (Dashboard, Stock-in, Reports, etc.)
├── routes/         # Application routing configuration
├── schemas/        # Zod validation schemas
├── services/       # API call definitions using Axios
├── types/          # Global TypeScript interfaces and types
└── utils/          # Helper functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- `pnpm` (Project uses `pnpm-lock.yaml`)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd stock-tracker-frontend-app
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure Environment Variables:**

   Rename `env.example` to `.env` and replace `YOUR_BACKEND_URL` with your actual backend server URL.

   ```bash
   VITE_API_BASE_URL=YOUR_BACKEND_URL
   ```

4. **Start the Development Server:**

   ```bash
   pnpm run dev
   ```

   The app will be running at `http://localhost:5173`.

## 📜 Available Scripts

- `pnpm run dev`: Starts the development server using Vite.
- `pnpm run build`: Compiles TypeScript and builds the app for production.
- `pnpm run preview`: Bootstraps a local web server that serves the production build.
- `pnpm run lint`: Runs ESLint to catch code quality issues.
- `pnpm run format`: Formats code using Prettier.
- `pnpm run typecheck`: Runs TypeScript compiler check without emitting files.
