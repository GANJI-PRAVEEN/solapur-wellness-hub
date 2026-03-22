<<<<<<< HEAD
# Solapur Wellness Hub
=======
# Welcome to our project
>>>>>>> f7de59484dc22c1fba65d0d05a48d0a48a552201

Solapur Wellness Hub is a comprehensive Smart Public Health Management System intended to digitally empower the Solapur Municipal Corporation (SMC). It features a robust multi-role dashboard for citizens and medical staff, real-time analytics, online patient reports, and full multilingual support natively built into the client interface.

## 🚀 Features

- **Multi-Language Support Interface**: Effortlessly switch between English, Marathi, Hindi, Urdu, and Kannada on the fly without page reloads using custom React Context mapping.
- **Citizen Portal**: 
  - **Online Test Reports**: Upload, view (via secure objectURLs), and locally download medical test reports and scans.
  - **Medical Bills**: View hospital treatment bills and process dummy payments.
  - **Appointment Booking**: Request doctor appointments dynamically mapped by ward and specialty.
- **Staff / Admin Dashboard**: 
  - **Patient Records directory**: Allows doctors to visualize cases and review online uploaded reports from citizens seamlessly.
  - **Analytical Overview**: Metrics counting total active alerts, available beds, real-time disease outbreak charts, and active daily cases.

## 🛠️ Tech Stack

This project is entirely modern, utilizing cutting-edge tools optimized for fast deployment, rigid typed safety, and accessible UI structures.

* **Frontend Framework**: [React 18](https://react.dev/) using [Vite](https://vitejs.dev/) as the fast-refresh dev server and bundler.
* **Language**: [TypeScript](https://www.typescriptlang.org/) for strong static typing and error prevention.
* **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first responsive cascading styles.
* **Component Library**: [Shadcn UI](https://ui.shadcn.com/) (using Radix UI accessible primitives) for components like Selects, Modals, Forms, and Avatars.
* **Routing**: [React Router v6](https://reactrouter.com/) for modular and protected client-side route paths.
* **Icons**: [Lucide React](https://lucide.dev/) for crisp, scalable SVG icons.
* **Data Fetching / State**: [TanStack React Query](https://tanstack.com/query/latest) for robust async state management.
* **Mapping**: `leaflet` & `react-leaflet` mapping engines.
* **Charts**: `recharts` for robust visual analytics.
* **Testing Engine**: Setup configured for `Vitest` and `Playwright`.

## ⚙️ How to Run Locally

Follow these steps to deploy and run the development environment on your local machine:

### 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18 or higher recommended)
* **npm** or **bun** packet manager

### 2. Installation
To install the dependencies, clone the repository and run:
```bash
# Clone the repository
git clone https://github.com/GANJI-PRAVEEN/solapur-wellness-hub.git

# Navigate into the directory
cd solapur-wellness-hub

# Install all necessary dependencies
npm install
```

### 3. Start Development Server
Once dependencies are properly installed, boot up the local Vite dev server:
```bash
npm run dev
```

### 4. Viewing the Application
The development server will expose the application locally, by default running on port 8080.
Open your browser and navigate to:
`http://localhost:8080`

### 5. Production Build
If you'd like to build the project for a live production environment (creating a deployable `./dist` folder):
```bash
npm run build
```
