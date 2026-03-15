# Wally - expense tracker

A modern, feature-rich expense tracking application built with React, TypeScript, and Tailwind CSS.

## Features

- 💰 **Transaction Management** - Track income and expenses with ease
- 📊 **Visual Analytics** - Beautiful charts and graphs to visualize your spending
- 🏷️ **Category Organization** - Organize transactions with customizable categories
- 💵 **Budget Tracking** - Set and monitor monthly budgets per category
- 🌙 **Dark Mode** - Eye-friendly dark theme support
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 💾 **Data Backup** - Export and import your financial data
- 🔒 **Privacy First** - All data stored locally in your browser

## Tech Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe code
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Beautiful data visualizations
- **Motion** - Smooth animations
- **date-fns** - Date manipulation
- **Lucide React** - Modern icon library

## Getting Started

## Prerequisites
 
- **Node.js** v18 or higher
- **Python** 3.12 or higher
- **PostgreSQL** installed and running
 
### 1. Clone the Repo
 
```bash
git clone https://github.com/your-team/expense-tracker.git
cd expense-tracker
```
 
### 2. Set Up PostgreSQL
 
Open the PostgreSQL shell and create a database:
 
```bash
# Arch Linux:
sudo -iu postgres psql
 
# macOS (Homebrew):
psql postgres
 
# Windows:
psql -U postgres
```
 
Then run:
 
```sql
CREATE USER expense_user WITH PASSWORD 'expense_pass';
CREATE DATABASE expense_tracker OWNER expense_user;
ALTER USER expense_user CREATEDB;
\q
```
 
### 3. Set Up the Backend
 
```bash
cd backend
 
# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows
 
# Install dependencies
pip install -r requirements.txt
 
# Run migrations
python manage.py migrate
 
# Create an admin account (optional, for the /admin panel)
python manage.py createsuperuser
 
# Start the backend server
python manage.py runserver
```
 
The API will be running at `http://127.0.0.1:8000/api/`.
 
### 4. Set Up the Frontend
 
Open a **new terminal** (keep the backend running):
 
```bash
# From the repo root (not inside backend/)
cd ..
 
# Install dependencies
npm install
 
# Start the dev server
npm run dev
```
 
The app will be running at `http://localhost:3000` (or whatever port Vite assigns).
 
### 5. Use the App
 
1. Open the frontend URL in your browser
2. Click **Sign Up** to create an account
3. Start adding transactions!
 
## Project Structure
 
```
expense-tracker/
├── src/                    ← Frontend (React + TypeScript)
│   ├── components/         ← UI components
│   ├── utils/
│   │   └── api.ts          ← API client (all backend communication)
│   ├── hooks.ts            ← Data hooks (transactions, categories, budgets)
│   ├── types.ts            ← TypeScript interfaces
│   └── App.tsx             ← Main app component
├── backend/                ← Backend (Django + DRF)
│   ├── config/             ← Django project settings
│   │   ├── settings.py
│   │   └── urls.py
│   ├── expenses/           ← Expense tracker app
│   │   ├── models.py       ← Database models
│   │   ├── views.py        ← API endpoints
│   │   ├── serializers.py  ← JSON serialization
│   │   └── urls.py         ← URL routing
│   ├── manage.py
│   └── requirements.txt
├── package.json
├── vite.config.ts
└── README.md
```
 
 
## API Endpoints
 
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register/` | No | Create account |
| POST | `/api/auth/login/` | No | Log in |
| POST | `/api/auth/logout/` | Yes | Log out |
| GET | `/api/auth/me/` | Yes | Get current user |
| GET/POST | `/api/categories/` | Yes | List / create categories |
| GET/PUT/DELETE | `/api/categories/{id}/` | Yes | Category detail |
| GET/POST | `/api/transactions/` | Yes | List / create transactions |
| GET/PUT/DELETE | `/api/transactions/{id}/` | Yes | Transaction detail |
| GET/POST | `/api/budgets/` | Yes | List / create budgets |
| GET/PUT/DELETE | `/api/budgets/{id}/` | Yes | Budget detail |
 
## Build for Production
 
```bash
npm run build
```
 
The built files will be in the `dist` directory.
