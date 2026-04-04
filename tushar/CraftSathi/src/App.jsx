import React, { Suspense, lazy } from "react";
import Login from "../src/component/auth/login";
import Register from "../src/component/auth/register";
import Header from "../src/component/header";
import Home from "../src/component/home";
import Story from "./component/AI/Story/Story";
import Network from "./component/Network/Network";
import Profile from "./component/Profile";
import BASE_URL from "./api";

// import { AuthProvider } from "../src/context/authcontext";
import { AuthProvider } from "../src/context/authcontext";
import { useRoutes } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
// import GetStarted from "./component/AI/GetStarted";
import GetStarted from "./component/AI/getstarted";

const GuidanceLayout = lazy(() => import("./features/guidance/GuidanceLayout"));
const AboutLayout = lazy(() => import("./features/about/AboutLayout"));
import ExploreLayout from "./features/explore/components/ExploreLayout";

// Configure axios to point to FastAPI backend
axios.defaults.baseURL = BASE_URL;
function App() {
  return (
    <Router>
      <AuthProvider>
        {/* <Header /> */}
        <div className="w-full min-h-screen flex flex-col bg-gradient-to-b from-purple-900 to-black">
          <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-white">Loading...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<ExploreLayout />} />
              <Route path="/guidance" element={<GuidanceLayout />} />
              <Route path="/network" element={<Network />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<AboutLayout />} />
              <Route path="/ai/getstarted" element={<GetStarted />} />
              <Route path="/ai/story" element={<Story />} />
              <Route path="*" element={<Login />} />
            </Routes>
          </Suspense>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
