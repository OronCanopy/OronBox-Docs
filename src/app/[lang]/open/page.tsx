import { HomeLayout } from 'fumadocs-ui/layouts/home';
import type { Metadata } from 'next';
import { baseOptions } from '@/lib/layout.shared';
import { M3EFooter } from '@/components/m3e-footer';
import { OpenRedirectCard } from '@/components/open-redirect-card';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === 'en';
  return {
    title: isEn ? 'Open in OronBox' : '在 OronBox 中打开',
    robots: { index: false, follow: false },
  };
}

export default async function OpenPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { lang } = await params;
  const rawSearch = await searchParams;

  const normalizedQuery: Record<string, string> = {};
  for (const [key, value] of Object.entries(rawSearch)) {
    if (typeof value === 'string') {
      normalizedQuery[key] = value;
    } else if (Array.isArray(value) && value.length > 0) {
      normalizedQuery[key] = value[0];
    }
  }

  return (
    <HomeLayout {...baseOptions(lang)}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pt-6 pb-14 sm:px-6">
        <OpenRedirectCard lang={lang} query={normalizedQuery} />
        <M3EFooter lang={lang} />
      </div>
    </HomeLayout>
  );
}
