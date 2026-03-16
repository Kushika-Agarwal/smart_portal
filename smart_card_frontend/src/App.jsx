import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import pages
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Verification from "./pages/verification_page";
import Application from "./pages/Applicationpage";
import SuccessPage from "./pages/successpage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserProtectedRoute from "./components/UserProtectedRoute";
function App() {
  return (
      <Layout>

    <div className="flex justify-center items-center mt-20">
    <Router>
      <Routes>

        {/* Login Route */}
        <Route path="/" element={<Home />} />
        <Route path="/verification" element={<Verification />} />
       <Route
  path="/application"
  element={
    <UserProtectedRoute>
      <Application />
    </UserProtectedRoute>
  }
/>

<Route
  path="/success"
  element={
    <UserProtectedRoute>
      <SuccessPage />
    </UserProtectedRoute>
  }
/>
     <Route path="/admin/login" element={<AdminLogin />} />
<Route
  path="/admin/dashboard"
  element={
    <AdminProtectedRoute>
      <AdminDashboard />
    </AdminProtectedRoute>
  }
/>

      </Routes>
        </Router>
        </div>

  </Layout>
  );
}

export default App;