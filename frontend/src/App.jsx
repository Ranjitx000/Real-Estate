import { Routes, Route } from "react-router-dom";
import './App.css'
import Home from './pages/Home'
import PropertyListingsPage from "./pages/PropertyListingsPage";
import PropertyDetailsPage from "./pages/PropertyDetailsPage";
import AddPropertyPage from "./pages/AddPropertyPage";
function App() {
 

  return (
   
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/Listing" element={<PropertyListingsPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/add-property" element={<AddPropertyPage />} />
          
      </Routes>
    
  )
}

export default App
