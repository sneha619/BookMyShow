import React, { useState } from 'react';
import { Layout, Menu, Dropdown, Button, Input, Avatar, Space, Drawer, Typography, Badge } from 'antd';
import { UserOutlined, SearchOutlined, MenuOutlined, LogoutOutlined, DashboardOutlined, UserSwitchOutlined, HomeOutlined, TagOutlined, ProfileOutlined, SettingOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice.js';

const { Header: AntHeader } = Layout;
const { Search } = Input;
const { Text } = Typography;

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state?.users?.user ? state.users : { user: null });
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(setUser(null));
    navigate('/login');
  };

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/?search=${encodeURIComponent(value.trim())}`);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile')
    },
    {
      key: 'bookings',
      icon: <BellOutlined />,
      label: 'My Bookings',
      onClick: () => navigate('/profile')
    },
    ...(user?.isAdmin ? [{
      key: 'admin',
      icon: <SettingOutlined />,
      label: 'Admin Dashboard',
      onClick: () => navigate('/admin/dashboard')
    }] : []),
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const navigationItems = [
    { key: '/', label: 'Movies', path: '/' },
    { key: '/theaters', label: 'Theaters', path: '/theaters' },
    { key: '/events', label: 'Events', path: '/events' },
    { key: '/sports', label: 'Sports', path: '/sports' }
  ];

  const mobileMenuItems = [
    ...navigationItems.map(item => ({
      key: item.key,
      label: item.label,
      onClick: () => navigate(item.path)
    })),
    {
      type: 'divider'
    },
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: 'My Profile',
      onClick: () => navigate('/profile')
    },
    ...(user?.isAdmin ? [{
      key: 'admin',
      icon: <SettingOutlined />,
      label: 'Admin Dashboard',
      onClick: () => navigate('/admin/dashboard')
    }] : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ];

  const mobileMenu = (
    <Menu>
      {navigationItems.map(item => (
        <Menu.Item key={item.key} onClick={() => navigate(item.path)}>
          {item.label}
        </Menu.Item>
      ))}
      <Menu.Divider />
      <Menu.Item key="profile" icon={<ProfileOutlined />} onClick={() => navigate('/profile')}>
        My Profile
      </Menu.Item>
      {user?.isAdmin && (
        <Menu.Item key="admin" icon={<SettingOutlined />} onClick={() => navigate('/admin/dashboard')}>
          Admin Dashboard
        </Menu.Item>
      )}
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <AntHeader style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '70px'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div 
            style={{ 
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onClick={() => navigate('/')}
          >
            <div style={{
              fontSize: '28px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'flex',
              alignItems: 'center',
              letterSpacing: '-1px'
            }}>
              🎬 BookMyShow
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {navigationItems.map(item => (
              <Button
                key={item.key}
                type="text"
                icon={item.key === '/' ? <HomeOutlined /> : undefined}
                style={{
                  color: location.pathname === item.path ? '#ff6b6b' : 'rgba(255,255,255,0.8)',
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  fontSize: '16px',
                  height: '40px',
                  padding: '8px 16px',
                  border: 'none',
                  background: 'transparent'
                }}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
            
            <Search
              placeholder="Search for movies, theaters..."
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              style={{ 
                maxWidth: '400px', 
                width: '100%',
              }}
              onSearch={handleSearch}
            />
          </div>
        </div>

        {/* User Menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button 
            type="text" 
            icon={<TagOutlined />} 
            style={{ 
              color: 'rgba(255,255,255,0.8)', 
              border: 'none',
              fontSize: '14px',
              height: '40px'
            }}
            onClick={() => navigate('/profile')}
          >
            My Bookings
          </Button>
          
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <Button 
              type="text" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '20px',
                color: 'white',
                height: '40px'
              }}
            >
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#ff6b6b' }}
              />
              <Text style={{ color: 'white', fontSize: '14px' }}>{user?.name || 'User'}</Text>
            </Button>
          </Dropdown>

          {/* Mobile Menu Button */}
          <Button
            className="mobile-menu-btn"
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuVisible(true)}
            style={{ 
              display: 'none',
              color: 'white',
              fontSize: '18px'
            }}
          />
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={
          <div style={{
            fontSize: '20px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🎬 BookMyShow
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuVisible(false)}
        open={mobileMenuVisible}
        width={320}
        styles={{
          header: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          },
          body: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            padding: '24px'
          }
        }}
      >
        <div>
          {/* User Info */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <Avatar 
              size={48} 
              icon={<UserOutlined />} 
              style={{ backgroundColor: '#ff6b6b' }}
            />
            <div>
              <Text style={{ color: 'white', fontSize: '16px', fontWeight: 'bold', display: 'block' }}>
                {user?.name || 'User'}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                {user?.email || 'No email provided'}
              </Text>
            </div>
          </div>
          
          <Search
            placeholder="Search movies..."
            allowClear
            enterButton
            style={{ marginBottom: '24px' }}
            onSearch={handleSearch}
          />
          
          <Menu 
            mode="vertical" 
            style={{ 
              border: 'none',
              background: 'transparent'
            }}
            theme="dark"
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <span style={{ color: 'rgba(255,255,255,0.8)' }} onClick={() => navigate('/')}>Movies</span>
            </Menu.Item>
            
            <Menu.Item key="profile" icon={<UserOutlined />}>
              <span style={{ color: 'rgba(255,255,255,0.8)' }} onClick={() => navigate('/profile')}>My Profile</span>
            </Menu.Item>
            
            <Menu.Item key="bookings" icon={<TagOutlined />}>
              <span style={{ color: 'rgba(255,255,255,0.8)' }} onClick={() => navigate('/profile')}>My Bookings</span>
            </Menu.Item>
            
            {user?.isAdmin && (
              <Menu.Item key="admin" icon={<DashboardOutlined />}>
                <span style={{ color: 'rgba(255,255,255,0.8)' }} onClick={() => navigate('/admin/dashboard')}>Admin Dashboard</span>
              </Menu.Item>
            )}
            
            <Menu.Divider style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            
            <Menu.Item 
              key="logout" 
              icon={<LogoutOutlined />} 
              onClick={handleLogout}
              style={{ color: '#ff6b6b' }}
            >
              Logout
            </Menu.Item>
          </Menu>
        </div>
      </Drawer>

      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </AntHeader>
  );
}

export default Header;