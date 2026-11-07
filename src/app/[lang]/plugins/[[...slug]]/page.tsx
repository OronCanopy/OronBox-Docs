import { pluginSource } from '@/lib/source';
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
  const page = pluginSource.getPage(slug, lang);
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
            className="m3e-ambient-drift-3 absolute -top-12 -right-10 size-36 opacity-50"
          >
            <rect
              x="8"
              y="16"
              width="84"
              height="68"
              rx="34"
              transform="rotate(-16 50 50)"
              fill="var(--md-custom-color-amber-container)"
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
            a: createRelativeLink(pluginSource, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return i18n.languages.flatMap((lang) =>
    pluginSource.getPages(lang).map((page) => ({ lang, slug: page.slugs })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug?: string[] }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = pluginSource.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
