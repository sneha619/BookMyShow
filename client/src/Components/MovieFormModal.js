import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin } from 'antd';
import { addMovie, updateMovie } from '../apicalls/movies';
import { getAllTheaters } from '../apicalls/theaters';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

function MovieFormModal({ 
  visible, 
  onCancel, 
  editingMovie, 
  onSuccess
}) {
  const [form] = Form.useForm();
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Adventure', 'Animation', 'Documentary'];
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi'];
  
  useEffect(() => {
    const fetchTheaters = async () => {
      setLoading(true);
      try {
        const response = await getAllTheaters();
        if (response.success) {
          setTheaters(response.data);
        } else {
          message.error('Failed to fetch theaters');
        }
      } catch (error) {
        console.error('Error fetching theaters:', error);
        message.error('Failed to fetch theaters');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTheaters();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (!values.theaters || values.theaters.length === 0) {
        message.error('Please select at least one theater');
        return;
      }
      
      const movieData = {
        ...values,
        releaseDate: values.releaseDate.format('YYYY-MM-DD'),
        cast: values.cast.split(',').map(actor => ({
          name: actor.trim(),
          role: '',
          image: ''
        })),
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
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || `Failed to ${editingMovie ? 'update' : 'add'} movie`);
      }
    } catch (error) {
      message.error(`Failed to ${editingMovie ? 'update' : 'add'} movie`);
    }
  };

  // Set initial values when editing a movie
  useEffect(() => {
    if (editingMovie && visible) {
      form.setFieldsValue({
        ...editingMovie,
        releaseDate: editingMovie.releaseDate ? moment(editingMovie.releaseDate) : null,
        cast: Array.isArray(editingMovie.cast) ? editingMovie.cast.map(actor => actor.name).join(', ') : '',
        genre: Array.isArray(editingMovie.genre) ? editingMovie.genre : [],
        language: Array.isArray(editingMovie.language) ? editingMovie.language : [],
        theaters: Array.isArray(editingMovie.theaters) ? editingMovie.theaters : []
      });
    } else {
      form.resetFields();
    }
  }, [editingMovie, form, visible]);

  return (
    <Modal
      title={editingMovie ? 'Edit Movie' : 'Add Movie'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      {loading && <Spin tip="Loading theaters..." style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }} />}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          isActive: true
        }}
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
          name="theaters"
          label="Theaters"
          rules={[{ required: true, message: 'Please select at least one theater' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select theaters"
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : null}
          >
            {theaters.map(theater => (
              <Option key={theater._id} value={theater._id}>
                {theater.name} - {theater.address.city}, {theater.address.state}
              </Option>
            ))}
          </Select>
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
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            {editingMovie ? 'Update' : 'Add'} Movie
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default MovieFormModal;