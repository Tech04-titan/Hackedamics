import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UI/Card';
import { Input } from '../../components/UI/Input';
import { Button } from '../../components/UI/Button';
import toast, { Toaster } from 'react-hot-toast';

export const Profile: React.FC = () => {
  const { currentUser, updateUser } = useApp();
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateUser(currentUser.id, { name, email });
      toast.success('Profile updated successfully!');
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    toast.success('Password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account information</p>
      </div>

      {/* Profile Information */}
      <Card title="Profile Information" subtitle="Update your personal details">
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            type="text"
            label="Full Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            icon={<User size={20} />}
            required
          />

          <Input
            type="email"
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail size={20} />}
            required
          />

          <div className="pt-2">
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password */}
      <Card title="Change Password" subtitle="Update your account password">
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <Input
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={<Lock size={20} />}
            required
          />

          <Input
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={<Lock size={20} />}
            required
          />

          <Input
            type="password"
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<Lock size={20} />}
            required
          />

          <div className="pt-2">
            <Button type="submit" variant="primary">
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Account Information */}
      <Card title="Account Information">
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-gray-400">Role</span>
            <span className="text-white capitalize">{currentUser?.role}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-dark-border">
            <span className="text-gray-400">Account Created</span>
            <span className="text-white">
              {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : '-'}
            </span>
          </div>
          {currentUser?.department && (
            <div className="flex justify-between py-2 border-b border-dark-border">
              <span className="text-gray-400">Department</span>
              <span className="text-white">{currentUser.department}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

