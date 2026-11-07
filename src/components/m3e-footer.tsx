const BUILD_TIMESTAMP = (() => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
})();

const BUILD_YEAR = new Date().getFullYear();

export function M3EFooter({
  lang = 'zh',
  className = '',
}: {
  lang?: string;
  className?: string;
}) {
  const isEn = lang === 'en';

  return (
    <footer
      className={`not-prose relative isolate mt-4 flex flex-col justify-between gap-4 overflow-hidden rounded-[28px] bg-[var(--md-sys-color-surface-container-low)] px-6 py-5 text-xs leading-relaxed text-fd-muted-foreground sm:flex-row sm:items-end sm:px-7 sm:py-6 ${className}`}
    >
      {/* Subtle M3E geometric corner accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        <svg
          viewBox="0 0 100 100"
          className="m3e-ambient-drift-1 absolute -top-12 -right-10 size-36 opacity-50"
        >
          <path
            d="M50 3C56.8 3 61.7 8.9 67.8 11.4C73.9 13.9 81.6 12.1 86.3 16.7C90.9 21.4 89.1 29.1 91.6 35.2C94.1 41.3 100 46.2 100 53C100 59.8 94.1 64.7 91.6 70.8C89.1 76.9 90.9 84.6 86.3 89.3C81.6 93.9 73.9 92.1 67.8 94.6C61.7 97.1 56.8 100 50 100C43.2 100 38.3 97.1 32.2 94.6C26.1 92.1 18.4 93.9 13.7 89.3C9.1 84.6 10.9 76.9 8.4 70.8C5.9 64.7 0 59.8 0 53C0 46.2 5.9 41.3 8.4 35.2C10.9 29.1 9.1 21.4 13.7 16.7C18.4 12.1 26.1 13.9 32.2 11.4C38.3 8.9 43.2 3 50 3Z"
            fill="var(--md-sys-color-primary-container)"
          />
        </svg>
        <svg
          viewBox="0 0 100 100"
          className="m3e-ambient-drift-3 absolute -bottom-10 left-[38%] hidden size-24 opacity-40 sm:block"
        >
          <path
            d="M32 6C41 6 46 12 50 12C54 12 59 6 68 6C82 6 94 18 94 32C94 41 88 46 88 50C88 54 94 59 94 68C94 82 82 94 68 94C59 94 54 88 50 88C46 88 41 94 32 94C18 94 6 82 6 68C6 59 12 54 12 50C12 46 6 41 6 32C6 18 18 6 32 6Z"
            fill="var(--md-sys-color-secondary-container)"
          />
        </svg>
      </div>

      {/* Left: Brand Title + Copyright + License + Build Time */}
      <div className="relative z-10 flex flex-col gap-1">
        <div className="font-brand mb-1 text-lg font-semibold tracking-tight text-[var(--color-fd-foreground)] sm:text-xl">
          OronCanopy
        </div>
        <div>
          {isEn ? `Copyright © ${BUILD_YEAR}` : `版权所有 ${BUILD_YEAR}`}
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <span>
            {isEn ? 'Documentation licensed under' : '文档内容遵循'}
          </span>
          <a
            href={
              isEn
                ? 'https://creativecommons.org/licenses/by-nc-sa/4.0/'
                : 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh-hans'
            }
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center rounded-[10px] bg-[var(--md-sys-color-primary-container)] px-2 py-0.5 text-[11px] font-semibold text-[var(--md-sys-color-on-primary-container)] no-underline transition-[border-radius,background-color,color] duration-200 ease-[var(--md-ease-emphasized)] hover:rounded-[6px] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)]"
          >
            CC BY-NC-SA 4.0
          </a>
          {!isEn && <span>协议共享</span>}
        </div>
        <div className="text-[var(--md-sys-color-on-surface-variant)]/70">
          {isEn
            ? `Built at ${BUILD_TIMESTAMP}`
            : `构建于 ${BUILD_TIMESTAMP}`}
        </div>
      </div>

      {/* Right: QQ Group + Connected Repository Pills */}
      <div className="relative z-10 flex flex-col items-start gap-2 sm:items-end sm:text-right">
        <a
          href="https://qm.qq.com/q/il3TbmJlKM"
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-8 items-center rounded-[16px] bg-[var(--md-sys-color-secondary-container)] px-3.5 py-1 text-xs font-semibold text-[var(--md-sys-color-on-secondary-container)] no-underline transition-[border-radius,background-color,color] duration-200 ease-[var(--md-ease-emphasized)] hover:rounded-[10px] hover:bg-[var(--md-sys-color-primary)] hover:text-[var(--md-sys-color-on-primary)]"
        >
          {isEn ? 'QQ Group: 2163057031' : 'QQ 群: 2163057031'}
        </a>
        <div className="m3e-connected-group inline-flex flex-wrap items-center gap-1">
          <a
            href="https://github.com/OronCanopy/OronBox"
            target="_blank"
            rel="noreferrer noopener"
            className="m3e-connected-item inline-flex min-h-7 items-center bg-[var(--md-sys-color-surface-container)] px-3 text-xs font-medium text-[var(--color-fd-foreground)] no-underline hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)]"
          >
            OronBox
          </a>
          <a
            href="https://github.com/OronCanopy/OronBox-Docs"
            target="_blank"
            rel="noreferrer noopener"
            className="m3e-connected-item inline-flex min-h-7 items-center bg-[var(--md-sys-color-surface-container)] px-3 text-xs font-medium text-[var(--color-fd-foreground)] no-underline hover:bg-[var(--md-sys-color-primary-container)] hover:text-[var(--md-sys-color-on-primary-container)]"
          >
            OronBox Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
