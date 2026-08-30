import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://eekalavara.in'),
  title: {
    default: 'EE-KALAVARA — Kerala\'s Digital Chandha',
    template: '%s | EE-KALAVARA',
  },
  description:
    'EE-KALAVARA is Kerala\'s curated digital chandha — handpicked products from local shops, independent designers, and 3D-printing makers across Kerala.',
  keywords: ['Kerala marketplace', 'Kerala products', 'digital chandha', 'local shopping', 'Kerala online shop'],
  authors: [{ name: 'EE-KALAVARA' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'EE-KALAVARA',
    title: 'EE-KALAVARA — Kerala\'s Digital Chandha',
    description: 'Curated products from Kerala\'s best local shops, designers, and makers.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EE-KALAVARA — Kerala\'s Digital Chandha',
    description: 'Curated products from Kerala\'s best local shops, designers, and makers.',
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
