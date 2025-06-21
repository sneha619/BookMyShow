import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Button, message } from 'antd';
import { UserOutlined, VideoCameraOutlined, ShopOutlined, BookOutlined } from '@ant-design/icons';
import { getAllMovies } from '../../apicalls/movies';
import { getAllTheaters } from '../../apicalls/theaters';
import { getAllBookings } from '../../apicalls/bookings';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheaters: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
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
        .reduce((sum, booking) => sum + booking.totalAmount, 0);
      
      setStats({
        totalMovies: movies.length,
        totalTheaters: theaters.length,
        totalBookings: bookings.length,
        totalRevenue
      });
      
      // Set recent bookings (last 10)
      setRecentBookings(bookings.slice(0, 10));
      
    } catch (error) {
      message.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const bookingColumns = [
    {
      title: 'Booking ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => id.slice(-8).toUpperCase()
    },
    {
      title: 'Movie',
      dataIndex: ['show', 'movie', 'title'],
      key: 'movie'
    },
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'user'
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'amount',
      render: (amount) => `₹${amount}`
    },
    {
      title: 'Status',
      dataIndex: 'bookingStatus',
      key: 'status',
      render: (status) => {
        const color = status === 'confirmed' ? 'green' : status === 'pending' ? 'orange' : 'red';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'bookingDate',
      key: 'date',
      render: (date) => moment(date).format('MMM DD, YYYY')
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Manage your BookMyShow platform
        </p>
      </div>

      {/* Stats Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Movies"
              value={stats.totalMovies}
              prefix={<VideoCameraOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Theaters"
              value={stats.totalTheaters}
              prefix={<ShopOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={stats.totalBookings}
              prefix={<BookOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={stats.totalRevenue}
              prefix="₹"
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Card title="Quick Actions" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Button 
              type="primary" 
              block 
              size="large"
              onClick={() => navigate('/admin/movies')}
            >
              Manage Movies
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              block 
              size="large"
              onClick={() => navigate('/admin/theaters')}
            >
              Manage Theaters
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              block 
              size="large"
              onClick={() => navigate('/admin/shows')}
            >
              Manage Shows
            </Button>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Button 
              block 
              size="large"
              onClick={() => navigate('/admin/bookings')}
            >
              View All Bookings
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Recent Bookings */}
      <Card title="Recent Bookings">
        <Table
          columns={bookingColumns}
          dataSource={recentBookings}
          rowKey="_id"
          loading={loading}
          pagination={false}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
}

export default AdminDashboard;