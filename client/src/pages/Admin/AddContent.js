import React, { useState, useEffect } from 'react';
import { Card, Tabs, Typography, Space, Divider, message } from 'antd';
import { VideoCameraOutlined, ShopOutlined, PlusOutlined, CalendarOutlined, TrophyOutlined } from '@ant-design/icons';
import MovieFormModal from '../../Components/MovieFormModal';
import TheaterFormModal from '../../Components/TheaterFormModal';
import EventFormModal from '../../Components/EventFormModal';
import SportFormModal from '../../Components/SportFormModal';
import useAuth from '../../hooks/useAuth';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function AddContent() {
  const [movieModalVisible, setMovieModalVisible] = useState(false);
  const [theaterModalVisible, setTheaterModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [sportModalVisible, setSportModalVisible] = useState(false);
  const { localUser, fetchUserData } = useAuth();

  // Verify user authentication and admin status
  useEffect(() => {
    let isMounted = true;
    
    const verifyAdmin = async () => {
      try {
        const result = await fetchUserData();
        // Only update state if component is still mounted
        if (isMounted && (!result || !localUser?.isAdmin)) {
          message.error('You must be logged in as an admin to access this page');
        }
      } catch (error) {
        console.error('Error verifying admin status:', error);
      }
    };
    
    verifyAdmin();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);  // Empty dependency array to run only once

  const handleMovieSuccess = () => {
    setMovieModalVisible(false);
    message.success('Movie added successfully!');
  };

  const handleTheaterSuccess = () => {
    setTheaterModalVisible(false);
    message.success('Theater added successfully!');
  };

  const handleEventSuccess = () => {
    setEventModalVisible(false);
    message.success('Event added successfully!');
  };

  const handleSportSuccess = () => {
    setSportModalVisible(false);
    message.success('Sport event added successfully!');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={2} style={{ color: '#1a1a2e', marginBottom: '8px' }}>
          Add Content
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Manage your platform content by adding movies, theaters, events, and sports
        </Text>
      </div>

      <Tabs 
        defaultActiveKey="movies" 
        centered 
        size="large"
        style={{ marginTop: '24px' }}
      >
        <TabPane 
          tab={
            <span>
              <VideoCameraOutlined />
              Add Movies
            </span>
          } 
          key="movies"
        >
          <Card 
            style={{ 
              textAlign: 'center', 
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px'
            }}
            bodyStyle={{
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <VideoCameraOutlined style={{ fontSize: '64px', marginBottom: '24px', color: 'white' }} />
            <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
              Add New Movie
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '32px' }}>
              Add movies to your cinema catalog with detailed information
            </Text>
            <button
              onClick={() => setMovieModalVisible(true)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid white',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#667eea';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.color = 'white';
              }}
            >
              <PlusOutlined /> Add Movie
            </button>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <ShopOutlined />
              Add Theaters
            </span>
          } 
          key="theaters"
        >
          <Card 
            style={{ 
              textAlign: 'center', 
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px'
            }}
            bodyStyle={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <ShopOutlined style={{ fontSize: '64px', marginBottom: '24px', color: 'white' }} />
            <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
              Add New Theater
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '32px' }}>
              Register new theaters and cinema halls to expand your network
            </Text>
            <button
              onClick={() => setTheaterModalVisible(true)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid white',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#f5576c';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.color = 'white';
              }}
            >
              <PlusOutlined /> Add Theater
            </button>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <CalendarOutlined />
              Add Events
            </span>
          } 
          key="events"
        >
          <Card 
            style={{ 
              textAlign: 'center', 
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px'
            }}
            bodyStyle={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <CalendarOutlined style={{ fontSize: '64px', marginBottom: '24px', color: 'white' }} />
            <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
              Add New Event
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '32px' }}>
              Add concerts, conferences, and other special events to your platform
            </Text>
            <button
              onClick={() => setEventModalVisible(true)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid white',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#43cea2';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.color = 'white';
              }}
            >
              <PlusOutlined /> Add Event
            </button>
          </Card>
        </TabPane>

        <TabPane 
          tab={
            <span>
              <TrophyOutlined />
              Add Sports
            </span>
          } 
          key="sports"
        >
          <Card 
            style={{ 
              textAlign: 'center', 
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '16px'
            }}
            bodyStyle={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <TrophyOutlined style={{ fontSize: '64px', marginBottom: '24px', color: 'white' }} />
            <Title level={3} style={{ color: 'white', marginBottom: '16px' }}>
              Add Sports Event
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', marginBottom: '32px' }}>
              Add sporting events, tournaments, and matches to your platform
            </Text>
            <button
              onClick={() => setSportModalVisible(true)}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid white',
                color: 'white',
                padding: '12px 32px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#ff5e62';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.2)';
                e.target.style.color = 'white';
              }}
            >
              <PlusOutlined /> Add Sport Event
            </button>
          </Card>
        </TabPane>
      </Tabs>

      {/* Movie Modal */}
      <MovieFormModal
        visible={movieModalVisible}
        onCancel={() => setMovieModalVisible(false)}
        onSuccess={handleMovieSuccess}
        editingMovie={null}
      />

      {/* Theater Modal */}
      <TheaterFormModal
        visible={theaterModalVisible}
        onCancel={() => setTheaterModalVisible(false)}
        onSuccess={handleTheaterSuccess}
        editingTheater={null}
      />

      {/* Event Modal */}
      <EventFormModal
        visible={eventModalVisible}
        onCancel={() => setEventModalVisible(false)}
        onSuccess={handleEventSuccess}
        editingEvent={null}
      />

      {/* Sport Modal */}
      <SportFormModal
        visible={sportModalVisible}
        onCancel={() => setSportModalVisible(false)}
        onSuccess={handleSportSuccess}
        editingSport={null}
      />
    </div>
  );
}

export default AddContent;