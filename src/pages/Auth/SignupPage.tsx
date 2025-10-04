import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Globe, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Button } from '../../components/UI/Button';
import { fetchCountries } from '../../utils/api';
import toast, { Toaster } from 'react-hot-toast';

export const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([]);
  const [role, setRole] = useState<'admin' | 'manager' | 'employee'>('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    const data = await fetchCountries();
    const countryOptions = data
      .map(c => ({
        value: c.name.common,
        label: c.name.common,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
    setCountries([{ value: '', label: 'Select a country' }, ...countryOptions]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!country) {
      toast.error('Please select a country');
      return;
    }

    setIsLoading(true);

    try {
      const success = await signup(name, email, password, country, role);
      if (success) {
        toast.success('Account created successfully!');
        const dashboardRoutes = {
          admin: '/admin/dashboard',
          manager: '/manager/dashboard',
          employee: '/employee/dashboard'
        };
        setTimeout(() => navigate(dashboardRoutes[role]), 500);
      } else {
        toast.error('Signup failed. Please try again.');
      }
    } catch (error) {
      toast.error('Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <Toaster position="top-right" />
      
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">E</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Start managing your expenses today</p>
        </div>

        {/* Signup Card */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="text"
              label="Full Name"
              placeholder="Enter your full name"
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

            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'manager' | 'employee')}
              options={[
                { value: 'employee', label: 'Employee' },
                { value: 'manager', label: 'Manager' },
                { value: 'admin', label: 'Admin' },
              ]}
              required
            />

            <Select
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              options={countries}
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock size={20} />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Input
              type={showPassword ? 'text' : 'password'}
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              icon={<Lock size={20} />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary-light font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2025 ExpenseFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
};

