import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetails';
import BookShow from './pages/BookShow';
import Profile from './pages/Profile';
import AdminDashboard from './pages/Admin/Dashboard';
import MoviesList from './pages/Admin/MoviesList';
import TheatersList from './pages/Admin/TheatersList';
import Header from './Components/Header';
import { useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import ProtectedRoute from './Components/ProtectedRoute';

const { Content } = Layout;

function App() {
  const { loading } = useSelector((state) => state.loader);
  const { user } = useSelector((state)=> state.user);

  console.log(loading);
  console.log(user);

  return (
    <div>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.4.5)', 
            zIndex: 1000,
          }}
        >
          <Spin
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 70,
                }}
                spin
              />
            }
          />
        </div>
      )}

      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes with Header */}
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout style={{ minHeight: '100vh' }}>
                <Header />
                <Content style={{ background: '#f0f2f5' }}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/movie/:movieId" element={<MovieDetails />} />
                    <Route path="/book-show/:showId" element={<BookShow />} />
                    <Route path="/profile" element={<Profile />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/movies" element={<MoviesList />} />
                    <Route path="/admin/theaters" element={<TheatersList />} />
                  </Routes>
                </Content>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
