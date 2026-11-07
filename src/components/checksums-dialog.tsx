'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  Copy,
  Download,
  FileCheck2,
  Loader2,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import { M3EShapeBadge } from '@/components/m3e-shapes';
import { useDownloadProxy } from '@/hooks/use-download-proxy';
import { cn } from '@/lib/cn';

interface ChecksumEntry {
  hash: string;
  filename: string;
}

function parseChecksums(raw: string): ChecksumEntry[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^([a-fA-F0-9]{64})\s+\*?(.+)$/);
      if (m) {
        return { hash: m[1].toLowerCase(), filename: m[2].trim() };
      }
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        return {
          hash: parts[0],
          filename: parts.slice(1).join(' ').replace(/^\*/, ''),
        };
      }
      return { hash: line, filename: '' };
    })
    .filter((entry) => !entry.filename.endsWith('.aab'));
}

const copyText = {
  title: { zh: 'SHA256 校验和', en: 'SHA256 Checksums' },
  loading: {
    zh: '正在拉取最新 SHA256 校验和...',
    en: 'Fetching latest SHA256 checksums...',
  },
  error: {
    zh: '拉取校验和失败，请重试或直接下载校验文件',
    en: 'Failed to load checksums, please retry or download the file directly',
  },
  retry: { zh: '重新拉取', en: 'Retry' },
  searchPlaceholder: {
    zh: '筛选文件名或哈希...',
    en: 'Filter by filename or hash...',
  },
  copyHash: { zh: '复制哈希', en: 'Copy hash' },
  copied: { zh: '已复制', en: 'Copied' },
  copyAll: { zh: '复制全部', en: 'Copy all' },
  downloadRaw: { zh: '下载 sha256sums.txt', en: 'Download sha256sums.txt' },
  close: { zh: '关闭', en: 'Close' },
  emptyFilter: { zh: '无匹配项', en: 'No matching entries' },
} as const;

export function ChecksumsDialog({
  checksumsUrl,
  tag,
  locale,
  label,
  githubToastMessage,
  downloadToastMessage,
  className,
}: {
  checksumsUrl: string;
  tag: string;
  locale: 'zh' | 'en';
  label: string;
  githubToastMessage?: string;
  downloadToastMessage?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rawText, setRawText] = useState<string>('');
  const [entries, setEntries] = useState<ChecksumEntry[]>([]);
  const [query, setQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const { goto } = useDownloadProxy();

  const pick = <T,>(v: { zh: T; en: T }) => v[locale] ?? v.zh;

  const fetchChecksums = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch(
        `/api/checksums?url=${encodeURIComponent(checksumsUrl)}`,
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      setRawText(text);
      setEntries(parseChecksums(text));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [checksumsUrl]);

  const handleOpen = () => {
    setOpen(true);
    void fetchChecksums();
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const copyToClipboard = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 1800);
    } catch {
      /* ignore clipboard error */
    }
  };

  const filtered = entries.filter((item) => {
    if (!query.trim()) return true;
    const q = query.trim().toLowerCase();
    return (
      item.filename.toLowerCase().includes(q) ||
      item.hash.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          'm3e-connected-item inline-flex min-h-10 cursor-pointer items-center gap-2 bg-[var(--md-sys-color-surface-container-low)] px-4.5 text-sm font-semibold text-[var(--color-fd-foreground)] select-none hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)]',
          className,
        )}
      >
        <FileCheck2 className="size-4" />
        <span>{label}</span>
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checksums-dialog-title"
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 backdrop-blur-xs sm:items-center sm:p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="relative flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[28px] border border-[var(--md-sys-color-outline-variant)]/45 bg-[var(--md-sys-color-surface-container-low)] p-5 shadow-2xl sm:rounded-[28px] sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <M3EShapeBadge
                    variant="scallop"
                    bg="var(--md-sys-color-primary-container)"
                    fg="var(--md-sys-color-on-primary-container)"
                    size="sm"
                  >
                    <FileCheck2 className="size-5" />
                  </M3EShapeBadge>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2
                        id="checksums-dialog-title"
                        className="font-brand text-lg font-semibold text-[var(--color-fd-foreground)] sm:text-xl"
                      >
                        {pick(copyText.title)}
                      </h2>
                      <span className="rounded-[10px] bg-[var(--md-sys-color-secondary-container)] px-2.5 py-0.5 text-xs font-bold text-[var(--md-sys-color-on-secondary-container)]">
                        {tag}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={pick(copyText.close)}
                  className="inline-flex size-8 cursor-pointer items-center justify-center rounded-[14px] bg-[var(--md-sys-color-surface-container)] text-[var(--md-sys-color-on-surface-variant)] transition-[border-radius,background-color,color] duration-200 ease-[var(--md-ease-emphasized)] hover:rounded-[10px] hover:bg-[var(--md-sys-color-secondary-container)] hover:text-[var(--md-sys-color-on-secondary-container)]"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* Filter bar when loaded */}
              {!loading && !error && entries.length > 0 && (
                <div className="mt-4 flex items-center gap-2 rounded-[16px] bg-[var(--md-sys-color-surface-container)] px-3.5 py-2">
                  <Search className="size-4 shrink-0 text-fd-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={pick(copyText.searchPlaceholder)}
                    className="w-full bg-transparent text-sm text-[var(--color-fd-foreground)] outline-none placeholder:text-fd-muted-foreground"
                  />
                </div>
              )}

              {/* Content area */}
              <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-[20px] bg-[var(--md-sys-color-surface-container)] py-14 text-sm text-fd-muted-foreground">
                    <Loader2 className="size-6 animate-spin text-[var(--md-sys-color-primary)]" />
                    <span>{pick(copyText.loading)}</span>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center gap-3 rounded-[20px] bg-[var(--md-sys-color-surface-container)] px-4 py-12 text-center">
                    <p className="text-sm text-fd-muted-foreground">
                      {pick(copyText.error)}
                    </p>
                    <button
                      type="button"
                      onClick={() => void fetchChecksums()}
                      className="m3e-morph-pill inline-flex min-h-10 cursor-pointer items-center gap-2 bg-[var(--md-sys-color-primary-container)] px-4 text-sm font-semibold text-[var(--md-sys-color-on-primary-container)] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)]"
                    >
                      <RefreshCw className="size-4" />
                      <span>{pick(copyText.retry)}</span>
                    </button>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="rounded-[20px] bg-[var(--md-sys-color-surface-container)] py-10 text-center text-sm text-fd-muted-foreground">
                    {pick(copyText.emptyFilter)}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1 overflow-hidden rounded-[20px]">
                    {filtered.map((item) => {
                      const key = item.filename || item.hash;
                      const isCopied = copiedKey === key;
                      return (
                        <div
                          key={key}
                          className="flex flex-col gap-1 rounded-[8px] first:rounded-t-[20px] last:rounded-b-[20px] bg-[var(--md-sys-color-surface-container)] px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            {item.filename && (
                              <div className="font-brand truncate text-xs font-semibold text-[var(--color-fd-foreground)] sm:text-sm">
                                {item.filename}
                              </div>
                            )}
                            <div className="truncate font-mono text-[11px] text-fd-muted-foreground sm:text-xs">
                              {item.hash}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => void copyToClipboard(item.hash, key)}
                            className="inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 self-end rounded-[12px] bg-[var(--md-sys-color-secondary-container)] px-3 text-xs font-semibold text-[var(--md-sys-color-on-secondary-container)] transition-[border-radius,background-color,color] duration-200 ease-[var(--md-ease-emphasized)] hover:rounded-[8px] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)] sm:self-center"
                          >
                            {isCopied ? (
                              <>
                                <Check className="size-3.5" />
                                <span>{pick(copyText.copied)}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="size-3.5" />
                                <span>{pick(copyText.copyHash)}</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer actions */}
              <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                {!loading && !error && rawText && (
                  <button
                    type="button"
                    onClick={() => void copyToClipboard(rawText, '__all__')}
                    className="m3e-morph-pill inline-flex min-h-10 cursor-pointer items-center gap-2 bg-[var(--md-sys-color-secondary-container)] px-4 text-xs font-semibold text-[var(--md-sys-color-on-secondary-container)] hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)] sm:text-sm"
                  >
                    {copiedKey === '__all__' ? (
                      <>
                        <Check className="size-4" />
                        <span>{pick(copyText.copied)}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        <span>{pick(copyText.copyAll)}</span>
                      </>
                    )}
                  </button>
                )}
                <a
                  href={checksumsUrl}
                  onClick={(e) => {
                    e.preventDefault();
                    goto(
                      checksumsUrl,
                      githubToastMessage,
                      downloadToastMessage,
                    );
                  }}
                  className="m3e-morph-pill inline-flex min-h-10 items-center gap-2 bg-[var(--md-sys-color-primary)] px-4 text-xs font-semibold text-[var(--md-sys-color-on-primary)] no-underline hover:brightness-105 sm:text-sm"
                >
                  <Download className="size-4" />
                  <span>{pick(copyText.downloadRaw)}</span>
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
