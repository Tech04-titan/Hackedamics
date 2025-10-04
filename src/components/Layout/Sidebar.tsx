import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Users,
  Settings,
  FileText,
  CheckSquare,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { currentUser } = useApp();

  const navItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: currentUser?.role === 'admin' 
        ? '/admin/dashboard'
        : currentUser?.role === 'manager'
        ? '/manager/dashboard'
        : '/employee/dashboard',
      roles: ['admin', 'manager', 'employee'],
    },
    {
      name: 'Submit Expense',
      icon: Receipt,
      path: '/employee/submit-expense',
      roles: ['employee'],
    },
    {
      name: 'My Expenses',
      icon: FileText,
      path: '/employee/expenses',
      roles: ['employee'],
    },
    {
      name: 'Pending Approvals',
      icon: CheckSquare,
      path: '/manager/approvals',
      roles: ['manager', 'admin'],
    },
    {
      name: 'Team Expenses',
      icon: DollarSign,
      path: '/manager/team-expenses',
      roles: ['manager'],
    },
    {
      name: 'All Expenses',
      icon: DollarSign,
      path: '/admin/expenses',
      roles: ['admin'],
    },
    {
      name: 'User Management',
      icon: Users,
      path: '/admin/users',
      roles: ['admin'],
    },
    {
      name: 'Approval Rules',
      icon: Settings,
      path: '/approval-rules',
      roles: ['admin'],
    },
    {
      name: 'Company Settings',
      icon: Settings,
      path: '/settings',
      roles: ['admin'],
    },
    {
      name: 'Help & Support',
      icon: HelpCircle,
      path: '/help',
      roles: ['admin', 'manager', 'employee'],
    },
  ];

  const filteredNavItems = navItems.filter(item =>
    currentUser && item.roles.includes(currentUser.role)
  );

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-800/70 border-r border-gray-700/50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 backdrop-blur-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="h-full overflow-y-auto py-6 px-3">
          <div className="space-y-1">
            {filteredNavItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50 hover:scale-105'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};

