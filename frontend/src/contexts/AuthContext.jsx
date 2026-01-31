import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuthStatus = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      
      // Check if Google Client ID is configured
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId || clientId === 'demo-client-id.apps.googleusercontent.com') {
        throw new Error('Google Client ID not configured. Please check your .env file.');
      }

      // Initialize Google Identity Services
      if (!window.google) {
        throw new Error('Google Identity Services not loaded. Please refresh the page and try again.');
      }

      return new Promise((resolve, reject) => {
        // Initialize the Google Sign-In client
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'profile email',
          callback: (response) => {
            if (response.access_token) {
              // Get user info using the access token
              fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${response.access_token}`)
                .then(res => {
                  if (!res.ok) {
                    throw new Error('Failed to fetch user information');
                  }
                  return res.json();
                })
                .then(userData => {
                  const userWithToken = {
                    ...userData,
                    token: response.access_token,
                    id: userData.id
                  };

                  // Store in localStorage
                  localStorage.setItem('authToken', response.access_token);
                  localStorage.setItem('userData', JSON.stringify(userWithToken));
                  
                  setUser(userWithToken);
                  setIsLoading(false);
                  resolve({ success: true, user: userWithToken });
                })
                .catch(error => {
                  console.error('Error fetching user data:', error);
                  setIsLoading(false);
                  reject(new Error('Failed to get user information from Google'));
                });
            } else {
              setIsLoading(false);
              reject(new Error('No access token received from Google'));
            }
          },
          error_callback: (error) => {
            console.error('Google OAuth Error:', error);
            setIsLoading(false);
            reject(new Error('Google authentication failed: ' + (error.error || 'Unknown error')));
          }
        });

        // Request the token
        try {
          client.requestAccessToken();
        } catch (error) {
          setIsLoading(false);
          reject(new Error('Failed to request Google access token'));
        }
      });
      
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    // Revoke Google token if available
    if (window.google && window.google.accounts && window.google.accounts.oauth2) {
      const token = localStorage.getItem('authToken');
      if (token) {
        window.google.accounts.oauth2.revoke(token);
      }
    }
    
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
