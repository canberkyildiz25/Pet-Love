import type { Metadata } from 'next';
import { AuthForm } from '@/components/AuthForm';

export const metadata: Metadata = { title: 'Create an account', robots: { index: false }, alternates: { canonical: '/join/' } };

export default function Join() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Create an account</h1>
        <p>So that a notice you post is yours to close when the animal is home.</p>
      </header>
      <AuthForm joining />
      <div className="page-foot" />
    </main>
  );
}
