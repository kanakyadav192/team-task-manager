'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalTasks: 0, pending: 0, completed: 0, overdue: 0 });
  const [overdueTasks, setOverdueTasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [taskRes, userRes] = await Promise.all([
          fetch('/api/tasks'),
          fetch('/api/auth/me')
        ]);

        if (taskRes.status === 401) { router.push('/login'); return; }

        const tasks = await taskRes.json();
        const userData = await userRes.json();
        setUser(userData.user);

        let pending = 0, completed = 0, overdue = 0;
        const overdueList: any[] = [];
        const now = new Date();

        tasks.forEach((t: any) => {
          if (t.status === 'DONE') {
            completed++;
          } else {
            pending++;
            if (t.dueDate && new Date(t.dueDate) < now) {
              overdue++;
              overdueList.push(t);
            }
          }
        });

        setStats({ totalTasks: tasks.length, pending, completed, overdue });
        setOverdueTasks(overdueList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          You are logged in as{' '}
          <span className={`badge ${user?.role === 'ADMIN' ? 'badge-admin' : 'badge-todo'}`}>
            {user?.role || 'MEMBER'}
          </span>
        </p>
      </div>

      <div className="dashboard-grid">
        <div className="stat-card glass-panel">
          <span className="stat-title">Total Tasks</span>
          <span className="stat-value">{stats.totalTasks}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>across all projects</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-title">Active</span>
          <span className="stat-value" style={{ color: 'var(--accent-color)' }}>{stats.pending}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>in progress or todo</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-title">Completed</span>
          <span className="stat-value" style={{ color: 'var(--success-color)' }}>{stats.completed}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>tasks done</span>
        </div>
        <div className="stat-card glass-panel">
          <span className="stat-title">Overdue</span>
          <span className="stat-value" style={{ color: 'var(--danger-color)' }}>{stats.overdue}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>past due date</span>
        </div>
      </div>

      {overdueTasks.length > 0 && (
        <div className="glass-panel" style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ Overdue Tasks
          </h2>
          <div className="task-list">
            {overdueTasks.map((task: any) => (
              <div key={task.id} className="task-card" style={{ borderLeft: '3px solid var(--danger-color)' }}>
                <div>
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span>📁 {task.project?.name}</span>
                    {task.assignedTo && <span>👤 {task.assignedTo.name}</span>}
                    <span style={{ color: 'var(--danger-color)' }}>
                      🗓 Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.totalTasks === 0 && (
        <div className="glass-panel" style={{ marginTop: '2rem', textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No tasks yet.</p>
          {user?.role === 'ADMIN' && (
            <Link href="/projects" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem' }}>
              Create a Project →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
