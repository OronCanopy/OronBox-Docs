import { pluginSource } from '@/lib/source';
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
    <DocsLayout tree={pluginSource.getPageTree(lang)} {...docsOptions(lang)}>
      {children}
    </DocsLayout>
  );
}
