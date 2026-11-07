import { creatorSource } from '@/lib/source';
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
  const page = creatorSource.getPage(slug, lang);
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
            className="m3e-ambient-drift-2 absolute -top-12 -right-10 size-36 opacity-50"
          >
            <path
              d="M42 6.6C46.9 3.8 53.1 3.8 58 6.6L84.8 22.1C89.7 24.9 92.8 30.2 92.8 35.9V64.1C92.8 69.8 89.7 75.1 84.8 77.9L58 93.4C53.1 96.2 46.9 96.2 42 93.4L15.2 77.9C10.3 75.1 7.2 69.8 7.2 64.1V35.9C7.2 30.2 10.3 24.9 15.2 22.1L42 6.6Z"
              fill="var(--md-custom-color-teal-container)"
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
            a: createRelativeLink(creatorSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) =>
    creatorSource.getPages(lang).map((page) => ({ lang, slug: page.slugs })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = creatorSource.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
