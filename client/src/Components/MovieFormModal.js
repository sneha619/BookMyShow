import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message } from 'antd';
import { addMovie, updateMovie } from '../apicalls/movies';
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
  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi', 'Adventure', 'Animation', 'Documentary'];
  const languages = ['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Gujarati', 'Punjabi'];

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
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || `Failed to ${editingMovie ? 'update' : 'add'} movie`);
      }
    } catch (error) {
      message.error(`Failed to ${editingMovie ? 'update' : 'add'} movie`);
    }
  };

  return (
    <Modal
      title={editingMovie ? 'Edit Movie' : 'Add Movie'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
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