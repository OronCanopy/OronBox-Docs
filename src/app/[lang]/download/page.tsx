import { HomeLayout } from 'fumadocs-ui/layouts/home';
import {
  FileArchive,
  Globe,
  History,
} from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { baseOptions } from '@/lib/layout.shared';
import {
  getRelease,
  linuxDownloadOptions,
  recommendedFor,
  type Arch,
  type Os,
  type PackageKind,
} from '@/lib/releases';
import { ChecksumsDialog } from '@/components/checksums-dialog';
import { DownloadButton } from '@/components/download-detect';
import { DownloadOptionButton } from '@/components/download-option-button';
import { M3EFooter } from '@/components/m3e-footer';
import { M3EHeroBackdrop } from '@/components/m3e-hero-backdrop';
import { M3EShapeBadge, type M3EShapeVariant } from '@/components/m3e-shapes';
import { ProxiedAnchor } from '@/components/proxied-anchor';
import {
  AndroidIcon,
  AppleIcon,
  AppImageIcon,
  ArchLinuxIcon,
  DebianIcon,
  FedoraIcon,
  FlatpakIcon,
  LinuxIcon,
  WindowsIcon,
} from '@/components/brand-icons';

type Locale = 'zh' | 'en';
type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

const copy = {
  hero: {
    title: { zh: '下载 OronBox', en: 'Download OronBox' },
    subtitle: {
      zh: '选择你的平台，开始管理你的穿戴设备',
      en: 'Pick your platform and start managing your wearables',
    },
    prerelease: { zh: '预发布版本', en: 'Prerelease' },
    download: { zh: '下载', en: 'Download' },
    downloadFor: {
      windows: { zh: ' Windows 版', en: ' for Windows' },
      macos: { zh: ' macOS 版', en: ' for macOS' },
      linux: { zh: ' Linux 版', en: ' for Linux' },
      android: { zh: ' Android 版', en: ' for Android' },
      web: { zh: ' Web 版', en: ' for Web' },
    } as Record<Os, { zh: string; en: string }>,
    fallback: { zh: '查看全部下载选项', en: 'See all download options' },
    githubMirrorTesting: {
      zh: 'GitHub镜像测速中...',
      en: 'Testing GitHub mirrors...',
    },
    downloadStarting: { zh: '开始下载...', en: 'Starting download...' },
  },
  recommended: { zh: '推荐', en: 'Recommended' },
  platforms: {
    windows: {
      name: 'Windows',
      note: { zh: 'x64 安装包与压缩包', en: 'x64 installer and archive' },
    },
    macos: {
      name: 'macOS',
      note: { zh: 'Intel 与 Apple Silicon 通用', en: 'For Intel and Apple Silicon' },
    },
    linux: {
      name: 'Linux',
      note: {
        zh: '.AppImage / .flatpak / .deb / .rpm / .pkg.tar.zst / .tar.gz',
        en: '.AppImage / .flatpak / .deb / .rpm / .pkg.tar.zst / .tar.gz',
      },
    },
    android: {
      name: 'Android',
      note: {
        zh: 'arm64-v8a / armeabi-v7a / x86_64',
        en: 'arm64-v8a / armeabi-v7a / x86_64',
      },
    },
    web: {
      name: 'Web',
      note: { zh: '自部署静态包', en: 'Self-hosted static bundle' },
    },
  } as Record<Os, { name: string; note: { zh: string; en: string } }>,
  footer: {
    checksums: { zh: 'SHA256 校验和', en: 'SHA256 checksums' },
    allReleases: { zh: '全部历史版本', en: 'All releases' },
  },
} as const;

const platformIcons: Record<Os, IconComponent> = {
  windows: WindowsIcon,
  macos: AppleIcon,
  linux: LinuxIcon,
  android: AndroidIcon,
  web: Globe as unknown as IconComponent,
};

const platformShapeStyles: Record<
  Os,
  { shape: M3EShapeVariant; bg: string; fg: string }
> = {
  android: {
    shape: 'scallop',
    bg: 'var(--md-custom-color-teal-container)',
    fg: 'var(--md-custom-color-on-teal-container)',
  },
  macos: {
    shape: 'squircle',
    bg: 'var(--md-sys-color-primary-container)',
    fg: 'var(--md-sys-color-on-primary-container)',
  },
  linux: {
    shape: 'sunny',
    bg: 'var(--md-custom-color-amber-container)',
    fg: 'var(--md-custom-color-on-amber-container)',
  },
  windows: {
    shape: 'clover',
    bg: 'var(--md-custom-color-blue-container)',
    fg: 'var(--md-custom-color-on-blue-container)',
  },
  web: {
    shape: 'hexagon',
    bg: 'var(--md-sys-color-tertiary-container)',
    fg: 'var(--md-sys-color-on-tertiary-container)',
  },
};

const linuxFormatIcons: Partial<Record<PackageKind, IconComponent>> = {
  appimage: AppImageIcon,
  flatpak: FlatpakIcon,
  deb: DebianIcon,
  rpm: FedoraIcon,
  arch: ArchLinuxIcon,
  targz: FileArchive as unknown as IconComponent,
};

const linuxFormatNames: Partial<Record<PackageKind, string>> = {
  appimage: 'AppImage',
  flatpak: 'Flatpak',
  deb: 'Debian / Ubuntu',
  rpm: 'Fedora / RHEL / openSUSE',
  arch: 'Arch Linux',
  targz: 'tar.gz',
};

const linuxKindOrder: PackageKind[] = [
  'flatpak',
  'appimage',
  'deb',
  'rpm',
  'arch',
  'targz',
];

const platformOrder: Os[] = ['android', 'macos', 'linux', 'windows', 'web'];

const archOrder: Record<Arch, number> = {
  x64: 0,
  arm64: 1,
  armv7: 2,
  universal: 3,
  any: 4,
};

/** Android listing order: arm64-v8a → armeabi-v7a → x86_64 */
const androidArchOrder: Record<Arch, number> = {
  arm64: 0,
  armv7: 1,
  x64: 2,
  any: 3,
  universal: 4,
};

/** recommended package kind per platform, for the 推荐 badge. */
const recommendedKind: Record<Os, PackageKind | null> = {
  windows: 'exe',
  macos: 'dmg',
  linux: 'flatpak',
  android: 'apk',
  web: 'web',
};

export default async function DownloadPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const pick = <T,>(v: { zh: T; en: T }) => v[locale] ?? v.zh;

  const release = await getRelease();
  const linuxOptions = linuxDownloadOptions(release);

  const picks: Partial<Record<Os, { url: string; format: string }>> = {};
  for (const os of platformOrder) {
    const option = recommendedFor(release, os, os === 'android' ? 'arm64' : 'x64');
    if (option) picks[os] = { url: option.url, format: option.format };
  }
  const downloadTexts = {
    download: pick(copy.hero.download),
    forOs: {
      windows: pick(copy.hero.downloadFor.windows),
      macos: pick(copy.hero.downloadFor.macos),
      linux: pick(copy.hero.downloadFor.linux),
      android: pick(copy.hero.downloadFor.android),
      web: pick(copy.hero.downloadFor.web),
    },
    fallback: pick(copy.hero.fallback),
  };

  const byOs = (os: Os) =>
    release.options
      .filter((o) => o.os === os)
      .sort(
        (a, b) =>
          (os === 'android' ? androidArchOrder : archOrder)[a.arch] -
          (os === 'android' ? androidArchOrder : archOrder)[b.arch],
      );

  const linuxByKind = linuxKindOrder
    .map((kind) => ({
      kind,
      options: byOs('linux').filter((o) => o.kind === kind),
    }))
    .filter((group) => group.options.length > 0);

  return (
    <HomeLayout {...baseOptions(lang)}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-6 pb-14 sm:px-6">
        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-[32px] bg-[var(--md-sys-color-surface-container-low)] px-6 py-10 text-center sm:px-10 sm:py-12">
          <M3EHeroBackdrop variant="download" />

          <div className="relative z-10 flex flex-col items-center gap-2.5">
            <div className="inline-flex items-center gap-1 rounded-[18px] bg-[var(--md-sys-color-surface-container)] p-1">
              <span className="rounded-[14px] bg-[var(--md-sys-color-primary-container)] px-3 py-0.5 text-xs font-bold text-[var(--md-sys-color-on-primary-container)]">
                {release.tag}
              </span>
              {release.prerelease && (
                <span className="rounded-[14px] bg-[var(--md-custom-color-amber-container)] px-3 py-0.5 text-xs font-bold text-[var(--md-custom-color-on-amber-container)]">
                  {pick(copy.hero.prerelease)}
                </span>
              )}
            </div>

            <h1 className="font-brand text-[clamp(34px,5.5vw,56px)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--color-fd-foreground)]">
              {pick(copy.hero.title)}
            </h1>

            <p className="text-sm text-fd-muted-foreground sm:text-base">
              {pick(copy.hero.subtitle)}
            </p>

            <div className="mt-2 flex flex-wrap items-center justify-center gap-2.5">
              <DownloadButton
                picks={picks}
                texts={downloadTexts}
                downloadPageHref="#all"
                variant="filled"
                className="min-h-12 px-7 text-sm sm:text-base"
                linuxOptions={linuxOptions}
                githubToastMessage={pick(copy.hero.githubMirrorTesting)}
                downloadToastMessage={pick(copy.hero.downloadStarting)}
              />
            </div>
          </div>
        </section>

        {/* Direct M3E Segmented Platform Stack (no outer box wrapper) */}
        <section
          id="all"
          className="flex scroll-mt-20 flex-col gap-1.5 overflow-hidden rounded-[28px]"
        >
          {platformOrder.map((os) => {
            const PlatformIcon = platformIcons[os];
            const platform = copy.platforms[os];
            const badgeStyle = platformShapeStyles[os];
            return (
              <div
                key={os}
                className="group m3e-segmented-card bg-[var(--md-sys-color-surface-container-low)] p-5 sm:p-6"
              >
                <div className="mb-4 flex items-center gap-3">
                  <M3EShapeBadge
                    variant={badgeStyle.shape}
                    bg={badgeStyle.bg}
                    fg={badgeStyle.fg}
                    size="sm"
                  >
                    <PlatformIcon className="size-5" />
                  </M3EShapeBadge>
                  <div>
                    <h2 className="font-brand text-lg font-semibold text-[var(--color-fd-foreground)] sm:text-xl">
                      {platform.name}
                    </h2>
                    <p className="text-xs text-fd-muted-foreground sm:text-sm">
                      {pick(platform.note)}
                    </p>
                  </div>
                </div>

                {os === 'linux' ? (
                  <div className="flex flex-col gap-1 overflow-hidden rounded-[20px]">
                    {linuxByKind.map(({ kind, options }) => {
                      const FormatIcon =
                        linuxFormatIcons[kind] ?? FileArchive;
                      return (
                        <div
                          key={kind}
                          className="flex flex-col gap-2.5 rounded-[8px] bg-[var(--md-sys-color-surface-container)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--md-sys-color-surface-container-high)] text-[var(--color-fd-foreground)]">
                              <FormatIcon className="size-4" />
                            </span>
                            <span className="font-brand text-sm font-semibold text-[var(--color-fd-foreground)] sm:text-base">
                              {linuxFormatNames[kind]}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {options.map((option) => (
                              <DownloadOptionButton
                                key={option.name}
                                option={option}
                                recommended={
                                  recommendedKind.linux !== null &&
                                  kind === recommendedKind.linux &&
                                  option.arch === 'x64'
                                }
                                recommendedLabel={pick(copy.recommended)}
                                githubToastMessage={pick(
                                  copy.hero.githubMirrorTesting,
                                )}
                                downloadToastMessage={pick(
                                  copy.hero.downloadStarting,
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {byOs(os).map((option) => (
                      <DownloadOptionButton
                        key={option.name}
                        option={option}
                        recommended={
                          option.kind === recommendedKind[os] &&
                          (os === 'android'
                            ? option.arch === 'arm64'
                            : option.arch === 'x64' ||
                              option.arch === 'universal' ||
                              option.arch === 'any')
                        }
                        recommendedLabel={pick(copy.recommended)}
                        githubToastMessage={pick(
                          copy.hero.githubMirrorTesting,
                        )}
                        downloadToastMessage={pick(
                          copy.hero.downloadStarting,
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>

        {/* Integrity & history — M3E Connected Button Group */}
        <div className="flex justify-center">
          <div className="m3e-connected-group flex flex-wrap items-center justify-center gap-1">
            {release.checksumsUrl && (
              <ChecksumsDialog
                checksumsUrl={release.checksumsUrl}
                tag={release.tag}
                locale={locale}
                label={pick(copy.footer.checksums)}
                githubToastMessage={pick(copy.hero.githubMirrorTesting)}
                downloadToastMessage={pick(copy.hero.downloadStarting)}
              />
            )}
            <ProxiedAnchor
              href={release.pageUrl.replace(/\/tag\/.*$/, '')}
              className="m3e-connected-item inline-flex min-h-10 items-center gap-2 bg-[var(--md-sys-color-surface-container-low)] px-4.5 text-sm font-semibold text-[var(--color-fd-foreground)] no-underline hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)]"
              githubToastMessage={pick(copy.hero.githubMirrorTesting)}
              downloadToastMessage={pick(copy.hero.downloadStarting)}
            >
              <History className="size-4" />
              {pick(copy.footer.allReleases)}
            </ProxiedAnchor>
          </div>
        </div>

        <M3EFooter lang={lang} />
      </div>
    </HomeLayout>
  );
}
