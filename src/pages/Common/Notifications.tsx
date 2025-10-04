import React, { useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { formatRelativeTime } from '../../utils/formatters';

export const Notifications: React.FC = () => {
  const { currentUser, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  const userNotifications = notifications.filter(n => n.userId === currentUser?.id);
  const filteredNotifications = filter === 'unread'
    ? userNotifications.filter(n => !n.isRead)
    : userNotifications;

  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (notification: any) => {
    markNotificationAsRead(notification.id);
    if (notification.expenseId) {
      navigate(`/expenses/${notification.expenseId}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    return <Bell size={24} className="text-primary-light" />;
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'expense_approved':
        return 'border-l-success';
      case 'expense_rejected':
        return 'border-l-danger';
      case 'approval_pending':
        return 'border-l-warning';
      default:
        return 'border-l-primary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'You\'re all caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllNotificationsAsRead}>
            <CheckCheck size={16} />
            Mark All Read
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({userNotifications.length})
          </Button>
          <Button
            variant={filter === 'unread' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('unread')}
          >
            Unread ({unreadCount})
          </Button>
        </div>
      </Card>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">No notifications to display</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <Card
              key={notification.id}
              className={`cursor-pointer hover:bg-dark-hover transition-colors border-l-4 ${getNotificationColor(
                notification.type
              )} ${!notification.isRead ? 'bg-primary/5' : ''}`}
            >
              <div
                onClick={() => handleNotificationClick(notification)}
                className="flex items-start gap-4"
              >
                <div className="p-3 bg-primary/10 rounded-full">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-white font-semibold">{notification.title}</h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-2">{notification.message}</p>
                  <p className="text-gray-500 text-xs">
                    {formatRelativeTime(notification.createdAt)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

