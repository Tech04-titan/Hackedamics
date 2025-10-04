import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Table } from '../../components/UI/Table';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';

export const ManagerDashboard: React.FC = () => {
  const { currentUser, expenses, users } = useApp();

  // Get team members
  const teamMembers = users.filter(u => u.managerId === currentUser?.id);
  const teamExpenses = expenses.filter(e => 
    teamMembers.some(member => member.id === e.employeeId)
  );

  const pendingApprovals = expenses.filter(
    e => e.currentApproverId === currentUser?.id && (e.status === 'pending' || e.status === 'in_progress')
  );

  const stats = {
    pending: pendingApprovals.length,
    approved: teamExpenses.filter(e => e.approvalHistory.some(a => a.approverId === currentUser?.id && a.action === 'approved')).length,
    rejected: teamExpenses.filter(e => e.approvalHistory.some(a => a.approverId === currentUser?.id && a.action === 'rejected')).length,
    teamSize: teamMembers.length,
  };

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
      <div>
        <h1 className="text-3xl font-bold text-white">Manager Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage team expenses and approvals</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-warning/20 to-warning/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending Approvals</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.pending}</p>
            </div>
            <div className="p-3 bg-warning/20 rounded-lg">
              <Clock size={32} className="text-warning-light" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-success/20 to-success/5">
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

        <Card className="bg-gradient-to-br from-danger/20 to-danger/5">
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

        <Card className="bg-gradient-to-br from-accent/20 to-accent/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Team Members</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.teamSize}</p>
            </div>
            <div className="p-3 bg-accent/20 rounded-lg">
              <Users size={32} className="text-accent-light" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card
        title="Pending Approvals"
        subtitle="Expenses waiting for your approval"
        action={
          <Link to="/approvals">
            <Button variant="primary" size="sm">
              View All
            </Button>
          </Link>
        }
      >
        <Table columns={columns} data={pendingApprovals.slice(0, 5)} />
      </Card>

      {/* Recent Team Expenses */}
      <Card
        title="Recent Team Expenses"
        subtitle="Latest expenses from your team"
        action={
          <Link to="/team-expenses">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        }
      >
        <Table columns={columns} data={teamExpenses.slice(0, 5)} />
      </Card>
    </div>
  );
};

