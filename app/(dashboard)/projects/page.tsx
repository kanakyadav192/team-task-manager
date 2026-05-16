'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // New Project Form
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchUserAndProjects();
  }, []);

  const fetchUserAndProjects = async () => {
    try {
      const uRes = await fetch('/api/auth/me');
      const uData = await uRes.json();
      setUser(uData.user);

      const pRes = await fetch('/api/projects');
      const pData = await pRes.json();
      setProjects(pData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      if (res.ok) {
        setShowForm(false);
        setName('');
        setDescription('');
        fetchUserAndProjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Projects</h1>
        {user?.role === 'ADMIN' && (
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Project'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleCreateProject} className="glass-panel" style={{ marginBottom: '2rem' }}>
          <div className="input-group">
            <label>Project Name</label>
            <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea className="input-field" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <button type="submit" className="btn btn-primary">Create Project</button>
        </form>
      )}

      <div className="dashboard-grid">
        {projects.map((p: any) => (
          <Link href={`/projects/${p.id}`} key={p.id}>
            <div className="stat-card glass-panel" style={{ cursor: 'pointer' }}>
              <span className="task-title" style={{ color: 'var(--text-primary)' }}>{p.name}</span>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                {p.description || 'No description'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span>Tasks: {p._count?.tasks || 0}</span>
                <span>Members: {p._count?.members || 0}</span>
              </div>
            </div>
          </Link>
        ))}
        {projects.length === 0 && <p>No projects found.</p>}
      </div>
    </div>
  );
}
