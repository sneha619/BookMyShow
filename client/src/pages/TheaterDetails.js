import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, message, Spin, Tag, Divider, Typography, Space, List, Avatar } from 'antd';
import { ShopOutlined, EnvironmentOutlined, PhoneOutlined, MailOutlined, CalendarOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { getTheaterById } from '../apicalls/theaters';
import { getShowsByTheater } from '../apicalls/shows';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

function TheaterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [theater, setTheater] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTheaterDetails = async () => {
      try {
        setLoading(true);
        const response = await getTheaterById(id);
        if (response.success) {
          setTheater(response.data);
          // Fetch shows for this theater
          try {
            const showsResponse = await getShowsByTheater(id);
            if (showsResponse.success) {
              setShows(showsResponse.data);
            }
          } catch (error) {
            console.error('Error fetching shows:', error);
          }
        } else {
          message.error('Failed to fetch theater details');
        }
      } catch (error) {
        message.error('Failed to fetch theater details');
      } finally {
        setLoading(false);
      }
    };

    fetchTheaterDetails();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!theater) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Title level={4}>Theater not found</Title>
        <Button type="primary" onClick={() => navigate('/theaters')}>
          Back to Theaters
        </Button>
      </div>
    );
  }

  return (
    <div className="theater-details-page">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card
            cover={
              <div style={{ 
                height: '200px', 
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShopOutlined style={{ fontSize: '64px', color: '#fff' }} />
              </div>
            }
          >
            <Title level={3}>{theater.name}</Title>
            <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }}>
              <Text>
                <EnvironmentOutlined /> {theater.address.street}, {theater.address.city}, {theater.address.state}, {theater.address.pincode}
              </Text>
              <Text>
                <PhoneOutlined /> {theater.phone}
              </Text>
              <Text>
                <MailOutlined /> {theater.email}
              </Text>
            </Space>
          </Card>

          {theater.facilities && theater.facilities.length > 0 && (
            <Card title="Facilities" style={{ marginTop: '24px' }}>
              <Space wrap>
                {theater.facilities.map((facility, index) => (
                  <Tag color="blue" key={index}>{facility}</Tag>
                ))}
              </Space>
            </Card>
          )}
        </Col>

        <Col xs={24} md={16}>
          <Card title="Current & Upcoming Shows">
            {shows.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Text>No shows currently scheduled at this theater</Text>
              </div>
            ) : (
              <List
                itemLayout="vertical"
                dataSource={shows}
                renderItem={show => (
                  <List.Item
                    key={show._id}
                    actions={[
                      <Button 
                        type="primary" 
                        onClick={() => navigate(`/book-show/${show._id}`)}
                      >
                        Book Tickets
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar icon={<VideoCameraOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                      title={
                        <a href={`/movie/${show.movie._id}`} onClick={(e) => { e.preventDefault(); navigate(`/movie/${show.movie._id}`); }}>
                          {show.movie.title}
                        </a>
                      }
                      description={
                        <Space direction="vertical">
                          <Text>
                            <CalendarOutlined /> {moment(show.date).format('MMM DD, YYYY')} at {moment(show.time, 'HH:mm').format('hh:mm A')}
                          </Text>
                          <Text>Price: ₹{show.ticketPrice}</Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>

          {theater.description && (
            <Card title="About this Theater" style={{ marginTop: '24px' }}>
              <Paragraph>{theater.description}</Paragraph>
            </Card>
          )}
        </Col>
      </Row>

      <div style={{ marginTop: '24px', textAlign: 'center' }}>
        <Button type="default" onClick={() => navigate('/theaters')}>
          Back to All Theaters
        </Button>
      </div>
    </div>
  );
}

export default TheaterDetails;