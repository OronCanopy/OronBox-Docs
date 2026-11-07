'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  KeyRound,
  Smartphone,
  Watch,
} from 'lucide-react';
import { withLocale } from '@/lib/i18n';
import { M3EHeroBackdrop } from '@/components/m3e-hero-backdrop';
import { M3EShapeBadge } from '@/components/m3e-shapes';

type Locale = 'zh' | 'en';

const copy = {
  badge: {
    deviceQr: { zh: '设备连接分享', en: 'Shared Device Link' },
    resv2: { zh: '社区资源跳转', en: 'Community Resource Link' },
    generic: { zh: '应用唤起链接', en: 'Deep Link Redirect' },
  },
  title: {
    zh: '正在唤起 OronBox',
    en: 'Opening in OronBox',
  },
  subtitle: {
    zh: '若浏览器弹出确认提示，请点击「打开 OronBox」继续',
    en: 'If your browser prompts for confirmation, click "Open OronBox" to continue',
  },
  fields: {
    deviceName: { zh: '设备名称', en: 'Device name' },
    macAddress: { zh: '蓝牙地址 (MAC)', en: 'Bluetooth MAC' },
    authKey: { zh: '连接密钥 (AuthKey)', en: 'AuthKey' },
    resourceId: { zh: '资源 ID', en: 'Resource ID' },
  },
  actions: {
    openApp: { zh: '立即打开 OronBox', en: 'Open OronBox Now' },
    copyLink: { zh: '复制链接', en: 'Copy Link' },
    copied: { zh: '已复制链接', en: 'Link Copied' },
    downloadClient: { zh: '下载客户端', en: 'Download Client' },
    openWeb: { zh: '在 Web 版中打开', en: 'Open in Web App' },
  },
  hint: {
    zh: '还没有安装 OronBox？你可以前往下载对应平台客户端，或复制上方链接在客户端「设备切换 → 导入」中粘贴使用',
    en: "Don't have OronBox installed yet? Download the client for your platform, or copy this link and paste it into Device Switch → Import",
  },
  invalid: {
    title: { zh: '未检测到唤起参数', en: 'No Deep Link Parameters Found' },
    description: {
      zh: '该链接不包含有效的设备或资源参数，请确认二维码或分享链接是否完整',
      en: 'This URL does not contain valid device or resource parameters. Please check if the QR code or shared link is complete',
    },
    backHome: { zh: '返回首页', en: 'Back to Home' },
  },
} as const;

function formatMacDisplay(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (
    !/^(?:[0-9a-fA-F]{12}|(?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}|(?:[0-9a-fA-F]{2}-){5}[0-9a-fA-F]{2})$/.test(
      trimmed,
    )
  ) {
    return trimmed;
  }
  const compact = trimmed.replace(/[:-]/g, '').toUpperCase();
  return Array.from({ length: 6 }, (_, i) =>
    compact.slice(i * 2, i * 2 + 2),
  ).join(':');
}

function maskAuthKey(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (trimmed.length <= 10) return trimmed;
  return `${trimmed.slice(0, 6)}••••••${trimmed.slice(-6)}`;
}

export function OpenRedirectCard({
  lang,
  query,
}: {
  lang: string;
  query: Record<string, string>;
}) {
  const locale: Locale = lang === 'en' ? 'en' : 'zh';
  const pick = <T,>(v: { zh: T; en: T }) => v[locale] ?? v.zh;

  const [copied, setCopied] = useState(false);

  const searchParams = new URLSearchParams(query);
  const queryString = searchParams.toString();
  const hasParams = queryString.length > 0;
  const deepLink = hasParams ? `oronbox://open?${queryString}` : 'oronbox://open';
  const webLink = hasParams ? `/web?${queryString}` : '/web';

  const source = (query.source ?? '').toLowerCase();
  const deviceName = query.name?.trim() || null;
  const macFormatted = formatMacDisplay(query.mac ?? query.addr);
  const authKeyMasked = maskAuthKey(query.authkey);
  const resourceId = query.id?.trim() || null;

  useEffect(() => {
    if (!hasParams) return;
    const timer = window.setTimeout(() => {
      window.location.assign(deepLink);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [deepLink, hasParams]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard errors
    }
  };

  if (!hasParams) {
    return (
      <section className="relative isolate overflow-hidden rounded-[32px] bg-[var(--md-sys-color-surface-container-low)] px-6 py-12 text-center sm:px-10 sm:py-16">
        <M3EHeroBackdrop variant="download" />
        <div className="relative z-10 mx-auto flex max-w-lg flex-col items-center gap-4">
          <M3EShapeBadge
            variant="scallop"
            bg="var(--md-custom-color-amber-container)"
            fg="var(--md-custom-color-on-amber-container)"
          >
            <Smartphone className="size-5" />
          </M3EShapeBadge>
          <h1 className="font-brand text-2xl font-semibold tracking-tight text-[var(--color-fd-foreground)] sm:text-3xl">
            {pick(copy.invalid.title)}
          </h1>
          <p className="text-sm leading-relaxed text-fd-muted-foreground sm:text-base">
            {pick(copy.invalid.description)}
          </p>
          <Link
            href={withLocale(lang, '/')}
            className="m3e-morph-pill mt-2 inline-flex min-h-11 items-center gap-2 bg-[var(--md-sys-color-primary)] px-6 text-sm font-semibold text-[var(--md-sys-color-on-primary)] no-underline"
          >
            {pick(copy.invalid.backHome)}
          </Link>
        </div>
      </section>
    );
  }

  const badgeLabel =
    source === 'deviceqr'
      ? pick(copy.badge.deviceQr)
      : source === 'resv2'
        ? pick(copy.badge.resv2)
        : pick(copy.badge.generic);

  return (
    <div className="flex flex-col gap-1.5 overflow-hidden rounded-[32px]">
      {/* Top Hero Card */}
      <section className="relative isolate overflow-hidden rounded-t-[32px] rounded-b-[12px] bg-[var(--md-sys-color-surface-container-low)] px-6 py-10 text-center sm:px-10 sm:py-12">
        <M3EHeroBackdrop variant="home" />

        <div className="relative z-10 mx-auto flex max-w-xl flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-[18px] bg-[var(--md-sys-color-surface-container)] px-3.5 py-1 text-xs font-semibold text-[var(--md-sys-color-on-surface-variant)]">
            <Watch className="size-3.5 text-[var(--md-sys-color-primary)]" />
            <span>{badgeLabel}</span>
          </div>

          <h1 className="font-brand text-[clamp(28px,4.5vw,44px)] font-semibold leading-tight tracking-[-0.025em] text-[var(--color-fd-foreground)]">
            {deviceName ?? pick(copy.title)}
          </h1>

          <p className="text-sm leading-relaxed text-fd-muted-foreground sm:text-base">
            {pick(copy.subtitle)}
          </p>

          {/* Device / Resource Summary Chips */}
          {(deviceName || macFormatted || authKeyMasked || resourceId) && (
            <div className="mt-2 grid w-full max-w-md gap-1.5 overflow-hidden rounded-[22px] text-left sm:grid-cols-2">
              {macFormatted && (
                <div className="flex flex-col gap-0.5 rounded-[10px] bg-[var(--md-sys-color-surface-container)] px-4 py-3">
                  <span className="text-[11px] font-medium text-fd-muted-foreground">
                    {pick(copy.fields.macAddress)}
                  </span>
                  <span className="font-mono text-sm font-semibold text-[var(--color-fd-foreground)]">
                    {macFormatted}
                  </span>
                </div>
              )}
              {authKeyMasked && (
                <div className="flex flex-col gap-0.5 rounded-[10px] bg-[var(--md-sys-color-surface-container)] px-4 py-3">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-fd-muted-foreground">
                    <KeyRound className="size-3" />
                    {pick(copy.fields.authKey)}
                  </span>
                  <span className="font-mono text-sm font-semibold text-[var(--color-fd-foreground)]">
                    {authKeyMasked}
                  </span>
                </div>
              )}
              {resourceId && (
                <div className="flex flex-col gap-0.5 rounded-[10px] bg-[var(--md-sys-color-surface-container)] px-4 py-3 sm:col-span-2">
                  <span className="text-[11px] font-medium text-fd-muted-foreground">
                    {pick(copy.fields.resourceId)}
                  </span>
                  <span className="font-mono text-sm font-semibold text-[var(--color-fd-foreground)]">
                    {resourceId}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Primary & Connected Actions */}
          <div className="mt-4 flex flex-col items-center gap-2.5">
            <a
              href={deepLink}
              className="m3e-morph-pill inline-flex min-h-12 items-center justify-center gap-2 bg-[var(--md-sys-color-primary)] px-7 text-sm font-semibold text-[var(--md-sys-color-on-primary)] no-underline hover:brightness-105 sm:text-base"
            >
              <ExternalLink className="size-4 shrink-0" />
              <span>{pick(copy.actions.openApp)}</span>
            </a>

            <div className="m3e-connected-group flex flex-wrap items-center justify-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                className="m3e-connected-item inline-flex min-h-10 cursor-pointer items-center gap-1.5 bg-[var(--md-sys-color-secondary-container)] px-4 text-xs font-semibold text-[var(--md-sys-color-on-secondary-container)] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] sm:text-sm"
              >
                {copied ? (
                  <Check className="size-4 shrink-0" />
                ) : (
                  <Copy className="size-4 shrink-0" />
                )}
                <span>
                  {copied
                    ? pick(copy.actions.copied)
                    : pick(copy.actions.copyLink)}
                </span>
              </button>
              <Link
                href={withLocale(lang, '/download')}
                className="m3e-connected-item inline-flex min-h-10 items-center gap-1.5 bg-[var(--md-sys-color-secondary-container)] px-4 text-xs font-semibold text-[var(--md-sys-color-on-secondary-container)] no-underline hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] sm:text-sm"
              >
                <Download className="size-4 shrink-0" />
                <span>{pick(copy.actions.downloadClient)}</span>
              </Link>
              <a
                href={webLink}
                className="m3e-connected-item inline-flex min-h-10 items-center gap-1.5 bg-[var(--md-sys-color-secondary-container)] px-4 text-xs font-semibold text-[var(--md-sys-color-on-secondary-container)] no-underline hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] sm:text-sm"
              >
                <Smartphone className="size-4 shrink-0" />
                <span>{pick(copy.actions.openWeb)}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Hint Bar */}
      <section className="rounded-t-[12px] rounded-b-[32px] bg-[var(--md-sys-color-surface-container-low)] px-6 py-4 text-center text-xs leading-relaxed text-fd-muted-foreground sm:text-sm">
        {pick(copy.hint)}
      </section>
    </div>
  );
}
