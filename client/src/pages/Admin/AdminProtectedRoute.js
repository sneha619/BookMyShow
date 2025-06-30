import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

function AdminProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user is not an admin, show access denied page
  if (!user.isAdmin) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page. Admin privileges required."
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          }
        />
      </div>
    );
  }

  // If user is admin, render the children
  return children;
}

export default AdminProtectedRoute;