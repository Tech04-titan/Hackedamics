import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Table } from '../../components/UI/Table';
import { Modal } from '../../components/UI/Modal';
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '../../utils/formatters';
import { Expense } from '../../types';

export const MyExpenses: React.FC = () => {
  const { currentUser, expenses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showModal, setShowModal] = useState(false);

  const myExpenses = expenses.filter(e => e.employeeId === currentUser?.id);

  const filteredExpenses = myExpenses.filter(expense => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      key: 'id',
      label: 'Expense ID',
      render: (value: string) => (
        <span className="font-mono text-xs">#{value.slice(-8)}</span>
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
      render: (value: string) => (
        <span className="px-2 py-1 bg-accent/10 text-accent-light rounded text-xs">
          {value}
        </span>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value: string) => (
        <span className="max-w-xs truncate block">{value}</span>
      ),
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

  const handleRowClick = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">My Expenses</h1>
          <p className="text-gray-400 mt-1">View and track your expense submissions</p>
        </div>
        <Link to="/expenses/submit">
          <Button variant="primary">
            <Plus size={20} />
            Submit Expense
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search by ID, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={20} />}
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Status' },
              { value: 'pending', label: 'Pending' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'approved', label: 'Approved' },
              { value: 'rejected', label: 'Rejected' },
            ]}
          />
        </div>
      </Card>

      {/* Expenses Table */}
      <Card>
        <Table columns={columns} data={filteredExpenses} onRowClick={handleRowClick} />
      </Card>

      {/* Expense Details Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Expense Details"
        size="lg"
      >
        {selectedExpense && (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(selectedExpense.status)}`}>
                {selectedExpense.status.charAt(0).toUpperCase() + selectedExpense.status.slice(1).replace('_', ' ')}
              </span>
              <span className="text-gray-400 text-sm">
                ID: #{selectedExpense.id.slice(-8)}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Amount</p>
                <p className="text-white font-semibold text-lg">
                  {formatCurrency(selectedExpense.amount, selectedExpense.currency)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Category</p>
                <p className="text-white font-medium">{selectedExpense.category}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Date</p>
                <p className="text-white font-medium">{formatDate(selectedExpense.date)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Submitted</p>
                <p className="text-white font-medium">{formatDateTime(selectedExpense.submittedAt)}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Description</p>
              <p className="text-white bg-dark-hover p-4 rounded-lg">{selectedExpense.description}</p>
            </div>

            {/* Receipt */}
            {selectedExpense.receiptUrl && (
              <div>
                <p className="text-gray-400 text-sm mb-2">Receipt</p>
                <img
                  src={selectedExpense.receiptUrl}
                  alt="Receipt"
                  className="w-full max-h-64 object-contain bg-dark-hover rounded-lg"
                />
              </div>
            )}

            {/* Approval History */}
            {selectedExpense.approvalHistory.length > 0 && (
              <div>
                <p className="text-gray-400 text-sm mb-3">Approval History</p>
                <div className="space-y-3">
                  {selectedExpense.approvalHistory.map((action) => (
                    <div
                      key={action.id}
                      className="bg-dark-hover p-4 rounded-lg border-l-4 border-primary"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{action.approverName}</span>
                        <span className="text-gray-400 text-sm">{formatDateTime(action.timestamp)}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            action.action === 'approved'
                              ? 'bg-success/20 text-success-light'
                              : 'bg-danger/20 text-danger-light'
                          }`}
                        >
                          {action.action.charAt(0).toUpperCase() + action.action.slice(1)}
                        </span>
                        <span className="text-gray-400 text-xs">Step {action.step}</span>
                      </div>
                      {action.comments && (
                        <p className="text-gray-300 text-sm">{action.comments}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

