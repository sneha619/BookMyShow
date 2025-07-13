import React, { useEffect, useState } from 'react';
import { getAllTheaters } from '../apicalls/theaters';
import { Card, Row, Col, Input, Select, Button, message, Spin, Typography, Space, Tag, List, Avatar, Empty, Tooltip, Badge } from 'antd';
import { SearchOutlined, EnvironmentOutlined, ShopOutlined, PhoneOutlined, MailOutlined, StarOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { Option } = Select;
const { Search } = Input;
const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;

function Theaters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
  });

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];

  const getTheaters = async () => {
    try {
      setLoading(true);
      console.log('Fetching theaters with filters:', filters);
      const response = await getAllTheaters(filters);
      console.log('Theater API response:', response);
      if (response.success) {
        setTheaters(response.data);
      } else {
        message.error('Failed to fetch theaters: ' + response.message);
      }
    } catch (error) {
      console.error('Error fetching theaters:', error);
      message.error('Failed to fetch theaters: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTheaters();
  }, [filters.city]);

  const handleSearch = (value) => {
    setFilters({
      ...filters,
      city: value
    });
  };

  const handleCityChange = (value) => {
    setFilters({
      ...filters,
      city: value
    });
  };

  const handleClearFilters = () => {
    setFilters({
      city: ''
    });
  };

  return (
    <div className="theaters-page">
      <div className="page-header" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', padding: '24px', borderRadius: '8px', color: 'white' }}>
        <Title level={2} style={{ marginBottom: '16px', color: 'white' }}>
          <ShopOutlined /> Theaters
        </Title>
        <Paragraph style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '16px', marginBottom: 0 }}>
          Find the best theaters in your city for an amazing movie experience
        </Paragraph>
      </div>

      <div className="filters-section" style={{ marginBottom: '24px', background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ marginBottom: '16px' }}>
          <Title level={4} style={{ margin: 0 }}>Find Theaters</Title>
          <Text type="secondary">Use the filters below to find theaters in your city</Text>
        </div>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={24} md={8} lg={10}>
            <Search
              placeholder="Search by city name"
              allowClear
              enterButton={<SearchOutlined />}
              size="large"
              value={filters.city}
              onChange={(e) => handleSearch(e.target.value)}
              onSearch={handleSearch}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={8}>
            <Select
              placeholder="Select from popular cities"
              style={{ width: '100%' }}
              size="large"
              value={filters.city || undefined}
              onChange={handleCityChange}
              allowClear
              dropdownStyle={{ maxHeight: 400 }}
              showSearch
              optionFilterProp="children"
            >
              {cities.map(city => (
                <Option key={city} value={city}>{city}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={6} lg={6}>
            <Button 
              type="primary" 
              ghost
              size="large" 
              onClick={handleClearFilters}
              style={{ width: '100%' }}
              icon={<SearchOutlined />}
            >
              Clear Filters
            </Button>
          </Col>
        </Row>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Spin size="large" tip="Loading theaters..." />
        </div>
      ) : (
        <div className="theaters-list">
          {theaters.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <Space direction="vertical" align="center">
                    <Title level={4}>No theaters found</Title>
                    <Paragraph>Try changing your search criteria</Paragraph>
                  </Space>
                }
              />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {theaters.map(theater => {
                // Generate random number of available screens (3-8)
                const screens = Math.floor(Math.random() * 6) + 3;
                
                return (
                <Col xs={24} sm={12} md={8} lg={8} xl={6} key={theater._id}>
                  <Badge.Ribbon text={`${screens} Screens`} color="#1a237e">
                    <Card
                      hoverable
                      style={{ height: '100%', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      cover={
                        <div style={{ 
                          height: '160px', 
                          background: 'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23ffffff\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
                            opacity: 0.7
                          }}></div>
                          <ShopOutlined style={{ fontSize: '64px', color: '#fff' }} />
                        </div>
                      }
                      actions={[
                        <Button 
                          type="primary" 
                          onClick={() => navigate(`/theater/${theater._id}`)}
                          style={{ background: '#1a237e', borderColor: '#1a237e' }}
                          icon={<ArrowRightOutlined />}
                        >
                          View Details
                        </Button>
                      ]}
                    >
                      <Meta
                        title={
                          <Tooltip title={theater.name}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {theater.name}
                            </div>
                          </Tooltip>
                        }
                        description={
                          <Space direction="vertical" style={{ width: '100%' }} size="small">
                            <Tag color="blue" style={{ marginBottom: '4px' }}>
                              <StarOutlined /> Premium Experience
                            </Tag>
                            <Text style={{ display: 'flex', alignItems: 'center' }}>
                              <EnvironmentOutlined style={{ marginRight: '8px', color: '#1a237e' }} /> 
                              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {theater.address.city}, {theater.address.state}
                              </span>
                            </Text>
                            <Text style={{ display: 'flex', alignItems: 'center' }}>
                              <PhoneOutlined style={{ marginRight: '8px', color: '#1a237e' }} /> 
                              {theater.phone}
                            </Text>
                            <Text ellipsis style={{ display: 'flex', alignItems: 'center' }}>
                              <MailOutlined style={{ marginRight: '8px', color: '#1a237e' }} /> 
                              {theater.email}
                            </Text>
                          </Space>
                        }
                      />
                    </Card>
                  </Badge.Ribbon>
                </Col>
              )})}  
            </Row>
          )}
        </div>
      )}
    </div>
  );
}

export default Theaters;