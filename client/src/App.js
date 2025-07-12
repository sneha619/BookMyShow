import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import MovieDetails from './pages/MovieDetails';
import BookShow from './pages/BookShow';
import Profile from './pages/Profile';
import AdminProfile from './pages/AdminProfile';
import AdminDashboard from './pages/Admin/Dashboard';
import MoviesList from './pages/Admin/MoviesList';
import TheatersList from './pages/Admin/TheatersList';
import AddContent from './pages/Admin/AddContent';
import Header from './Components/Header';
import { useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminProtectedRoute from './pages/Admin/AdminProtectedRoute'
import Admin from './pages/Admin';
import { useEffect } from 'react';
import ErrorBoundary from './Components/ErrorBoundary';
import useAuth from './hooks/useAuth';


function App() {
  const { loading } = useSelector((state) => state.loader);
  const { localUser, isLoading, fetchUserData } = useAuth();

  // Fetch user data only once on component mount
  useEffect(() => {
    console.log("App - Component mounted, initializing user state");
    const token = localStorage.getItem('token');
    if (token) {
      try {
        fetchUserData().catch(error => {
          console.error("Failed to fetch user data:", error);
          // Handle the error gracefully without crashing the app
        });
      } catch (error) {
        console.error("Error in fetchUserData:", error);
        // Handle any synchronous errors
      }
    }
  }, [fetchUserData]); // Include fetchUserData in dependencies
  
  // Debug user state changes
  useEffect(() => {
    console.log("App - User state changed:", localUser);
  }, [localUser]);

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
            backgroundColor: 'rgba(255, 255, 255, 0.45)', 
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

      <ErrorBoundary>
        <Header />
        <Layout.Content style={{ minHeight: 'calc(100vh - 64px)', padding: '20px' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path='/admin' element={<ProtectedRoute><AdminProtectedRoute><Admin/></AdminProtectedRoute></ProtectedRoute>}/>
            <Route path='/admin/dashboard' element={<ProtectedRoute><AdminProtectedRoute><Admin/></AdminProtectedRoute></ProtectedRoute>}/>
            <Route path='/admin/movies' element={<ProtectedRoute><AdminProtectedRoute><Admin/></AdminProtectedRoute></ProtectedRoute>}/>
            <Route path='/admin/theaters' element={<ProtectedRoute><AdminProtectedRoute><Admin/></AdminProtectedRoute></ProtectedRoute>}/>
            <Route path='/admin/add-content' element={<ProtectedRoute><AdminProtectedRoute><AddContent/></AdminProtectedRoute></ProtectedRoute>}/>
            <Route path='/profile' element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
            <Route path='/admin-profile' element={<ProtectedRoute><AdminProtectedRoute><AdminProfile/></AdminProtectedRoute></ProtectedRoute>}/>
            <Route path='/movie/:id' element={<ErrorBoundary><MovieDetails /></ErrorBoundary>} />
            <Route path='/book-show/:id' element={<ProtectedRoute><ErrorBoundary><BookShow /></ErrorBoundary></ProtectedRoute>} />
          </Routes>
        </Layout.Content>
      </ErrorBoundary>
    </div>
  );
}

export default App;
