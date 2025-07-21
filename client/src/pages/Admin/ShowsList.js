import React, { useEffect, useState } from 'react';
import { Table, Button, message, Popconfirm, Tag, Space, DatePicker, Select } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getShowsByTheaterOwner, deleteShow } from '../../apicalls/shows';
import { getAllTheaters } from '../../apicalls/theaters';
import ShowFormModal from '../../Components/ShowFormModal';
import moment from 'moment';

function ShowsList() {
  const [shows, setShows] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingShow, setEditingShow] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchShows = async () => {
    try {
      setLoading(true);
      const response = await getShowsByTheaterOwner();
      if (response.success) {
        setShows(response.data);
      } else {
        message.error('Failed to fetch shows');
      }
    } catch (error) {
      message.error('Failed to fetch shows');
    } finally {
      setLoading(false);
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await getAllTheaters();
      if (response.success) {
        setTheaters(response.data);
      } else {
        message.error('Failed to fetch theaters');
      }
    } catch (error) {
      message.error('Failed to fetch theaters');
    }
  };

  useEffect(() => {
    fetchShows();
    fetchTheaters();
  }, []);

  const handleAddShow = () => {
    setEditingShow(null);
    setModalVisible(true);
  };

  const handleEditShow = (show) => {
    setEditingShow(show);
    setModalVisible(true);
  };

  const handleDeleteShow = async (showId) => {
    try {
      const response = await deleteShow(showId);
      if (response.success) {
        message.success('Show deleted successfully');
        fetchShows();
      } else {
        message.error(response.message || 'Failed to delete show');
      }
    } catch (error) {
      message.error('Failed to delete show');
    }
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    setEditingShow(null);
    fetchShows();
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingShow(null);
  };

  const handleTheaterFilter = (theaterId) => {
    setSelectedTheater(theaterId);
  };

  const handleDateFilter = (date) => {
    setSelectedDate(date);
  };

  // Filter shows based on selected theater and date
  const filteredShows = shows.filter(show => {
    let matchesTheater = true;
    let matchesDate = true;

    if (selectedTheater) {
      matchesTheater = show.theater._id === selectedTheater;
    }

    if (selectedDate) {
      const showDate = moment(show.date).format('YYYY-MM-DD');
      matchesDate = showDate === selectedDate.format('YYYY-MM-DD');
    }

    return matchesTheater && matchesDate;
  });

  const columns = [
    {
      title: 'Movie',
      dataIndex: 'movie',
      key: 'movie',
      render: (movie) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {movie.poster && (
            <img 
              src={movie.poster} 
              alt={movie.title} 
              style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} 
            />
          )}
          <div>
            <div style={{ fontWeight: 'bold' }}>{movie.title}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {movie.language.join(', ')} | {movie.duration} mins
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Theater',
      dataIndex: 'theater',
      key: 'theater',
      render: (theater) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{theater.name}</div>
          <div style={{ fontSize: '12px', color: '#888' }}>
            {theater.address.city}, {theater.address.state}
          </div>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => moment(date).format('MMM DD, YYYY'),
      sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix(),
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      render: (time) => time,
      sorter: (a, b) => {
        const timeA = moment(a.time, 'HH:mm');
        const timeB = moment(b.time, 'HH:mm');
        return timeA.unix() - timeB.unix();
      },
    },
    {
      title: 'Ticket Price',
      dataIndex: 'ticketPrice',
      key: 'ticketPrice',
      render: (price) => `₹${price}`,
      sorter: (a, b) => a.ticketPrice - b.ticketPrice,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            size="small"
            onClick={() => handleEditShow(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this show?"
            onConfirm={() => handleDeleteShow(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />} 
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Shows Management</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddShow}
          size="large"
        >
          Add Show
        </Button>
      </div>

      <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
        <Select
          placeholder="Filter by Theater"
          style={{ width: '300px' }}
          allowClear
          onChange={handleTheaterFilter}
        >
          {theaters.map(theater => (
            <Select.Option key={theater._id} value={theater._id}>
              {theater.name} - {theater.address.city}
            </Select.Option>
          ))}
        </Select>

        <DatePicker 
          placeholder="Filter by Date"
          onChange={handleDateFilter}
          allowClear
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredShows}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} shows`
        }}
        scroll={{ x: 1200 }}
      />

      <ShowFormModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
        editingShow={editingShow}
      />
    </div>
  );
}

export default ShowsList;