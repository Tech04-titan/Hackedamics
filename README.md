# ExpenseFlow - Comprehensive Expense Management System

A modern, feature-rich expense management system built with React, TypeScript, and Tailwind CSS. ExpenseFlow streamlines the expense reimbursement process with multi-level approvals, OCR receipt scanning, currency conversion, and flexible approval workflows.

![ExpenseFlow Banner](https://via.placeholder.com/1200x400/0f172a/6366f1?text=ExpenseFlow+-+Expense+Management+System)

## 🚀 Features

### 🔐 Authentication & User Management
- **Seamless Signup**: Auto-creates company and admin user on first signup
- **Currency Auto-Detection**: Automatically sets company currency based on selected country
- **Role-Based Access Control**: Three distinct roles with specific permissions
  - **Admin**: Full system access, user management, approval rules configuration
  - **Manager**: Team expense approval, team member oversight
  - **Employee**: Expense submission and tracking

### 💼 Expense Submission (Employee)
- **Quick Submission**: Submit expenses with amount, category, description, and date
- **Multi-Currency Support**: Submit expenses in any currency
- **Receipt Upload**: Attach receipt images for verification
- **OCR Technology**: Automatically extracts data from receipts
  - Auto-fills amount, date, merchant name, and category
  - Extracts line items for detailed expense breakdown
  - Supports multiple currencies and formats
- **Expense History**: View all submitted expenses with status tracking

### ✅ Approval Workflow
- **Manager Approval**: Expenses route to assigned manager when configured
- **Sequential Approvals**: Define multi-step approval chains
  - Example: Manager → Finance → Director
  - Each step must approve before moving to the next
- **Conditional Approval Rules**:
  - **Percentage Rule**: Approve if X% of approvers agree (e.g., 60%)
  - **Specific Approver Rule**: Auto-approve if specific person approves (e.g., CFO)
  - **Hybrid Rule**: Combine both with AND/OR logic
- **Threshold-Based Routing**: Different approval flows based on expense amount
- **Approval Comments**: Add notes during approval/rejection
- **Real-Time Notifications**: Instant updates on approval status

### 💰 Currency Management
- **Global Currency Support**: Submit expenses in 200+ currencies
- **Real-Time Conversion**: Automatic conversion to company's base currency
- **API Integration**: Uses live exchange rates from exchangerate-api.com
- **Dual Display**: Shows both original and converted amounts

### 📊 Dashboard & Analytics
- **Role-Specific Dashboards**: Customized views for each user role
- **Visual Analytics**: Charts and graphs for expense tracking
  - Monthly expense trends
  - Category-wise breakdown
  - Approval status distribution
- **Quick Actions**: One-click access to common tasks
- **Recent Activity**: Real-time feed of expense submissions and approvals

### 🎨 Modern Dark Theme UI
- **Elegant Color Palette**:
  - Primary: Indigo (#6366f1) for main actions
  - Secondary: Purple (#8b5cf6) for highlights
  - Accent: Cyan (#06b6d4) for information
  - Success: Green (#10b981) for approvals
  - Warning: Amber (#f59e0b) for pending items
  - Danger: Red (#ef4444) for rejections
- **Smooth Transitions**: Polished animations and hover effects
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Accessible**: WCAG compliant with proper contrast ratios

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Navigation and routing
- **Recharts** - Beautiful data visualization
- **Lucide React** - Icon library

### APIs & Integrations
- **REST Countries API** - Country and currency data
- **Exchange Rate API** - Real-time currency conversion
- **Tesseract.js** - OCR for receipt scanning

### State Management
- **React Context API** - Global state management
- **LocalStorage** - Data persistence (no database required)

### Development Tools
- **Create React App** - Project scaffolding
- **React Hook Form** - Form handling
- **React Hot Toast** - Notifications
- **React Dropzone** - File upload
- **Date-fns** - Date formatting

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone or Navigate to the Project**
   ```bash
   cd expense-management-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Development Server**
   ```bash
   npm start
   ```

4. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically reload on code changes

## 🎯 Getting Started

### First Time Setup

1. **Sign Up**
   - Go to the signup page
   - Enter your name, email, and password
   - Select your country (this sets your company's currency)
   - An admin account and company are auto-created

2. **Create Users**
   - Navigate to User Management (admin only)
   - Add employees and managers
   - Assign managers to employees
   - Enable "Manager is Approver" if needed

3. **Configure Approval Rules**
   - Go to Approval Rules (admin only)
   - Create rules for different scenarios
   - Set thresholds, sequential approvers, and conditions
   - Activate rules

### For Employees

1. **Submit an Expense**
   - Click "Submit Expense"
   - Upload a receipt (optional but recommended for OCR)
   - Review auto-filled data or enter manually
   - Select currency, category, and add description
   - Submit for approval

2. **Track Expenses**
   - View "My Expenses" for complete history
   - Check status: Pending, In Progress, Approved, or Rejected
   - View approval history and comments

### For Managers

1. **Review Pending Approvals**
   - Check "Pending Approvals" for expenses awaiting review
   - View expense details and receipts
   - Approve or reject with comments
   - Track team expense trends

2. **Monitor Team**
   - View "Team Expenses" for all team submissions
   - Analyze spending patterns
   - Identify areas for cost optimization

### For Admins

1. **Manage Users**
   - Create, edit, or delete users
   - Assign roles and managers
   - Organize by departments

2. **Configure Workflows**
   - Set up approval rules
   - Define sequential approvers
   - Create conditional rules
   - Set threshold amounts

3. **System Overview**
   - Monitor all expenses across the company
   - View analytics and reports
   - Override approvals when necessary

## 📱 Page Guide

### Authentication Pages
- **Login** - Sign in with email and password
- **Signup** - Create new company account
- **Forgot Password** - Request password reset

### Employee Pages
- **Dashboard** - Overview of submitted expenses
- **Submit Expense** - Create new expense claim with OCR
- **My Expenses** - View and track all submissions

### Manager Pages
- **Dashboard** - Team overview and pending approvals
- **Pending Approvals** - Review and approve/reject expenses
- **Team Expenses** - Complete team expense history

### Admin Pages
- **Dashboard** - System-wide analytics and overview
- **User Management** - Create and manage users
- **Approval Rules** - Configure approval workflows
- **All Expenses** - View all company expenses
- **Company Settings** - Update company information

### Common Pages
- **Profile** - Update personal information
- **Notifications** - View all notifications
- **Help & Support** - FAQs and contact support

## 🔑 Role Permissions

| Feature | Admin | Manager | Employee |
|---------|-------|---------|----------|
| Submit Expenses | ✅ | ✅ | ✅ |
| View Own Expenses | ✅ | ✅ | ✅ |
| Approve/Reject Expenses | ✅ | ✅ | ❌ |
| View Team Expenses | ✅ | ✅ | ❌ |
| View All Expenses | ✅ | ❌ | ❌ |
| Create Users | ✅ | ❌ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ |
| Configure Approval Rules | ✅ | ❌ | ❌ |
| Company Settings | ✅ | ❌ | ❌ |
| Override Approvals | ✅ | ❌ | ❌ |

## 🎨 Design System

### Color Scheme
```css
/* Background Colors */
--dark-bg: #0f172a (Main background)
--dark-card: #1e293b (Card background)
--dark-hover: #334155 (Hover states)
--dark-border: #475569 (Borders)

/* Primary Colors */
--primary: #6366f1 (Indigo - Main actions)
--primary-hover: #4f46e5
--primary-light: #818cf8

/* Secondary Colors */
--secondary: #8b5cf6 (Purple - Highlights)
--accent: #06b6d4 (Cyan - Information)
--success: #10b981 (Green - Approvals)
--warning: #f59e0b (Amber - Pending)
--danger: #ef4444 (Red - Rejections)
```

### Typography
- **Font Family**: System fonts for optimal performance
- **Headings**: Bold, white color
- **Body Text**: Gray-300 for readability
- **Labels**: Gray-400 for subtle information

## 🔄 Approval Workflow Examples

### Example 1: Simple Manager Approval
```
Employee submits → Manager approves → Approved ✅
```

### Example 2: Multi-Level Sequential
```
Employee submits → Manager → Finance → Director → Approved ✅
```

### Example 3: Percentage Rule
```
Employee submits → 5 Approvers
→ 3 approve (60% threshold met) → Approved ✅
```

### Example 4: Specific Approver
```
Employee submits → Multiple Approvers
→ CFO approves → Auto-approved ✅
```

### Example 5: Hybrid (Percentage OR Specific)
```
Employee submits → Multiple Approvers
→ Either 60% approve OR CFO approves → Approved ✅
```

### Example 6: Combined Flows
```
Employee submits → Manager (required)
→ If amount > $1000 → Finance Team (60% rule) → Approved ✅
```

## 🌟 Key Features Explained

### OCR Receipt Scanning
The OCR feature uses Tesseract.js to extract data from receipt images:
1. Upload receipt image (JPG, PNG, etc.)
2. System processes image and extracts:
   - Amount and currency
   - Date of expense
   - Merchant/vendor name
   - Individual line items
   - Expense category (auto-categorized)
3. Review and edit extracted data
4. Submit with confidence

### Currency Conversion
Real-time currency conversion ensures accurate reporting:
1. Employee submits in any currency (e.g., EUR)
2. System fetches current exchange rate
3. Converts to company currency (e.g., USD)
4. Displays both amounts for transparency
5. Managers see converted amount for approval

### Notification System
Stay informed with real-time notifications:
- New expense submitted (for approvers)
- Expense approved (for employees)
- Expense rejected with reason (for employees)
- Approval request moved to next step
- Bell icon shows unread count
- Click to view expense details

## 📊 Data Storage

This application uses **localStorage** for data persistence. No database or backend is required, making it:
- Easy to set up and run
- Perfect for demos and prototypes
- Suitable for small teams
- Data persists across browser sessions

**Note**: Data is stored in the browser. Clearing browser data will reset the application.

## 🚧 Future Enhancements

Potential features for future versions:
- Backend API integration
- Real database support (PostgreSQL, MongoDB)
- Email notifications
- PDF report generation
- Advanced analytics and forecasting
- Bulk expense upload
- Mobile app (React Native)
- Integration with accounting software
- Automated expense policies
- Mileage tracking
- Credit card integration

## 🤝 Contributing

Contributions are welcome! Please feel free to:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Support

For questions or issues:
- Email: support@expenseflow.com
- Documentation: Full guides available in Help section
- Issues: Report bugs via GitHub Issues

## 🎉 Acknowledgments

- Design inspiration from modern SaaS applications
- Color palette based on Tailwind CSS
- Icons from Lucide React
- OCR powered by Tesseract.js
- Exchange rates from ExchangeRate-API

---

Built with ❤️ using React, TypeScript, and Tailwind CSS

**ExpenseFlow** - Simplifying expense management, one receipt at a time.

