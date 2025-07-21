import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin, TimePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

function SportFormModal({ 
  visible, 
  onCancel, 
  editingSport, 
  onSuccess
}) {
  const [form] = Form.useForm();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const sportTypes = ['Cricket', 'Football', 'Basketball', 'Tennis', 'Hockey', 'Badminton', 'Volleyball', 'Rugby', 'Baseball', 'Athletics', 'Swimming', 'Boxing', 'MMA', 'Golf', 'Other'];
  const tournamentTypes = ['League Match', 'Tournament', 'Championship', 'Friendly Match', 'Exhibition', 'World Cup', 'Series', 'Test Match', 'Other'];
  
  // Mock function for fetching venues - replace with actual API call when available
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        // Replace with actual API call when available
        // const response = await getAllVenues();
        const mockVenues = [
          { _id: '1', name: 'National Stadium', location: 'Downtown' },
          { _id: '2', name: 'Sports Arena', location: 'West End' },
          { _id: '3', name: 'Olympic Complex', location: 'North District' },
          { _id: '4', name: 'University Stadium', location: 'East Side' },
        ];
        
        setVenues(mockVenues);
      } catch (error) {
        console.error('Error fetching venues:', error);
        message.error('Failed to fetch venues');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVenues();
  }, []);

  const handleSubmit = async (values) => {
    try {
      if (!values.venue) {
        message.error('Please select a venue');
        return;
      }
      
      const sportData = {
        ...values,
        eventDate: values.eventDate.format('YYYY-MM-DD'),
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime ? values.endTime.format('HH:mm') : undefined,
      };

      // Replace with actual API call when available
      // let response;
      // if (editingSport) {
      //   response = await updateSport(editingSport._id, sportData);
      // } else {
      //   response = await addSport(sportData);
      // }

      // Mock successful response
      const response = { success: true };

      if (response.success) {
        message.success(`Sport event ${editingSport ? 'updated' : 'added'} successfully`);
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || `Failed to ${editingSport ? 'update' : 'add'} sport event`);
      }
    } catch (error) {
      message.error(`Failed to ${editingSport ? 'update' : 'add'} sport event`);
    }
  };

  // Set initial values when editing a sport event
  useEffect(() => {
    if (editingSport && visible) {
      form.setFieldsValue({
        ...editingSport,
        eventDate: editingSport.eventDate ? moment(editingSport.eventDate) : null,
        startTime: editingSport.startTime ? moment(editingSport.startTime, 'HH:mm') : null,
        endTime: editingSport.endTime ? moment(editingSport.endTime, 'HH:mm') : null,
      });
    } else {
      form.resetFields();
    }
  }, [editingSport, form, visible]);

  return (
    <Modal
      title={editingSport ? 'Edit Sport Event' : 'Add Sport Event'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      {loading && <Spin tip="Loading venues..." style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }} />}
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
          label="Event Title"
          rules={[{ required: true, message: 'Please enter event title' }]}
        >
          <Input placeholder="Enter event title (e.g., India vs Australia)" />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="sportType"
            label="Sport Type"
            rules={[{ required: true, message: 'Please select sport type' }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="Select sport type">
              {sportTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tournamentType"
            label="Tournament Type"
            rules={[{ required: true, message: 'Please select tournament type' }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="Select tournament type">
              {tournamentTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter event description' }]}
        >
          <TextArea rows={4} placeholder="Enter event description" />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="teamA"
            label="Team A / Player A"
            rules={[{ required: true, message: 'Please enter Team A' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Enter Team A or Player A name" />
          </Form.Item>

          <Form.Item
            name="teamB"
            label="Team B / Player B"
            rules={[{ required: true, message: 'Please enter Team B' }]}
            style={{ flex: 1 }}
          >
            <Input placeholder="Enter Team B or Player B name" />
          </Form.Item>
        </div>

        <Form.Item
          name="venue"
          label="Venue"
          rules={[{ required: true, message: 'Please select a venue' }]}
        >
          <Select
            placeholder="Select venue"
            loading={loading}
            notFoundContent={loading ? <Spin size="small" /> : null}
          >
            {venues.map(venue => (
              <Option key={venue._id} value={venue._id}>
                {venue.name} - {venue.location}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="eventDate"
            label="Event Date"
            rules={[{ required: true, message: 'Please select event date' }]}
            style={{ flex: 1 }}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: 'Please select start time' }]}
            style={{ flex: 1 }}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="endTime"
            label="End Time (Estimated)"
            style={{ flex: 1 }}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="ticketPrice"
            label="Ticket Price"
            rules={[{ required: true, message: 'Please enter ticket price' }]}
            style={{ flex: 1 }}
          >
            <Input type="number" min="0" step="0.01" placeholder="0.00" prefix="$" />
          </Form.Item>

          <Form.Item
            name="totalSeats"
            label="Total Seats"
            rules={[{ required: true, message: 'Please enter total seats' }]}
            style={{ flex: 1 }}
          >
            <Input type="number" min="1" placeholder="1000" />
          </Form.Item>
        </div>

        <Form.Item
          name="posterUrl"
          label="Poster URL"
        >
          <Input placeholder="https://example.com/poster.jpg" />
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
            {editingSport ? 'Update' : 'Add'} Sport Event
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default SportFormModal;