import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateGig from "./pages/CreateGig";
import GigList from "./pages/GigList";
import GigDetail from "./pages/GigDetail";
import GigSearch from "./pages/GigSearch";
import FreelancerProfile from "./pages/FreelancerProfile";
import MyGigs from "./pages/MyGigs";
import MyProfile from "./pages/MyProfile";
import Orders from "./pages/Orders";
import EditGig from "./pages/EditGig";
import EditFreelancerInfo from "./pages/EditFreelancerInfo";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
      <Router>
        <Navbar />
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gigs" element={<GigList />} />
          <Route path="/gigs/:id" element={<GigDetail />} />
          <Route path="/edit-gig/:id" element={<EditGig />} />
          <Route path="/search" element={<GigSearch />} />
          <Route path="/freelancer/:id" element={<FreelancerProfile />} />
          <Route path="/freelancer-info-edit" element={<EditFreelancerInfo />} />
          <Route
            path="/create-gig"
            element={
              <PrivateRoute allowedRoles={["freelancer"]}>
                <CreateGig />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-gigs"
            element={
              <PrivateRoute allowedRoles={["freelancer"]}>
                <MyGigs />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute allowedRoles={["client", "freelancer"]}>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <PrivateRoute allowedRoles={["client", "freelancer"]}>
                <MyProfile />
              </PrivateRoute>
            }
          />
          
        </Routes>
      </Router>
  );
}

export default App;
