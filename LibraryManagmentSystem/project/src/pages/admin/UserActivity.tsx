import { Activity, User, BookOpen, UserPlus } from 'lucide-react';

// Mock activity data
const MOCK_ACTIVITIES = [
  { 
    id: '1', 
    userId: '1', 
    userName: 'John Doe', 
    action: 'borrowed', 
    item: 'To Kill a Mockingbird', 
    date: new Date(2023, 9, 10, 14, 30) 
  },
  { 
    id: '2', 
    userId: '2', 
    userName: 'Jane Smith', 
    action: 'registered', 
    item: '', 
    date: new Date(2023, 9, 9, 10, 15) 
  },
  { 
    id: '3', 
    userId: '1', 
    userName: 'John Doe', 
    action: 'returned', 
    item: '1984', 
    date: new Date(2023, 9, 8, 16, 45) 
  },
  { 
    id: '4', 
    userId: '3', 
    userName: 'Robert Johnson', 
    action: 'borrowed', 
    item: 'Pride and Prejudice', 
    date: new Date(2023, 9, 7, 11, 20) 
  },
  { 
    id: '5', 
    userId: '4', 
    userName: 'Emily Wilson', 
    action: 'registered', 
    item: '', 
    date: new Date(2023, 9, 6, 9, 30) 
  }
];

const UserActivity = () => {
  // Sort activities by date (most recent first)
  const sortedActivities = [...MOCK_ACTIVITIES].sort((a, b) => 
    b.date.getTime() - a.date.getTime()
  );

  // Format date and time
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get icon for activity type
  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'borrowed':
        return <BookOpen className="h-5 w-5 text-teal-500" />;
      case 'returned':
        return <BookOpen className="h-5 w-5 text-amber-500" />;
      case 'registered':
        return <UserPlus className="h-5 w-5 text-blue-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  // Get activity description
  const getActivityDescription = (activity: typeof MOCK_ACTIVITIES[0]) => {
    switch (activity.action) {
      case 'borrowed':
        return `borrowed "${activity.item}"`;
      case 'returned':
        return `returned "${activity.item}"`;
      case 'registered':
        return 'registered a new account';
      default:
        return activity.action;
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-amber-600 text-white p-6">
        <h1 className="text-2xl font-bold">User Activity</h1>
        <p className="text-amber-100">Monitor all user activities</p>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        
        {sortedActivities.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No activities to display.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedActivities.map(activity => (
              <div 
                key={activity.id} 
                className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="mr-4">
                  {getActivityIcon(activity.action)}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between">
                    <div className="flex items-center mb-1 sm:mb-0">
                      <User className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="font-medium">{activity.userName}</span>
                    </div>
                    <span className="text-sm text-gray-500">{formatDateTime(activity.date)}</span>
                  </div>
                  <p className="text-gray-700">
                    {getActivityDescription(activity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserActivity;