export const signOut = (navigate) => {
    localStorage.removeItem('token'); // Clear the JWT token
    localStorage.removeItem('user'); // Clear user data
    navigate('/login'); // Redirect to login page
  };
  