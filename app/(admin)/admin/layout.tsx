import AdminSidebar from '@/components/admin/AdminSidebar';

export const dynamic = 'force-dynamic';


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--surface)' }}>
      <AdminSidebar />
      <main className="admin-content" style={{ flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
