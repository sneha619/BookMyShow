import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { useSelector, useDispatch } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminProtectedRoute from './pages/Admin/AdminProtectedRoute'
import Admin from './pages/Admin';
import { useEffect } from 'react';
import { getCurrentUser } from './apicalls/user';
import { setUser } from './redux/userSlice';
import { showLoading, hideLoading } from './redux/loaderSlice';


function App() {
  const { loading } = useSelector((state) => state.loader);
  const { user } = useSelector((state)=> state.user);
  const dispatch = useDispatch();

  const getValidUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      dispatch(showLoading());
      const response = await getCurrentUser();

      if (response.success && response.data) {
        dispatch(setUser(response.data));
      } else {
        localStorage.removeItem("token");
        dispatch(setUser(null));
      }
    } catch (error) {
      console.log("Error fetching user data", error.message);
      localStorage.removeItem("token");
      dispatch(setUser(null));
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getValidUser();
  }, []);

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
            <Route path='/movie/:id' element={<MovieDetails />} />
            <Route path='/book-show/:id' element={<ProtectedRoute><BookShow /></ProtectedRoute>} />
          </Routes>
        </Layout.Content>
      </BrowserRouter>
    </div>
  );
}

export default App;
