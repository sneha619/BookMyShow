import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message, TimePicker, InputNumber, Spin } from 'antd';
import { addShow, updateShow } from '../apicalls/shows';
import { getAllMovies } from '../apicalls/movies';
import { getAllTheaters } from '../apicalls/theaters';
import moment from 'moment';

const { Option } = Select;

function ShowFormModal({ 
  visible, 
  onCancel, 
  onSuccess, 
  editingShow,
  defaultTheaterId = null
}) {
  const [form] = Form.useForm();
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(defaultTheaterId);
  const [loading, setLoading] = useState(false);
  const [moviesLoading, setMoviesLoading] = useState(false);
  const [theatersLoading, setTheatersLoading] = useState(false);
  
  // Fetch theaters and movies when component mounts
  useEffect(() => {
    fetchTheaters();
    fetchMovies();
  }, []);

  // Set form values when editing a show
  useEffect(() => {
    if (editingShow) {
      form.setFieldsValue({
        movie: editingShow.movie._id,
        theater: editingShow.theater._id,
        date: moment(editingShow.date),
        time: moment(editingShow.time, 'HH:mm'),
        ticketPrice: editingShow.ticketPrice,
        isActive: editingShow.isActive ? 'active' : 'inactive'
      });
      setSelectedMovie(editingShow.movie._id);
      setSelectedTheater(editingShow.theater._id);
    } else if (defaultTheaterId) {
      form.setFieldsValue({
        theater: defaultTheaterId
      });
      setSelectedTheater(defaultTheaterId);
    }
  }, [editingShow, form, defaultTheaterId]);

  const fetchTheaters = async () => {
    setTheatersLoading(true);
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
      setTheatersLoading(false);
    }
  };

  const fetchMovies = async () => {
    setMoviesLoading(true);
    try {
      const response = await getAllMovies();
      if (response.success) {
        setMovies(response.data);
      } else {
        message.error('Failed to fetch movies');
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
      message.error('Failed to fetch movies');
    } finally {
      setMoviesLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      const showData = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
        time: values.time.format('HH:mm'),
        isActive: values.isActive === 'active'
      };

      let response;
      if (editingShow) {
        response = await updateShow(editingShow._id, showData);
      } else {
        response = await addShow(showData);
      }

      if (response.success) {
        message.success(`Show ${editingShow ? 'updated' : 'added'} successfully`);
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || `Failed to ${editingShow ? 'update' : 'add'} show`);
      }
    } catch (error) {
      message.error(`Failed to ${editingShow ? 'update' : 'add'} show`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleMovieChange = (movieId) => {
    setSelectedMovie(movieId);
    
    // If a theater is already selected, check if the movie is assigned to it
    if (selectedTheater) {
      const movie = movies.find(m => m._id === movieId);
      if (movie && !movie.theaters.includes(selectedTheater)) {
        message.warning('This movie is not assigned to the selected theater. Please choose another movie or theater.');
      }
    }
  };

  const handleTheaterChange = (theaterId) => {
    setSelectedTheater(theaterId);
    
    // If a movie is already selected, check if it's assigned to this theater
    if (selectedMovie) {
      const movie = movies.find(m => m._id === selectedMovie);
      if (movie && !movie.theaters.includes(theaterId)) {
        message.warning('The selected movie is not assigned to this theater. Please choose another movie or theater.');
      }
    }
  };

  // Filter movies based on selected theater
  const filteredMovies = selectedTheater 
    ? movies.filter(movie => movie.theaters.includes(selectedTheater))
    : movies;

  return (
    <Modal
      title={editingShow ? 'Edit Show' : 'Add Show'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="theater"
            label="Theater"
            rules={[{ required: true, message: 'Please select a theater' }]}
          >
            <Select 
              placeholder="Select theater"
              loading={theatersLoading}
              onChange={handleTheaterChange}
              disabled={!!defaultTheaterId}
            >
              {theaters.map(theater => (
                <Option key={theater._id} value={theater._id}>
                  {theater.name} - {theater.address.city}, {theater.address.state}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="movie"
            label="Movie"
            rules={[{ required: true, message: 'Please select a movie' }]}
          >
            <Select 
              placeholder="Select movie"
              loading={moviesLoading}
              onChange={handleMovieChange}
              disabled={!selectedTheater}
            >
              {filteredMovies.map(movie => (
                <Option key={movie._id} value={movie._id}>
                  {movie.title} ({movie.language.join(', ')}) - {movie.duration} mins
                </Option>
              ))}
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="date"
              label="Date"
              rules={[{ required: true, message: 'Please select a date' }]}
              style={{ flex: 1 }}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="YYYY-MM-DD"
                disabledDate={(current) => {
                  // Can't select days before today
                  return current && current < moment().startOf('day');
                }}
              />
            </Form.Item>

            <Form.Item
              name="time"
              label="Time"
              rules={[{ required: true, message: 'Please select a time' }]}
              style={{ flex: 1 }}
            >
              <TimePicker 
                style={{ width: '100%' }} 
                format="HH:mm" 
                minuteStep={5}
              />
            </Form.Item>
          </div>

          <Form.Item
            name="ticketPrice"
            label="Ticket Price (₹)"
            rules={[{ required: true, message: 'Please enter ticket price' }]}
          >
            <InputNumber 
              min={1} 
              max={2000} 
              style={{ width: '100%' }} 
              formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/₹\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
            initialValue="active"
          >
            <Select placeholder="Select status">
              <Option value="active">Active</Option>
              <Option value="inactive">Inactive</Option>
            </Select>
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              {editingShow ? 'Update' : 'Add'} Show
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
}

export default ShowFormModal;