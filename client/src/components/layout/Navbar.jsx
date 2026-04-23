const links = [
  { label: 'Home', href: '#' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

function Navbar() {
  return (
    <header style={{ borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
      <nav
        style={{
          width: 'min(1080px, 92vw)',
          margin: '0 auto',
          display: 'flex',
          gap: '1rem',
          padding: '1rem 0',
          alignItems: 'center',
        }}
      >
        <strong>My Portfolio</strong>
        <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
          {links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href="#">Login</a>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
