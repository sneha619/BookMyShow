import React from 'react';
import { Tabs, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusOutlined } from '@ant-design/icons';
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Admin Panel</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => navigate('/admin/add-content')}
          style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none'
          }}
        >
          Add Content
        </Button>
      </div>
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