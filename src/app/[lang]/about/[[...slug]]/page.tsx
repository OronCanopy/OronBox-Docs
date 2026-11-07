import { aboutSource } from '@/lib/source';
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
  const page = aboutSource.getPage(slug, lang);
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
            className="m3e-ambient-drift-4 absolute -top-12 -right-10 size-36 opacity-50"
          >
            <path
              d="M32 6C41 6 46 12 50 12C54 12 59 6 68 6C82 6 94 18 94 32C94 41 88 46 88 50C88 54 94 59 94 68C94 82 82 94 68 94C59 94 54 88 50 88C46 88 41 94 32 94C18 94 6 82 6 68C6 59 12 54 12 50C12 46 6 41 6 32C6 18 18 6 32 6Z"
              fill="var(--md-sys-color-tertiary-container)"
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
            a: createRelativeLink(aboutSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) =>
    aboutSource.getPages(lang).map((page) => ({ lang, slug: page.slugs })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = aboutSource.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
