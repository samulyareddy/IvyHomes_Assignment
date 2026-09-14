import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRentals = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/v1/rentals?page=${page}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          setRentals(data.results || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, [page]);

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4">Rentals</h2>
      {loading ? <div>Loading...</div> : (
        <div className="grid">
          {rentals.map(r => (
            <div key={r.listing_id} className="glass-card flex flex-col">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{r.apartment_name}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{r.bedroom} BHK in {r.locality}</p>
              <div className="flex justify-between items-center mt-auto">
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{r.price.toLocaleString()} / mo</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between mt-4">
        <button className="btn-primary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</button>
        <button className="btn-primary" onClick={() => setPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}
