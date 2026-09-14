import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ locality: '', bhk: '', min_price: '', max_price: '', furnishing: '' });
  const navigate = useNavigate();

  const fetchListings = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', 20); // API is clamping to 50 max actually, but 20 is fine
      
      if (filters.locality) params.append('locality', filters.locality.toLowerCase());
      if (filters.bhk) params.append('bhk', filters.bhk);
      if (filters.min_price) params.append('min_price', filters.min_price);
      if (filters.max_price) params.append('max_price', filters.max_price);
      if (filters.furnishing) params.append('furnishing', filters.furnishing.toLowerCase());

      const res = await api.get(`/v1/listings?${params.toString()}`);
      if (!res.ok) {
        if (res.status === 401) { navigate('/login'); }
        throw new Error('Failed to fetch listings');
      }
      const data = await res.json();
      setListings(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [page, filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-4 flex items-center" style={{ gap: '1rem', flexWrap: 'wrap' }}>
        <input name="locality" placeholder="Locality" className="input-field" style={{ width: '150px' }} value={filters.locality} onChange={handleFilterChange} />
        <input name="bhk" type="number" placeholder="BHK" className="input-field" style={{ width: '100px' }} value={filters.bhk} onChange={handleFilterChange} />
        <input name="min_price" type="number" placeholder="Min Price" className="input-field" style={{ width: '120px' }} value={filters.min_price} onChange={handleFilterChange} />
        <input name="max_price" type="number" placeholder="Max Price" className="input-field" style={{ width: '120px' }} value={filters.max_price} onChange={handleFilterChange} />
        <select name="furnishing" className="input-field" style={{ width: '150px' }} value={filters.furnishing} onChange={handleFilterChange}>
          <option value="">Any Furnishing</option>
          <option value="unfurnished">Unfurnished</option>
          <option value="semi-furnished">Semi-furnished</option>
          <option value="fully-furnished">Fully-furnished</option>
        </select>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div> : (
        <div className="grid">
          {listings.map(l => (
            <div key={l.listing_id} className="glass-card flex flex-col">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{l.apartment_name}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{l.bedroom} BHK in {l.locality}</p>
              <div className="flex justify-between items-center mt-auto">
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>₹{l.price.toLocaleString()}</span>
                <Link to={`/listings/${l.listing_id}`} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>View</Link>
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
