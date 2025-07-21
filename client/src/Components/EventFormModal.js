import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, message, Spin, TimePicker } from 'antd';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

function EventFormModal({ 
  visible, 
  onCancel, 
  editingEvent, 
  onSuccess
}) {
  const [form] = Form.useForm();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const categories = ['Concert', 'Conference', 'Exhibition', 'Festival', 'Workshop', 'Seminar', 'Meetup', 'Charity', 'Cultural', 'Other'];
  
  // Mock function for fetching venues - replace with actual API call when available
  useEffect(() => {
    const fetchVenues = async () => {
      setLoading(true);
      try {
        // Replace with actual API call when available
        // const response = await getAllVenues();
        const mockVenues = [
          { _id: '1', name: 'City Convention Center', location: 'Downtown' },
          { _id: '2', name: 'Grand Arena', location: 'West End' },
          { _id: '3', name: 'Exhibition Hall', location: 'North District' },
          { _id: '4', name: 'Community Center', location: 'East Side' },
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
      
      const eventData = {
        ...values,
        eventDate: values.eventDate.format('YYYY-MM-DD'),
        startTime: values.startTime.format('HH:mm'),
        endTime: values.endTime ? values.endTime.format('HH:mm') : undefined,
        performers: values.performers ? values.performers.split(',').map(performer => performer.trim()) : [],
      };

      // Replace with actual API call when available
      // let response;
      // if (editingEvent) {
      //   response = await updateEvent(editingEvent._id, eventData);
      // } else {
      //   response = await addEvent(eventData);
      // }

      // Mock successful response
      const response = { success: true };

      if (response.success) {
        message.success(`Event ${editingEvent ? 'updated' : 'added'} successfully`);
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || `Failed to ${editingEvent ? 'update' : 'add'} event`);
      }
    } catch (error) {
      message.error(`Failed to ${editingEvent ? 'update' : 'add'} event`);
    }
  };

  // Set initial values when editing an event
  useEffect(() => {
    if (editingEvent && visible) {
      form.setFieldsValue({
        ...editingEvent,
        eventDate: editingEvent.eventDate ? moment(editingEvent.eventDate) : null,
        startTime: editingEvent.startTime ? moment(editingEvent.startTime, 'HH:mm') : null,
        endTime: editingEvent.endTime ? moment(editingEvent.endTime, 'HH:mm') : null,
        performers: Array.isArray(editingEvent.performers) ? editingEvent.performers.join(', ') : '',
      });
    } else {
      form.resetFields();
    }
  }, [editingEvent, form, visible]);

  return (
    <Modal
      title={editingEvent ? 'Edit Event' : 'Add Event'}
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
          <Input placeholder="Enter event title" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter event description' }]}
        >
          <TextArea rows={4} placeholder="Enter event description" />
        </Form.Item>

        <div style={{ display: 'flex', gap: '16px' }}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category' }]}
            style={{ flex: 1 }}
          >
            <Select placeholder="Select category">
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="venue"
            label="Venue"
            rules={[{ required: true, message: 'Please select a venue' }]}
            style={{ flex: 1 }}
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
        </div>

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
            label="End Time"
            style={{ flex: 1 }}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
        </div>

        <Form.Item
          name="performers"
          label="Performers/Speakers (comma separated)"
        >
          <Input placeholder="Performer 1, Performer 2, Performer 3" />
        </Form.Item>

        <Form.Item
          name="ticketPrice"
          label="Ticket Price"
          rules={[{ required: true, message: 'Please enter ticket price' }]}
        >
          <Input type="number" min="0" step="0.01" placeholder="0.00" prefix="$" />
        </Form.Item>

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
            {editingEvent ? 'Update' : 'Add'} Event
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default EventFormModal;