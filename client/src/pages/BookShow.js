import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, message, Spin, Modal, Typography, Space, Tag, Divider } from 'antd';
import { CreditCardOutlined, CheckCircleOutlined, CalendarOutlined, ClockCircleOutlined, EnvironmentOutlined, UserOutlined } from '@ant-design/icons';
import { getShowById } from '../apicalls/shows';
import { makeBooking, confirmBooking } from '../apicalls/bookings';
import { useSelector } from 'react-redux';
import moment from 'moment';

const { Title, Text } = Typography;

function BookShow() {
  const { showId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.users);
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const getShow = async () => {
    try {
      setLoading(true);
      const response = await getShowById(showId);
      if (response.success) {
        setShow(response.data);
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
    getShow();
  }, [showId]);

  const getSeatNumber = (row, col) => {
    return `${String.fromCharCode(65 + row)}${col + 1}`;
  };

  const isSeatBooked = (seatNumber) => {
    return show?.bookedSeats?.includes(seatNumber);
  };

  const isSeatSelected = (seatNumber) => {
    return selectedSeats.includes(seatNumber);
  };

  const handleSeatClick = (seatNumber) => {
    if (isSeatBooked(seatNumber)) return;

    if (isSeatSelected(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      if (selectedSeats.length < 10) {
        setSelectedSeats([...selectedSeats, seatNumber]);
      } else {
        message.warning('You can select maximum 10 seats');
      }
    }
  };

  const getSeatColor = (seatNumber) => {
    if (isSeatBooked(seatNumber)) return '#ff4d4f';
    if (isSeatSelected(seatNumber)) return '#52c41a';
    return '#e8f5e8';
  };

  const getSeatBorder = (seatNumber) => {
    if (isSeatBooked(seatNumber)) return '2px solid #ff4d4f';
    if (isSeatSelected(seatNumber)) return '2px solid #52c41a';
    return '2px solid #52c41a';
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      message.error('Please select at least one seat');
      return;
    }

    try {
      setBookingInProgress(true);
      const response = await makeBooking({
        show: showId,
        seats: selectedSeats,
        totalAmount: selectedSeats.length * show.ticketPrice
      });

      if (response.success) {
        setBookingId(response.data._id);
        setPaymentModal(true);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setBookingInProgress(false);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await confirmBooking(bookingId, {
        paymentId: `pay_${Date.now()}`,
        paymentStatus: 'completed'
      });

      if (response.success) {
        message.success('Booking confirmed successfully!');
        setPaymentModal(false);
        navigate('/profile');
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Payment failed');
    }
  };

  const renderSeats = () => {
    const rows = 10;
    const seatsPerRow = 12;
    const seats = [];

    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < seatsPerRow; col++) {
        const seatNumber = getSeatNumber(row, col);
        rowSeats.push(
          <div
            key={seatNumber}
            className="seat"
            style={{
              width: '36px',
              height: '36px',
              margin: '3px',
              backgroundColor: getSeatColor(seatNumber),
              border: getSeatBorder(seatNumber),
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isSeatBooked(seatNumber) ? 'not-allowed' : 'pointer',
              fontSize: '11px',
              fontWeight: 'bold',
              color: isSeatBooked(seatNumber) || isSeatSelected(seatNumber) ? 'white' : '#52c41a',
              transition: 'all 0.2s ease',
              transform: isSeatSelected(seatNumber) ? 'scale(1.1)' : 'scale(1)',
              boxShadow: isSeatSelected(seatNumber) ? '0 4px 12px rgba(82, 196, 26, 0.3)' : 'none'
            }}
            onClick={() => handleSeatClick(seatNumber)}
            onMouseEnter={(e) => {
              if (!isSeatBooked(seatNumber)) {
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isSeatSelected(seatNumber)) {
                e.target.style.transform = 'scale(1)';
              }
            }}
          >
            {seatNumber}
          </div>
        );
        
        // Add gap in the middle
        if (col === 5) {
          rowSeats.push(
            <div key={`gap-${row}-${col}`} style={{ width: '24px' }} />
          );
        }
      }
      
      seats.push(
        <div key={row} style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ 
            width: '24px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            color: '#666',
            textAlign: 'center'
          }}>
            {String.fromCharCode(65 + row)}
          </div>
          {rowSeats}
          <div style={{ 
            width: '24px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            color: '#666',
            textAlign: 'center'
          }}>
            {String.fromCharCode(65 + row)}
          </div>
        </div>
      );
    }

    return seats;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!show) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>Show not found</h3>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Show Details Header */}
        <Card style={{ 
          marginBottom: '32px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: 'none'
        }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={4}>
              <img
                src={show.movie.poster || '/placeholder-movie.jpg'}
                alt={show.movie.title}
                style={{
                  width: '100%',
                  maxWidth: '120px',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '12px'
                }}
              />
            </Col>
            <Col xs={24} md={12}>
              <div>
                <Title level={2} style={{ margin: 0, marginBottom: '8px', color: '#333' }}>
                  {show.movie.title}
                </Title>
                <div style={{ marginBottom: '16px' }}>
                  {show.movie.genre.slice(0, 3).map(g => (
                    <Tag key={g} color="blue" style={{ marginBottom: '4px', borderRadius: '12px' }}>
                      {g}
                    </Tag>
                  ))}
                </div>
                <Space direction="vertical" size="small">
                  <Space>
                    <EnvironmentOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666' }}>
                      {show.theater.name} - {show.theater.address.street}, {show.theater.address.city}
                    </Text>
                  </Space>
                  <Space>
                    <CalendarOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666' }}>
                      {moment(show.date).format('dddd, MMM DD, YYYY')}
                    </Text>
                  </Space>
                  <Space>
                    <ClockCircleOutlined style={{ color: '#666' }} />
                    <Text style={{ color: '#666' }}>
                      {moment(show.time, 'HH:mm').format('hh:mm A')}
                    </Text>
                  </Space>
                </Space>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div style={{ 
                textAlign: 'right',
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '12px'
              }}>
                <div style={{ fontSize: '16px', color: '#666', marginBottom: '8px' }}>
                  Ticket Price
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f84464', marginBottom: '16px' }}>
                  ₹{show.ticketPrice}
                </div>
                {selectedSeats.length > 0 && (
                  <>
                    <Divider style={{ margin: '12px 0' }} />
                    <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                      {selectedSeats.length} seat(s) selected
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                      Total: ₹{selectedSeats.length * show.ticketPrice}
                    </div>
                  </>
                )}
              </div>
            </Col>
          </Row>
        </Card>

        {/* Seat Selection */}
        <Card 
          style={{ 
            marginBottom: '32px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: 'none'
          }}
          bodyStyle={{ padding: '32px' }}
        >
          <Title level={3} style={{ textAlign: 'center', marginBottom: '32px' }}>
            Select Your Seats
          </Title>
          
          {/* Screen */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{
              width: '70%',
              height: '30px',
              background: 'linear-gradient(135deg, #f84464 0%, #ff6b8a 100%)',
              margin: '0 auto',
              borderRadius: '15px 15px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold',
              boxShadow: '0 4px 12px rgba(248, 68, 100, 0.3)'
            }}>
              🎬 SCREEN THIS WAY 🎬
            </div>
            <div style={{
              width: '70%',
              height: '4px',
              background: 'linear-gradient(135deg, #f84464 0%, #ff6b8a 100%)',
              margin: '0 auto',
              opacity: 0.3
            }} />
          </div>

          {/* Seats */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            marginBottom: '32px'
          }}>
            {renderSeats()}
          </div>

          {/* Legend */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '32px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                backgroundColor: '#e8f5e8', 
                border: '2px solid #52c41a',
                marginRight: '8px', 
                borderRadius: '6px' 
              }} />
              <Text>Available</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                backgroundColor: '#52c41a', 
                marginRight: '8px', 
                borderRadius: '6px' 
              }} />
              <Text>Selected</Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                width: '24px', 
                height: '24px', 
                backgroundColor: '#ff4d4f', 
                marginRight: '8px', 
                borderRadius: '6px' 
              }} />
              <Text>Booked</Text>
            </div>
          </div>
        </Card>

        {/* Selected Seats & Booking */}
        {selectedSeats.length > 0 && (
          <Card style={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: '2px solid #52c41a',
            background: 'linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%)'
          }}>
            <Row gutter={[24, 24]} align="middle">
              <Col xs={24} md={16}>
                <div style={{ marginBottom: '16px' }}>
                  <Title level={4} style={{ margin: 0, marginBottom: '8px', color: '#333' }}>
                    🎫 Booking Summary
                  </Title>
                  <Space direction="vertical" size="small">
                    <div>
                      <Text strong style={{ color: '#666' }}>Selected Seats: </Text>
                      <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                        {selectedSeats.join(', ')}
                      </Text>
                    </div>
                    <div>
                      <Text strong style={{ color: '#666' }}>Number of Tickets: </Text>
                      <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {selectedSeats.length}
                      </Text>
                    </div>
                    <div>
                      <Text strong style={{ color: '#666' }}>Total Amount: </Text>
                      <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#f84464' }}>
                        ₹{selectedSeats.length * show.ticketPrice}
                      </Text>
                    </div>
                  </Space>
                </div>
              </Col>
              <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<CreditCardOutlined />}
                  loading={bookingInProgress}
                  onClick={handleBooking}
                  style={{ 
                    width: '100%',
                    height: '56px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: '#f84464',
                    borderColor: '#f84464',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(248, 68, 100, 0.3)'
                  }}
                >
                  Proceed to Payment
                </Button>
              </Col>
            </Row>
          </Card>
        )}
        {/* Payment Modal */}
        <Modal
          title={null}
          open={paymentModal}
          onCancel={() => setPaymentModal(false)}
          footer={null}
          width={480}
          centered
          style={{ borderRadius: '16px' }}
          >
            <div style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
                boxShadow: '0 8px 24px rgba(82, 196, 26, 0.3)'
              }}>
                <CreditCardOutlined style={{ fontSize: '36px', color: 'white' }} />
              </div>
              
              <Title level={3} style={{ marginBottom: '16px', color: '#333' }}>
                Confirm Payment
              </Title>
              
              <div style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Movie:</Text>
                    <Text strong>{show.movie.title}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Seats:</Text>
                    <Text strong>{selectedSeats.join(', ')}</Text>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Date & Time:</Text>
                    <Text strong>{moment(show.date).format('MMM DD')} at {moment(show.time, 'HH:mm').format('hh:mm A')}</Text>
                  </div>
                  <Divider style={{ margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: '16px' }}>Total Amount:</Text>
                    <Text strong style={{ fontSize: '20px', color: '#f84464' }}>
                      ₹{selectedSeats.length * show.ticketPrice}
                    </Text>
                  </div>
                </Space>
              </div>
              
              <Text style={{ fontSize: '12px', color: '#999', display: 'block', marginBottom: '24px' }}>
                🔒 This is a demo payment. In a real application, you would integrate with a secure payment gateway.
              </Text>
              
              <Button
                type="primary"
                size="large"
                onClick={handlePayment}
                style={{ 
                  width: '100%',
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  background: '#f84464',
                  borderColor: '#f84464',
                  borderRadius: '12px'
                }}
              >
                💳 Confirm Payment
              </Button>
            </div>
          </Modal>
      </div>
    </div>
  );
}

export default BookShow;