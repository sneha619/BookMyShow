import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';
import { getCurrentUser } from '../apicalls/user';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
  const { user } = useSelector(state => state.user);
  const [localUser, setLocalUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Sync local state with Redux
  useEffect(() => {
    if (user) {
      setLocalUser(user);
    }
  }, [user]);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    if (isLoading) return false; // Prevent multiple simultaneous calls
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, skipping user data fetch');
        dispatch(setUser(null));
        return false;
      }
      
      const response = await getCurrentUser();
      if (response.success && response.data) {
        dispatch(setUser(response.data));
        return true;
      } else {
        console.warn('Failed to fetch user data:', response.message);
        // If fetching user data fails, clear the user state
        dispatch(setUser(null));
        return false;
      }
    } catch (error) {
      console.error('Auth hook error:', error);
      // Clear user state on error
      dispatch(setUser(null));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch(setUser(null));
    setLocalUser(null);
    navigate('/login');
  }, [dispatch, navigate]);

  return { localUser, isLoading, fetchUserData, logout };
};

export default useAuth;