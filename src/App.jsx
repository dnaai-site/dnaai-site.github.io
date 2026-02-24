import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chatbot from './pages/Chatbot';
import MBTI from './pages/MBTI';
import StressTest from './pages/StressTest';
import Emotion from './pages/Emotion';
import Career from './pages/Career';
import Library from './pages/Library';
import Community from './pages/Community';
import Login from './pages/Login';
import Register from './pages/Register';

import PrivacyPolicy from './pages/PrivacyPolicy';
import Settings from './pages/Settings';
import Messages from './pages/Messages';
import Admin from './pages/Admin';
import Support from './pages/Support';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/mbti" element={<MBTI />} />
            <Route path="/test" element={<StressTest />} />
            <Route path="/emotion" element={<Emotion />} />
            <Route path="/career" element={<Career />} />
            <Route path="/library" element={<Library />} />
            <Route path="/community" element={<Community />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/:userId" element={<Messages />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/support" element={<Support />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
