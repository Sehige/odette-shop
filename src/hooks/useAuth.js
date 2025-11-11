import { useState, useEffect, createContext, useContext } from 'react';

/**
 * Authentication Hook for Odette Pastry Shop
 * Manages user authentication state and operations
 */

// Create Auth Context
const AuthContext = createContext(null);

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for existing session on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if user is authenticated
  const checkAuthStatus = () => {
    try {
      const storedUser = localStorage.getItem('odette_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // In a real application, this would be an API call
      // For now, we'll simulate authentication
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Simulate checking credentials (in real app, this would be server-side)
      const users = JSON.parse(localStorage.getItem('odette_users') || '[]');
      const existingUser = users.find(u => u.email === email);

      if (!existingUser) {
        throw new Error('Invalid email or password');
      }

      // In a real app, you'd verify the password hash on the server
      if (existingUser.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Create user session
      const userSession = {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        phone: existingUser.phone || '',
        addresses: existingUser.addresses || [],
        createdAt: existingUser.createdAt,
        lastLogin: new Date().toISOString()
      };

      // Store session
      localStorage.setItem('odette_user', JSON.stringify(userSession));
      setUser(userSession);

      return { success: true, user: userSession };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // Validate input
      if (!userData.name || !userData.email || !userData.password) {
        throw new Error('Name, email, and password are required');
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Validate password strength
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('odette_users') || '[]');
      const existingUser = users.find(u => u.email === userData.email);

      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        password: userData.password, // In real app, this would be hashed on server
        phone: userData.phone || '',
        addresses: [],
        createdAt: new Date().toISOString()
      };

      // Save user
      users.push(newUser);
      localStorage.setItem('odette_users', JSON.stringify(users));

      // Create session
      const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        addresses: [],
        createdAt: newUser.createdAt,
        lastLogin: new Date().toISOString()
      };

      localStorage.setItem('odette_user', JSON.stringify(userSession));
      setUser(userSession);

      return { success: true, user: userSession };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    try {
      localStorage.removeItem('odette_user');
      setUser(null);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error during logout:', err);
      return { success: false, error: err.message };
    }
  };

  // Update user profile
  const updateProfile = async (updates) => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update user data
      const updatedUser = { ...user, ...updates };

      // Update in storage
      const users = JSON.parse(localStorage.getItem('odette_users') || '[]');
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem('odette_users', JSON.stringify(users));
      }

      localStorage.setItem('odette_user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Add address
  const addAddress = async (address) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const newAddress = {
        id: `addr_${Date.now()}`,
        ...address,
        createdAt: new Date().toISOString()
      };

      const updatedAddresses = [...(user.addresses || []), newAddress];
      return await updateProfile({ addresses: updatedAddresses });
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Remove address
  const removeAddress = async (addressId) => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
      return await updateProfile({ addresses: updatedAddresses });
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Get user orders
  const getUserOrders = () => {
    try {
      if (!user) {
        return [];
      }

      const allOrders = JSON.parse(localStorage.getItem('odette_orders') || '[]');
      return allOrders.filter(order => order.customer.email === user.email);
    } catch (err) {
      console.error('Error retrieving user orders:', err);
      return [];
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    addAddress,
    removeAddress,
    getUserOrders
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    // If used outside provider, return a default implementation
    console.warn('useAuth must be used within AuthProvider. Returning default values.');
    return {
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      login: async () => ({ success: false, error: 'Auth not configured' }),
      register: async () => ({ success: false, error: 'Auth not configured' }),
      logout: () => ({ success: false, error: 'Auth not configured' }),
      updateProfile: async () => ({ success: false, error: 'Auth not configured' }),
      addAddress: async () => ({ success: false, error: 'Auth not configured' }),
      removeAddress: async () => ({ success: false, error: 'Auth not configured' }),
      getUserOrders: () => []
    };
  }
  
  return context;
};

// Helper function to check if user is authenticated (without context)
export const isUserAuthenticated = () => {
  try {
    const user = localStorage.getItem('odette_user');
    return !!user;
  } catch {
    return false;
  }
};

// Helper function to get current user (without context)
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('odette_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export default useAuth;