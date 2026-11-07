import { userSource } from '@/lib/source';
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { M3EFooter } from '@/components/m3e-footer';
import { getMDXComponents } from '@/components/mdx';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { i18n } from '@/lib/i18n';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}) {
  const { lang, slug } = await params;
  const page = userSource.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      tableOfContent={{ style: 'clerk' }}
      footer={{ children: <M3EFooter lang={lang} /> }}
    >
      <div className="relative isolate mb-3 overflow-hidden rounded-[26px] bg-[var(--md-sys-color-surface-container-low)] px-6 py-5 sm:px-7 sm:py-6">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden select-none"
        >
          <svg
            viewBox="0 0 100 100"
            className="m3e-ambient-drift-1 absolute -top-12 -right-10 size-36 opacity-50"
          >
            <path
              d="M50 3C56.8 3 61.7 8.9 67.8 11.4C73.9 13.9 81.6 12.1 86.3 16.7C90.9 21.4 89.1 29.1 91.6 35.2C94.1 41.3 100 46.2 100 53C100 59.8 94.1 64.7 91.6 70.8C89.1 76.9 90.9 84.6 86.3 89.3C81.6 93.9 73.9 92.1 67.8 94.6C61.7 97.1 56.8 100 50 100C43.2 100 38.3 97.1 32.2 94.6C26.1 92.1 18.4 93.9 13.7 89.3C9.1 84.6 10.9 76.9 8.4 70.8C5.9 64.7 0 59.8 0 53C0 46.2 5.9 41.3 8.4 35.2C10.9 29.1 9.1 21.4 13.7 16.7C18.4 12.1 26.1 13.9 32.2 11.4C38.3 8.9 43.2 3 50 3Z"
              fill="var(--md-custom-color-blue-container)"
            />
          </svg>
        </div>
        <DocsTitle className="font-brand relative z-10 text-2xl sm:text-3xl">
          {page.data.title}
        </DocsTitle>
        <DocsDescription className="relative z-10 mt-1.5 mb-0 text-sm sm:text-base">
          {page.data.description}
        </DocsDescription>
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(userSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) =>
    userSource.getPages(lang).map((page) => ({ lang, slug: page.slugs })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = userSource.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
