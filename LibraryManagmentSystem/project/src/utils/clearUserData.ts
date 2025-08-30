// Utility function to clear all user data from localStorage
export const clearAllUserData = () => {
  // Remove all registered users
  localStorage.removeItem('registeredUsers');
  
  // Remove all borrowed books
  localStorage.removeItem('borrowedBooks');
  
  // Remove all fines
  localStorage.removeItem('fines');
  
  // Remove all pending verifications
  localStorage.removeItem('pendingVerifications');
  
  // Remove individual verification data
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith('verification_')) {
      localStorage.removeItem(key);
    }
  });
  
  console.log('All user data cleared from localStorage');
};