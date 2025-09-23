// Utility functions for handling authentication

export const handleAuthError = (response: Response, errorMessage: string = 'Authentication failed') => {
  console.log(`handleAuthError - Response status: ${response.status}, Message: ${errorMessage}`);
  
  if (response.status === 401) {
    console.log('handleAuthError - 401 error detected, clearing auth state');
    // Clear token from localStorage
    localStorage.removeItem('token');
    
    // Dispatch a custom event that AuthContext can listen to
    window.dispatchEvent(new CustomEvent('auth:logout', { 
      detail: { reason: 'token_invalid' } 
    }));
    
    throw new Error(errorMessage);
  }
  
  // For non-401 errors, just throw the original error
  throw new Error(`HTTP ${response.status}: ${errorMessage}`);
};

export const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  console.log('getAuthHeaders - token from localStorage:', token ? 'present' : 'missing');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
