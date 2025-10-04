import { format, formatDistanceToNow } from 'date-fns';

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy hh:mm a');
};

export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'text-success-light bg-success/10 border-success';
    case 'rejected':
      return 'text-danger-light bg-danger/10 border-danger';
    case 'pending':
      return 'text-warning-light bg-warning/10 border-warning';
    case 'in_progress':
      return 'text-accent-light bg-accent/10 border-accent';
    default:
      return 'text-gray-400 bg-gray-800 border-gray-600';
  }
};

export const getRoleColor = (role: string): string => {
  switch (role) {
    case 'admin':
      return 'text-primary-light bg-primary/10 border-primary';
    case 'manager':
      return 'text-secondary-light bg-secondary/10 border-secondary';
    case 'employee':
      return 'text-accent-light bg-accent/10 border-accent';
    default:
      return 'text-gray-400 bg-gray-800 border-gray-600';
  }
};

