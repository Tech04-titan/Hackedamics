import React from 'react';
import { Link } from 'react-router-dom';
import { Receipt, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Table } from '../../components/UI/Table';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

export const EmployeeDashboard: React.FC = () => {
  const { currentUser, expenses, company } = useApp();

  const myExpenses = expenses.filter(e => e.employeeId === currentUser?.id);
  
  const stats = {
    total: myExpenses.length,
    pending: myExpenses.filter(e => e.status === 'pending' || e.status === 'in_progress').length,
    approved: myExpenses.filter(e => e.status === 'approved').length,
    rejected: myExpenses.filter(e => e.status === 'rejected').length,
  };

  const recentExpenses = myExpenses.slice(0, 5);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: string) => (
        <span className="font-mono text-xs">#{value.slice(-6)}</span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (value: number, row: any) => (
        <span className="font-semibold">{formatCurrency(value, row.currency)}</span>
      ),
    },
    {
      key: 'category',
      label: 'Category',
    },
    {
      key: 'date',
      label: 'Date',
      render: (value: Date) => formatDate(value),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between relative">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back, {currentUser?.name}!</p>
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-sm"></div>
        <Link to="/expenses/submit">
          <Button variant="primary" className="relative z-10 hover:scale-105 transition-transform">
            <Plus size={20} />
            Submit Expense
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-indigo-600/20 to-indigo-600/5 hover:from-indigo-500/30 hover:to-indigo-500/10 transition-all transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Submitted</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>
            <div className="p-3 bg-primary/20 rounded-lg">
              <Receipt size={32} className="text-primary-light" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-600/20 to-amber-600/5 hover:from-amber-500/30 hover:to-amber-500/10 transition-all transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.pending}</p>
            </div>
            <div className="p-3 bg-warning/20 rounded-lg">
              <Clock size={32} className="text-warning-light" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600/20 to-emerald-600/5 hover:from-emerald-500/30 hover:to-emerald-500/10 transition-all transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.approved}</p>
            </div>
            <div className="p-3 bg-success/20 rounded-lg">
              <CheckCircle size={32} className="text-success-light" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-600/20 to-red-600/5 hover:from-red-500/30 hover:to-red-500/10 transition-all transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.rejected}</p>
            </div>
            <div className="p-3 bg-danger/20 rounded-lg">
              <XCircle size={32} className="text-danger-light" />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card
        title="Recent Expenses"
        subtitle="Your most recent expense submissions"
        action={
          <Link to="/expenses">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        }
      >
        <Table columns={columns} data={recentExpenses} />
      </Card>
    </div>
  );
};

