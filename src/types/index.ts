export type UserRole = 'admin' | 'manager' | 'employee';

export type ExpenseStatus = 'pending' | 'approved' | 'rejected' | 'in_progress';

export type ExpenseCategory = 
  | 'Travel'
  | 'Food'
  | 'Accommodation'
  | 'Transportation'
  | 'Office Supplies'
  | 'Client Entertainment'
  | 'Training'
  | 'Other';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  managerId?: string;
  department?: string;
  isManagerApprover?: boolean;
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  country: string;
  currency: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  currency: string;
  amountInCompanyCurrency?: number;
  category: ExpenseCategory;
  description: string;
  date: Date;
  receiptUrl?: string;
  status: ExpenseStatus;
  submittedAt: Date;
  currentApproverId?: string;
  approvalHistory: ApprovalAction[];
  ocrData?: OCRData;
}

export interface ApprovalAction {
  id: string;
  expenseId: string;
  approverId: string;
  approverName: string;
  action: 'approved' | 'rejected';
  comments?: string;
  timestamp: Date;
  step: number;
}

export interface ApprovalRule {
  id: string;
  name: string;
  description?: string;
  thresholdAmount?: number;
  currency: string;
  approvers: ApprovalStep[];
  conditionalRules?: ConditionalRule;
  isActive: boolean;
  createdAt: Date;
}

export interface ApprovalStep {
  step: number;
  approverId: string;
  approverName: string;
  approverRole: UserRole;
}

export interface ConditionalRule {
  type: 'percentage' | 'specific' | 'hybrid';
  percentageRequired?: number;
  specificApproverIds?: string[];
  requireBoth?: boolean;
}

export interface OCRData {
  amount?: number;
  currency?: string;
  date?: Date;
  merchantName?: string;
  category?: ExpenseCategory;
  lineItems?: {
    description: string;
    amount: number;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'expense_submitted' | 'expense_approved' | 'expense_rejected' | 'approval_pending';
  title: string;
  message: string;
  isRead: boolean;
  expenseId?: string;
  createdAt: Date;
}

export interface CurrencyRate {
  base: string;
  rates: {
    [key: string]: number;
  };
}

export interface Country {
  name: {
    common: string;
    official: string;
  };
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
}

