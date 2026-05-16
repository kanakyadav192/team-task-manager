'use client';

import { useEffect, useState } from 'react';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>My Tasks</h1>

      <div className="task-list">
        {tasks.map((task: any) => (
          <div key={task.id} className="task-card">
            <div>
              <div className="task-title">{task.title}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Project: {task.project?.name}</div>
              <div className="task-meta">
                <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status.replace('_', ' ')}</span>
                {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>
            </div>
            <div>
              <select 
                className="input-field" 
                value={task.status} 
                onChange={(e) => updateStatus(task.id, e.target.value)}
                style={{ width: 'auto', padding: '0.5rem' }}
              >
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>
          </div>
        ))}
        {tasks.length === 0 && <p>You don't have any tasks right now.</p>}
      </div>
    </div>
  );
}
