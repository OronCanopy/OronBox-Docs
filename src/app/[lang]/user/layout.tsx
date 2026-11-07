import { userSource } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { docsOptions } from '@/lib/layout.shared';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <DocsLayout tree={userSource.getPageTree(lang)} {...docsOptions(lang)}>
      {children}
    </DocsLayout>
  );
}
