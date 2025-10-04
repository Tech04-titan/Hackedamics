import React, { useState } from 'react';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Modal } from '../../components/UI/Modal';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ApprovalRule, ApprovalStep, ConditionalRule, UserRole } from '../../types';
import toast, { Toaster } from 'react-hot-toast';

export const ApprovalRules: React.FC = () => {
  const { approvalRules, users, company, createApprovalRule, updateApprovalRule, deleteApprovalRule } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState<ApprovalRule | null>(null);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [thresholdAmount, setThresholdAmount] = useState('');
  const [approvers, setApprovers] = useState<ApprovalStep[]>([]);
  const [conditionalType, setConditionalType] = useState<'percentage' | 'specific' | 'hybrid' | 'none'>('none');
  const [percentageRequired, setPercentageRequired] = useState('');
  const [specificApprovers, setSpecificApprovers] = useState<string[]>([]);
  const [requireBoth, setRequireBoth] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const resetForm = () => {
    setName('');
    setDescription('');
    setThresholdAmount('');
    setApprovers([]);
    setConditionalType('none');
    setPercentageRequired('');
    setSpecificApprovers([]);
    setRequireBoth(false);
    setIsActive(true);
    setEditingRule(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (rule: ApprovalRule) => {
    setEditingRule(rule);
    setName(rule.name);
    setDescription(rule.description || '');
    setThresholdAmount(rule.thresholdAmount?.toString() || '');
    setApprovers(rule.approvers);
    setConditionalType(rule.conditionalRules?.type || 'none');
    setPercentageRequired(rule.conditionalRules?.percentageRequired?.toString() || '');
    setSpecificApprovers(rule.conditionalRules?.specificApproverIds || []);
    setRequireBoth(rule.conditionalRules?.requireBoth || false);
    setIsActive(rule.isActive);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const conditionalRules: ConditionalRule | undefined =
      conditionalType !== 'none'
        ? {
            type: conditionalType,
            percentageRequired: percentageRequired ? parseInt(percentageRequired) : undefined,
            specificApproverIds: specificApprovers.length > 0 ? specificApprovers : undefined,
            requireBoth: conditionalType === 'hybrid' ? requireBoth : undefined,
          }
        : undefined;

    const ruleData = {
      name,
      description: description || undefined,
      thresholdAmount: thresholdAmount ? parseFloat(thresholdAmount) : undefined,
      currency: company?.currency || 'USD',
      approvers,
      conditionalRules,
      isActive,
    };

    if (editingRule) {
      updateApprovalRule(editingRule.id, ruleData);
      toast.success('Approval rule updated successfully!');
    } else {
      createApprovalRule(ruleData);
      toast.success('Approval rule created successfully!');
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this rule?')) {
      deleteApprovalRule(ruleId);
      toast.success('Rule deleted successfully!');
    }
  };

  const addApprover = () => {
    setApprovers([
      ...approvers,
      {
        step: approvers.length + 1,
        approverId: '',
        approverName: '',
        approverRole: 'manager',
      },
    ]);
  };

  const removeApprover = (index: number) => {
    setApprovers(approvers.filter((_, i) => i !== index).map((a, i) => ({ ...a, step: i + 1 })));
  };

  const updateApprover = (index: number, userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const updated = [...approvers];
      updated[index] = {
        ...updated[index],
        approverId: user.id,
        approverName: user.name,
        approverRole: user.role,
      };
      setApprovers(updated);
    }
  };

  const toggleExpand = (ruleId: string) => {
    setExpandedRule(expandedRule === ruleId ? null : ruleId);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Approval Rules</h1>
          <p className="text-gray-400 mt-1">Configure approval workflows and conditions</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus size={20} />
          Create Rule
        </Button>
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {approvalRules.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">No approval rules configured</p>
              <Button variant="primary" onClick={openCreateModal}>
                <Plus size={20} />
                Create Your First Rule
              </Button>
            </div>
          </Card>
        ) : (
          approvalRules.map(rule => (
            <Card key={rule.id}>
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{rule.name}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rule.isActive
                            ? 'bg-success/20 text-success-light'
                            : 'bg-gray-700 text-gray-400'
                        }`}
                      >
                        {rule.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {rule.description && (
                      <p className="text-gray-400 text-sm mb-2">{rule.description}</p>
                    )}
                    {rule.thresholdAmount && (
                      <p className="text-gray-300 text-sm">
                        Threshold: {formatCurrency(rule.thresholdAmount, rule.currency)}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEditModal(rule)}>
                      <Edit size={16} />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(rule.id)}>
                      <Trash2 size={16} className="text-danger" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleExpand(rule.id)}
                    >
                      {expandedRule === rule.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </div>
                </div>

                {expandedRule === rule.id && (
                  <div className="border-t border-dark-border pt-4 space-y-4">
                    {/* Sequential Approvers */}
                    {rule.approvers.length > 0 && (
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-2">Sequential Approvers:</p>
                        <div className="space-y-2">
                          {rule.approvers.map(approver => (
                            <div
                              key={approver.step}
                              className="flex items-center gap-3 bg-dark-hover p-3 rounded-lg"
                            >
                              <span className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-primary-light font-semibold">
                                {approver.step}
                              </span>
                              <div>
                                <p className="text-white font-medium">{approver.approverName}</p>
                                <p className="text-gray-400 text-xs capitalize">{approver.approverRole}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Conditional Rules */}
                    {rule.conditionalRules && (
                      <div>
                        <p className="text-gray-400 text-sm font-medium mb-2">Conditional Rules:</p>
                        <div className="bg-dark-hover p-3 rounded-lg">
                          <p className="text-white mb-1">Type: <span className="capitalize">{rule.conditionalRules.type}</span></p>
                          {rule.conditionalRules.percentageRequired && (
                            <p className="text-white mb-1">
                              Percentage Required: {rule.conditionalRules.percentageRequired}%
                            </p>
                          )}
                          {rule.conditionalRules.specificApproverIds && (
                            <p className="text-white">
                              Specific Approvers: {
                                rule.conditionalRules.specificApproverIds
                                  .map(id => users.find(u => u.id === id)?.name || 'Unknown')
                                  .join(', ')
                              }
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-gray-400 text-xs">
                      Created: {formatDate(rule.createdAt)}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Rule Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingRule ? 'Edit Approval Rule' : 'Create Approval Rule'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="text"
            label="Rule Name"
            placeholder="Enter rule name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-300">Description (Optional)</label>
            <textarea
              className="w-full bg-dark-hover border border-dark-border rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              rows={2}
              placeholder="Enter rule description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Input
            type="number"
            label="Threshold Amount (Optional)"
            placeholder="0.00"
            value={thresholdAmount}
            onChange={(e) => setThresholdAmount(e.target.value)}
            step="0.01"
            min="0"
          />

          {/* Sequential Approvers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-300">Sequential Approvers</label>
              <Button type="button" size="sm" variant="outline" onClick={addApprover}>
                <Plus size={16} />
                Add Step
              </Button>
            </div>
            <div className="space-y-2">
              {approvers.map((approver, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-gray-400 w-8">#{approver.step}</span>
                  <Select
                    value={approver.approverId}
                    onChange={(e) => updateApprover(index, e.target.value)}
                    options={[
                      { value: '', label: 'Select Approver' },
                      ...users
                        .filter(u => u.role === 'manager' || u.role === 'admin')
                        .map(u => ({ value: u.id, label: `${u.name} (${u.role})` })),
                    ]}
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => removeApprover(index)}
                  >
                    <Trash2 size={16} className="text-danger" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Conditional Rules */}
          <div>
            <Select
              label="Conditional Rule Type"
              value={conditionalType}
              onChange={(e) => setConditionalType(e.target.value as any)}
              options={[
                { value: 'none', label: 'None' },
                { value: 'percentage', label: 'Percentage Based' },
                { value: 'specific', label: 'Specific Approver' },
                { value: 'hybrid', label: 'Hybrid (Percentage OR Specific)' },
              ]}
            />

            {(conditionalType === 'percentage' || conditionalType === 'hybrid') && (
              <Input
                type="number"
                label="Percentage Required"
                placeholder="60"
                value={percentageRequired}
                onChange={(e) => setPercentageRequired(e.target.value)}
                min="1"
                max="100"
                className="mt-3"
              />
            )}

            {(conditionalType === 'specific' || conditionalType === 'hybrid') && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Specific Approvers
                </label>
                {users
                  .filter(u => u.role === 'manager' || u.role === 'admin')
                  .map(user => (
                    <label key={user.id} className="flex items-center gap-2 mb-2">
                      <input
                        type="checkbox"
                        checked={specificApprovers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSpecificApprovers([...specificApprovers, user.id]);
                          } else {
                            setSpecificApprovers(specificApprovers.filter(id => id !== user.id));
                          }
                        }}
                        className="w-4 h-4 bg-dark-hover border-dark-border rounded text-primary focus:ring-primary focus:ring-offset-dark-bg"
                      />
                      <span className="text-gray-300 text-sm">{user.name} ({user.role})</span>
                    </label>
                  ))}
              </div>
            )}

            {conditionalType === 'hybrid' && (
              <label className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  checked={requireBoth}
                  onChange={(e) => setRequireBoth(e.target.checked)}
                  className="w-4 h-4 bg-dark-hover border-dark-border rounded text-primary focus:ring-primary focus:ring-offset-dark-bg"
                />
                <span className="text-gray-300 text-sm">Require both conditions (AND instead of OR)</span>
              </label>
            )}
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 bg-dark-hover border-dark-border rounded text-primary focus:ring-primary focus:ring-offset-dark-bg"
            />
            <span className="text-gray-300 text-sm">Rule is active</span>
          </label>

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingRule ? 'Update Rule' : 'Create Rule'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

