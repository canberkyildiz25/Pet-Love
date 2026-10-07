import { ListPage, listMeta } from '@/components/ListPage';

export const metadata = listMeta('found');

export default function Found() {
  return <ListPage kind="found" />;
}
