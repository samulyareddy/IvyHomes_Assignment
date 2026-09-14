import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [listingRes, similarRes] = await Promise.all([
          api.get(`/v1/listings/${id}`),
          api.get(`/v1/listings/${id}/similar`)
        ]);

        if (listingRes.status === 401) { navigate('/login'); return; }

        if (listingRes.ok) setListing(await listingRes.json());
        if (similarRes.ok) setSimilar(await similarRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const toggleSave = async () => {
    try {
      if (saved) {
        await api.delete(`/v1/favourites/${id}`);
        setSaved(false);
      } else {
        await api.post('/v1/favourites', { id });
        setSaved(true);
      }
    } catch (e) {
      console.error('Failed to toggle save');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  if (!listing) return <div style={{ textAlign: 'center', padding: '2rem' }}>Listing not found</div>;

  return (
    <div className="animate-fade-in">
      <div className="glass-card mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 style={{ marginBottom: 0 }}>{listing.apartment_name}</h2>
          <button className="btn-primary" onClick={toggleSave}>
            {saved ? 'Saved ★' : 'Save ☆'}
          </button>
        </div>
        
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Price</span>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{listing.price.toLocaleString()}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Location</span>
            <p>{listing.locality}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Type</span>
            <p>{listing.property_type}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>BHK</span>
            <p>{listing.bedroom}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Area</span>
            <p>{listing.carpet_area} sqft</p>
          </div>
        </div>

        <div className="mt-4" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Description</h3>
          <p style={{ lineHeight: '1.6' }}>{listing.description}</p>
        </div>
      </div>

      {similar.length > 0 && (
        <>
          <h3 className="mt-4">Similar Listings</h3>
          <div className="grid">
            {similar.map(l => (
              <div key={l.listing_id} className="glass-card flex flex-col">
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{l.apartment_name}</h4>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>₹{l.price.toLocaleString()}</p>
                <button className="btn-primary" onClick={() => navigate(`/listings/${l.listing_id}`)}>View</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
