// import logo from './logo.svg';
import './App.css';
import DashboardLayout from './Components/Layouts/DashboardLayout';
import MovieList from './Components/MovieList';
import SignIn from './Components/SignIn';
import Theatre from './Components/Theatre';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout title={"Home Page"} >Dashboard!</DashboardLayout>
  },
  {
    path: "/sign-in",
    element: < SignIn />
  },
  {
    path: "/movies",
    element: <DashboardLayout title={"Movies"}>< MovieList /></DashboardLayout>
  },
  {
    path: "/theatre",
    element: <DashboardLayout title={"Theatre"}>< Theatre /></DashboardLayout>
  }
]);

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
