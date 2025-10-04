# Quick Start Guide - ExpenseFlow

## 🚀 Installation (3 steps)

```bash
# 1. Navigate to project directory
cd expense-management-system

# 2. Install dependencies
npm install

# 3. Start the app
npm start
```

The app will open at `http://localhost:3000`

## 🎯 First Steps

### 1. Create Your Account
- Click "Sign Up" on the login page
- Fill in your details:
  - **Name**: Your full name
  - **Email**: your@email.com
  - **Country**: Select your country (sets currency)
  - **Password**: Secure password
- You're now an Admin! 🎉

### 2. Add Team Members
- Go to **User Management** from sidebar
- Click **"Add User"**
- Fill in details:
  - Name and email
  - Select role (Manager/Employee)
  - Assign manager (for employees)
  - Check "Manager is Approver" if needed

### 3. Submit Your First Expense
- Switch to Employee view (or create an employee user)
- Click **"Submit Expense"**
- Upload a receipt image (JPG/PNG)
- Watch OCR auto-fill the details! ✨
- Review and submit

## 🎨 Dark Theme Colors

The app uses a beautiful dark theme with vibrant accents:

- **Primary (Indigo)**: Main buttons and actions
- **Success (Green)**: Approved expenses
- **Warning (Amber)**: Pending approvals
- **Danger (Red)**: Rejections
- **Accent (Cyan)**: Information highlights

## 📱 Key Pages

| Page | URL | Who Can Access |
|------|-----|----------------|
| Dashboard | `/dashboard` | Everyone |
| Submit Expense | `/expenses/submit` | Employee |
| My Expenses | `/expenses` | Employee |
| Pending Approvals | `/approvals` | Manager, Admin |
| User Management | `/users` | Admin only |
| Approval Rules | `/approval-rules` | Admin only |

## 💡 Pro Tips

1. **OCR Works Best With**:
   - Clear, well-lit photos
   - Receipts with printed text
   - Minimal background noise

2. **Multi-Currency**:
   - Submit in any currency
   - Auto-converts to company currency
   - Both amounts shown for transparency

3. **Approval Rules**:
   - Set threshold amounts
   - Create sequential flows
   - Use percentage rules for flexibility

4. **Notifications**:
   - Bell icon shows unread count
   - Click notification to view expense
   - Mark all read with one click

## 🔐 Test Accounts

After signup, create these test accounts:

```
Admin (you)
- Full access to everything

Manager (create)
- Email: manager@test.com
- Role: Manager
- Can approve team expenses

Employee (create)
- Email: employee@test.com
- Role: Employee
- Manager: Assign the manager above
- Can submit expenses
```

## 🎭 Testing Workflow

1. **As Employee**: Submit expense with receipt
2. **As Manager**: Go to Pending Approvals
3. **Approve/Reject**: Add comments
4. **As Employee**: Check My Expenses for status

## 🌟 Cool Features to Try

✅ **OCR Magic**: Upload a receipt and watch it auto-fill
✅ **Currency Converter**: Submit in EUR, see USD conversion
✅ **Approval Rules**: Create 60% approval rule
✅ **Sequential Flow**: Manager → Finance → Director
✅ **Dark Theme**: Enjoy the beautiful UI
✅ **Real-time Notifications**: Get instant updates
✅ **Charts & Analytics**: View expense trends

## ❓ Need Help?

- Check the **Help & Support** page in the app
- Read the full **README.md**
- All FAQs answered in the Help section

## 🎉 You're Ready!

Start managing expenses like a pro with ExpenseFlow! 

The system uses localStorage, so your data persists across sessions. No database setup needed!

---

**Happy Expense Managing! 💼✨**

