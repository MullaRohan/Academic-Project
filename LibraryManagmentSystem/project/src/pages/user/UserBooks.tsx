import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { AlertCircle, Lock, CheckCircle } from 'lucide-react';
import BookList from '../../components/books/BookList';
import { useState, useEffect } from 'react';

const UserBooks = () => {
  const { user } = useAuth();
  const [isUserVerified, setIsUserVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('');

  // Check if user is verified
  useEffect(() => {
    const checkVerificationStatus = () => {
      if (user?.role === 'admin') {
        setIsUserVerified(true);
        setVerificationStatus('verified');
        return;
      }

      if (user?.role === 'user' && user?.id) {
        // Check from Supabase user data first
        if (user.verificationStatus === 'verified') {
          setIsUserVerified(true);
          setVerificationStatus('verified');
          return;
        }

        // Fallback: Check from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userRecord = registeredUsers.find((u: any) => u.id === user.id || u.email === user.email);
        
        if (userRecord?.verificationStatus === 'verified') {
          setIsUserVerified(true);
          setVerificationStatus('verified');
          return;
        }

        // Check verification data directly
        const verificationData = localStorage.getItem(`verification_${user.id}`);
        if (verificationData) {
          const data = JSON.parse(verificationData);
          setVerificationStatus(data.status || 'pending');
          if (data.status === 'verified') {
            setIsUserVerified(true);
            return;
          }
        }

        // Set status from user record or default to pending
        setVerificationStatus(userRecord?.verificationStatus || user.verificationStatus || 'pending');
        setIsUserVerified(false);
      } else {
        setIsUserVerified(false);
        setVerificationStatus('');
      }
    };

    checkVerificationStatus();
  }, [user]);

  // Show verification status message for non-verified users
  if (user?.role === 'user' && !isUserVerified) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-teal-600 text-white p-6">
          <h1 className="text-2xl font-bold">Available Books</h1>
          <p className="text-teal-100">Browse and borrow from our collection</p>
        </div>

        <div className="p-6">
          <div className="text-center py-20">
            <div className="flex justify-center mb-6">
              <div className={`p-6 rounded-full ${
                verificationStatus === 'pending' ? 'bg-yellow-100' : 
                verificationStatus === 'rejected' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {verificationStatus === 'pending' ? (
                  <AlertCircle className="h-16 w-16 text-yellow-600" />
                ) : verificationStatus === 'rejected' ? (
                  <AlertCircle className="h-16 w-16 text-red-600" />
                ) : (
                  <Lock className="h-16 w-16 text-gray-600" />
                )}
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {verificationStatus === 'pending' ? 'Verification Under Review' :
               verificationStatus === 'rejected' ? 'Verification Rejected' :
               'Account Verification Required'}
            </h2>
            
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {verificationStatus === 'pending' ? 
                'Your student ID verification is currently under admin review. Please wait for approval to access our book collection.' :
               verificationStatus === 'rejected' ?
                'Your student ID verification was rejected. Please resubmit a clearer image of your student card.' :
                'To access our book collection and borrow books, you need to verify your student account. Please upload your student ID card for admin verification.'
              }
            </p>
            
            <div className={`border rounded-lg p-4 mb-6 max-w-md mx-auto ${
              verificationStatus === 'pending' ? 'bg-yellow-50 border-yellow-200' :
              verificationStatus === 'rejected' ? 'bg-red-50 border-red-200' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-start">
                <AlertCircle className={`h-5 w-5 mt-0.5 mr-3 flex-shrink-0 ${
                  verificationStatus === 'pending' ? 'text-yellow-600' :
                  verificationStatus === 'rejected' ? 'text-red-600' :
                  'text-blue-600'
                }`} />
                <div className="text-left">
                  <h3 className={`font-medium mb-1 ${
                    verificationStatus === 'pending' ? 'text-yellow-800' :
                    verificationStatus === 'rejected' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    {verificationStatus === 'pending' ? 'What happens next?' :
                     verificationStatus === 'rejected' ? 'Next steps:' :
                     'Verification Steps:'}
                  </h3>
                  <ol className={`text-sm space-y-1 ${
                    verificationStatus === 'pending' ? 'text-yellow-700' :
                    verificationStatus === 'rejected' ? 'text-red-700' :
                    'text-blue-700'
                  }`}>
                    {verificationStatus === 'pending' ? (
                      <>
                        <li>• Admin will review your student ID card</li>
                        <li>• You'll be notified once approved</li>
                        <li>• Then you can start borrowing books!</li>
                      </>
                    ) : verificationStatus === 'rejected' ? (
                      <>
                        <li>• Go to "My Account"</li>
                        <li>• Upload a clearer student ID card photo</li>
                        <li>• Wait for admin re-approval</li>
                        <li>• Start borrowing books once approved!</li>
                      </>
                    ) : (
                      <>
                        <li>1. Go to "My Account"</li>
                        <li>2. Upload your student ID card photo</li>
                        <li>3. Wait for admin approval</li>
                        <li>4. Start borrowing books!</li>
                      </>
                    )}
                  </ol>
                </div>
              </div>
            </div>
            
            <Link
              to="/user/account"
              className={`inline-flex items-center font-medium py-3 px-6 rounded-lg transition-colors duration-300 ${
                verificationStatus === 'pending' ? 
                  'bg-yellow-600 hover:bg-yellow-700 text-white' :
                verificationStatus === 'rejected' ?
                  'bg-red-600 hover:bg-red-700 text-white' :
                  'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {verificationStatus === 'pending' ? (
                <>
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Check Verification Status
                </>
              ) : verificationStatus === 'rejected' ? (
                <>
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Resubmit Verification
                </>
              ) : (
                <>
                  <Lock className="h-5 w-5 mr-2" />
                  Verify My Account
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show books for verified users
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-teal-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Available Books</h1>
            <p className="text-teal-100">Browse and borrow from our collection</p>
          </div>
          {isUserVerified && (
            <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <BookList />
      </div>
    </div>
  );
};

export default UserBooks;