import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function Saved() {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await api.get('/v1/favourites');
      if (res.ok) {
        const data = await res.json();
        setSaved(data.results || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const removeSave = async (id) => {
    try {
      await api.delete(`/v1/favourites/${id}`);
      fetchSaved(); // refresh list
    } catch (e) {
      console.error('Failed to remove');
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4">Saved Listings</h2>
      {loading ? <div>Loading...</div> : (
        saved.length === 0 ? <p>No saved listings.</p> : (
          <div className="grid">
            {saved.map(l => (
              <div key={l.listing_id} className="glass-card flex flex-col">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{l.apartment_name}</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>₹{l.price.toLocaleString()}</p>
                <div className="flex justify-between items-center mt-auto">
                  <Link to={`/listings/${l.listing_id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View</Link>
                  <button className="btn-primary" onClick={() => removeSave(l.listing_id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
