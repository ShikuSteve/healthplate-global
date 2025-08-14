export function Header({ sidebarWidth = 250 }: { sidebarWidth: number }) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: sidebarWidth,
        right: 0,
        height: "64px",
        backgroundColor: "#f8f9fa",
        padding: "1rem 2rem",
        borderBottom: "1px solid #dee2e6",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Dashboard</h1>
    </header>
  );
}
