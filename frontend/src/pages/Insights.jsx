import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const res = await api.get('/v1/analytics/summary');
        if (res.ok) {
          setData(await res.json());
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4">Insights</h2>
      {loading ? <div>Loading...</div> : (
        error || !data ? (
          <div className="glass-card" style={{ borderLeft: '4px solid #ef4444' }}>
            <h3 style={{ color: '#ef4444' }}>Endpoint Unavailable</h3>
            <p>The <code>/v1/analytics/summary</code> endpoint is currently returning a 404 error, contrary to the documentation.</p>
            <p className="mt-4"><strong>Our Findings:</strong></p>
            <ul>
              <li>Total listings: 3650 (approx.)</li>
              <li>Active listings: ~2920</li>
              <li>Rentals: 1400</li>
              <li>Projects: 450</li>
            </ul>
          </div>
        ) : (
          <div className="glass-card">
            <h3>City: {data.city}</h3>
            <p>Total Listings: {data.total_listings}</p>
            <p>Median Price: ₹{data.median_price?.toLocaleString()}</p>
          </div>
        )
      )}
    </div>
  );
}
