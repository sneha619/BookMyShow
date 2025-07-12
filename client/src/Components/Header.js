import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Layout, Menu, Dropdown, Button, Input, Avatar, Space, Drawer, Typography, Badge } from 'antd';
import { UserOutlined, SearchOutlined, MenuOutlined, LogoutOutlined, HomeOutlined, TagOutlined, ProfileOutlined, SettingOutlined, BellOutlined, VideoCameraOutlined, ShopOutlined, PlusOutlined } from '@ant-design/icons';
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
  const { user } = useSelector(state => state.user);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  
  // Use Redux user directly instead of local state to prevent sync issues
  const localUser = user;
  
  // Debug logging when user changes
  useEffect(() => {
    if (user) {
      console.log('Header - User updated from Redux:', user);
      console.log('Header - User isAdmin:', user?.isAdmin);
    } else {
      console.log('Header - No user in Redux state');
    }
  }, [user]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch(setUser(null));
    navigate('/login');
  }, [dispatch, navigate]);

  const userMenuItems = useMemo(() => [
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
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ], [navigate, handleLogout]);

  const navigationItems = useMemo(() => {
    const baseItems = [
      { key: '/', label: 'Movies', path: '/' },
      { key: '/theaters', label: 'Theaters', path: '/theaters' },
      { key: '/events', label: 'Events', path: '/events' },
      { key: '/sports', label: 'Sports', path: '/sports' }
    ];
    
    // Only add admin items if user is logged in and is an admin
    if (localUser && localUser.isAdmin) {
      return [
        ...baseItems,
        { key: '/admin/add-content', label: 'Add Content', path: '/admin/add-content', icon: <PlusOutlined /> }
      ];
    }
    
    return baseItems;
  }, [localUser]);
  
  // If we're on the login or register page, don't show the header
  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

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
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
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
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, justifyContent: 'flex-start', marginLeft: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {navigationItems.map(item => (
              <Button
                key={item.key}
                type="text"
                icon={item.key === '/' ? <HomeOutlined /> : item.icon}
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
          </div>
        </div>

        {/* User Menu or Login/Register */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto', marginRight: '20px' }}>
          {localUser ? (
            <>
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
                  <Text style={{ color: 'white', fontSize: '14px' }}>{localUser.name}</Text>
                </Button>
              </Dropdown>
            </>
          ) : (
            <>
              <Button 
                type="text" 
                style={{ 
                  color: 'rgba(255,255,255,0.8)', 
                  border: 'none',
                  fontSize: '14px',
                  height: '40px'
                }}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                type="primary" 
                style={{ 
                  background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                  border: 'none',
                  borderRadius: '20px',
                  height: '40px'
                }}
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </>
          )}

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
          {localUser ? (
            <>
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
                    {localUser.name}
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                    {localUser.email || 'No email provided'}
                  </Text>
                </div>
              </div>
              
              <Menu 
                mode="vertical" 
                style={{ 
                  border: 'none',
                  background: 'transparent'
                }}
                theme="dark"
              >
                {navigationItems.map(item => (
                   <Menu.Item key={item.key} icon={item.key === '/' ? <HomeOutlined /> : item.icon} onClick={() => navigate(item.path)}>
                     <span style={{ color: 'rgba(255,255,255,0.8)' }}>{item.label}</span>
                   </Menu.Item>
                 ))}
                
                <Menu.Item key="profile" icon={<UserOutlined />} onClick={() => navigate('/profile')}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>My Profile</span>
                </Menu.Item>
                
                <Menu.Item key="bookings" icon={<TagOutlined />} onClick={() => navigate('/profile')}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>My Bookings</span>
                </Menu.Item>
                
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
            </>
          ) : (
            <>
              <div style={{ padding: '16px', marginBottom: '24px', textAlign: 'center' }}>
                <Text style={{ color: 'white', fontSize: '16px', marginBottom: '16px', display: 'block' }}>
                  Sign in to access your account
                </Text>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    block
                    size="large"
                    style={{ 
                      background: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      height: '44px',
                      marginBottom: '12px'
                    }}
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    block
                    size="large"
                    style={{ 
                      borderRadius: '8px',
                      height: '44px',
                      borderColor: 'rgba(255,255,255,0.3)',
                      color: 'white'
                    }}
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </Space>
              </div>
              
              <Menu 
                mode="vertical" 
                style={{ 
                  border: 'none',
                  background: 'transparent'
                }}
                theme="dark"
              >
                <Menu.Item key="home" icon={<HomeOutlined />} onClick={() => navigate('/')}>
                  <span style={{ color: 'rgba(255,255,255,0.8)' }}>Movies</span>
                </Menu.Item>
              </Menu>
            </>
          )}
        </div>
      </Drawer>

      <style jsx="true">{`
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

export default React.memo(Header);