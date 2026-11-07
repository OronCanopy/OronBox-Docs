import { HomeLayout } from 'fumadocs-ui/layouts/home';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Bluetooth,
  Boxes,
  Code2,
  MessageCircle,
  Package,
  Puzzle,
  Server,
  ShieldCheck,
  Star,
  Terminal,
  Upload,
  Users,
} from 'lucide-react';
import { withLocale } from '@/lib/i18n';
import { baseOptions, sectionVisuals } from '@/lib/layout.shared';
import { sections } from '@/lib/shared';
import { getRelease, linuxDownloadOptions, recommendedFor, type Os } from '@/lib/releases';
import {
  DownloadButton,
  type AndroidDownloadOption,
} from '@/components/download-detect';
import { M3EFooter } from '@/components/m3e-footer';
import { M3EHeroBackdrop } from '@/components/m3e-hero-backdrop';
import { M3EShapeBadge, type M3EShapeVariant } from '@/components/m3e-shapes';
import { WebLaunchButton } from '@/components/web-launch-button';
import { cn } from '@/lib/cn';
import type { ComponentType } from 'react';

type Locale = 'zh' | 'en';

const copy = {
  hero: {
    subtitle: {
      zh: '一个又好看又快的 VelaOS / ZeppOS 可穿戴设备管理软件，使用 Flutter 构建',
      en: 'A beautiful and fast VelaOS / ZeppOS wearable device manager, built with Flutter',
    },
    description: {
      zh: '无需官方客户端，即可连接并管理 小米VelaOS / 华米ZeppOS 设备\n从社区资源库安装应用、表盘与插件',
      en: 'Connect and manage Xiaomi VelaOS / Amazfit ZeppOS devices without the official client\nInstall apps, watchfaces and plugins from community registries',
    },
    derivedFrom: {
      prefix: { zh: '衍生自 ', en: 'Derived from ' },
      links: [
        {
          text: 'AstroBox-NG',
          href: 'https://github.com/AstralSightStudios/AstroBox-NG',
        },
        {
          text: 'GadgetBridge',
          href: 'https://codeberg.org/Freeyourgadget/Gadgetbridge',
        },
      ],
    },
  },
  cta: {
    primary: { zh: '快速上手', en: 'Quick Start' },
    github: { zh: 'GitHub', en: 'GitHub' },
    webOnline: { zh: '使用 Web 版', en: 'Use web version' },
    download: { zh: '下载', en: 'Download' },
    downloadFor: {
      windows: { zh: ' Windows 版', en: ' for Windows' },
      macos: { zh: ' macOS 版', en: ' for macOS' },
      linux: { zh: ' Linux 版', en: ' for Linux' },
      android: { zh: ' Android 版', en: ' for Android' },
      web: { zh: ' Web 版', en: ' for Web' },
    },
    downloadFallback: { zh: '更多下载选项', en: 'More download options' },
    lanzou: { zh: '蓝奏云网盘', en: 'Lanzou cloud drive' },
    githubRelease: { zh: 'GitHub Release', en: 'GitHub Release' },
    githubMirrorTesting: {
      zh: 'GitHub镜像测速中...',
      en: 'Testing GitHub mirrors...',
    },
    downloadStarting: { zh: '开始下载...', en: 'Starting download...' },
  },
  preview: {
    title: { zh: '界面一览', en: 'Take a look' },
    altMain: {
      zh: 'OronBox 桌面端设备管理界面',
      en: 'OronBox desktop device management screen',
    },
    altPhone: {
      zh: 'OronBox 手机端设备管理界面',
      en: 'OronBox Android device management screen',
    },
  },
  features: {
    title: { zh: '能力一览', en: 'Capabilities' },
    description: {
      zh: '直连设备、安装社区资源、创作发布与扩展插件的一站式体验',
      en: 'Connect devices, install community resources, publish creations and extend with plugins',
    },
    items: [
      {
        icon: Bluetooth,
        title: { zh: '直连设备', en: 'Connect devices' },
        description: {
          zh: 'BLE、SPP 与 Web Serial 多种传输方式\n无需官方客户端即可连接并管理设备',
          en: 'BLE, SPP and Web Serial transports\nConnect and manage devices without the official client',
        },
      },
      {
        icon: Boxes,
        title: { zh: '社区资源库', en: 'Community registries' },
        description: {
          zh: '米坛 BandBBS、AstroBox-Repo、华米商店与插件注册源\n一站式浏览与安装',
          en: 'BandBBS, AstroBox-Repo, the Amazfit store and the plugin registry\nBrowse and install in one place',
        },
      },
      {
        icon: Upload,
        title: { zh: '创作者中心', en: 'Creator center' },
        description: {
          zh: '打包表盘与快应用，一键发布到米坛 / AstroBox-Repo\n草稿与审核全流程管理',
          en: 'Package watchfaces and quick apps, publish to BandBBS / AstroBox-Repo\nTrack drafts and reviews end to end',
        },
      },
      {
        icon: Puzzle,
        title: { zh: '插件系统', en: 'Plugin system' },
        description: {
          zh: '高性能 QuickJS 沙箱运行时\n支持 WASM 混合模式',
          en: 'High-performance QuickJS sandbox runtime\nWASM and hybrid modes supported',
        },
      },
      {
        icon: ShieldCheck,
        title: { zh: '本地优先', en: 'Local-first' },
        description: {
          zh: '设备连接凭据与数据默认保存在本机',
          en: 'Device credentials and data stay on your machine by default',
        },
      },
      {
        icon: Terminal,
        title: { zh: '命令行工具', en: 'CLI tooling' },
        description: {
          zh: '无 GUI 环境下脚本化连接设备、安装资源\n访问社区源与控制后台任务',
          en: 'Scriptable CLI to manage devices, install resources\nand drive background tasks without the GUI',
        },
      },
    ],
  },
  platforms: {
    title: { zh: '平台支持', en: 'Platform support' },
    hint: {
      zh: '各平台连接能力与功能支持程度不同，详见用户文档',
      en: 'Connectivity and feature completeness vary per platform — see the user guide',
    },
    items: ['Windows', 'macOS', 'Linux', 'Android', 'Web'],
  },
  docs: {
    title: { zh: '文档与指南', en: 'Documentation & guides' },
    description: {
      zh: '从日常安装连接、表盘快应用创作到插件开发与项目架构说明',
      en: 'From daily device setup and watchface creation to plugin development and project architecture',
    },
  },
  community: {
    title: { zh: '社区与开源', en: 'Community & open source' },
    description: {
      zh: 'OronBox 客户端与服务端代码遵循 AGPL v3.0 开源，欢迎参与贡献与讨论',
      en: 'The OronBox client and server are open source under AGPL v3.0 — contributions and discussions are welcome',
    },
    links: [
      {
        icon: Code2,
        title: { zh: 'OronBox', en: 'OronBox' },
        description: { zh: '客户端源码', en: 'Client source code' },
        href: 'https://github.com/OronCanopy/OronBox',
      },
      {
        icon: Server,
        title: { zh: 'OronBox-Server', en: 'OronBox-Server' },
        description: { zh: '服务端源码', en: 'Server source code' },
        href: 'https://github.com/OronCanopy/OronBox-Server',
      },
      {
        icon: Users,
        title: { zh: 'QQ 群', en: 'QQ Group' },
        description: { zh: '加入 QQ 群', en: 'Join the QQ group' },
        href: 'https://qm.qq.com/q/il3TbmJlKM',
      },
      {
        icon: MessageCircle,
        title: { zh: 'Discussions', en: 'Discussions' },
        description: { zh: '公开讨论区', en: 'Public discussions' },
        href: 'https://github.com/OronCanopy/OronBox/discussions',
      },
    ],
  },
} as const;

/** tonal chip palettes rotating across feature icons */
const accents = [
  ['var(--md-sys-color-primary-container)', 'var(--md-sys-color-on-primary-container)'],
  ['var(--md-custom-color-blue-container)', 'var(--md-custom-color-on-blue-container)'],
  ['var(--md-custom-color-teal-container)', 'var(--md-custom-color-on-teal-container)'],
  ['var(--md-custom-color-amber-container)', 'var(--md-custom-color-on-amber-container)'],
  ['var(--md-sys-color-tertiary-container)', 'var(--md-sys-color-on-tertiary-container)'],
  ['var(--md-sys-color-secondary-container)', 'var(--md-sys-color-on-secondary-container)'],
] as const;

const shapeVariants: M3EShapeVariant[] = [
  'scallop',
  'clover',
  'sunny',
  'hexagon',
  'pill',
  'squircle',
];

function DockLink({
  href,
  icon: Icon,
  children,
  variant = 'filled',
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
  variant?: 'filled' | 'connected';
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center justify-center gap-2 text-sm font-semibold no-underline select-none',
        variant === 'filled'
          ? 'm3e-morph-pill min-h-12 bg-[var(--md-sys-color-primary)] px-6 text-[var(--md-sys-color-on-primary)] hover:brightness-105'
          : 'm3e-connected-item min-h-11 bg-[var(--md-sys-color-secondary-container)] px-4.5 text-[var(--md-sys-color-on-secondary-container)] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)]',
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{children}</span>
    </Link>
  );
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  const pick = <T,>(v: { zh: T; en: T }) => v[locale] ?? v.zh;

  const release = await getRelease();
  const picks: Partial<Record<Os, { url: string; format: string }>> = {};
  for (const os of ['windows', 'macos', 'linux', 'android', 'web'] as Os[]) {
    const option = recommendedFor(release, os, os === 'android' ? 'arm64' : 'x64');
    if (option) picks[os] = { url: option.url, format: option.format };
  }
  const downloadTexts = {
    download: pick(copy.cta.download),
    forOs: {
      windows: pick(copy.cta.downloadFor.windows),
      macos: pick(copy.cta.downloadFor.macos),
      linux: pick(copy.cta.downloadFor.linux),
      android: pick(copy.cta.downloadFor.android),
      web: pick(copy.cta.downloadFor.web),
    },
    fallback: pick(copy.cta.downloadFallback),
  };
  const linuxOptions = linuxDownloadOptions(release);
  const androidOption = recommendedFor(release, 'android', 'arm64');
  const androidOptions: AndroidDownloadOption[] = [
    {
      url: 'https://cpwdxbd.lanzoue.com/oronbox',
      label: pick(copy.cta.lanzou),
      showDownloadToast: false,
    },
    ...(androidOption
      ? [{ url: androidOption.url, label: pick(copy.cta.githubRelease) }]
      : []),
  ];

  return (
    <HomeLayout {...baseOptions(lang)}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pt-6 pb-12 sm:px-6">
        {/* Unified M3E Segmented Top Stage: Hero + Preview + Platform Strip */}
        <div className="flex flex-col gap-1.5 overflow-hidden rounded-[32px]">
          {/* Segment 1: Hero */}
          <section className="relative isolate overflow-hidden rounded-t-[32px] rounded-b-[12px] bg-[var(--md-sys-color-surface-container-low)] px-6 py-10 text-center sm:px-10 sm:py-12">
            <M3EHeroBackdrop variant="home" />

            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-2.5">
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-[20px] bg-[var(--md-sys-color-surface-container)] px-3.5 py-1 text-xs font-medium text-[var(--md-sys-color-on-surface-variant)]">
                <span>{pick(copy.hero.derivedFrom.prefix)}</span>
                <a
                  href={copy.hero.derivedFrom.links[0].href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[12px] bg-[var(--md-sys-color-primary-container)] px-2 py-0.5 font-semibold text-[var(--md-sys-color-on-primary-container)] no-underline transition-colors hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)]"
                >
                  {copy.hero.derivedFrom.links[0].text}
                </a>
                <span>&amp;</span>
                <a
                  href={copy.hero.derivedFrom.links[1].href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[12px] bg-[var(--md-sys-color-secondary-container)] px-2 py-0.5 font-semibold text-[var(--md-sys-color-on-secondary-container)] no-underline transition-colors hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)]"
                >
                  {copy.hero.derivedFrom.links[1].text}
                </a>
              </div>

              <h1 className="font-brand text-[clamp(42px,6.8vw,72px)] font-semibold leading-[1.04] tracking-[-0.03em] text-[var(--color-fd-foreground)]">
                OronBox
              </h1>

              <p className="text-[1.0625rem] font-medium leading-[1.5] text-[var(--color-fd-foreground)] sm:text-[1.25rem]">
                {pick(copy.hero.subtitle)}
              </p>

              <p className="whitespace-pre-line text-sm leading-[1.65] text-fd-muted-foreground sm:text-[0.9375rem]">
                {pick(copy.hero.description)}
              </p>

              <div className="mt-3 flex flex-col items-center gap-2">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <DockLink href={withLocale(lang, '/user')} icon={ArrowRight}>
                    {pick(copy.cta.primary)}
                  </DockLink>
                  <DownloadButton
                    picks={picks}
                    texts={downloadTexts}
                    downloadPageHref={withLocale(lang, '/download')}
                    variant="tonal"
                    className="min-h-12 px-6"
                    linuxOptions={linuxOptions}
                    androidOptions={androidOptions}
                    githubToastMessage={pick(copy.cta.githubMirrorTesting)}
                    downloadToastMessage={pick(copy.cta.downloadStarting)}
                  />
                </div>

                <div className="m3e-connected-group flex flex-wrap items-center justify-center gap-1">
                  <WebLaunchButton
                    href="/web"
                    downloadHref={withLocale(lang, '/download')}
                    locale={locale}
                  >
                    {pick(copy.cta.webOnline)}
                  </WebLaunchButton>
                  <DockLink
                    href={withLocale(lang, '/download')}
                    icon={Package}
                    variant="connected"
                  >
                    {pick(copy.cta.downloadFallback)}
                  </DockLink>
                  <DockLink
                    href="https://github.com/OronCanopy/OronBox"
                    icon={Star}
                    variant="connected"
                  >
                    {pick(copy.cta.github)}
                  </DockLink>
                </div>
              </div>
            </div>
          </section>

          {/* Segment 2: Product Preview */}
          <section
            id="preview"
            aria-label={pick(copy.preview.title)}
            className="scroll-mt-20 rounded-[12px] bg-[var(--md-sys-color-surface-container-low)] p-2 sm:p-2.5"
          >
            <div className="flex flex-row gap-1.5 overflow-hidden rounded-[8px] sm:gap-2">
              <div
                className="min-w-0 overflow-hidden rounded-[8px] bg-[var(--md-sys-color-surface-container)]"
                style={{ flexGrow: 2268 / 1434, flexBasis: 0 }}
              >
                <Image
                  src={`/screenshots/${locale}_purple_light.png`}
                  alt={pick(copy.preview.altMain)}
                  width={2268}
                  height={1434}
                  className="block h-auto w-full dark:hidden"
                  priority={false}
                />
                <Image
                  src={`/screenshots/${locale}_purple_dark.png`}
                  alt={pick(copy.preview.altMain)}
                  width={2268}
                  height={1434}
                  className="hidden h-auto w-full dark:block"
                  priority={false}
                />
              </div>
              <div
                className="min-w-0 overflow-hidden rounded-[8px] bg-[var(--md-sys-color-surface-container)]"
                style={{ flexGrow: 1440 / 3200, flexBasis: 0 }}
              >
                <Image
                  src={`/screenshots/mobile_${locale}_purple_light.png`}
                  alt={pick(copy.preview.altPhone)}
                  width={1440}
                  height={3200}
                  className="block h-auto w-full dark:hidden"
                />
                <Image
                  src={`/screenshots/mobile_${locale}_purple_dark.png`}
                  alt={pick(copy.preview.altPhone)}
                  width={1440}
                  height={3200}
                  className="hidden h-auto w-full dark:block"
                />
              </div>
            </div>
          </section>

          {/* Segment 3: Integrated Platform Support Bar */}
          <section
            id="platforms"
            className="flex scroll-mt-20 flex-col items-center justify-between gap-3 rounded-t-[12px] rounded-b-[32px] bg-[var(--md-sys-color-surface-container-low)] px-5 py-4 sm:px-6 lg:flex-row"
          >
            <div className="flex flex-col items-center gap-0.5 text-center sm:flex-row sm:gap-3 lg:text-left">
              <h2 className="font-brand text-base font-semibold text-[var(--color-fd-foreground)]">
                {pick(copy.platforms.title)}
              </h2>
              <p className="text-xs text-fd-muted-foreground sm:text-sm">
                {pick(copy.platforms.hint)}
              </p>
            </div>
            <div className="m3e-connected-group flex flex-wrap items-center justify-center gap-1">
              {copy.platforms.items.map((item) => (
                <span
                  key={item}
                  className="m3e-connected-item inline-flex min-h-9 items-center bg-[var(--md-sys-color-secondary-container)] px-3.5 text-xs font-semibold text-[var(--md-sys-color-on-secondary-container)] select-none hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] sm:text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Features — Direct M3E Segmented Grid */}
        <section>
          <div className="mb-3.5 flex flex-col gap-1 px-1">
            <h2 className="font-brand text-[clamp(22px,3vw,28px)] font-semibold tracking-[-0.02em] text-[var(--color-fd-foreground)]">
              {pick(copy.features.title)}
            </h2>
            <p className="text-xs text-fd-muted-foreground sm:text-sm">
              {pick(copy.features.description)}
            </p>
          </div>
          <div className="grid gap-1.5 overflow-hidden rounded-[28px] grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))]">
            {copy.features.items.map((feature, i) => {
              const [chipBg, chipFg] = accents[i % accents.length];
              const shape = shapeVariants[i % shapeVariants.length];
              return (
                <div
                  key={feature.title.zh}
                  className="group m3e-segmented-card flex flex-col gap-3 bg-[var(--md-sys-color-surface-container-low)] p-5 hover:bg-[var(--md-sys-color-surface-container)]"
                >
                  <div className="flex items-center gap-3">
                    <M3EShapeBadge
                      variant={shape}
                      bg={chipBg}
                      fg={chipFg}
                      size="sm"
                    >
                      <feature.icon className="size-5" />
                    </M3EShapeBadge>
                    <h3 className="font-brand text-base font-semibold text-[var(--color-fd-foreground)] sm:text-lg">
                      {pick(feature.title)}
                    </h3>
                  </div>
                  <p className="whitespace-pre-line text-sm leading-[1.6] text-fd-muted-foreground">
                    {pick(feature.description)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Documentation sections — Compact Horizontal M3E Segmented Tiles */}
        <section>
          <div className="mb-3.5 flex flex-col gap-1 px-1">
            <h2 className="font-brand text-[clamp(22px,3vw,28px)] font-semibold tracking-[-0.02em] text-[var(--color-fd-foreground)]">
              {pick(copy.docs.title)}
            </h2>
            <p className="text-xs text-fd-muted-foreground sm:text-sm">
              {pick(copy.docs.description)}
            </p>
          </div>
          <div className="grid gap-1.5 overflow-hidden rounded-[28px] grid-cols-[repeat(auto-fit,minmax(min(100%,270px),1fr))]">
            {sections.map((section) => {
              const visual = sectionVisuals[section.slug];
              const Icon = visual.icon;
              return (
                <Link
                  key={section.slug}
                  href={withLocale(lang, section.url)}
                  className="group m3e-segmented-card flex items-center justify-between gap-4 bg-[var(--md-sys-color-surface-container-low)] p-5 no-underline hover:bg-[var(--md-sys-color-primary-container)]/55"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <M3EShapeBadge
                      variant={visual.shape}
                      bg={visual.bg}
                      fg={visual.fg}
                    >
                      <Icon className="size-5" />
                    </M3EShapeBadge>
                    <div className="min-w-0">
                      <h3 className="font-brand text-base font-semibold text-[var(--color-fd-foreground)] sm:text-lg">
                        {pick(section.title)}
                      </h3>
                      <p className="mt-0.5 text-sm leading-[1.5] text-fd-muted-foreground">
                        {pick(section.description)}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[18px] bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)] transition-[width,border-radius,background-color,color] duration-250 ease-[var(--md-ease-emphasized)] group-hover:w-12 group-hover:rounded-[12px] group-hover:bg-[var(--md-sys-color-primary)] group-hover:text-[var(--md-sys-color-on-primary)]">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Community — Direct 4-Column M3E Segmented Strip */}
        <section>
          <div className="mb-3.5 flex flex-col gap-1 px-1">
            <h2 className="font-brand text-[clamp(22px,3vw,28px)] font-semibold tracking-[-0.02em] text-[var(--color-fd-foreground)]">
              {pick(copy.community.title)}
            </h2>
            <p className="text-xs text-fd-muted-foreground sm:text-sm">
              {pick(copy.community.description)}
            </p>
          </div>
          <div className="grid gap-1.5 overflow-hidden rounded-[28px] grid-cols-[repeat(auto-fit,minmax(min(100%,210px),1fr))]">
            {copy.community.links.map((link, i) => {
              const [chipBg, chipFg] = accents[(i + 2) % accents.length];
              const shape = shapeVariants[(i + 2) % shapeVariants.length];
              return (
                <Link
                  key={link.title.zh}
                  href={link.href}
                  className="group m3e-segmented-card flex items-center gap-3.5 bg-[var(--md-sys-color-surface-container-low)] p-4 no-underline hover:bg-[var(--md-sys-color-surface-container-high)]"
                >
                  <M3EShapeBadge
                    variant={shape}
                    bg={chipBg}
                    fg={chipFg}
                    size="sm"
                  >
                    <link.icon className="size-5" />
                  </M3EShapeBadge>
                  <div className="min-w-0 flex-1">
                    <div className="font-brand truncate text-sm font-semibold text-[var(--color-fd-foreground)] sm:text-base">
                      {pick(link.title)}
                    </div>
                    <div className="truncate text-xs text-fd-muted-foreground sm:text-sm">
                      {pick(link.description)}
                    </div>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-fd-muted-foreground transition-transform duration-300 ease-[var(--md-ease-spring)] group-hover:translate-x-0.5 group-hover:text-[var(--md-sys-color-primary)]" />
                </Link>
              );
            })}
          </div>
        </section>

        <M3EFooter lang={lang} />
      </div>
    </HomeLayout>
  );
}
