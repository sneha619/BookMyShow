import React, { useEffect, useState } from 'react';
import { Table, Button, Form, message, Popconfirm, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllMovies, deleteMovie } from '../../apicalls/movies';
import MovieFormModal from '../../Components/MovieFormModal';
import moment from 'moment';

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await getAllMovies();
      if (response.success) {
        setMovies(response.data);
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
    fetchMovies();
  }, []);

  const handleAddMovie = () => {
    setEditingMovie(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    form.setFieldsValue({
      ...movie,
      releaseDate: moment(movie.releaseDate),
      cast: movie.cast.join(', ')
    });
    setModalVisible(true);
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      const response = await deleteMovie(movieId);
      if (response.success) {
        message.success('Movie deleted successfully');
        fetchMovies();
      } else {
        message.error(response.message || 'Failed to delete movie');
      }
    } catch (error) {
      message.error('Failed to delete movie');
    }
  };

  const handleModalSuccess = () => {
    setModalVisible(false);
    setEditingMovie(null);
    fetchMovies();
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingMovie(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'poster',
      key: 'poster',
      width: 80,
      render: (poster) => (
        <img 
          src={poster || '/placeholder-movie.jpg'} 
          alt="Movie poster" 
          style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px' }}
        />
      )
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title)
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      render: (genres) => (
        <>
          {genres.map(genre => (
            <Tag key={genre} color="blue">{genre}</Tag>
          ))}
        </>
      )
    },
    {
      title: 'Language',
      dataIndex: 'language',
      key: 'language',
      render: (languages) => (
        <>
          {languages.map(lang => (
            <Tag key={lang} color="green">{lang}</Tag>
          ))}
        </>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} min`
    },
    {
      title: 'Release Date',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      render: (date) => moment(date).format('MMM DD, YYYY'),
      sorter: (a, b) => moment(a.releaseDate).unix() - moment(b.releaseDate).unix()
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => `${rating}/10`
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditMovie(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this movie?"
            onConfirm={() => handleDeleteMovie(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="primary" 
              danger 
              size="small" 
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Movies Management</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddMovie}
          size="large"
        >
          Add Movie
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={movies}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} movies`
        }}
        scroll={{ x: 1200 }}
      />

      <MovieFormModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        editingMovie={editingMovie}
        onSuccess={handleModalSuccess}
        form={form}
      />
    </div>
  );
}

export default MoviesList;