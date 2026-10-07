import { ListPage, listMeta } from '@/components/ListPage';

export const metadata = listMeta('lost');

export default function Lost() {
  return <ListPage kind="lost" />;
}
