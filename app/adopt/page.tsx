import { ListPage, listMeta } from '@/components/ListPage';

export const metadata = listMeta('adopt');

export default function Adopt() {
  return <ListPage kind="adopt" />;
}
