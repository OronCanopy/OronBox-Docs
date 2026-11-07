import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import type { DocsLayoutProps } from 'fumadocs-ui/layouts/docs';
import {
  BookOpen,
  Download,
  Info,
  Palette,
  Puzzle,
  type LucideIcon,
} from 'lucide-react';
import { M3EHeader } from '@/components/m3e-header';
import { M3EShapeBadge, type M3EShapeVariant } from '@/components/m3e-shapes';
import { withLocale } from './i18n';
import { gitConfig, sections, type SectionSlug } from './shared';

const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

/**
 * Matches the exact M3E shape & tonal container palette used for each
 * documentation section on the homepage (`src/app/[lang]/page.tsx`).
 */
export const sectionVisuals: Record<
  SectionSlug,
  {
    icon: LucideIcon;
    shape: M3EShapeVariant;
    bg: string;
    fg: string;
  }
> = {
  user: {
    icon: BookOpen,
    shape: 'sunny',
    bg: 'var(--md-custom-color-blue-container)',
    fg: 'var(--md-custom-color-on-blue-container)',
  },
  creator: {
    icon: Palette,
    shape: 'hexagon',
    bg: 'var(--md-custom-color-teal-container)',
    fg: 'var(--md-custom-color-on-teal-container)',
  },
  plugins: {
    icon: Puzzle,
    shape: 'pill',
    bg: 'var(--md-custom-color-amber-container)',
    fg: 'var(--md-custom-color-on-amber-container)',
  },
  about: {
    icon: Info,
    shape: 'squircle',
    bg: 'var(--md-sys-color-tertiary-container)',
    fg: 'var(--md-sys-color-on-tertiary-container)',
  },
};

export function baseOptions(lang: string): BaseLayoutProps {
  return {
    nav: {
      component: <M3EHeader lang={lang} />,
    },
    githubUrl,
  };
}

export function docsOptions(
  lang: string,
): Omit<DocsLayoutProps, 'tree' | 'children'> {
  const locale = (lang === 'en' ? 'en' : 'zh') as 'zh' | 'en';

  return {
    nav: {
      url: withLocale(lang, '/'),
      title: (
        <span className="font-brand px-1 text-base font-semibold tracking-tight text-[var(--md-sys-color-on-surface)]">
          OronBox Docs
        </span>
      ),
    },
    tabs: sections.map((section) => {
      const visual = sectionVisuals[section.slug];
      const Icon = visual.icon;
      return {
        title: section.title[locale] ?? section.title.zh,
        description: section.description[locale] ?? section.description.zh,
        url: withLocale(lang, section.url),
        icon: (
          <M3EShapeBadge
            variant={visual.shape}
            bg={visual.bg}
            fg={visual.fg}
            size="fill"
          >
            <Icon className="size-[48%]" />
          </M3EShapeBadge>
        ),
        props: {
          className:
            'group !items-center !gap-3 !rounded-[16px] !p-2 [&>div:first-child]:!size-10 [&>div:first-child]:!my-auto',
        },
      };
    }),
    links: [
      {
        type: 'icon',
        label: locale === 'zh' ? '下载客户端' : 'Download Client',
        text: locale === 'zh' ? '下载' : 'Download',
        url: withLocale(lang, '/download'),
        icon: <Download className="size-4" />,
      },
    ],
    themeSwitch: {
      mode: 'light-dark-system',
    },
    githubUrl,
  };
}
