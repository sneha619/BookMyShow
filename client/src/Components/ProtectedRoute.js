import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/loaderSlice';
import { getCurrentUser } from '../apicalls/user';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setUser } from '../redux/userSlice';
import { Layout, Menu, message } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { HomeOutlined, LogoutOutlined, ProfileOutlined, UserOutlined } from '@ant-design/icons';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getValidUser = async () => {
    try {
      console.log("Fetching token from localStorage");
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found, redirecting to login");
        navigate("/login");
        return;
      }

      console.log("Decoding token");
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // in seconds

      if (decodedToken.exp < currentTime) {
        console.log("Token is expired, redirecting to login");
        localStorage.removeItem("token"); 
        navigate("/login");
        return;
      }

      dispatch(showLoading());
      console.log("Calling getCurrentUser API");
      const response = await getCurrentUser();

      if (response.success) {
        console.log("User data fetched successfully", response.data);
        dispatch(setUser(response.data));
      } else {
        console.log("Failed to fetch user data", response.message);
        dispatch(setUser(null));
        message.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      console.log("Error fetching user data", error.message);
      dispatch(setUser(null));
      message.error(error.message);
      navigate("/login");
    } finally {
      dispatch(hideLoading());
    }
  };

  const navItems = [
    {
      label: 'Home',
      icon: <HomeOutlined />
    },
    {
      label: `${user?.name}`,
      icon: <UserOutlined />,

      children: [
        {
          label: (
            <span onClick={() => {user.isAdmin? navigate('/admin'): navigate('/profile')}}>
             My Profile 
            </span>
          ),
          icon: <ProfileOutlined />
        },
        {
          label: (<Link to='/login' onClick={() => localStorage.removeItem('token')}>Log Out</Link>),
          icon: <LogoutOutlined />
        }
      ]
    }
  ];

  useEffect(() => {
    console.log("ProtectedRoute mounted, calling getValidUser");
    getValidUser();
  }, [navigate]);

  if (!user) {
    console.log("No user found, not rendering children");
    return null;
  }

  console.log("User found, rendering children");
  return (
    <Layout>
      <Header className='d-flex justify-content-between'
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1,
          width: "100%",
          display: "flex",
          alignItems: "center",
        }} >
        <h3 className='demo-logo text-white m-0'>Book My Show</h3>
        <Menu theme='dark' mode='horizontal' items={navItems}></Menu>
      </Header>
      <div style={{ padding: 24, minHeight: 380, background: '#fff' }}>
        {children}
      </div>
    </Layout>
  );
}

export default ProtectedRoute;