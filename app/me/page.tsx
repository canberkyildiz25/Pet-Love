import type { Metadata } from 'next';
import { MyNotices } from '@/components/MyNotices';

export const metadata: Metadata = { title: 'My notices', robots: { index: false }, alternates: { canonical: '/me/' } };

export default function Me() {
  return (
    <main id="main" className="wrap">
      <MyNotices />
    </main>
  );
}
