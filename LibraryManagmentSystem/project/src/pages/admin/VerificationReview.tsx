import { useState, useEffect } from 'react';
import { CheckCircle, X, Clock, Eye, User, Mail, CreditCard, Building, Calendar } from 'lucide-react';

interface VerificationData {
  status: 'pending' | 'verified' | 'rejected';
  image: string;
  submittedAt: string;
  studentId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  department: string;
}

const VerificationReview = () => {
  const [pendingVerifications, setPendingVerifications] = useState<VerificationData[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<VerificationData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Load pending verifications
    const pending = localStorage.getItem('pendingVerifications');
    if (pending) {
      setPendingVerifications(JSON.parse(pending));
    }
  }, []);

  // Handle verification approval/rejection
  const handleVerificationDecision = (verification: VerificationData, decision: 'approved' | 'rejected') => {
    const newStatus = decision === 'approved' ? 'verified' : 'rejected';
    
    // Update verification data
    const updatedVerification = { ...verification, status: newStatus };
    localStorage.setItem(`verification_${verification.userId}`, JSON.stringify(updatedVerification));
    
    // Update student in registered users
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const updatedUsers = users.map((u: any) => 
      u.id === verification.userId ? { ...u, verificationStatus: newStatus } : u
    );
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    // Remove from pending verifications
    const updatedPending = pendingVerifications.filter(v => v.userId !== verification.userId);
    setPendingVerifications(updatedPending);
    localStorage.setItem('pendingVerifications', JSON.stringify(updatedPending));
    
    setShowModal(false);
    setSelectedVerification(null);
    
    alert(`Student verification ${decision}!`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-amber-600 text-white p-6">
        <h1 className="text-2xl font-bold">Student Verification Review</h1>
        <p className="text-amber-100">Review and approve student ID card submissions</p>
      </div>

      <div className="p-6">
        {pendingVerifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-6 rounded-full">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Caught Up!</h2>
            <p className="text-gray-600">No pending student verifications to review.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Pending Verifications ({pendingVerifications.length})</h2>
              <p className="text-gray-600">Review student ID cards and approve or reject verification requests.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingVerifications.map((verification) => (
                <div key={verification.userId} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <div className="bg-yellow-100 p-2 rounded-full mr-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800">{verification.studentName}</h3>
                        <p className="text-sm text-gray-500">Pending Review</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{verification.studentEmail}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{verification.studentId}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Building className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600 text-xs">{verification.department}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{formatDate(verification.submittedAt)}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <img
                        src={verification.image}
                        alt="Student ID card"
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                    </div>

                    <button
                      onClick={() => {
                        setSelectedVerification(verification);
                        setShowModal(true);
                      }}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Review Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Verification Review Modal */}
      {showModal && selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Review Student Verification</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Student Information</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <p><strong>Name:</strong> {selectedVerification.studentName}</p>
                  <p><strong>Email:</strong> {selectedVerification.studentEmail}</p>
                  <p><strong>Student ID:</strong> {selectedVerification.studentId}</p>
                  <p><strong>Department:</strong> {selectedVerification.department}</p>
                  <p><strong>Submitted:</strong> {formatDate(selectedVerification.submittedAt)}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-2">Submitted Student Card</h4>
                <div className="border rounded-lg p-4">
                  <img
                    src={selectedVerification.image}
                    alt="Student card"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-yellow-800 mb-2">Verification Guidelines</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Verify that the student ID on the card matches the registered ID</li>
                  <li>• Check that the photo on the card appears to match the student</li>
                  <li>• Ensure the card appears to be authentic and not tampered with</li>
                  <li>• Confirm the card is from the correct institution</li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => handleVerificationDecision(selectedVerification, 'rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleVerificationDecision(selectedVerification, 'approved')}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationReview;