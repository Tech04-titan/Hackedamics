import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Table } from '../../components/UI/Table';
import { Modal } from '../../components/UI/Modal';
import { formatDate, getRoleColor } from '../../utils/formatters';
import { User, UserRole } from '../../types';
import toast, { Toaster } from 'react-hot-toast';

export const UserManagement: React.FC = () => {
  const { users, createUser, updateUser, deleteUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('employee');
  const [managerId, setManagerId] = useState('');
  const [department, setDepartment] = useState('');
  const [isManagerApprover, setIsManagerApprover] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const managers = users.filter(u => u.role === 'manager' || u.role === 'admin');

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('employee');
    setManagerId('');
    setDepartment('');
    setIsManagerApprover(false);
    setEditingUser(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setManagerId(user.managerId || '');
    setDepartment(user.department || '');
    setIsManagerApprover(user.isManagerApprover || false);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      role,
      managerId: managerId || undefined,
      department: department || undefined,
      isManagerApprover,
    };

    if (editingUser) {
      updateUser(editingUser.id, userData);
      toast.success('User updated successfully!');
    } else {
      createUser(userData);
      toast.success('User created successfully!');
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(userId);
      toast.success('User deleted successfully!');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (value: string, row: User) => (
        <div>
          <p className="text-white font-medium">{value}</p>
          <p className="text-gray-400 text-xs">{row.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (value: string) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleColor(value)}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      ),
    },
    {
      key: 'department',
      label: 'Department',
      render: (value?: string) => value || '-',
    },
    {
      key: 'managerId',
      label: 'Manager',
      render: (value?: string) => {
        const manager = users.find(u => u.id === value);
        return manager ? manager.name : '-';
      },
    },
    {
      key: 'createdAt',
      label: 'Joined',
      render: (value: Date) => formatDate(value),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: User) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              openEditModal(row);
            }}
          >
            <Edit size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.id);
            }}
          >
            <Trash2 size={16} className="text-danger" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Management</h1>
          <p className="text-gray-400 mt-1">Manage employees, managers, and permissions</p>
        </div>
        <Button variant="primary" onClick={openCreateModal}>
          <Plus size={20} />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={20} />}
            />
          </div>
          <Select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Roles' },
              { value: 'admin', label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'employee', label: 'Employee' },
            ]}
          />
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table columns={columns} data={filteredUsers} />
      </Card>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            options={[
              { value: 'employee', label: 'Employee' },
              { value: 'manager', label: 'Manager' },
              { value: 'admin', label: 'Admin' },
            ]}
            required
          />

          <Input
            type="text"
            label="Department (Optional)"
            placeholder="Enter department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          {role === 'employee' && (
            <>
              <Select
                label="Assign Manager (Optional)"
                value={managerId}
                onChange={(e) => setManagerId(e.target.value)}
                options={[
                  { value: '', label: 'No Manager' },
                  ...managers.map(m => ({ value: m.id, label: m.name })),
                ]}
              />

              {managerId && (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isManagerApprover}
                    onChange={(e) => setIsManagerApprover(e.target.checked)}
                    className="w-4 h-4 bg-dark-hover border-dark-border rounded text-primary focus:ring-primary focus:ring-offset-dark-bg"
                  />
                  <span className="text-gray-300 text-sm">Manager is approver</span>
                </label>
              )}
            </>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" variant="primary" className="flex-1">
              {editingUser ? 'Update User' : 'Create User'}
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

