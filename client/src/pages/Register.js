import '../App.css'; 
import React, { useEffect } from 'react';
import { Button, Form, Input, Radio, message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterUser } from '../apicalls/user';

function Register() {

    const navigate = useNavigate();

    const [form] = Form.useForm(); 

    const submitForm = async (value) => {
        try {
            const res = await RegisterUser(value);
            console.log(res);
            if (res.success) {
                message.success("Registration successful!");
                navigate('/login');
                
            } else {
                throw new Error(res.message || "Registration failed!");
            }
        } catch (error) {
            const errorData = error.response?.data;

            // Highlight specific field errors
            if (errorData?.message?.includes("password")) {
                form.setFields([
                    {
                        name: "password",
                        errors: [errorData.message],
                    },
                ]);
            } else {
                message.error(errorData?.message || "Something went wrong!");
            }
            console.error("Error details:", error.response?.data);
        }
    };

      useEffect(()=>{
        if(localStorage.getItem('token')){
          navigate('/');
        }
      }, []);
    

  return (
    <>
        <div className="blurred-background"></div>
        <header className="App-header">
            <main className="main-area mw-500 text-center px-3">
                <section className="left-section">
                    <h1>Register to BookMyShow</h1>
                </section>
                <section className="right-section">
                    <Form 
                        layout="vertical" 
                        onFinish={submitForm}
                        form={form}
                    >
                    <Form.Item
                        label="Name"
                        htmlFor="name"
                        name="name"
                        className="d-block"
                        rules={[{ required: true, message: "Name is required!" }]}
                    >
                        <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        rules={[{ required: true, message: "Email is required!" }]}
                        ></Input>
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        htmlFor="email"
                        name="email"
                        className="d-block"
                        rules={[{ required: true, message: "Email is required!" }]}
                    >
                        <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        ></Input>
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        htmlFor="password"
                        name="password"
                        className="d-block"
                        rules={[
                            { required: true, message: "Password is required!" },
                            { min: 8, message: "Password must be at least 8 characters long." },
                            {
                                validator: (_, value) =>
                                    value && /[A-Z]/.test(value)
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("Must include at least one uppercase letter")),
                            },
                            {
                                validator: (_, value) =>
                                    value && /[a-z]/.test(value)
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("Must include at least one lowercase letter")),
                            },
                            {
                                validator: (_, value) =>
                                    value && /\d/.test(value)
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("Must include at least one number")),
                            },
                        ]}
                    >
                        <Input
                        id="password"
                        type="password"
                        placeholder="Enter the password"
                        ></Input>
                    </Form.Item>

                    <Form.Item>
                        <Button
                        block
                        type="primary"
                        htmlType="submit"
                        style={{ fontSize: "1rem", fontWeight: "600" }}
                        >
                        Sign Up
                        </Button>
                    </Form.Item>
                    <Form.Item
                        label="Register as a Partner"
                        htmlFor="role"
                        name="role"
                        className="d-block text-center"
                        rules={[{ required: true, message: "Please select an option!" }]}
                    >
                        <div className="d-flex justify-content-start">
                        <Radio.Group
                            name="radiogroup"
                            className="flex-start"
                        >
                            <Radio value={'true'}>Yes</Radio>
                            <Radio value={'false'}>No</Radio>
                        </Radio.Group>
                        </div>
                    </Form.Item>
                    </Form>
                    <div className='redirect-login'>
                    <p>
                        Already a user? <Link to="/login">Login now</Link>
                    </p>
                    </div>
                </section>
            </main>
      </header>
    </>
  )
}

export default Register
