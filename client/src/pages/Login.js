import { Button, Form, Input, message } from "antd";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../apicalls/user";

function Login() {
  const navigate = useNavigate();

  const sumbitForm = async (values) => {
    
    try {
      const res = await LoginUser(values);
      console.log(res);
      if (res.success) {
        message.success("Logged in successfully");

        localStorage.setItem('token', res.token);

        window.location.href = '/'
      } else {
        throw new Error(res.message || "Login failed");
      }
    } catch (error) {
      console.log(error);
      message.error(error.message || "An error occurred during login.");
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
            <h1>Welcomeback to BookMyShow</h1>
          </section>

          <section className="right-section">
            <Form layout="vertical" onFinish={sumbitForm}>
              <Form.Item
                label="Email"
                htmlFor="email"
                name="email"
                className="d-block"
                rules={[{ required: true, message: "Email is required" }]}
              >
                <Input id="email" type="text" placeholder="Enter your Email" />
              </Form.Item>

              <Form.Item
                label="Password"
                htmlFor="password"
                name="password"
                className="d-block"
                rules={[{ required: true, message: "Password is required" }]}
              >
                <Input.Password
                  id="password"
                  placeholder="Enter your Password"
                />
              </Form.Item>

              <Form.Item className="d-block">
                <Button
                  type="primary"
                  block
                  htmlType="submit"
                  style={{ fontSize: "1rem", fontWeight: "600" }}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>
            <div>
              <p>
                New User? <Link to="/register">Register Here</Link>
              </p>
              <p>
                Forgot Password? <Link to="/forget">Click Here</Link>
              </p>
            </div>
          </section>
        </main>
      </header>
    </>
  );
}

export default Login;
