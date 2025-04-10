export const signOut = (navigate) => {
    localStorage.removeItem('token'); // Clear the JWT token
    localStorage.removeItem('user'); // Clear user data
    navigate('/login'); // Redirect to login page
  };
  
// Function to get authentication configuration for API requests
export const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};
  