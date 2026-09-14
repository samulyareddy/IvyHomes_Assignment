import { useState, useEffect } from 'react';
import { api } from '../api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/v1/projects?page=${page}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data.results || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [page]);

  return (
    <div className="animate-fade-in">
      <h2 className="mb-4">Projects</h2>
      {loading ? <div>Loading...</div> : (
        <div className="grid">
          {projects.map(p => (
            <div key={p.project_id} className="glass-card flex flex-col">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{p.apartment_name}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>By {p.developer_name}</p>
              <div className="flex justify-between items-center mt-auto">
                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Status: {p.project_status}</span>
                <span style={{ color: 'var(--text-muted)' }}>{p.total_units} Units</span>
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
