import type { Metadata } from 'next';
import PrintingServiceClient from './PrintingServiceClient';

export const metadata: Metadata = {
  title: '3D Printing Service — Ee Kalavara',
  description: 'Custom 3D printing service in Kerala. FDM printing at ₹6/gram and SLA printing at ₹12/gram. Fast delivery across Kerala. Order via WhatsApp.',
  keywords: ['3D printing Kerala', 'FDM printing', 'SLA printing', 'custom 3D prints', 'Ee Kalavara'],
};

export default function PrintingServicePage() {
  return <PrintingServiceClient />;
}
