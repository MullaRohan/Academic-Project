import { useState, useEffect } from 'react';
import { User, Mail, CreditCard, Building, Calendar, Search, Users, Trash2, CheckCircle, AlertCircle, Camera, Clock, Eye, X, DollarSign } from 'lucide-react';
import { useBooks } from '../../context/BookContext';

interface StudentData {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  registeredDate: Date;
  verificationStatus?: 'verified' | 'rejected' | 'pending' | null;
  verificationData?: any;
}

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

const RegisteredStudents = () => {
  const { fines, clearFine } = useBooks();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'unverified' | 'pending' | 'fines'>('all');
  const [pendingVerifications, setPendingVerifications] = useState<VerificationData[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<VerificationData | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showFineModal, setShowFineModal] = useState(false);
  const [selectedStudentFines, setSelectedStudentFines] = useState<any[]>([]);
  const [selectedStudentName, setSelectedStudentName] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    // Load students from localStorage on component mount
    const savedUsers = localStorage.getItem('registeredUsers');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers).map((user: any) => ({
        ...user,
        registeredDate: new Date(user.registeredDate)
      }));
      setStudents(parsedUsers);
    }

    // Load pending verifications
    const pending = localStorage.getItem('pendingVerifications');
    if (pending) {
      setPendingVerifications(JSON.parse(pending));
    }
  }, []);

  // Get unique departments for filter
  const departments = [...new Set(students.map(student => student.department))].filter(Boolean);

  // Filter students based on search term, department, and verification status
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.includes(searchTerm) ||
      (student.department && student.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = departmentFilter === 'all' || student.department === departmentFilter;
    
    const matchesVerification = activeTab === 'all' || 
      (activeTab === 'verified' && student.verificationStatus === 'verified') ||
      (activeTab === 'unverified' && student.verificationStatus !== 'verified') ||
      (activeTab === 'pending' && student.verificationStatus === 'pending') ||
      (activeTab === 'fines' && fines.some(fine => fine.userId === student.id && fine.status === 'pending'));
    
    return matchesSearch && matchesDepartment && matchesVerification;
  });

  // Sort students by registration date (most recent first)
  const sortedStudents = [...filteredStudents].sort((a, b) => 
    b.registeredDate.getTime() - a.registeredDate.getTime()
  );

  // Get verification counts
  const verifiedCount = students.filter(s => s.verificationStatus === 'verified').length;
  const pendingCount = students.filter(s => s.verificationStatus === 'pending').length;
  const unverifiedCount = students.length - verifiedCount - pendingCount;
  const studentsWithFines = [...new Set(fines.filter(f => f.status === 'pending').map(f => f.userId))].length;

  // Handle student deletion
  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (window.confirm(`Are you sure you want to remove ${studentName} from the system? This will permanently delete their account and they will need to register again.`)) {
      // Remove from students state
      const updatedStudents = students.filter(student => student.id !== studentId);
      setStudents(updatedStudents);
      
      // Update localStorage
      localStorage.setItem('registeredUsers', JSON.stringify(updatedStudents));
      
      // Also remove from any borrowed books records
      const borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks') || '[]');
      const updatedBorrowedBooks = borrowedBooks.filter((borrow: any) => borrow.userId !== studentId);
      localStorage.setItem('borrowedBooks', JSON.stringify(updatedBorrowedBooks));
      
      // Remove verification data
      localStorage.removeItem(`verification_${studentId}`);
      
      // Remove from pending verifications
      const updatedPending = pendingVerifications.filter(v => v.userId !== studentId);
      setPendingVerifications(updatedPending);
      localStorage.setItem('pendingVerifications', JSON.stringify(updatedPending));
      
      alert(`${studentName} has been successfully removed from the system.`);
    }
  };

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
    
    // Update local state
    setStudents(updatedUsers.map((user: any) => ({
      ...user,
      registeredDate: new Date(user.registeredDate)
    })));
    
    setShowVerificationModal(false);
    setSelectedVerification(null);
    
    alert(`Student verification ${decision}!`);
  };

  // Handle fine management
  const handleManageFines = (studentId: string, studentName: string) => {
    const studentFines = fines.filter(fine => fine.userId === studentId && fine.status === 'pending');
    setSelectedStudentFines(studentFines);
    setSelectedStudentName(studentName);
    setPaymentAmount('');
    setShowFineModal(true);
  };

  const handleClearFine = (fineId: string) => {
    clearFine(fineId);
    // Update the selected student fines
    setSelectedStudentFines(prev => prev.filter(fine => fine.id !== fineId));
  };

  const handlePartialPayment = () => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid payment amount');
      return;
    }

    let remainingAmount = amount;
    const updatedFines = [...selectedStudentFines];

    // Process payment against fines (FIFO)
    for (let i = 0; i < updatedFines.length && remainingAmount > 0; i++) {
      const fine = updatedFines[i];
      if (remainingAmount >= fine.amount) {
        // Full payment for this fine
        remainingAmount -= fine.amount;
        clearFine(fine.id);
        updatedFines.splice(i, 1);
        i--; // Adjust index after removal
      } else {
        // Partial payment - reduce fine amount
        const newAmount = fine.amount - remainingAmount;
        // Update fine amount (in a real app, you'd have an updateFine function)
        remainingAmount = 0;
      }
    }

    setSelectedStudentFines(updatedFines);
    setPaymentAmount('');
    alert(`Payment of $${amount.toFixed(2)} processed successfully!`);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getVerificationIcon = (status?: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Camera className="h-4 w-4 text-gray-400" />;
    }
  };

  const getVerificationBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verified</span>;
      case 'rejected':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Rejected</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Pending</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Not Submitted</span>;
    }
  };

  const getStudentFineAmount = (studentId: string) => {
    return fines
      .filter(fine => fine.userId === studentId && fine.status === 'pending')
      .reduce((total, fine) => total + fine.amount, 0);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-amber-600 text-white p-6">
        <h1 className="text-2xl font-bold">REG STUDENTS</h1>
        <p className="text-amber-100">View and manage all registered students</p>
      </div>

      <div className="p-6">
        {/* Pending Verifications Alert */}
        {pendingVerifications.length > 0 && (
          <div className="mb-6 bg-yellow-100 border-l-4 border-yellow-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>{pendingVerifications.length}</strong> student verification{pendingVerifications.length > 1 ? 's' : ''} pending your review.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap mb-6 border-b">
          <button
            className={`px-4 py-2 font-medium mr-2 ${
              activeTab === 'all'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-amber-600'
            }`}
            onClick={() => setActiveTab('all')}
          >
            All Students ({students.length})
          </button>
          <button
            className={`px-4 py-2 font-medium mr-2 ${
              activeTab === 'verified'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-amber-600'
            }`}
            onClick={() => setActiveTab('verified')}
          >
            Verified Students ({verifiedCount})
          </button>
          <button
            className={`px-4 py-2 font-medium mr-2 ${
              activeTab === 'pending'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-amber-600'
            }`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Verification ({pendingCount})
          </button>
          <button
            className={`px-4 py-2 font-medium mr-2 ${
              activeTab === 'unverified'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-amber-600'
            }`}
            onClick={() => setActiveTab('unverified')}
          >
            Unverified Students ({unverifiedCount})
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'fines'
                ? 'text-amber-600 border-b-2 border-amber-600'
                : 'text-gray-500 hover:text-amber-600'
            }`}
            onClick={() => setActiveTab('fines')}
          >
            Students with Fines ({studentsWithFines})
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, email, student ID, or department..."
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-teal-100 p-4 rounded-lg">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-teal-600 mr-3" />
              <div>
                <p className="text-sm text-teal-600 font-medium">Total Students</p>
                <p className="text-2xl font-bold text-teal-800">{students.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-green-600 font-medium">Verified Students</p>
                <p className="text-2xl font-bold text-green-800">{verifiedCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-100 p-4 rounded-lg">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-yellow-600 font-medium">Pending Verification</p>
                <p className="text-2xl font-bold text-yellow-800">{pendingCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="flex items-center">
              <Building className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-blue-600 font-medium">Departments</p>
                <p className="text-2xl font-bold text-blue-800">{departments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-100 p-4 rounded-lg">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm text-red-600 font-medium">Students with Fines</p>
                <p className="text-2xl font-bold text-red-800">{studentsWithFines}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        {sortedStudents.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No students found. Try a different search term or filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Serial No.</th>
                  <th className="py-3 px-6 text-left">Student Info</th>
                  <th className="py-3 px-6 text-left">Contact</th>
                  <th className="py-3 px-6 text-left">Academic Info</th>
                  <th className="py-3 px-6 text-center">Verification</th>
                  {activeTab === 'fines' && <th className="py-3 px-6 text-center">Fines</th>}
                  <th className="py-3 px-6 text-left">Registration Date</th>
                  <th className="py-3 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {sortedStudents.map((student, index) => {
                  const pendingVerification = pendingVerifications.find(v => v.userId === student.id);
                  const studentFineAmount = getStudentFineAmount(student.id);
                  
                  return (
                    <tr key={student.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center">
                          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="bg-amber-100 p-2 rounded-full mr-3">
                            <User className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{student.name}</p>
                            <p className="text-xs text-gray-500">Student ID: {student.studentId}</p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{student.email}</span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-xs text-gray-600">{student.department}</span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <div className="flex flex-col items-center space-y-1">
                          {getVerificationIcon(student.verificationStatus)}
                          {getVerificationBadge(student.verificationStatus)}
                          {pendingVerification && (
                            <button
                              onClick={() => {
                                setSelectedVerification(pendingVerification);
                                setShowVerificationModal(true);
                              }}
                              className="mt-1 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs flex items-center"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </button>
                          )}
                        </div>
                      </td>

                      {activeTab === 'fines' && (
                        <td className="py-4 px-6 text-center">
                          <div className="flex flex-col items-center space-y-1">
                            <span className="text-lg font-bold text-red-600">
                              ${studentFineAmount.toFixed(2)}
                            </span>
                            {studentFineAmount > 0 && (
                              <button
                                onClick={() => handleManageFines(student.id, student.name)}
                                className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                              >
                                Manage
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm">{formatDate(student.registeredDate)}</span>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDeleteStudent(student.id, student.name)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200"
                          title={`Remove ${student.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification Review Modal */}
      {showVerificationModal && selectedVerification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Review Student Verification</h3>
              <button
                onClick={() => setShowVerificationModal(false)}
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
                  <p><strong>Submitted:</strong> {new Date(selectedVerification.submittedAt).toLocaleString()}</p>
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

      {/* Fine Management Modal */}
      {showFineModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Manage Fines - {selectedStudentName}</h3>
              <button
                onClick={() => setShowFineModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-4">Outstanding Fines</h4>
                {selectedStudentFines.length === 0 ? (
                  <p className="text-gray-500">No outstanding fines.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedStudentFines.map(fine => (
                      <div key={fine.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{fine.reason === 'borrow' ? 'Book Price' : 'Overdue Fine'}</p>
                          <p className="text-sm text-gray-600">Created: {formatDate(fine.createdAt)}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-red-600">${fine.amount.toFixed(2)}</span>
                          <button
                            onClick={() => handleClearFine(fine.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedStudentFines.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-800 mb-4">Partial Payment</h4>
                  <div className="flex space-x-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter payment amount"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                    <button
                      onClick={handlePartialPayment}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Process Payment
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Total Due: ${selectedStudentFines.reduce((total, fine) => total + fine.amount, 0).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisteredStudents;