import { Routes, Route } from "react-router-dom";
import './App.css'
import Header from "./component/Header";
import Footer from "./component/Footer";
import Home from './pages/Home'
import PropertyListingsPage from "./pages/PropertyListingsPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import AddPropertyPage from "./pages/AddPropertyPage";
import AgentPage from "./pages/Agentpage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";

function App() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/"                element={<Home />} />
          <Route path="/Listing"         element={<PropertyListingsPage />} />
          <Route path="/property/:id"    element={<PropertyDetailsPage />} />
          <Route path="/add-property"    element={<AddPropertyPage />} />
          <Route path="/Agent"           element={<AgentPage />} />
          <Route path="/admin"           element={<AdminDashboardPage />} />
          {/* Auth pages */}
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App
