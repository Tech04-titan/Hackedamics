import React, { useState } from 'react';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Table } from '../../components/UI/Table';
import { Modal } from '../../components/UI/Modal';
import { formatCurrency, formatDate, formatDateTime, getStatusColor } from '../../utils/formatters';
import { Expense } from '../../types';
import toast, { Toaster } from 'react-hot-toast';

export const PendingApprovals: React.FC = () => {
  const { currentUser, expenses, approveExpense, rejectExpense, company } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');

  const pendingApprovals = expenses.filter(
    e => e.currentApproverId === currentUser?.id && (e.status === 'pending' || e.status === 'in_progress')
  );

  const filteredExpenses = pendingApprovals.filter(expense =>
    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      key: 'id',
      label: 'Expense ID',
      render: (value: string) => (
        <span className="font-mono text-xs">#{value.slice(-8)}</span>
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
        <div>
          <span className="font-semibold block">{formatCurrency(value, row.currency)}</span>
          {row.currency !== company?.currency && row.amountInCompanyCurrency && (
            <span className="text-xs text-gray-400">
              {formatCurrency(row.amountInCompanyCurrency, company?.currency || 'USD')}
            </span>
          )}
        </div>
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
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: Expense) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="success"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExpense(row);
              setActionType('approve');
              setShowModal(true);
            }}
          >
            <CheckCircle size={16} />
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedExpense(row);
              setActionType('reject');
              setShowModal(true);
            }}
          >
            <XCircle size={16} />
          </Button>
        </div>
      ),
    },
  ];

  const handleApprove = () => {
    if (selectedExpense) {
      approveExpense(selectedExpense.id, comments);
      toast.success('Expense approved successfully!');
      setShowModal(false);
      setComments('');
      setSelectedExpense(null);
      setActionType(null);
    }
  };

  const handleReject = () => {
    if (selectedExpense && comments.trim()) {
      rejectExpense(selectedExpense.id, comments);
      toast.success('Expense rejected');
      setShowModal(false);
      setComments('');
      setSelectedExpense(null);
      setActionType(null);
    } else {
      toast.error('Please provide rejection comments');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Pending Approvals</h1>
        <p className="text-gray-400 mt-1">Review and approve expense claims</p>
      </div>

      {/* Search */}
      <Card>
        <Input
          type="text"
          placeholder="Search by employee, description, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search size={20} />}
        />
      </Card>

      {/* Approvals Table */}
      <Card>
        <Table columns={columns} data={filteredExpenses} />
      </Card>

      {/* Action Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setComments('');
          setActionType(null);
        }}
        title={actionType === 'approve' ? 'Approve Expense' : 'Reject Expense'}
      >
        {selectedExpense && (
          <div className="space-y-6">
            {/* Expense Summary */}
            <div className="bg-dark-hover p-4 rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Employee</span>
                <span className="text-white font-medium">{selectedExpense.employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Amount</span>
                <span className="text-white font-semibold">
                  {formatCurrency(selectedExpense.amount, selectedExpense.currency)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Category</span>
                <span className="text-white">{selectedExpense.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date</span>
                <span className="text-white">{formatDate(selectedExpense.date)}</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-400 text-sm mb-2">Description</p>
              <p className="text-white bg-dark-hover p-3 rounded-lg">{selectedExpense.description}</p>
            </div>

            {/* Receipt */}
            {selectedExpense.receiptUrl && (
              <div>
                <p className="text-gray-400 text-sm mb-2">Receipt</p>
                <img
                  src={selectedExpense.receiptUrl}
                  alt="Receipt"
                  className="w-full max-h-48 object-contain bg-dark-hover rounded-lg"
                />
              </div>
            )}

            {/* Comments */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-300">
                Comments {actionType === 'reject' && <span className="text-danger">*</span>}
              </label>
              <textarea
                className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                rows={3}
                placeholder={actionType === 'reject' ? 'Rejection reason is required' : 'Optional comments...'}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              {actionType === 'approve' ? (
                <Button variant="success" className="flex-1" onClick={handleApprove}>
                  <CheckCircle size={20} />
                  Approve Expense
                </Button>
              ) : (
                <Button variant="danger" className="flex-1" onClick={handleReject}>
                  <XCircle size={20} />
                  Reject Expense
                </Button>
              )}
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowModal(false);
                  setComments('');
                  setActionType(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

