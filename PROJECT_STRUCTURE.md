# Project Structure

```
expense-management-system/
│
├── public/
│   └── index.html                 # HTML template
│
├── src/
│   ├── components/                # Reusable components
│   │   ├── Layout/
│   │   │   ├── Header.tsx        # Top navigation bar
│   │   │   ├── Sidebar.tsx       # Side navigation menu
│   │   │   └── MainLayout.tsx    # Main layout wrapper
│   │   │
│   │   └── UI/                   # UI components
│   │       ├── Button.tsx        # Styled button
│   │       ├── Card.tsx          # Card container
│   │       ├── Input.tsx         # Form input
│   │       ├── Select.tsx        # Dropdown select
│   │       ├── Modal.tsx         # Modal dialog
│   │       └── Table.tsx         # Data table
│   │
│   ├── context/
│   │   └── AppContext.tsx        # Global state management
│   │
│   ├── pages/                    # Page components
│   │   ├── Auth/
│   │   │   ├── LoginPage.tsx             # Login
│   │   │   ├── SignupPage.tsx            # Signup
│   │   │   └── ForgotPasswordPage.tsx    # Password reset
│   │   │
│   │   ├── Employee/
│   │   │   ├── EmployeeDashboard.tsx     # Employee dashboard
│   │   │   ├── SubmitExpense.tsx         # Submit expense
│   │   │   └── MyExpenses.tsx            # View expenses
│   │   │
│   │   ├── Manager/
│   │   │   ├── ManagerDashboard.tsx      # Manager dashboard
│   │   │   └── PendingApprovals.tsx      # Approve expenses
│   │   │
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.tsx        # Admin dashboard
│   │   │   ├── UserManagement.tsx        # Manage users
│   │   │   └── ApprovalRules.tsx         # Configure rules
│   │   │
│   │   └── Common/
│   │       ├── Profile.tsx               # User profile
│   │       ├── Notifications.tsx         # Notifications
│   │       └── Help.tsx                  # Help & support
│   │
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   │
│   ├── utils/                    # Utility functions
│   │   ├── api.ts               # API calls (countries, currency)
│   │   ├── ocr.ts               # OCR processing
│   │   └── formatters.ts        # Data formatters
│   │
│   ├── App.tsx                  # Main app component
│   ├── index.tsx               # App entry point
│   └── index.css               # Global styles
│
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # Tailwind config
├── postcss.config.js          # PostCSS config
├── .gitignore                 # Git ignore rules
├── .env.example               # Environment variables
├── README.md                  # Full documentation
├── QUICK_START.md             # Quick start guide
└── PROJECT_STRUCTURE.md       # This file
```

## 📁 Directory Breakdown

### `/src/components/`
Reusable UI components used throughout the application.

- **Layout**: Navigation and page structure
- **UI**: Generic UI elements (buttons, inputs, cards, etc.)

### `/src/pages/`
Full page components organized by user role.

- **Auth**: Authentication pages (login, signup, forgot password)
- **Employee**: Employee-specific pages (dashboard, submit expense, my expenses)
- **Manager**: Manager pages (dashboard, approvals)
- **Admin**: Admin pages (dashboard, user management, approval rules)
- **Common**: Shared pages (profile, notifications, help)

### `/src/context/`
Global state management using React Context API.

- **AppContext**: Manages users, expenses, approvals, notifications

### `/src/types/`
TypeScript type definitions and interfaces.

- User, Company, Expense, ApprovalRule, etc.

### `/src/utils/`
Helper functions and utilities.

- **api.ts**: External API calls (countries, exchange rates)
- **ocr.ts**: Receipt OCR processing with Tesseract.js
- **formatters.ts**: Date, currency, and status formatting

## 🎨 Styling

The application uses **Tailwind CSS** for styling with a custom dark theme configuration in `tailwind.config.js`.

### Key Classes
- `bg-dark-bg` - Main background
- `bg-dark-card` - Card backgrounds
- `bg-dark-hover` - Hover states
- `border-dark-border` - Borders
- `text-primary` - Primary color
- `text-success` - Success state
- `text-warning` - Warning state
- `text-danger` - Error state

## 🔄 Data Flow

```
User Action (UI)
    ↓
Component Event Handler
    ↓
Context Method (AppContext)
    ↓
State Update
    ↓
LocalStorage Persistence
    ↓
UI Re-render
```

## 🚀 Key Features by File

| Feature | Primary Files |
|---------|--------------|
| Authentication | `LoginPage.tsx`, `SignupPage.tsx`, `AppContext.tsx` |
| Expense Submission | `SubmitExpense.tsx`, `ocr.ts` |
| OCR Processing | `ocr.ts`, `SubmitExpense.tsx` |
| Currency Conversion | `api.ts`, `AppContext.tsx` |
| Approval Workflow | `PendingApprovals.tsx`, `AppContext.tsx` |
| User Management | `UserManagement.tsx`, `AppContext.tsx` |
| Approval Rules | `ApprovalRules.tsx`, `AppContext.tsx` |
| Notifications | `Notifications.tsx`, `Header.tsx`, `AppContext.tsx` |

## 📱 Routing Structure

```
/                          → Redirect to /dashboard
/login                     → Login page
/signup                    → Signup page
/forgot-password           → Password reset
/dashboard                 → Role-based dashboard
/expenses/submit           → Submit expense (Employee)
/expenses                  → My expenses (Employee)
/approvals                 → Pending approvals (Manager, Admin)
/team-expenses             → Team expenses (Manager)
/all-expenses              → All expenses (Admin)
/users                     → User management (Admin)
/approval-rules            → Approval rules (Admin)
/profile                   → User profile (All)
/notifications             → Notifications (All)
/help                      → Help & support (All)
```

## 🔐 Protected Routes

Routes are protected based on user role using the `ProtectedRoute` component in `App.tsx`.

## 💾 Data Storage

All data is stored in **localStorage** with the following keys:

- `currentUser` - Current logged-in user
- `company` - Company information
- `users` - All users
- `expenses` - All expenses
- `approvalRules` - Approval rules
- `notifications` - User notifications

## 🎯 State Management

The app uses **React Context API** for global state:

- `AppProvider` wraps the entire app
- `useApp()` hook provides access to state and methods
- All CRUD operations handled in context
- Automatic localStorage persistence

## 🔧 Configuration Files

- **package.json**: Dependencies and scripts
- **tsconfig.json**: TypeScript compiler options
- **tailwind.config.js**: Tailwind CSS theme customization
- **postcss.config.js**: PostCSS plugins configuration

## 📦 Dependencies

### Production
- react, react-dom - UI library
- react-router-dom - Routing
- typescript - Type safety
- tailwindcss - Styling
- axios - HTTP client
- tesseract.js - OCR
- recharts - Charts
- react-hot-toast - Notifications
- date-fns - Date formatting
- lucide-react - Icons

### Development
- @types/* - TypeScript definitions
- react-scripts - Build tools

---

This structure ensures:
✅ Clear separation of concerns
✅ Easy to navigate and maintain
✅ Scalable architecture
✅ Reusable components
✅ Type-safe development

