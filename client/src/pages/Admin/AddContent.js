import React, { useState } from 'react';
import { Card, Tabs, Typography, Space, Divider } from 'antd';
import { VideoCameraOutlined, ShopOutlined, PlusOutlined } from '@ant-design/icons';
import MovieFormModal from '../../Components/MovieFormModal';
import TheaterFormModal from '../../Components/TheaterFormModal';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

function AddContent() {
  const [movieModalVisible, setMovieModalVisible] = useState(false);
  const [theaterModalVisible, setTheaterModalVisible] = useState(false);

  const handleMovieSuccess = () => {
    setMovieModalVisible(false);
    // You can add success notification here
  };

  const handleTheaterSuccess = () => {
    setTheaterModalVisible(false);
    // You can add success notification here
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={2} style={{ color: '#1a1a2e', marginBottom: '8px' }}>
          Add Movies & Theaters
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          Manage your cinema content by adding new movies and theaters
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
    </div>
  );
}

export default AddContent;