import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, message, Modal, Spin, Tag, Typography, Space, Divider, Empty, Avatar } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, DeleteOutlined, EyeOutlined, TagOutlined } from '@ant-design/icons';
import { getUserBookings, cancelBooking } from '../apicalls/bookings';
import { useSelector } from 'react-redux';
import moment from 'moment';

const { Title, Text } = Typography;

function Profile() {
  const { user } = useSelector(state => state?.users?.user ? state.users : { user: null });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const getBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();
      if (response.success) {
        setBookings(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, []);

  const handleCancelBooking = async () => {
    try {
      const response = await cancelBooking(selectedBooking._id);
      if (response.success) {
        message.success('Booking cancelled successfully');
        getBookings();
        setCancelModal(false);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Something went wrong');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#52c41a';
      case 'pending': return '#faad14';
      case 'cancelled': return '#ff4d4f';
      default: return '#1890ff';
    }
  };

  const canCancelBooking = (booking) => {
    if (!booking || booking.bookingStatus !== 'confirmed') return false;
    const showDate = booking?.show?.date;
    const showTime = booking?.show?.time;
    if (!showDate || !showTime) return false;
    const showDateTime = moment(`${showDate} ${showTime}`);
    const now = moment();
    return showDateTime.diff(now, 'hours') > 2;
  };

  const getBookingStatusText = (booking) => {
    if (!booking || !booking.bookingStatus) return 'Unknown';
    switch (booking.bookingStatus) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Payment Pending';
      case 'cancelled': return 'Cancelled';
      default: return booking.bookingStatus;
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Profile Header */}
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
                  {user?.name || 'User'}
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', display: 'block', marginBottom: '16px' }}>
                  {user?.email || 'No email provided'}
                </Text>
                <Space size="large">
                  <div>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block' }}>Role</Text>
                    <Tag color={user?.isAdmin ? 'gold' : 'blue'} style={{ marginTop: '4px' }}>
                      {user?.isAdmin ? '👑 Admin' : '🎬 Movie Lover'}
                    </Tag>
                  </div>
                  <div>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block' }}>Member Since</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                      {user?.createdAt ? moment(user.createdAt).format('MMMM YYYY') : 'Unknown'}
                    </Text>
                  </div>
                  <div>
                    <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', display: 'block' }}>Total Bookings</Text>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>
                      {bookings.length}
                    </Text>
                  </div>
                </Space>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Bookings Section */}
        <Card style={{
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: 'none'
        }}>
          <div style={{ marginBottom: '24px' }}>
            <Title level={3} style={{ margin: 0, color: '#333' }}>
              🎫 My Bookings
            </Title>
            <Text style={{ color: '#666' }}>Manage your movie ticket bookings</Text>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>
                <Text style={{ color: '#666' }}>Loading your bookings...</Text>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div>
                  <Text style={{ fontSize: '16px', color: '#666' }}>No bookings found</Text>
                  <br />
                  <Text style={{ color: '#999' }}>Start booking your favorite movies!</Text>
                </div>
              }
              style={{ padding: '60px 0' }}
            />
          ) : (
            <Row gutter={[24, 24]}>
              {bookings.map((booking) => (
                <Col xs={24} md={12} lg={8} key={booking._id}>
                  <Card
                    style={{
                      borderRadius: '12px',
                      border: `2px solid ${getStatusColor(booking.bookingStatus)}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      transition: 'all 0.3s ease'
                    }}
                    bodyStyle={{ padding: '20px' }}
                    hoverable
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <Title level={5} style={{ margin: 0, fontSize: '16px' }}>
                          {booking?.show?.movie?.title || 'Untitled Movie'}
                        </Title>
                        <Tag 
                          color={getStatusColor(booking?.bookingStatus)}
                          style={{ 
                            borderRadius: '12px',
                            fontWeight: 'bold',
                            fontSize: '10px'
                          }}
                        >
                          {getBookingStatusText(booking)}
                        </Tag>
                      </div>
                      
                      <div style={{ marginBottom: '12px' }}>
                        <img
                          src={booking?.show?.movie?.poster || '/placeholder-movie.jpg'}
                          alt={booking?.show?.movie?.title || 'Movie'}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }}
                        />
                      </div>
                    </div>
                    
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <EnvironmentOutlined style={{ color: '#666', marginRight: '8px' }} />
                        <Text style={{ fontSize: '13px', color: '#666' }}>
                          {booking?.show?.theater?.name || 'Theater information unavailable'}
                        </Text>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarOutlined style={{ color: '#666', marginRight: '8px' }} />
                        <Text style={{ fontSize: '13px', color: '#666' }}>
                          {booking?.show?.date ? moment(booking.show.date).format('MMM DD, YYYY') : 'Date unavailable'}
                        </Text>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ClockCircleOutlined style={{ color: '#666', marginRight: '8px' }} />
                        <Text style={{ fontSize: '13px', color: '#666' }}>
                          {booking?.show?.time ? moment(booking.show.time, 'HH:mm').format('hh:mm A') : 'Time unavailable'}
                        </Text>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <TagOutlined style={{ color: '#666', marginRight: '8px' }} />
                        <Text style={{ fontSize: '13px', color: '#666' }}>
                          Seats: <Text strong>{booking?.seats?.join(', ') || 'No seats selected'}</Text>
                        </Text>
                      </div>
                      
                      <Divider style={{ margin: '12px 0' }} />
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <Text style={{ fontSize: '12px', color: '#666' }}>Total Amount</Text>
                          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f84464' }}>
                            ₹{booking.totalAmount}
                          </div>
                        </div>
                        
                        {canCancelBooking(booking) && (
                          <Button
                            type="primary"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => {
                              setSelectedBooking(booking);
                              setCancelModal(true);
                            }}
                            style={{ borderRadius: '8px' }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>
        {/* Cancel Confirmation Modal */}
      <Modal
        title="Cancel Booking"
        open={cancelModal}
        onOk={handleCancelBooking}
        onCancel={() => setCancelModal(false)}
        okText="Yes, Cancel"
        cancelText="No, Keep Booking"
        okButtonProps={{ danger: true }}
        >
        <p>Are you sure you want to cancel this booking?</p>
        {selectedBooking && (
          <div style={{ background: '#f5f5f5', padding: '12px', borderRadius: '6px' }}>
            <div><strong>Movie:</strong> {selectedBooking?.show?.movie?.title || 'Unknown Movie'}</div>
            <div><strong>Date:</strong> {selectedBooking?.show?.date ? moment(selectedBooking.show.date).format('MMM DD, YYYY') : 'Unknown Date'}</div>
            <div><strong>Time:</strong> {selectedBooking?.show?.time ? moment(selectedBooking.show.time, 'HH:mm').format('hh:mm A') : 'Unknown Time'}</div>
            <div><strong>Seats:</strong> {selectedBooking?.seats?.join(', ') || 'No seats'}</div>
            <div><strong>Amount:</strong> ₹{selectedBooking?.totalAmount || 0}</div>
          </div>
        )}
        <p style={{ marginTop: '12px', color: '#666', fontSize: '12px' }}>
          Note: Cancellation is only allowed up to 2 hours before the show time.
        </p>
      </Modal>
      </div>
    </div>
  );
}

export default Profile;