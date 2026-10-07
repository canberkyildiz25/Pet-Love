import type { Metadata } from 'next';
import { AuthForm } from '@/components/AuthForm';

export const metadata: Metadata = { title: 'Sign in', robots: { index: false }, alternates: { canonical: '/sign-in/' } };

export default function SignIn() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Sign in</h1>
        <p>To close, reopen or take down a notice you posted.</p>
      </header>
      <AuthForm joining={false} />
      <div className="page-foot" />
    </main>
  );
}
