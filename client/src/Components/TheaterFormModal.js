import React, { useState } from 'react';
import { Modal, Form, Input, Button, Select, InputNumber, message } from 'antd';
import { addTheater, updateTheater } from '../apicalls/theaters';

const { Option } = Select;
const { TextArea } = Input;

function TheaterFormModal({ visible, onCancel, onSuccess, editingTheater }) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      
      // Properly structure the address object
      const theaterData = {
        ...values,
        address: {
          street: values.address,
          city: values.city,
          state: values.state,
          pincode: values.pincode
        }
      };
      
      // Remove individual address fields to avoid duplication
      delete theaterData.city;
      delete theaterData.state;
      delete theaterData.pincode;
      
      let response;
      
      if (editingTheater) {
        response = await updateTheater(editingTheater._id, theaterData);
      } else {
        response = await addTheater(theaterData);
      }
      
      if (response.success) {
        message.success(editingTheater ? 'Theater updated successfully!' : 'Theater added successfully!');
        form.resetFields();
        onSuccess();
      } else {
        message.error(response.message || 'Something went wrong');
      }
    } catch (error) {
      message.error('Something went wrong');
      console.error('Theater form error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // Set form values when editing
  React.useEffect(() => {
    if (editingTheater && visible) {
      form.setFieldsValue({
        name: editingTheater.name,
        address: editingTheater.address?.street || '',
        city: editingTheater.address?.city || '',
        state: editingTheater.address?.state || '',
        pincode: editingTheater.address?.pincode || '',
        phone: editingTheater.phone,
        email: editingTheater.email,
        capacity: editingTheater.capacity,
        facilities: editingTheater.facilities,
        description: editingTheater.description
      });
    } else if (!editingTheater && visible) {
      form.resetFields();
    }
  }, [editingTheater, visible, form]);

  return (
    <Modal
      title={editingTheater ? 'Edit Theater' : 'Add New Theater'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: '20px' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            label="Theater Name"
            name="name"
            rules={[{ required: true, message: 'Please enter theater name' }]}
          >
            <Input placeholder="Enter theater name" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[
              { required: true, message: 'Please enter phone number' },
              {
                pattern: /^\d{10}$/,
                message: 'Phone number must be exactly 10 digits',
              },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>
        </div>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <TextArea rows={2} placeholder="Enter complete address" />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <Form.Item
            label="City"
            name="city"
            rules={[{ required: true, message: 'Please enter city' }]}
          >
            <Input placeholder="Enter city" />
          </Form.Item>

          <Form.Item
            label="State"
            name="state"
            rules={[{ required: true, message: 'Please enter state' }]}
          >
            <Input placeholder="Enter state" />
          </Form.Item>

          <Form.Item
            label="Pincode"
            name="pincode"
            rules={[{ required: true, message: 'Please enter pincode' }]}
          >
            <Input placeholder="Enter pincode" />
          </Form.Item>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Total Capacity"
            name="capacity"
            rules={[{ required: true, message: 'Please enter capacity' }]}
          >
            <InputNumber 
              placeholder="Enter total capacity" 
              style={{ width: '100%' }}
              min={1}
            />
          </Form.Item>
        </div>

        <Form.Item
          label="Facilities"
          name="facilities"
        >
          <Select
            mode="multiple"
            placeholder="Select available facilities"
            options={[
              { value: 'parking', label: 'Parking' },
              { value: 'food_court', label: 'Food Court' },
              { value: 'wheelchair_accessible', label: 'Wheelchair Accessible' },
              { value: 'air_conditioning', label: 'Air Conditioning' },
              { value: 'dolby_atmos', label: 'Dolby Atmos' },
              { value: 'imax', label: 'IMAX' },
              { value: '3d_screen', label: '3D Screen' },
              { value: 'recliner_seats', label: 'Recliner Seats' }
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
        >
          <TextArea rows={3} placeholder="Enter theater description (optional)" />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ background: '#1890ff' }}
          >
            {editingTheater ? 'Update Theater' : 'Add Theater'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default TheaterFormModal;