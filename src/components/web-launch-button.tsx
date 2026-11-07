'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Download,
  Globe,
  X,
  XCircle,
} from 'lucide-react';
import { M3EShapeBadge } from '@/components/m3e-shapes';
import { cn } from '@/lib/cn';

interface BrowserCapabilities {
  webSerial: boolean;
  webBluetooth: boolean;
  wasm: boolean;
  secureContext: boolean;
}

function inspectCapabilities(): BrowserCapabilities {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      webSerial: false,
      webBluetooth: false,
      wasm: false,
      secureContext: false,
    };
  }
  return {
    webSerial: 'serial' in navigator,
    webBluetooth: 'bluetooth' in navigator,
    wasm: typeof WebAssembly === 'object',
    secureContext: Boolean(window.isSecureContext),
  };
}

const dialogCopy = {
  title: {
    zh: '当前浏览器不支持 Web Serial',
    en: 'Web Serial is not supported in this browser',
  },
  description: {
    zh: 'OronBox Web 版需通过 Web Serial 连接穿戴设备\n建议使用桌面版 Chrome 或 Edge 打开，或下载对应平台的客户端',
    en: 'OronBox Web requires Web Serial to connect to wearable devices\nUse desktop Chrome or Edge, or download the native client for your platform',
  },
  items: {
    webSerial: {
      label: 'Web Serial API',
      hint: { zh: '串口与调试桥设备连接', en: 'Serial & bridge device connection' },
    },
    webBluetooth: {
      label: 'Web Bluetooth API',
      hint: { zh: 'BLE 蓝牙低功耗连接', en: 'BLE low-energy connection' },
    },
    wasm: {
      label: 'WebAssembly',
      hint: { zh: '应用核心与插件运行时', en: 'App core & plugin runtime' },
    },
  },
  status: {
    supported: { zh: '可用', en: 'Available' },
    unsupported: { zh: '不可用', en: 'Unavailable' },
  },
  actions: {
    download: { zh: '前往下载客户端', en: 'Download client' },
    continueAnyway: { zh: '仍要打开 Web 版', en: 'Open web version anyway' },
    close: { zh: '关闭', en: 'Close' },
  },
} as const;

export function WebLaunchButton({
  href = '/web',
  downloadHref,
  locale,
  children,
  className,
}: {
  href?: string;
  downloadHref: string;
  locale: 'zh' | 'en';
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [caps, setCaps] = useState<BrowserCapabilities | null>(null);
  const pick = <T,>(v: { zh: T; en: T }) => v[locale] ?? v.zh;

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const detected = inspectCapabilities();
    if (detected.webSerial && detected.wasm && detected.secureContext) {
      return;
    }
    e.preventDefault();
    setCaps(detected);
    setOpen(true);
  };

  const rows = caps
    ? [
        {
          key: 'webSerial',
          label: dialogCopy.items.webSerial.label,
          hint: pick(dialogCopy.items.webSerial.hint),
          ok: caps.webSerial,
        },
        {
          key: 'webBluetooth',
          label: dialogCopy.items.webBluetooth.label,
          hint: pick(dialogCopy.items.webBluetooth.hint),
          ok: caps.webBluetooth,
        },
        {
          key: 'wasm',
          label: dialogCopy.items.wasm.label,
          hint: pick(dialogCopy.items.wasm.hint),
          ok: caps.wasm,
        },
      ]
    : [];

  return (
    <>
      <a
        href={href}
        onClick={handleClick}
        className={cn(
          'm3e-connected-item inline-flex min-h-11 items-center justify-center gap-2 bg-[var(--md-sys-color-secondary-container)] px-4.5 text-sm font-semibold text-[var(--md-sys-color-on-secondary-container)] no-underline select-none hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)]',
          className,
        )}
      >
        <Globe className="size-4 shrink-0" />
        <span>{children}</span>
      </a>

      {open &&
        caps &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="web-capability-dialog-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative w-full max-w-md rounded-[28px] border border-[var(--md-sys-color-outline-variant)]/45 bg-[var(--md-sys-color-surface-container-low)] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={pick(dialogCopy.actions.close)}
                className="absolute top-5 right-5 inline-flex size-8 items-center justify-center rounded-[14px] bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)] transition-[border-radius,background-color,color] duration-200 ease-[var(--md-ease-emphasized)] hover:rounded-[10px] hover:bg-[var(--md-sys-color-secondary-container)] hover:text-[var(--md-sys-color-on-secondary-container)]"
              >
                <X className="size-4" />
              </button>

              <div className="flex items-center gap-3.5 pr-8">
                <M3EShapeBadge
                  variant="hexagon"
                  bg="var(--md-custom-color-amber-container)"
                  fg="var(--md-custom-color-on-amber-container)"
                  size="sm"
                >
                  <AlertTriangle className="size-5" />
                </M3EShapeBadge>
                <h2
                  id="web-capability-dialog-title"
                  className="font-brand text-lg font-semibold leading-snug text-[var(--color-fd-foreground)] sm:text-xl"
                >
                  {pick(dialogCopy.title)}
                </h2>
              </div>

              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-fd-muted-foreground">
                {pick(dialogCopy.description)}
              </p>

              <div className="mt-4 flex flex-col gap-1 overflow-hidden rounded-[20px]">
                {rows.map((row) => (
                  <div
                    key={row.key}
                    className="flex items-center justify-between gap-3 rounded-[8px] first:rounded-t-[20px] last:rounded-b-[20px] bg-[var(--md-sys-color-surface-container)] px-4 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="font-brand text-sm font-semibold text-[var(--color-fd-foreground)]">
                        {row.label}
                      </div>
                      <div className="text-xs text-fd-muted-foreground">
                        {row.hint}
                      </div>
                    </div>
                    <span
                      className={cn(
                        'inline-flex shrink-0 items-center gap-1.5 rounded-[12px] px-2.5 py-1 text-xs font-semibold',
                        row.ok
                          ? 'bg-[var(--md-custom-color-teal-container)] text-[var(--md-custom-color-on-teal-container)]'
                          : 'bg-[var(--md-custom-color-amber-container)] text-[var(--md-custom-color-on-amber-container)]',
                      )}
                    >
                      {row.ok ? (
                        <CheckCircle2 className="size-3.5" />
                      ) : (
                        <XCircle className="size-3.5" />
                      )}
                      <span>
                        {row.ok
                          ? pick(dialogCopy.status.supported)
                          : pick(dialogCopy.status.unsupported)}
                      </span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <Link
                  href={downloadHref}
                  onClick={() => setOpen(false)}
                  className="m3e-morph-pill inline-flex min-h-11 flex-1 items-center justify-center gap-2 bg-[var(--md-sys-color-primary)] px-4 text-sm font-semibold text-[var(--md-sys-color-on-primary)] no-underline hover:brightness-105"
                >
                  <Download className="size-4 shrink-0" />
                  <span>{pick(dialogCopy.actions.download)}</span>
                </Link>
                <a
                  href={href}
                  className="m3e-morph-pill inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 bg-[var(--md-sys-color-secondary-container)] px-4 text-sm font-semibold text-[var(--md-sys-color-on-secondary-container)] no-underline hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)]"
                >
                  <span>{pick(dialogCopy.actions.continueAnyway)}</span>
                  <ArrowRight className="size-4 shrink-0" />
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
