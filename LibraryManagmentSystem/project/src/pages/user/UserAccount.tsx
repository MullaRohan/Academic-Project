import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, Edit, Save, CreditCard, Building, Upload, CheckCircle, AlertCircle, Camera, Clock, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserAccount = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Verification states
  const [studentCardImage, setStudentCardImage] = useState<string>('');
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected' | null>(null);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load verification status from localStorage
  useEffect(() => {
    if (user?.id) {
      const verificationData = localStorage.getItem(`verification_${user.id}`);
      if (verificationData) {
        const data = JSON.parse(verificationData);
        setVerificationStatus(data.status);
        setStudentCardImage(data.image || '');
      }
    }
  }, [user?.id]);

  const handleUpdateProfile = () => {
    updateProfile({
      name,
      bio
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    // Simple validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    // Mock password check - in a real app, this would validate against current password in backend
    if (currentPassword !== 'password') {
      setPasswordError('Current password is incorrect');
      return;
    }
    
    // Mock password update - in a real app, this would update in backend
    setPasswordSuccess('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleStudentCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setVerificationMessage('Please upload an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setStudentCardImage(reader.result as string);
        setVerificationMessage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVerificationSubmit = async () => {
    if (!studentCardImage) {
      setVerificationMessage('Please upload your student card image');
      return;
    }

    setIsSubmitting(true);
    setVerificationMessage('');

    // Submit for admin review
    const verificationData = {
      status: 'pending',
      image: studentCardImage,
      submittedAt: new Date().toISOString(),
      studentId: user?.studentId,
      userId: user?.id,
      studentName: user?.name,
      studentEmail: user?.email,
      department: user?.department
    };
    
    // Save verification data to localStorage for admin review
    localStorage.setItem(`verification_${user?.id}`, JSON.stringify(verificationData));
    
    // Add to pending verifications list for admin
    const pendingVerifications = JSON.parse(localStorage.getItem('pendingVerifications') || '[]');
    const existingIndex = pendingVerifications.findIndex((v: any) => v.userId === user?.id);
    
    if (existingIndex >= 0) {
      pendingVerifications[existingIndex] = verificationData;
    } else {
      pendingVerifications.push(verificationData);
    }
    
    localStorage.setItem('pendingVerifications', JSON.stringify(pendingVerifications));
    
    // Update user verification status in registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === user?.id ? { ...u, verificationStatus: 'pending', verificationData } : u
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    setVerificationStatus('pending');
    setVerificationMessage('Your student card has been submitted for admin review. You will be notified once it\'s approved.');
    setIsSubmitting(false);
  };

  const getVerificationStatusColor = () => {
    switch (verificationStatus) {
      case 'verified':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getVerificationStatusIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <Camera className="h-5 w-5 text-gray-600" />;
    }
  };

  const getVerificationStatusText = () => {
    switch (verificationStatus) {
      case 'verified':
        return 'Verified';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending Review';
      default:
        return 'Not Submitted';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-teal-600 text-white p-6">
        <h1 className="text-2xl font-bold">My Account</h1>
        <p className="text-teal-100">Manage your profile and settings</p>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center text-teal-600 hover:text-teal-800"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            ) : (
              <button
                onClick={handleUpdateProfile}
                className="flex items-center text-teal-600 hover:text-teal-800"
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </button>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bio">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="text-gray-800">{user?.name}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-gray-800">{user?.email}</p>
                  </div>
                </div>
                {user?.studentId && (
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Student ID</h3>
                      <p className="text-gray-800">{user.studentId}</p>
                    </div>
                  </div>
                )}
                {user?.department && (
                  <div className="flex items-start">
                    <Building className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Department</h3>
                      <p className="text-gray-800">{user.department}</p>
                    </div>
                  </div>
                )}
                {user?.bio && (
                  <div className="flex items-start">
                    <div className="h-5 w-5 mr-3" /> {/* Spacer for alignment */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                      <p className="text-gray-800">{user.bio}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Student Verification Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Student Verification</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center mb-4">
              {getVerificationStatusIcon()}
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-500">Verification Status</h3>
                <p className={`font-medium ${getVerificationStatusColor()}`}>
                  {getVerificationStatusText()}
                </p>
              </div>
            </div>

            {verificationStatus !== 'verified' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Upload Student Card Photo
                  </label>
                  <p className="text-xs text-gray-500 mb-3">
                    Please upload a clear photo of your student ID card. An admin will review and verify that the ID matches your registered student ID.
                  </p>
                  
                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <div className="flex flex-col items-center">
                        {studentCardImage ? (
                          <div className="relative">
                            <img
                              src={studentCardImage}
                              alt="Student card preview"
                              className="h-40 w-auto object-cover mb-4 rounded-lg"
                            />
                            {verificationStatus !== 'pending' && (
                              <button
                                type="button"
                                onClick={() => setStudentCardImage('')}
                                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ) : (
                          <Camera className="mx-auto h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      {verificationStatus !== 'pending' && (
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="student-card-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500"
                          >
                            <span>Upload student card</span>
                            <input
                              id="student-card-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={handleStudentCardUpload}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                      )}
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>

                {verificationMessage && (
                  <div className={`p-3 rounded-lg ${
                    verificationStatus === 'verified' 
                      ? 'bg-green-100 text-green-700' 
                      : verificationStatus === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : verificationStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {verificationMessage}
                  </div>
                )}

                {verificationStatus !== 'pending' && (
                  <button
                    onClick={handleVerificationSubmit}
                    disabled={!studentCardImage || isSubmitting}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : verificationStatus === 'rejected' ? 'Resubmit for Review' : 'Submit for Admin Review'}
                  </button>
                )}

                {verificationStatus === 'pending' && (
                  <div className="bg-yellow-100 p-4 rounded-lg">
                    <div className="flex items-center">
                      <Clock className="h-6 w-6 text-yellow-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Under Review</h4>
                        <p className="text-sm text-yellow-600">Your student card is being reviewed by an admin. Please wait for approval.</p>
                      </div>
                    </div>
                  </div>
                )}

                {verificationStatus === 'rejected' && (
                  <div className="bg-red-100 p-4 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
                      <div>
                        <h4 className="font-medium text-red-800">Verification Rejected</h4>
                        <p className="text-sm text-red-600">Your student card verification was rejected. Please upload a clearer image or contact support.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

           
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          
          <form onSubmit={handlePasswordChange} className="bg-gray-50 p-4 rounded-lg">
            {passwordError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {passwordError}
              </div>
            )}
            
            {passwordSuccess && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
                {passwordSuccess}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
                  Current Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="currentPassword"
                    type="password"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors duration-300"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;