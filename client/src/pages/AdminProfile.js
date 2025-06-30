import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, message, Statistic, Table, Tag, Typography, Space, Avatar, Divider } from 'antd';
import { UserOutlined, DashboardOutlined, VideoCameraOutlined, ShopOutlined, BookOutlined, SettingOutlined, EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { getAllMovies } from '../apicalls/movies';
import { getAllTheaters } from '../apicalls/theaters';
import { getAllBookings } from '../apicalls/bookings';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title, Text } = Typography;

function AdminProfile() {
  const { user } = useSelector(state => state.user);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheaters: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeMovies: 0,
    activeTheaters: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      
      // Fetch movies
      const moviesResponse = await getAllMovies();
      const movies = moviesResponse.success ? moviesResponse.data : [];
      
      // Fetch theaters
      const theatersResponse = await getAllTheaters();
      const theaters = theatersResponse.success ? theatersResponse.data : [];
      
      // Fetch bookings
      const bookingsResponse = await getAllBookings();
      const bookings = bookingsResponse.success ? bookingsResponse.data : [];
      
      // Calculate stats
      const totalRevenue = bookings
        .filter(booking => booking.bookingStatus === 'confirmed')
        .reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
      
      const activeMovies = movies.filter(movie => movie.isActive).length;
      const activeTheaters = theaters.filter(theater => theater.isActive).length;
      
      setStats({
        totalMovies: movies.length,
        totalTheaters: theaters.length,
        totalBookings: bookings.length,
        totalRevenue,
        activeMovies,
        activeTheaters
      });
      
      // Set recent bookings (last 5)
      const sortedBookings = bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setRecentBookings(sortedBookings);
      
    } catch (error) {
      message.error('Failed to fetch admin statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const quickActions = [
    {
      title: 'Manage Movies',
      description: 'Add, edit, or remove movies',
      icon: <VideoCameraOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      action: () => navigate('/admin/movies'),
      color: '#1890ff'
    },
    {
      title: 'Manage Theaters',
      description: 'Add, edit, or remove theaters',
      icon: <ShopOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      action: () => navigate('/admin/theaters'),
      color: '#52c41a'
    },
    {
      title: 'View Dashboard',
      description: 'Access full admin dashboard',
      icon: <DashboardOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
      action: () => navigate('/admin/dashboard'),
      color: '#722ed1'
    }
  ];

  const bookingColumns = [
    {
      title: 'Movie',
      dataIndex: ['show', 'movie', 'title'],
      key: 'movie',
      render: (title) => title || 'N/A'
    },
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'user',
      render: (name) => name || 'N/A'
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (amount) => `₹${amount || 0}`
    },
    {
      title: 'Status',
      dataIndex: 'bookingStatus',
      key: 'status',
      render: (status) => {
        const color = status === 'confirmed' ? 'green' : status === 'pending' ? 'orange' : 'red';
        return <Tag color={color}>{status?.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'date',
      render: (date) => moment(date).format('MMM DD, YYYY')
    }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Admin Header */}
        <Card style={{ 
          marginBottom: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: 'none',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={6}>
              <div style={{ textAlign: 'center' }}>
                <Avatar 
                  size={120} 
                  icon={<UserOutlined />} 
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    border: '4px solid rgba(255,255,255,0.3)'
                  }} 
                />
              </div>
            </Col>
            <Col xs={24} md={18}>
              <div>
                <Title level={2} style={{ margin: 0, marginBottom: '8px', color: 'white' }}>
                  👑 {user?.name || 'Admin'}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
                  {user?.email || 'No email provided'}
                </Text>
                <Space size="large">
                  <div>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block' }}>Role</Text>
                    <Tag color="gold" style={{ marginTop: '4px' }}>
                      🛡️ System Administrator
                    </Tag>
                  </div>
                  <div>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block' }}>Admin Since</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      {user?.createdAt ? moment(user.createdAt).format('MMMM YYYY') : 'Unknown'}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block' }}>Total Revenue</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                      ₹{stats.totalRevenue.toLocaleString()}
                    </Text>
                  </div>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Statistics Cards */}
        <Row gutter={[24, 24]} style={{ marginBottom: '32px' }}>
          <Col xs={12} sm={8} md={6}>
            <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
              <Statistic
                title="Total Movies"
                value={stats.totalMovies}
                prefix={<VideoCameraOutlined style={{ color: '#1890ff' }} />}
                suffix={<Text type="secondary">({stats.activeMovies} active)</Text>}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
              <Statistic
                title="Total Theaters"
                value={stats.totalTheaters}
                prefix={<ShopOutlined style={{ color: '#52c41a' }} />}
                suffix={<Text type="secondary">({stats.activeTheaters} active)</Text>}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
              <Statistic
                title="Total Bookings"
                value={stats.totalBookings}
                prefix={<BookOutlined style={{ color: '#faad14' }} />}
              />
            </Card>
          </Col>
          <Col xs={12} sm={8} md={6}>
            <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
              <Statistic
                title="Total Revenue"
                value={stats.totalRevenue}
                prefix="₹"
                precision={0}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Card style={{
          marginBottom: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: 'none'
        }}>
          <Title level={3} style={{ marginBottom: '24px' }}>⚡ Quick Actions</Title>
          <Row gutter={[24, 24]}>
            {quickActions.map((action, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '12px',
                    border: `2px solid ${action.color}`,
                    cursor: 'pointer'
                  }}
                  onClick={action.action}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ marginBottom: '16px' }}>
                      {action.icon}
                    </div>
                    <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>
                      {action.title}
                    </Title>
                    <Text type="secondary">{action.description}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Recent Bookings */}
        <Card style={{
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: 'none'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <Title level={3} style={{ margin: 0 }}>📊 Recent Bookings</Title>
              <Text type="secondary">Latest booking activities</Text>
            </div>
            <Button 
              type="primary" 
              icon={<EyeOutlined />}
              onClick={() => navigate('/admin/dashboard')}
            >
              View All
            </Button>
          </div>
          
          <Table
            columns={bookingColumns}
            dataSource={recentBookings}
            rowKey="_id"
            loading={loading}
            pagination={false}
            size="middle"
          />
        </Card>
      </div>
    </div>
  );
}

export default AdminProfile;