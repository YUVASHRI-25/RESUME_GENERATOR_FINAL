import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navigation = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">ResumeMaster</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {user?.picture ? (
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <User className="w-8 h-8 text-gray-400" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {user?.name || user?.email}
              </span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
