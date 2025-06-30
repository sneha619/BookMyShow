import React from 'react';
import { Tabs } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard';
import MoviesList from './MoviesList';
import TheatersList from './TheatersList';

function Admin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  const items = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      children: <Dashboard />
    },
    {
      key: 'movies',
      label: 'Movies',
      children: <MoviesList />
    },
    {
      key: 'theaters',
      label: 'Theaters',
      children: <TheatersList />
    }
  ];

  // Determine active tab based on pathname
  let activeKey = 'dashboard';
  if (pathname.includes('movies')) {
    activeKey = 'movies';
  } else if (pathname.includes('theaters')) {
    activeKey = 'theaters';
  }

  const onChange = (key) => {
    switch(key) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'movies':
        navigate('/admin/movies');
        break;
      case 'theaters':
        navigate('/admin/theaters');
        break;
      default:
        navigate('/admin');
    }
  };

  return (
    <div className="admin-container" style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Admin Panel</h1>
      <Tabs 
        activeKey={activeKey} 
        onChange={onChange} 
        items={items} 
        type="card"
        style={{ marginBottom: '16px' }}
      />
    </div>
  );
}

export default Admin;