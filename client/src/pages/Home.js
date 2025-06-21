import React, { useEffect, useState } from 'react';
import { getAllMovies } from '../apicalls/movies';
import { Card, Row, Col, Input, Select, Button, message, Spin, Typography, Space, Tag, Carousel } from 'antd';
import { SearchOutlined, CalendarOutlined, EnvironmentOutlined, StarFilled, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;
const { Search } = Input;
const { Title, Text } = Typography;

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    genre: '',
    language: '',
    city: ''
  });

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Adventure', 'Animation'];
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

  const getMovies = async () => {
    try {
      setLoading(true);
      const response = await getAllMovies(filters);
      if (response.success) {
        setMovies(response.data);
        // Set featured movies (first 5 movies with high ratings)
        const featured = response.data
          .filter(movie => movie.rating >= 7.5)
          .slice(0, 5);
        setFeaturedMovies(featured);
      } else {
        message.error('Failed to fetch movies');
      }
    } catch (error) {
      message.error('Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    if (searchParams.get('search')) {
      getMovies();
    }
  }, [searchParams]);

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      {/* Featured Movies Carousel */}
      {featuredMovies.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <Carousel autoplay effect="fade" style={{ borderRadius: '0 0 20px 20px', overflow: 'hidden' }}>
            {featuredMovies.map((movie) => (
              <div key={movie._id}>
                <div 
                  style={{
                    height: '400px',
                    background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${movie.poster || '/placeholder-movie.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => navigate(`/movie/${movie._id}`)}
                >
                  <div style={{ textAlign: 'center', maxWidth: '600px', padding: '0 20px' }}>
                    <Title level={1} style={{ color: 'white', fontSize: '48px', marginBottom: '16px' }}>
                      {movie.title}
                    </Title>
                    <Text style={{ color: 'white', fontSize: '18px', display: 'block', marginBottom: '20px' }}>
                      {movie.description}
                    </Text>
                    <Space size="large">
                      <Tag color="gold" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        <StarFilled /> {movie.rating}/10
                      </Tag>
                      <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {movie.duration} min
                      </Tag>
                      {movie.genre.slice(0, 2).map(g => (
                        <Tag key={g} color="purple" style={{ fontSize: '14px', padding: '4px 12px' }}>
                          {g}
                        </Tag>
                      ))}
                    </Space>
                    <div style={{ marginTop: '24px' }}>
                      <Button 
                        type="primary" 
                        size="large" 
                        icon={<PlayCircleOutlined />}
                        style={{ 
                          background: '#f84464', 
                          borderColor: '#f84464',
                          fontSize: '16px',
                          height: '48px',
                          padding: '0 32px'
                        }}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      )}

      <div style={{ padding: '0 24px 40px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Filters */}
        <div style={{ 
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginBottom: '40px'
        }}>
          <Title level={3} style={{ marginBottom: '24px', color: '#333' }}>Find Movies</Title>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={6}>
              <Search
                placeholder="Search movies..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onSearch={() => getMovies()}
                style={{ borderRadius: '8px' }}
              />
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Genre"
                allowClear
                size="large"
                style={{ width: '100%', borderRadius: '8px' }}
                value={filters.genre}
                onChange={(value) => setFilters({ ...filters, genre: value })}
              >
                {genres.map(genre => (
                  <Option key={genre} value={genre}>{genre}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="Language"
                allowClear
                size="large"
                style={{ width: '100%', borderRadius: '8px' }}
                value={filters.language}
                onChange={(value) => setFilters({ ...filters, language: value })}
              >
                {languages.map(language => (
                  <Option key={language} value={language}>{language}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={4}>
              <Select
                placeholder="City"
                allowClear
                size="large"
                style={{ width: '100%', borderRadius: '8px' }}
                value={filters.city}
                onChange={(value) => setFilters({ ...filters, city: value })}
              >
                {cities.map(city => (
                  <Option key={city} value={city}>{city}</Option>
                ))}
              </Select>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button 
                type="primary" 
                size="large" 
                icon={<SearchOutlined />}
                onClick={getMovies}
                style={{ 
                  width: '100%', 
                  background: '#f84464', 
                  borderColor: '#f84464',
                  borderRadius: '8px',
                  height: '40px'
                }}
              >
                Search Movies
              </Button>
            </Col>
          </Row>
        </div>

        {/* Movies Section */}
        <div>
          <Title level={3} style={{ marginBottom: '24px', color: '#333' }}>Now Showing</Title>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[20, 24]}>
              {movies.map((movie) => (
                <Col key={movie._id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    hoverable
                    style={{ 
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      border: 'none'
                    }}
                    bodyStyle={{ padding: '16px' }}
                    cover={
                      <div style={{ position: 'relative', height: '320px', overflow: 'hidden' }}>
                        <img
                          alt={movie.title}
                          src={movie.poster || '/placeholder-movie.jpg'}
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                        />
                        <div style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          background: 'rgba(0,0,0,0.8)',
                          color: 'white',
                          padding: '6px 10px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <StarFilled style={{ color: '#ffd700' }} /> {movie.rating}
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                          padding: '40px 16px 16px 16px',
                          color: 'white'
                        }}>
                          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
                            {movie.title}
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.9 }}>
                            {movie.language.join(', ')} • {movie.duration} min
                          </div>
                        </div>
                      </div>
                    }
                    onClick={() => navigate(`/movie/${movie._id}`)}
                  >
                    <div style={{ padding: '8px 0' }}>
                      <div style={{ marginBottom: '12px' }}>
                        {movie.genre.slice(0, 3).map(g => (
                          <Tag key={g} color="blue" style={{ marginBottom: '4px', borderRadius: '12px' }}>
                            {g}
                          </Tag>
                        ))}
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        color: '#666',
                        fontSize: '12px'
                      }}>
                        <span>
                          <CalendarOutlined /> {moment(movie.releaseDate).format('MMM DD')}
                        </span>
                        <Button 
                          type="primary" 
                          size="small"
                          style={{ 
                            background: '#f84464', 
                            borderColor: '#f84464',
                            borderRadius: '16px'
                          }}
                        >
                          Book
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {movies.length === 0 && !loading && (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px', 
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
              <Title level={3} style={{ color: '#666', marginBottom: '8px' }}>No movies found</Title>
              <Text style={{ color: '#999' }}>Try adjusting your search filters to find more movies</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;