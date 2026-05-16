'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';

export default function ProjectDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [uRes, pRes] = await Promise.all([
        fetch('/api/auth/me'),
        fetch(`/api/projects/${id}`)
      ]);
      const uData = await uRes.json();
      const pData = await pRes.json();
      setUser(uData.user);
      setProject(pData);
    } catch (err) {
      console.error(err);
    }
  };

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/projects/${id}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: newMemberEmail })
    });
    if (res.ok) { setNewMemberEmail(''); fetchData(); }
  };

  const removeMember = async (userId: string) => {
    await fetch(`/api/projects/${id}/members/${userId}`, { method: 'DELETE' });
    fetchData();
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const body: any = { title: newTaskTitle, projectId: id };
    if (newTaskDueDate) body.dueDate = newTaskDueDate;
    if (newTaskAssignee) body.assignedToId = newTaskAssignee;

    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (res.ok) {
      setNewTaskTitle('');
      setNewTaskDueDate('');
      setNewTaskAssignee('');
      fetchData();
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchData();
  };

  if (!project) return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>Loading project...</div>;

  const getTasksByStatus = (status: string) => project.tasks?.filter((t: any) => t.status === status) || [];
  const members = project.members || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem', fontSize: '2.5rem' }}>{project.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{project.description}</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', minWidth: '280px' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
            Team Members ({members.length})
          </h2>
          {user?.role === 'ADMIN' && (
            <form onSubmit={addMember} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="email" className="input-field" placeholder="User Email"
                value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} required
                style={{ padding: '0.5rem', fontSize: '0.9rem' }}
              />
              <button className="btn btn-primary" type="submit" style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }}>Add</button>
            </form>
          )}
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {members.map((m: any) => (
              <li key={m.userId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.95rem', padding: '0.4rem 0' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-color), var(--accent-hover))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>
                    {m.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div>{m.user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{m.user.email}</div>
                  </div>
                </span>
                {user?.role === 'ADMIN' && m.user.role !== 'ADMIN' && (
                  <button onClick={() => removeMember(m.userId)} style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}>
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Add Task Form */}
      <div className="glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Add New Task</h2>
        <form onSubmit={addTask}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Task Title</label>
              <input type="text" className="input-field" placeholder="What needs to be done?" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} required />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Due Date</label>
              <input type="date" className="input-field" value={newTaskDueDate} onChange={e => setNewTaskDueDate(e.target.value)} />
            </div>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Assign To</label>
              <select className="input-field" value={newTaskAssignee} onChange={e => setNewTaskAssignee(e.target.value)}>
                <option value="">Unassigned</option>
                {members.map((m: any) => (
                  <option key={m.userId} value={m.userId}>{m.user.name}</option>
                ))}
              </select>
            </div>
            <button className="btn btn-primary" type="submit">Add Task</button>
          </div>
        </form>
      </div>

      {/* Kanban Board */}
      <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>Task Board</h2>
      <div className="kanban-board">
        {/* TODO */}
        <div className="kanban-column">
          <div className="kanban-header">
            <span>To Do</span>
            <span className="badge badge-todo">{getTasksByStatus('TODO').length}</span>
          </div>
          {getTasksByStatus('TODO').map((task: any) => (
            <div key={task.id} className="task-card">
              <div className="task-title">{task.title}</div>
              <div className="task-meta">
                {task.assignedTo && <span>👤 {task.assignedTo.name}</span>}
                {task.dueDate && (
                  <span style={{ color: new Date(task.dueDate) < new Date() ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                    🗓 {new Date(task.dueDate).toLocaleDateString()}
                    {new Date(task.dueDate) < new Date() ? ' ⚠️ Overdue' : ''}
                  </span>
                )}
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem', marginTop: '0.5rem' }} onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}>Start →</button>
              </div>
            </div>
          ))}
          {getTasksByStatus('TODO').length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No tasks</p>}
        </div>

        {/* IN PROGRESS */}
        <div className="kanban-column">
          <div className="kanban-header">
            <span style={{ color: '#818cf8' }}>In Progress</span>
            <span className="badge badge-in_progress">{getTasksByStatus('IN_PROGRESS').length}</span>
          </div>
          {getTasksByStatus('IN_PROGRESS').map((task: any) => (
            <div key={task.id} className="task-card" style={{ borderLeft: '3px solid #818cf8' }}>
              <div className="task-title">{task.title}</div>
              <div className="task-meta">
                {task.assignedTo && <span>👤 {task.assignedTo.name}</span>}
                {task.dueDate && (
                  <span style={{ color: new Date(task.dueDate) < new Date() ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                    🗓 {new Date(task.dueDate).toLocaleDateString()}
                    {new Date(task.dueDate) < new Date() ? ' ⚠️' : ''}
                  </span>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }} onClick={() => updateTaskStatus(task.id, 'TODO')}>← Back</button>
                  <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', background: 'rgba(16,185,129,0.1)', color: '#34d399', borderColor: '#34d399' }} onClick={() => updateTaskStatus(task.id, 'DONE')}>✓ Done</button>
                </div>
              </div>
            </div>
          ))}
          {getTasksByStatus('IN_PROGRESS').length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No tasks</p>}
        </div>

        {/* DONE */}
        <div className="kanban-column">
          <div className="kanban-header">
            <span style={{ color: '#34d399' }}>Done</span>
            <span className="badge badge-done">{getTasksByStatus('DONE').length}</span>
          </div>
          {getTasksByStatus('DONE').map((task: any) => (
            <div key={task.id} className="task-card" style={{ opacity: 0.7, borderLeft: '3px solid #34d399' }}>
              <div className="task-title" style={{ textDecoration: 'line-through' }}>{task.title}</div>
              <div className="task-meta">
                {task.assignedTo && <span>👤 {task.assignedTo.name}</span>}
                <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', marginTop: '0.5rem' }} onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}>← Reopen</button>
              </div>
            </div>
          ))}
          {getTasksByStatus('DONE').length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No tasks</p>}
        </div>
      </div>
    </div>
  );
}
