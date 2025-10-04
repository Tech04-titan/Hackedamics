import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Receipt, DollarSign, Settings, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Table } from '../../components/UI/Table';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { users, expenses, approvalRules, company } = useApp();

  const stats = {
    totalUsers: users.length,
    totalExpenses: expenses.length,
    pendingExpenses: expenses.filter(e => e.status === 'pending' || e.status === 'in_progress').length,
    totalAmount: expenses
      .filter(e => e.status === 'approved')
      .reduce((sum, e) => sum + (e.amountInCompanyCurrency || e.amount), 0),
  };

  // Category data for pie chart
  const categoryData = Object.entries(
    expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  // Monthly data for bar chart
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.amount += expense.amountInCompanyCurrency || expense.amount;
    } else {
      acc.push({ month, amount: expense.amountInCompanyCurrency || expense.amount });
    }
    return acc;
  }, [] as { month: string; amount: number }[]);

  const recentExpenses = expenses.slice(0, 5);

  const columns = [
    {
      key: 'id',
      label: 'ID',
      render: (value: string) => (
        <span className="font-mono text-xs">#{value.slice(-6)}</span>
      ),
    },
    {
      key: 'employeeName',
      label: 'Employee',
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
      <div className="relative">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Overview of your expense management system</p>
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-sm -z-10"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-indigo-600/20 to-indigo-600/5 hover:from-indigo-500/30 hover:to-indigo-500/10 transition-all transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
            </div>
            <div className="p-3 bg-primary/20 rounded-lg">
              <Users size={32} className="text-primary-light" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-600/5 hover:from-purple-500/30 hover:to-purple-500/10 transition-all transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Expenses</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.totalExpenses}</p>
            </div>
            <div className="p-3 bg-secondary/20 rounded-lg">
              <Receipt size={32} className="text-secondary-light" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-amber-600/20 to-amber-600/5 hover:from-amber-500/30 hover:to-amber-500/10 transition-all transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.pendingExpenses}</p>
            </div>
            <div className="p-3 bg-warning/20 rounded-lg">
              <Settings size={32} className="text-warning-light animate-spin-slow" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-600/20 to-emerald-600/5 hover:from-emerald-500/30 hover:to-emerald-500/10 transition-all transform hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Approved Total</p>
              <p className="text-2xl font-bold text-white mt-2">
                {formatCurrency(stats.totalAmount, company?.currency || 'USD')}
              </p>
            </div>
            <div className="p-3 bg-success/20 rounded-lg">
              <DollarSign size={32} className="text-success-light" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Monthly Expenses" subtitle="Approved expenses by month">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="amount" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Expenses by Category" subtitle="Distribution of expense categories">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Expenses */}
      <Card
        title="Recent Expenses"
        subtitle="Latest expense submissions"
        action={
          <Link to="/all-expenses">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        }
      >
        <Table columns={columns} data={recentExpenses} />
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/users">
          <Card className="hover:bg-dark-hover transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Users size={24} className="text-primary-light" />
              </div>
              <div>
                <p className="text-white font-semibold">Manage Users</p>
                <p className="text-gray-400 text-sm">Add or edit users and roles</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/approval-rules">
          <Card className="hover:bg-dark-hover transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-secondary/20 rounded-lg">
                <Settings size={24} className="text-secondary-light" />
              </div>
              <div>
                <p className="text-white font-semibold">Approval Rules</p>
                <p className="text-gray-400 text-sm">Configure approval workflows</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/settings">
          <Card className="hover:bg-dark-hover transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Settings size={24} className="text-accent-light" />
              </div>
              <div>
                <p className="text-white font-semibold">Company Settings</p>
                <p className="text-gray-400 text-sm">Update company information</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

