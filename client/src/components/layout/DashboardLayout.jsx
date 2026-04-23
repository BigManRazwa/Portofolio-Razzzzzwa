function DashboardLayout({ title = 'Dashboard', children }) {
  return (
    <section className="page">
      <h1 style={{ marginTop: 0 }}>{title}</h1>
      {children}
    </section>
  )
}

export default DashboardLayout
