import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  Company,
  Expense,
  ApprovalRule,
  Notification,
  UserRole,
} from '../types';

interface AppContextType {
  currentUser: User | null;
  company: Company | null;
  users: User[];
  expenses: Expense[];
  approvalRules: ApprovalRule[];
  notifications: Notification[];
  
  // Auth
  login: (email: string, password: string, role: 'admin' | 'manager' | 'employee') => Promise<boolean>;
  logout: () => void;
  signup: (name: string, email: string, password: string, country: string, role: 'admin' | 'manager' | 'employee') => Promise<boolean>;
  
  // User Management
  createUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  
  // Expense Management
  submitExpense: (expense: Omit<Expense, 'id' | 'employeeId' | 'employeeName' | 'status' | 'submittedAt' | 'approvalHistory'>) => void;
  approveExpense: (expenseId: string, comments?: string) => void;
  rejectExpense: (expenseId: string, comments: string) => void;
  
  // Approval Rules
  createApprovalRule: (rule: Omit<ApprovalRule, 'id' | 'createdAt'>) => void;
  updateApprovalRule: (ruleId: string, updates: Partial<ApprovalRule>) => void;
  deleteApprovalRule: (ruleId: string) => void;
  
  // Notifications
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [approvalRules, setApprovalRules] = useState<ApprovalRule[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedCompany = localStorage.getItem('company');
    const savedUsers = localStorage.getItem('users');
    const savedExpenses = localStorage.getItem('expenses');
    const savedRules = localStorage.getItem('approvalRules');
    const savedNotifications = localStorage.getItem('notifications');

    if (savedUser) setCurrentUser(JSON.parse(savedUser));
    if (savedCompany) setCompany(JSON.parse(savedCompany));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedRules) setApprovalRules(JSON.parse(savedRules));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (company) localStorage.setItem('company', JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('approvalRules', JSON.stringify(approvalRules));
  }, [approvalRules]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const login = async (email: string, password: string, role: 'admin' | 'manager' | 'employee'): Promise<boolean> => {
    // Simple authentication - in production, this would be a real API call
    const user = users.find(u => u.email === email && u.role === role);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const signup = async (name: string, email: string, password: string, country: string, role: 'admin' | 'manager' | 'employee'): Promise<boolean> => {
    try {
      // Fetch currency for selected country
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,currencies');
      const countries = await response.json();
      const selectedCountry = countries.find((c: any) => 
        c.name.common === country || c.name.official === country
      );

      const currency = selectedCountry 
        ? Object.keys(selectedCountry.currencies)[0]
        : 'USD';

      // Create new company
      const newCompany: Company = {
        id: Date.now().toString(),
        name: `${name}'s Company`,
        country,
        currency,
        createdAt: new Date(),
      };

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role,
        createdAt: new Date(),
      };

      setCompany(newCompany);
      setCurrentUser(newUser);
      setUsers([newUser]);

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setUsers([...users, newUser]);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const submitExpense = (expenseData: Omit<Expense, 'id' | 'employeeId' | 'employeeName' | 'status' | 'submittedAt' | 'approvalHistory'>) => {
    if (!currentUser) return;

    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      status: 'pending',
      submittedAt: new Date(),
      approvalHistory: [],
    };

    // Determine approval flow
    const user = users.find(u => u.id === currentUser.id);
    if (user?.managerId && user?.isManagerApprover) {
      newExpense.currentApproverId = user.managerId;
    }

    setExpenses([...expenses, newExpense]);

    // Create notification for approver
    if (newExpense.currentApproverId) {
      const notification: Notification = {
        id: Date.now().toString(),
        userId: newExpense.currentApproverId,
        type: 'approval_pending',
        title: 'New Expense Awaiting Approval',
        message: `${currentUser.name} submitted an expense for approval`,
        isRead: false,
        expenseId: newExpense.id,
        createdAt: new Date(),
      };
      setNotifications([...notifications, notification]);
    }
  };

  const approveExpense = (expenseId: string, comments?: string) => {
    if (!currentUser) return;

    setExpenses(expenses.map(expense => {
      if (expense.id === expenseId) {
        const approvalAction = {
          id: Date.now().toString(),
          expenseId,
          approverId: currentUser.id,
          approverName: currentUser.name,
          action: 'approved' as const,
          comments,
          timestamp: new Date(),
          step: expense.approvalHistory.length + 1,
        };

        return {
          ...expense,
          status: 'approved' as const,
          approvalHistory: [...expense.approvalHistory, approvalAction],
        };
      }
      return expense;
    }));

    // Create notification for employee
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
      const notification: Notification = {
        id: Date.now().toString(),
        userId: expense.employeeId,
        type: 'expense_approved',
        title: 'Expense Approved',
        message: `Your expense has been approved by ${currentUser.name}`,
        isRead: false,
        expenseId,
        createdAt: new Date(),
      };
      setNotifications([...notifications, notification]);
    }
  };

  const rejectExpense = (expenseId: string, comments: string) => {
    if (!currentUser) return;

    setExpenses(expenses.map(expense => {
      if (expense.id === expenseId) {
        const approvalAction = {
          id: Date.now().toString(),
          expenseId,
          approverId: currentUser.id,
          approverName: currentUser.name,
          action: 'rejected' as const,
          comments,
          timestamp: new Date(),
          step: expense.approvalHistory.length + 1,
        };

        return {
          ...expense,
          status: 'rejected' as const,
          approvalHistory: [...expense.approvalHistory, approvalAction],
        };
      }
      return expense;
    }));

    // Create notification for employee
    const expense = expenses.find(e => e.id === expenseId);
    if (expense) {
      const notification: Notification = {
        id: Date.now().toString(),
        userId: expense.employeeId,
        type: 'expense_rejected',
        title: 'Expense Rejected',
        message: `Your expense has been rejected by ${currentUser.name}`,
        isRead: false,
        expenseId,
        createdAt: new Date(),
      };
      setNotifications([...notifications, notification]);
    }
  };

  const createApprovalRule = (ruleData: Omit<ApprovalRule, 'id' | 'createdAt'>) => {
    const newRule: ApprovalRule = {
      ...ruleData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setApprovalRules([...approvalRules, newRule]);
  };

  const updateApprovalRule = (ruleId: string, updates: Partial<ApprovalRule>) => {
    setApprovalRules(approvalRules.map(rule => 
      rule.id === ruleId ? { ...rule, ...updates } : rule
    ));
  };

  const deleteApprovalRule = (ruleId: string) => {
    setApprovalRules(approvalRules.filter(rule => rule.id !== ruleId));
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications(notifications.map(notif => 
      notif.userId === currentUser.id ? { ...notif, isRead: true } : notif
    ));
  };

  const value: AppContextType = {
    currentUser,
    company,
    users,
    expenses,
    approvalRules,
    notifications,
    login,
    logout,
    signup,
    createUser,
    updateUser,
    deleteUser,
    submitExpense,
    approveExpense,
    rejectExpense,
    createApprovalRule,
    updateApprovalRule,
    deleteApprovalRule,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

