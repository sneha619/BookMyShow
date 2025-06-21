import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Upload, message, Popconfirm, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { getAllMovies, addMovie, updateMovie, deleteMovie } from '../../apicalls/movies';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form] = Form.useForm();

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Adventure', 'Animation', 'Documentary'];
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi'];

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

  const handleSubmit = async (values) => {
    try {
      const movieData = {
        ...values,
        releaseDate: values.releaseDate.format('YYYY-MM-DD'),
        cast: values.cast.split(',').map(actor => actor.trim()),
        duration: parseInt(values.duration)
      };

      let response;
      if (editingMovie) {
        response = await updateMovie(editingMovie._id, movieData);
      } else {
        response = await addMovie(movieData);
      }

      if (response.success) {
        message.success(`Movie ${editingMovie ? 'updated' : 'added'} successfully`);
        setModalVisible(false);
        fetchMovies();
      } else {
        message.error(response.message || `Failed to ${editingMovie ? 'update' : 'add'} movie`);
      }
    } catch (error) {
      message.error(`Failed to ${editingMovie ? 'update' : 'add'} movie`);
    }
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

      <Modal
        title={editingMovie ? 'Edit Movie' : 'Add Movie'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Movie Title"
            rules={[{ required: true, message: 'Please enter movie title' }]}
          >
            <Input placeholder="Enter movie title" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter movie description' }]}
          >
            <TextArea rows={4} placeholder="Enter movie description" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="duration"
              label="Duration (minutes)"
              rules={[{ required: true, message: 'Please enter duration' }]}
              style={{ flex: 1 }}
            >
              <Input type="number" placeholder="120" />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Rating (out of 10)"
              rules={[{ required: true, message: 'Please enter rating' }]}
              style={{ flex: 1 }}
            >
              <Input type="number" step="0.1" min="0" max="10" placeholder="8.5" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="genre"
              label="Genre"
              rules={[{ required: true, message: 'Please select genres' }]}
              style={{ flex: 1 }}
            >
              <Select mode="multiple" placeholder="Select genres">
                {genres.map(genre => (
                  <Option key={genre} value={genre}>{genre}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="language"
              label="Language"
              rules={[{ required: true, message: 'Please select languages' }]}
              style={{ flex: 1 }}
            >
              <Select mode="multiple" placeholder="Select languages">
                {languages.map(lang => (
                  <Option key={lang} value={lang}>{lang}</Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="releaseDate"
            label="Release Date"
            rules={[{ required: true, message: 'Please select release date' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="cast"
            label="Cast (comma separated)"
            rules={[{ required: true, message: 'Please enter cast members' }]}
          >
            <Input placeholder="Actor 1, Actor 2, Actor 3" />
          </Form.Item>

          <Form.Item
            name="director"
            label="Director"
            rules={[{ required: true, message: 'Please enter director name' }]}
          >
            <Input placeholder="Director name" />
          </Form.Item>

          <Form.Item
            name="poster"
            label="Poster URL"
          >
            <Input placeholder="https://example.com/poster.jpg" />
          </Form.Item>

          <Form.Item
            name="trailer"
            label="Trailer URL"
          >
            <Input placeholder="https://youtube.com/watch?v=..." />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Status"
            initialValue={true}
          >
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingMovie ? 'Update' : 'Add'} Movie
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

export default MoviesList;