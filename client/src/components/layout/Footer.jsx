function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '1px solid #e2e8f0',
        background: 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)',
        padding: '3rem 0 2rem 0',
        marginTop: '4rem',
      }}
    >
      <div style={{ width: 'min(1080px, 92vw)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>About</p>
            <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6 }}>Building clean, structured digital experiences with disciplined engineering and design.</p>
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Services</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="#projects" style={{ color: '#0066cc', textDecoration: 'none' }}>Web Development</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="#projects" style={{ color: '#0066cc', textDecoration: 'none' }}>UI/UX Design</a></li>
              <li><a href="#projects" style={{ color: '#0066cc', textDecoration: 'none' }}>Consulting</a></li>
            </ul>
          </div>
          <div>
            <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.95rem' }}>Connect</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem' }}>
              <li style={{ marginBottom: '0.5rem' }}><a href="mailto:razwaijea6466@gmail.com" style={{ color: '#0066cc', textDecoration: 'none' }}>Email</a></li>
              <li style={{ marginBottom: '0.5rem' }}><a href="https://github.com/BigManRazwa" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>GitHub</a></li>
              <li><a href="https://linkedin.com/in/razza-khoirie-4a4004389" target="_blank" rel="noopener noreferrer" style={{ color: '#0066cc', textDecoration: 'none' }}>LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <small style={{ color: '#666' }}>&copy; {currentYear} Muhammad Abdhel Razza Khoirie. All rights reserved.</small>
            <small style={{ color: '#999', fontSize: '0.8rem' }}>Crafted with precision and care</small>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
