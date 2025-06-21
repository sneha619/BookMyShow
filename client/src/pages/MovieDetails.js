import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, message, Spin, Tag, Divider, DatePicker, Select, Typography, Space, Rate } from 'antd';
import { PlayCircleOutlined, CalendarOutlined, ClockCircleOutlined, StarFilled, EnvironmentOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { getMovieById } from '../apicalls/movies';
import { getShowsByMovie } from '../apicalls/shows';
import moment from 'moment';

const { Title, Text, Paragraph } = Typography;

const { Option } = Select;

function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showsLoading, setShowsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

  const getMovie = async () => {
    try {
      setLoading(true);
      const response = await getMovieById(movieId);
      if (response.success) {
        setMovie(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const getShows = async () => {
    try {
      setShowsLoading(true);
      const response = await getShowsByMovie(movieId, {
        date: selectedDate.format('YYYY-MM-DD'),
        city: selectedCity
      });
      if (response.success) {
        setShows(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error('Something went wrong');
    } finally {
      setShowsLoading(false);
    }
  };

  useEffect(() => {
    getMovie();
  }, [movieId]);

  useEffect(() => {
    if (movieId) {
      getShows();
    }
  }, [movieId, selectedDate, selectedCity]);

  const handleShowBooking = (showId) => {
    navigate(`/book-show/${showId}`);
  };

  const groupShowsByTheater = (shows) => {
    const grouped = {};
    shows.forEach(show => {
      const theaterName = show.theater.name;
      if (!grouped[theaterName]) {
        grouped[theaterName] = {
          theater: show.theater,
          shows: []
        };
      }
      grouped[theaterName].shows.push(show);
    });
    return grouped;
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h3>Movie not found</h3>
      </div>
    );
  }

  const groupedShows = groupShowsByTheater(shows);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Hero Section */}
      <div style={{
        background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${movie.poster || '/placeholder-movie.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '60px 0',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Row gutter={[40, 40]} align="middle">
            <Col xs={24} md={8}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
              }}>
                <img
                  alt={movie.title}
                  src={movie.poster || '/placeholder-movie.jpg'}
                  style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                />
              </div>
            </Col>
            <Col xs={24} md={16}>
              <div>
                <Title level={1} style={{ color: 'white', fontSize: '48px', marginBottom: '16px' }}>
                  {movie.title}
                </Title>
                
                <div style={{ marginBottom: '24px' }}>
                  {movie.genre.map(g => (
                    <Tag key={g} color="purple" style={{ 
                      fontSize: '14px', 
                      padding: '6px 12px', 
                      marginBottom: '8px',
                      borderRadius: '20px'
                    }}>
                      {g}
                    </Tag>
                  ))}
                </div>

                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StarFilled style={{ color: '#ffd700', fontSize: '20px' }} />
                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                      {movie.rating}/10
                    </span>
                  </div>
                  <Rate disabled defaultValue={movie.rating/2} style={{ color: '#ffd700' }} />
                </div>

                <Row gutter={[24, 16]} style={{ marginBottom: '32px' }}>
                  <Col xs={24} sm={12}>
                    <Space>
                      <ClockCircleOutlined style={{ fontSize: '16px' }} />
                      <Text style={{ color: 'white', fontSize: '16px' }}>
                        {movie.duration} minutes
                      </Text>
                    </Space>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Space>
                      <CalendarOutlined style={{ fontSize: '16px' }} />
                      <Text style={{ color: 'white', fontSize: '16px' }}>
                        {moment(movie.releaseDate).format('MMM DD, YYYY')}
                      </Text>
                    </Space>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Space>
                      <VideoCameraOutlined style={{ fontSize: '16px' }} />
                      <Text style={{ color: 'white', fontSize: '16px' }}>
                        {movie.language.join(', ')}
                      </Text>
                    </Space>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Space>
                      <UserOutlined style={{ fontSize: '16px' }} />
                      <Text style={{ color: 'white', fontSize: '16px' }}>
                        {movie.director}
                      </Text>
                    </Space>
                  </Col>
                </Row>

                <Paragraph style={{ color: 'white', fontSize: '16px', lineHeight: '1.6', marginBottom: '32px' }}>
                  {movie.description}
                </Paragraph>

                <Space size="large">
                  {movie.trailer && (
                    <Button 
                      type="default"
                      icon={<PlayCircleOutlined />}
                      size="large"
                      onClick={() => window.open(movie.trailer, '_blank')}
                      style={{ 
                        background: 'rgba(255,255,255,0.2)',
                        borderColor: 'white',
                        color: 'white',
                        borderRadius: '8px',
                        height: '48px',
                        padding: '0 24px'
                      }}
                    >
                      Watch Trailer
                    </Button>
                  )}
                  <Button 
                    type="primary"
                    size="large"
                    style={{ 
                      background: '#f84464',
                      borderColor: '#f84464',
                      borderRadius: '8px',
                      height: '48px',
                      padding: '0 24px'
                    }}
                    onClick={() => {
                      const element = document.getElementById('book-tickets');
                      element?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Book Tickets
                  </Button>
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {/* Cast Section */}
      <div style={{ background: 'white', padding: '40px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={3} style={{ marginBottom: '24px' }}>Cast & Crew</Title>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {movie.cast.map((actor, index) => (
              <Tag key={index} style={{ 
                fontSize: '14px', 
                padding: '8px 16px',
                borderRadius: '20px',
                border: '1px solid #d9d9d9',
                background: '#fafafa'
              }}>
                {actor}
              </Tag>
            ))}
          </div>
        </div>
      </div>

      {/* Show Selection */}
      <div id="book-tickets" style={{ background: '#f0f2f5', padding: '40px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Title level={2} style={{ marginBottom: '32px', textAlign: 'center' }}>Book Tickets</Title>
          
          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            marginBottom: '32px'
          }}>
            <Row gutter={[24, 16]} align="middle">
              <Col xs={24} sm={12} md={8}>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong style={{ fontSize: '16px' }}>Select Date</Text>
                </div>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  disabledDate={(current) => current && current < moment().startOf('day')}
                  size="large"
                  style={{ width: '100%', borderRadius: '8px' }}
                  format="MMM DD, YYYY"
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong style={{ fontSize: '16px' }}>Select City</Text>
                </div>
                <Select
                  value={selectedCity}
                  onChange={setSelectedCity}
                  size="large"
                  style={{ width: '100%', borderRadius: '8px' }}
                  suffixIcon={<EnvironmentOutlined />}
                >
                  {cities.map(city => (
                    <Option key={city} value={city}>{city}</Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={24} md={8}>
                <div style={{ marginBottom: '8px' }}>
                  <Text strong style={{ fontSize: '16px' }}>Selected Date & City</Text>
                </div>
                <div style={{
                  padding: '12px 16px',
                  background: '#f0f2f5',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}>
                  {selectedDate.format('MMM DD, YYYY')} • {selectedCity}
                </div>
              </Col>
            </Row>
          </div>

          {showsLoading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', fontSize: '16px', color: '#666' }}>
                Loading shows...
              </div>
            </div>
          ) : (
            <div>
              {Object.keys(groupedShows).length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎭</div>
                  <Title level={3} style={{ color: '#666', marginBottom: '8px' }}>No shows available</Title>
                  <Text style={{ color: '#999', fontSize: '16px' }}>Try selecting a different date or city</Text>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {Object.entries(groupedShows).map(([theaterName, theaterData]) => (
                    <Card
                      key={theaterName}
                      style={{
                        borderRadius: '16px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        border: 'none'
                      }}
                      bodyStyle={{ padding: '24px' }}
                    >
                      <div style={{ marginBottom: '20px' }}>
                        <Title level={4} style={{ margin: 0, marginBottom: '4px' }}>
                          {theaterName}
                        </Title>
                        <Text style={{ color: '#666', fontSize: '14px' }}>
                          <EnvironmentOutlined style={{ marginRight: '4px' }} />
                          {theaterData.theater.address.street}, {theaterData.theater.address.city}
                        </Text>
                      </div>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                        {theaterData.shows.map(show => (
                          <Button
                            key={show._id}
                            type="default"
                            style={{
                              border: '2px solid #f84464',
                              color: '#f84464',
                              borderRadius: '12px',
                              padding: '12px 20px',
                              height: 'auto',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              minWidth: '120px',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.background = '#f84464';
                              e.target.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.background = 'white';
                              e.target.style.color = '#f84464';
                            }}
                            onClick={() => handleShowBooking(show._id)}
                          >
                            <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '4px' }}>
                              {moment(show.time, 'HH:mm').format('hh:mm A')}
                            </div>
                            <div style={{ fontSize: '12px', opacity: 0.8 }}>
                              ₹{show.ticketPrice}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;