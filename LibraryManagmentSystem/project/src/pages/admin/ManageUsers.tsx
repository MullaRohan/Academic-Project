import { useState, useEffect } from 'react';
import { Trash2, User, Mail, CreditCard, Building, AlertTriangle } from 'lucide-react';
import { clearAllUserData } from '../../utils/clearUserData';

interface UserData {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  department?: string;
  registeredDate: Date;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  useEffect(() => {
    // Load users from localStorage on component mount
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers).map((user: any) => ({
        ...user,
        registeredDate: new Date(user.registeredDate)
      }));
      setUsers(parsedUsers);
    }
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.studentId && user.studentId.includes(searchTerm)) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort users by registration date (most recent first)
  const sortedUsers = [...filteredUsers].sort((a, b) => 
    b.registeredDate.getTime() - a.registeredDate.getTime()
  );

  // Handle user removal
  const handleRemoveUser = (userId: string) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    }
  };

  // Handle clearing all users
  const handleClearAllUsers = () => {
    setShowClearAllModal(true);
  };

  const confirmClearAllUsers = () => {
    // Clear all user data
    clearAllUserData();
    setUsers([]);
    setShowClearAllModal(false);
    alert('All users have been removed from the system successfully!');
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-amber-600 text-white p-6">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <p className="text-amber-100">View and manage library users</p>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div className="relative max-w-md flex-1">
              <input
                type="text"
                placeholder="Search users by name, email, student ID, or department..."
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {users.length > 0 && (
              <button
                onClick={handleClearAllUsers}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove All Users
              </button>
            )}
          </div>

          {/* Statistics */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <User className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-medium text-blue-800">Total Registered Users</h3>
                <p className="text-2xl font-bold text-blue-900">{users.length}</p>
              </div>
            </div>
          </div>

          {sortedUsers.length === 0 ? (
            <div className="text-center py-10">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? 'No users found. Try a different search term.' : 'No users registered yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Email</th>
                    <th className="py-3 px-6 text-left">Student ID</th>
                    <th className="py-3 px-6 text-left">Department</th>
                    <th className="py-3 px-6 text-left">Registered Date</th>
                    <th className="py-3 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm">
                  {sortedUsers.map(user => (
                    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <span>{user.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                          <span>{user.studentId || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex items-center">
                          <div className="mr-2">
                            <Building className="h-5 w-5 text-gray-400" />
                          </div>
                          <span className="text-xs">{user.department || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        {formatDate(user.registeredDate)}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleRemoveUser(user.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove User"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Clear All Users Confirmation Modal */}
      {showClearAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Remove All Users</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to remove all {users.length} users from the system? This will:
                </p>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Delete all user accounts</li>
                  <li>• Remove all borrowed book records</li>
                  <li>• Clear all verification data</li>
                  <li>• Remove all fines and penalties</li>
                </ul>
                <p className="text-red-600 text-sm mt-4 font-medium">
                  This action is permanent and cannot be undone!
                </p>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowClearAllModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmClearAllUsers}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Remove All Users
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageUsers;