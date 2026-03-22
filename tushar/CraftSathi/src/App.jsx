import React from 'react';
import Login from "../src/component/auth/login";
import Register from "../src/component/auth/register";
import Header from "../src/component/header";
import Home from "../src/component/home";
import Story from "./component/AI/Story/Story";
import Network from "./component/Network/Network"


// import { AuthProvider } from "../src/context/authcontext";
import { AuthProvider } from "../src/context/authcontext";
import { useRoutes } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from 'axios';
// import GetStarted from "./component/AI/GetStarted";
import GetStarted from "./component/AI/getstarted";

// Configure axios to point to FastAPI backend
axios.defaults.baseURL = 'http://localhost:8000';
function App() {
  return (
    <Router>
      <AuthProvider>
        {/* <Header /> */}
        <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-purple-900 to-black">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/network" element={<Network />} />
            <Route path="/ai/getstarted" element={<GetStarted />} />
            <Route path="/ai/story" element={<Story />} />
            <Route path="*" element={<Login />} />
            
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;