import Link from 'next/link';

export default function Home() {
  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', marginBottom: '4rem' }}>
        <div className="navbar-brand">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="var(--accent-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          TeamTask
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/login" className="btn btn-outline">Log In</Link>
          <Link href="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      <section className="hero-section">
        <h1 className="hero-title">
          Manage your team's work,<br />
          <span className="gradient-text">beautifully.</span>
        </h1>
        <p className="hero-subtitle">
          A premium full-stack task manager designed to help teams collaborate, track progress, and ship faster with role-based access control.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
          <Link href="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem' }}>
            Start for free
          </Link>
        </div>
        
      </section>
    </div>
  );
}
