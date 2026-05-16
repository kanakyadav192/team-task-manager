'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setUserRole(data.user.role);
      })
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <nav className="navbar">
      <Link href="/dashboard" className="navbar-brand">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Team Task Manager
      </Link>
      <div className="navbar-nav">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/projects">Projects</Link>
        <Link href="/tasks">My Tasks</Link>
        <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 1rem' }}>Logout</button>
      </div>
    </nav>
  );
}
