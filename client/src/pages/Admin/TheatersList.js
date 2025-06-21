import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Popconfirm, Tag, Space, Card } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { getAllTheaters, addTheater, updateTheater, deleteTheater } from '../../apicalls/theaters';

const { TextArea } = Input;

function TheatersList() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editingTheater, setEditingTheater] = useState(null);
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [form] = Form.useForm();

  const fetchTheaters = async () => {
    try {
      setLoading(true);
      const response = await getAllTheaters();
      if (response.success) {
        setTheaters(response.data);
      } else {
        message.error('Failed to fetch theaters');
      }
    } catch (error) {
      message.error('Failed to fetch theaters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheaters();
  }, []);

  const handleAddTheater = () => {
    setEditingTheater(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditTheater = (theater) => {
    setEditingTheater(theater);
    form.setFieldsValue({
      name: theater.name,
      email: theater.email,
      phone: theater.phone,
      street: theater.address.street,
      city: theater.address.city,
      state: theater.address.state,
      pincode: theater.address.pincode
    });
    setModalVisible(true);
  };

  const handleViewDetails = (theater) => {
    setSelectedTheater(theater);
    setDetailsModalVisible(true);
  };

  const handleDeleteTheater = async (theaterId) => {
    try {
      const response = await deleteTheater(theaterId);
      if (response.success) {
        message.success('Theater deleted successfully');
        fetchTheaters();
      } else {
        message.error(response.message || 'Failed to delete theater');
      }
    } catch (error) {
      message.error('Failed to delete theater');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const theaterData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          pincode: values.pincode
        },
        seats: [
          // Default seat configuration
          { seatNumber: 'A1', type: 'regular', price: 150 },
          { seatNumber: 'A2', type: 'regular', price: 150 },
          { seatNumber: 'A3', type: 'regular', price: 150 },
          { seatNumber: 'A4', type: 'regular', price: 150 },
          { seatNumber: 'A5', type: 'regular', price: 150 },
          { seatNumber: 'B1', type: 'premium', price: 200 },
          { seatNumber: 'B2', type: 'premium', price: 200 },
          { seatNumber: 'B3', type: 'premium', price: 200 },
          { seatNumber: 'B4', type: 'premium', price: 200 },
          { seatNumber: 'B5', type: 'premium', price: 200 }
        ]
      };

      let response;
      if (editingTheater) {
        response = await updateTheater(editingTheater._id, theaterData);
      } else {
        response = await addTheater(theaterData);
      }

      if (response.success) {
        message.success(`Theater ${editingTheater ? 'updated' : 'added'} successfully`);
        setModalVisible(false);
        fetchTheaters();
      } else {
        message.error(response.message || `Failed to ${editingTheater ? 'update' : 'add'} theater`);
      }
    } catch (error) {
      message.error(`Failed to ${editingTheater ? 'update' : 'add'} theater`);
    }
  };

  const columns = [
    {
      title: 'Theater Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      title: 'Owner',
      dataIndex: ['owner', 'name'],
      key: 'owner',
      render: (ownerName) => ownerName || 'N/A'
    },
    {
      title: 'City',
      dataIndex: ['address', 'city'],
      key: 'city'
    },
    {
      title: 'State',
      dataIndex: ['address', 'state'],
      key: 'state'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Total Seats',
      dataIndex: 'seats',
      key: 'totalSeats',
      render: (seats) => seats?.length || 0
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
      width: 150,
      render: (_, record) => (
        <Space>
          <Button 
            type="default" 
            size="small" 
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          <Button 
            type="primary" 
            size="small" 
            icon={<EditOutlined />}
            onClick={() => handleEditTheater(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this theater?"
            onConfirm={() => handleDeleteTheater(record._id)}
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
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Theaters Management</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddTheater}
          size="large"
        >
          Add Theater
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={theaters}
        rowKey="_id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} theaters`
        }}
        scroll={{ x: 1200 }}
      />

      {/* Add/Edit Theater Modal */}
      <Modal
        title={editingTheater ? 'Edit Theater' : 'Add Theater'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Theater Name"
            rules={[{ required: true, message: 'Please enter theater name' }]}
          >
            <Input placeholder="Enter theater name" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter valid email' }
              ]}
              style={{ flex: 1 }}
            >
              <Input placeholder="theater@example.com" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: 'Please enter phone number' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="9876543210" />
            </Form.Item>
          </div>

          <Form.Item
            name="street"
            label="Street Address"
            rules={[{ required: true, message: 'Please enter street address' }]}
          >
            <TextArea rows={2} placeholder="Enter street address" />
          </Form.Item>

          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true, message: 'Please enter city' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="City" />
            </Form.Item>

            <Form.Item
              name="state"
              label="State"
              rules={[{ required: true, message: 'Please enter state' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="State" />
            </Form.Item>

            <Form.Item
              name="pincode"
              label="Pincode"
              rules={[{ required: true, message: 'Please enter pincode' }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="123456" />
            </Form.Item>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingTheater ? 'Update' : 'Add'} Theater
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Theater Details Modal */}
      <Modal
        title="Theater Details"
        open={detailsModalVisible}
        onCancel={() => setDetailsModalVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailsModalVisible(false)}>Close</Button>]}
        width={700}
      >
        {selectedTheater && (
          <div>
            <Card title="Basic Information" style={{ marginBottom: '16px' }}>
              <p><strong>Name:</strong> {selectedTheater.name}</p>
              <p><strong>Owner:</strong> {selectedTheater.owner?.name || 'N/A'}</p>
              <p><strong>Email:</strong> {selectedTheater.email}</p>
              <p><strong>Phone:</strong> {selectedTheater.phone}</p>
              <p><strong>Status:</strong> 
                <Tag color={selectedTheater.isActive ? 'green' : 'red'}>
                  {selectedTheater.isActive ? 'Active' : 'Inactive'}
                </Tag>
              </p>
            </Card>

            <Card title="Address" style={{ marginBottom: '16px' }}>
              <p>{selectedTheater.address.street}</p>
              <p>{selectedTheater.address.city}, {selectedTheater.address.state} - {selectedTheater.address.pincode}</p>
            </Card>

            <Card title="Seating Configuration">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                {selectedTheater.seats?.map((seat, index) => (
                  <div key={index} style={{ 
                    padding: '8px', 
                    border: '1px solid #d9d9d9', 
                    borderRadius: '4px',
                    backgroundColor: seat.type === 'premium' ? '#fff7e6' : '#f6ffed'
                  }}>
                    <strong>{seat.seatNumber}</strong> - {seat.type} (₹{seat.price})
                  </div>
                ))}
              </div>
              <p style={{ marginTop: '16px' }}>
                <strong>Total Seats:</strong> {selectedTheater.seats?.length || 0}
              </p>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TheatersList;