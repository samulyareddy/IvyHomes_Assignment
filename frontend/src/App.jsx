import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from './api';

// Pages
import Login from './pages/Login';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Rentals from './pages/Rentals';
import Projects from './pages/Projects';
import Saved from './pages/Saved';
import Insights from './pages/Insights';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token');
  
  if (!token) return null;
  
  return (
    <nav className="glass-card mb-4 flex justify-between items-center" style={{ padding: '1rem 2rem', borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0 }}>
      <div className="flex items-center" style={{ gap: '2rem' }}>
        <h2 style={{ margin: 0, color: 'var(--primary)' }}>Ivy Homes</h2>
        <Link to="/">Listings</Link>
        <Link to="/rentals">Rentals</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/saved">Saved</Link>
        <Link to="/insights">Insights</Link>
      </div>
      <div>
        <button className="btn-primary" onClick={() => { logout(); navigate('/login'); }}>Logout</button>
      </div>
    </nav>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetail />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
