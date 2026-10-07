import type { Metadata } from 'next';
import { PostWizard } from '@/components/PostWizard';

export const metadata: Metadata = {
  title: 'Post a notice',
  description: 'Put up a lost, found or home-wanted notice in three short steps.',
  alternates: { canonical: '/post/' },
};

export default function Post() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Post a notice</h1>
        <p>Three short steps. You will see the notice as others will before it goes up.</p>
      </header>
      <PostWizard />
      <div className="page-foot" />
    </main>
  );
}
