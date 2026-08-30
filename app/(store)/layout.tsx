import Header from '@/components/store/Header';
import Footer from '@/components/store/Footer';

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main style={{ minHeight: '60vh' }}>{children}</main>
      <Footer />
    </>
  );
}
