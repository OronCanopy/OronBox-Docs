'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Languages, Menu } from 'lucide-react';
import {
  FullSearchTrigger,
  SearchTrigger,
} from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { LanguageSelect } from 'fumadocs-ui/layouts/shared/slots/language-select';
import { ThemeSwitch } from 'fumadocs-ui/layouts/shared/slots/theme-switch';
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { withLocale } from '@/lib/i18n';
import { appName, gitConfig, sections } from '@/lib/shared';
import { cn } from '@/lib/cn';

const githubUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function M3EHeader({ lang }: { lang: string }) {
  const pathname = usePathname();
  const locale = (lang === 'en' ? 'en' : 'zh') as 'zh' | 'en';
  const homeUrl = withLocale(lang, '/');

  const navLinks = [
    {
      text: locale === 'zh' ? '下载' : 'Download',
      url: withLocale(lang, '/download'),
      nested: false,
    },
    ...sections.map((section) => ({
      text: section.title[locale] ?? section.title.zh,
      url: withLocale(lang, section.url),
      nested: true,
    })),
  ];

  const isActive = (url: string, nested: boolean) => {
    if (pathname === url) return true;
    if (nested && pathname.startsWith(`${url}/`)) return true;
    return false;
  };

  const isHomeActive = pathname === homeUrl || pathname === `${homeUrl}/`;

  return (
    <header className="sticky top-3 z-40 mx-auto flex w-full max-w-[1232px] items-center justify-between px-4 sm:px-6">
      {/* Desktop: Left Main Navigation Capsule Dock (Brand Logo + Title | Links | Search) */}
      <nav
        aria-label={locale === 'zh' ? '主导航' : 'Main navigation'}
        className="hidden h-11 items-center gap-1 rounded-[22px] border border-[var(--md-sys-color-outline-variant)]/45 bg-[var(--md-sys-color-surface-container-low)]/92 p-1.5 backdrop-blur-md md:inline-flex"
      >
        <Link
          href={homeUrl}
          aria-label={locale === 'zh' ? '首页' : 'Home'}
          title={locale === 'zh' ? '首页' : 'Home'}
          className={cn(
            'inline-flex h-8 shrink-0 items-center gap-2 rounded-[16px] px-2.5 text-sm font-semibold text-[var(--md-sys-color-on-surface)] no-underline transition-[border-radius,background-color,transform] duration-200 ease-[var(--md-ease-emphasized)] hover:rounded-[10px] active:scale-95',
            isHomeActive
              ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]'
              : 'hover:bg-[var(--md-sys-color-secondary-container)] hover:text-[var(--md-sys-color-on-secondary-container)]',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt=""
            width={20}
            height={20}
            className="rounded-[5px] dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon-dark.svg"
            alt=""
            width={20}
            height={20}
            className="hidden rounded-[5px] dark:block"
          />
          <span className="font-brand tracking-tight">{appName}</span>
        </Link>

        <span
          aria-hidden="true"
          className="mx-0.5 h-4 w-px bg-[var(--md-sys-color-outline-variant)]/70"
        />

        <div className="flex items-center gap-0.5">
          {navLinks.map((item) => {
            const active = isActive(item.url, item.nested);
            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  'inline-flex h-8 shrink-0 items-center rounded-[16px] px-3.5 text-sm whitespace-nowrap no-underline transition-[border-radius,background-color,color] duration-200 ease-[var(--md-ease-emphasized)] hover:rounded-[10px]',
                  active
                    ? 'bg-[var(--md-sys-color-primary-container)] font-semibold text-[var(--md-sys-color-on-primary-container)]'
                    : 'font-medium text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-secondary-container)] hover:text-[var(--md-sys-color-on-secondary-container)]',
                )}
              >
                {item.text}
              </Link>
            );
          })}
        </div>

        <span
          aria-hidden="true"
          className="mx-0.5 h-4 w-px bg-[var(--md-sys-color-outline-variant)]/70"
        />

        <FullSearchTrigger
          hideIfDisabled
          className="h-8 shrink-0 rounded-[16px] border-none bg-[var(--md-sys-color-surface-container)] px-3 py-0 text-xs font-medium whitespace-nowrap text-[var(--md-sys-color-on-surface-variant)] transition-[border-radius,background-color,color] duration-200 ease-[var(--md-ease-emphasized)] hover:rounded-[10px] hover:bg-[var(--md-sys-color-secondary-container)] hover:text-[var(--md-sys-color-on-secondary-container)] [&_kbd]:rounded-[6px] [&_kbd]:border-none [&_kbd]:bg-[var(--md-sys-color-surface-container-low)] [&_kbd]:px-1.5 [&_kbd]:py-0.5 [&_kbd]:text-[11px]"
        />
      </nav>

      {/* Desktop: Right Utility Capsule (GitHub + Language + Theme) */}
      <div className="hidden h-11 items-center gap-1 rounded-[22px] border border-[var(--md-sys-color-outline-variant)]/45 bg-[var(--md-sys-color-surface-container-low)]/92 p-1.5 backdrop-blur-md md:inline-flex">
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          className="inline-flex size-8 items-center justify-center rounded-[16px] text-[var(--md-sys-color-on-surface-variant)] transition-[border-radius,background-color,color] duration-200 ease-[var(--md-ease-emphasized)] hover:rounded-[10px] hover:bg-[var(--md-sys-color-secondary-container)] hover:text-[var(--md-sys-color-on-secondary-container)]"
        >
          <GitHubIcon className="size-4" />
        </a>
        <LanguageSelect className="inline-flex size-8 items-center justify-center rounded-[16px] p-0 text-[var(--md-sys-color-on-surface-variant)] transition-[border-radius,background-color,color] duration-200 ease-[var(--md-ease-emphasized)] hover:rounded-[10px] hover:bg-[var(--md-sys-color-secondary-container)] hover:text-[var(--md-sys-color-on-secondary-container)]">
          <Languages className="size-4" />
        </LanguageSelect>
        <ThemeSwitch
          mode="light-dark-system"
          className="border-none bg-[var(--md-sys-color-surface-container)] p-0.5 *:cursor-pointer *:transition-colors"
        />
      </div>

      {/* Mobile Capsule Bar (<768px) */}
      <div className="flex h-11 w-full items-center justify-between rounded-[22px] border border-[var(--md-sys-color-outline-variant)]/45 bg-[var(--md-sys-color-surface-container-low)]/95 p-1.5 backdrop-blur-md md:hidden">
        <Link
          href={homeUrl}
          aria-label={locale === 'zh' ? '首页' : 'Home'}
          className={cn(
            'inline-flex h-8 shrink-0 items-center gap-2 rounded-[16px] px-2.5 text-sm font-semibold text-[var(--md-sys-color-on-surface)] no-underline transition-colors',
            isHomeActive
              ? 'bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]'
              : 'hover:bg-[var(--md-sys-color-secondary-container)]',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt=""
            width={20}
            height={20}
            className="rounded-[5px] dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon-dark.svg"
            alt=""
            width={20}
            height={20}
            className="hidden rounded-[5px] dark:block"
          />
          <span className="font-brand tracking-tight">{appName}</span>
        </Link>

        <div className="flex items-center gap-1">
          <SearchTrigger
            hideIfDisabled
            className="size-8 rounded-[16px] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-secondary-container)]"
          />
          <LanguageSelect className="inline-flex size-8 items-center justify-center rounded-[16px] p-0 text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-secondary-container)]">
            <Languages className="size-4" />
          </LanguageSelect>
          <ThemeSwitch
            mode="light-dark-system"
            className="border-none bg-[var(--md-sys-color-surface-container)] p-0.5 *:cursor-pointer *:transition-colors"
          />

          <Popover>
            <PopoverTrigger
              aria-label={locale === 'zh' ? '菜单' : 'Menu'}
              className="inline-flex size-8 items-center justify-center rounded-[16px] text-[var(--md-sys-color-on-surface-variant)] hover:bg-[var(--md-sys-color-secondary-container)]"
            >
              <Menu className="size-4.5" />
            </PopoverTrigger>
            <PopoverContent className="flex w-52 flex-col gap-1 rounded-[22px] border border-[var(--md-sys-color-outline-variant)]/45 bg-[var(--md-sys-color-surface-container-low)] p-2 shadow-xl">
              {navLinks.map((item) => {
                const active = isActive(item.url, item.nested);
                return (
                  <PopoverClose
                    key={item.url}
                    render={
                      <Link
                        href={item.url}
                        className={cn(
                          'flex items-center rounded-[14px] px-3.5 py-2 text-sm no-underline transition-colors',
                          active
                            ? 'bg-[var(--md-sys-color-primary-container)] font-semibold text-[var(--md-sys-color-on-primary-container)]'
                            : 'font-medium text-[var(--md-sys-color-on-surface)] hover:bg-[var(--md-sys-color-secondary-container)]',
                        )}
                      >
                        {item.text}
                      </Link>
                    }
                  />
                );
              })}
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-1 flex items-center gap-2 rounded-[14px] bg-[var(--md-sys-color-surface-container)] px-3.5 py-2 text-sm font-medium text-[var(--md-sys-color-on-surface-variant)] no-underline hover:bg-[var(--md-sys-color-secondary-container)]"
              >
                <GitHubIcon className="size-4" />
                <span>GitHub</span>
              </a>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
