import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, isSidebarOpen }) => {
  const { currentUser, logout, notifications } = useApp();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(
    n => n.userId === currentUser?.id && !n.isRead
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-dark-card border-b border-dark-border sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Logo and Menu */}
          <div className="flex items-center gap-4">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-lg hover:bg-dark-hover text-gray-400 hover:text-white transition-colors"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            )}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:block">ExpenseFlow</span>
            </Link>
          </div>

          {/* Right side - Notifications and User */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-dark-hover text-gray-400 hover:text-white transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-dark-card border border-dark-border rounded-lg shadow-xl max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-dark-border">
                    <h3 className="text-white font-semibold">Notifications</h3>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y divide-dark-border">
                      {notifications.slice(0, 5).map(notif => (
                        <div
                          key={notif.id}
                          className={`p-4 hover:bg-dark-hover cursor-pointer ${
                            !notif.isRead ? 'bg-primary/5' : ''
                          }`}
                          onClick={() => {
                            if (notif.expenseId) {
                              navigate(`/expenses/${notif.expenseId}`);
                            }
                            setShowNotifications(false);
                          }}
                        >
                          <p className="text-white font-medium text-sm">{notif.title}</p>
                          <p className="text-gray-400 text-xs mt-1">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link
                    to="/notifications"
                    className="block p-4 text-center text-primary hover:text-primary-light text-sm font-medium"
                    onClick={() => setShowNotifications(false)}
                  >
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-hover transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-white text-sm font-medium">{currentUser?.name}</p>
                  <p className="text-gray-400 text-xs capitalize">{currentUser?.role}</p>
                </div>
                <ChevronDown size={16} className="text-gray-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-dark-card border border-dark-border rounded-lg shadow-xl">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-dark-hover text-gray-300 hover:text-white transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-dark-hover text-gray-300 hover:text-white transition-colors border-t border-dark-border"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={18} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-dark-hover text-danger hover:text-danger-light transition-colors w-full text-left border-t border-dark-border"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

