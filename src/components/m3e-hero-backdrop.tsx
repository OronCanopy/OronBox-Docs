import type { CSSProperties } from 'react';

/**
 * Ambient Material 3 Expressive geometric backdrop for Hero cards.
 * Renders 6 expressive M3E vector shapes (Scallop, Clover, Pill, Sunny,
 * Hexagon, Squircle) that softly bloom in on load and drift in the background.
 */
export function M3EHeroBackdrop({
  variant = 'home',
}: {
  variant?: 'home' | 'download';
}) {
  if (variant === 'download') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none"
      >
        {/* 1. Top-right: Large Scallop */}
        <svg
          viewBox="0 0 100 100"
          className="m3e-ambient-drift-1 absolute -top-14 -right-12 size-48 opacity-65 sm:size-64"
        >
          <g
            className="m3e-shape-enter"
            style={{ '--shape-delay': '0ms' } as CSSProperties}
          >
            <path
              d="M50 3C56.8 3 61.7 8.9 67.8 11.4C73.9 13.9 81.6 12.1 86.3 16.7C90.9 21.4 89.1 29.1 91.6 35.2C94.1 41.3 100 46.2 100 53C100 59.8 94.1 64.7 91.6 70.8C89.1 76.9 90.9 84.6 86.3 89.3C81.6 93.9 73.9 92.1 67.8 94.6C61.7 97.1 56.8 100 50 100C43.2 100 38.3 97.1 32.2 94.6C26.1 92.1 18.4 93.9 13.7 89.3C9.1 84.6 10.9 76.9 8.4 70.8C5.9 64.7 0 59.8 0 53C0 46.2 5.9 41.3 8.4 35.2C10.9 29.1 9.1 21.4 13.7 16.7C18.4 12.1 26.1 13.9 32.2 11.4C38.3 8.9 43.2 3 50 3Z"
              fill="var(--md-sys-color-primary-container)"
            />
          </g>
        </svg>

        {/* 2. Bottom-left: Tilted Pill */}
        <svg
          viewBox="0 0 100 100"
          className="m3e-ambient-drift-2 absolute -bottom-16 -left-12 size-48 opacity-65 sm:size-60"
        >
          <g
            className="m3e-shape-enter"
            style={{ '--shape-delay': '60ms' } as CSSProperties}
          >
            <rect
              x="8"
              y="16"
              width="84"
              height="68"
              rx="34"
              transform="rotate(16 50 50)"
              fill="var(--md-sys-color-secondary-container)"
            />
          </g>
        </svg>

        {/* 3. Top-left: 4-Leaf Clover */}
        <svg
          viewBox="0 0 100 100"
          className="m3e-ambient-drift-3 absolute -top-10 left-[6%] size-28 opacity-55 sm:size-36"
        >
          <g
            className="m3e-shape-enter"
            style={{ '--shape-delay': '120ms' } as CSSProperties}
          >
            <path
              d="M32 6C41 6 46 12 50 12C54 12 59 6 68 6C82 6 94 18 94 32C94 41 88 46 88 50C88 54 94 59 94 68C94 82 82 94 68 94C59 94 54 88 50 88C46 88 41 94 32 94C18 94 6 82 6 68C6 59 12 54 12 50C12 46 6 41 6 32C6 18 18 6 32 6Z"
              fill="var(--md-sys-color-tertiary-container)"
            />
          </g>
        </svg>

        {/* 4. Bottom-right: Soft Hexagon */}
        <svg
          viewBox="0 0 100 100"
          className="m3e-ambient-drift-4 absolute right-[8%] -bottom-10 size-28 opacity-55 sm:size-36"
        >
          <g
            className="m3e-shape-enter"
            style={{ '--shape-delay': '180ms' } as CSSProperties}
          >
            <path
              d="M42 6.6C46.9 3.8 53.1 3.8 58 6.6L84.8 22.1C89.7 24.9 92.8 30.2 92.8 35.9V64.1C92.8 69.8 89.7 75.1 84.8 77.9L58 93.4C53.1 96.2 46.9 96.2 42 93.4L15.2 77.9C10.3 75.1 7.2 69.8 7.2 64.1V35.9C7.2 30.2 10.3 24.9 15.2 22.1L42 6.6Z"
              fill="var(--md-custom-color-teal-container)"
            />
          </g>
        </svg>

        {/* 5. Mid-left: Sunny Starburst */}
        <svg
          viewBox="0 0 100 100"
          className="m3e-ambient-spin absolute top-[38%] -left-6 size-16 opacity-45 sm:left-[14%] sm:size-20"
        >
          <g
            className="m3e-shape-enter"
            style={{ '--shape-delay': '240ms' } as CSSProperties}
          >
            <path
              d="M50 2L58.5 11.2L70.5 7.5L74.2 19.5L86.8 21.8L85.2 34.3L96 41.2L89.5 52L96 62.8L85.2 69.7L86.8 82.2L74.2 84.5L70.5 96.5L58.5 92.8L50 100L41.5 92.8L29.5 96.5L25.8 84.5L13.2 82.2L14.8 69.7L4 62.8L10.5 52L4 41.2L14.8 34.3L13.2 21.8L25.8 19.5L29.5 7.5L41.5 11.2L50 2Z"
              fill="var(--md-custom-color-amber-container)"
              stroke="var(--md-custom-color-amber-container)"
              strokeWidth="6"
              strokeLinejoin="round"
            />
          </g>
        </svg>

        {/* 6. Mid-right: Squircle (shifted just clear of the top-right Scallop) */}
        <svg
          viewBox="0 0 100 100"
          className="m3e-ambient-drift-2 absolute top-[36%] right-[24%] hidden size-14 opacity-45 sm:block"
        >
          <g
            className="m3e-shape-enter"
            style={{ '--shape-delay': '300ms' } as CSSProperties}
          >
            <path
              d="M50 4C82 4 96 18 96 50C96 82 82 96 50 96C18 96 4 82 4 50C4 18 18 4 50 4Z"
              fill="var(--md-custom-color-blue-container)"
            />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {/* 1. Top-left: Large Scallop */}
      <svg
        viewBox="0 0 100 100"
        className="m3e-ambient-drift-1 absolute -top-14 -left-14 size-52 opacity-65 sm:size-68"
      >
        <g
          className="m3e-shape-enter"
          style={{ '--shape-delay': '0ms' } as CSSProperties}
        >
          <path
            d="M50 3C56.8 3 61.7 8.9 67.8 11.4C73.9 13.9 81.6 12.1 86.3 16.7C90.9 21.4 89.1 29.1 91.6 35.2C94.1 41.3 100 46.2 100 53C100 59.8 94.1 64.7 91.6 70.8C89.1 76.9 90.9 84.6 86.3 89.3C81.6 93.9 73.9 92.1 67.8 94.6C61.7 97.1 56.8 100 50 100C43.2 100 38.3 97.1 32.2 94.6C26.1 92.1 18.4 93.9 13.7 89.3C9.1 84.6 10.9 76.9 8.4 70.8C5.9 64.7 0 59.8 0 53C0 46.2 5.9 41.3 8.4 35.2C10.9 29.1 9.1 21.4 13.7 16.7C18.4 12.1 26.1 13.9 32.2 11.4C38.3 8.9 43.2 3 50 3Z"
            fill="var(--md-sys-color-primary-container)"
          />
        </g>
      </svg>

      {/* 2. Bottom-right: Tilted Pill */}
      <svg
        viewBox="0 0 100 100"
        className="m3e-ambient-drift-2 absolute -right-12 -bottom-16 size-52 opacity-70 sm:size-64"
      >
        <g
          className="m3e-shape-enter"
          style={{ '--shape-delay': '60ms' } as CSSProperties}
        >
          <rect
            x="8"
            y="16"
            width="84"
            height="68"
            rx="34"
            transform="rotate(-16 50 50)"
            fill="var(--md-sys-color-tertiary-container)"
          />
        </g>
      </svg>

      {/* 3. Top-right: 4-Leaf Clover */}
      <svg
        viewBox="0 0 100 100"
        className="m3e-ambient-drift-3 absolute -top-10 right-[6%] size-32 opacity-55 sm:size-40"
      >
        <g
          className="m3e-shape-enter"
          style={{ '--shape-delay': '120ms' } as CSSProperties}
        >
          <path
            d="M32 6C41 6 46 12 50 12C54 12 59 6 68 6C82 6 94 18 94 32C94 41 88 46 88 50C88 54 94 59 94 68C94 82 82 94 68 94C59 94 54 88 50 88C46 88 41 94 32 94C18 94 6 82 6 68C6 59 12 54 12 50C12 46 6 41 6 32C6 18 18 6 32 6Z"
            fill="var(--md-sys-color-secondary-container)"
          />
        </g>
      </svg>

      {/* 4. Bottom-left: Soft Hexagon */}
      <svg
        viewBox="0 0 100 100"
        className="m3e-ambient-drift-4 absolute -bottom-12 left-[6%] size-32 opacity-55 sm:size-40"
      >
        <g
          className="m3e-shape-enter"
          style={{ '--shape-delay': '180ms' } as CSSProperties}
        >
          <path
            d="M42 6.6C46.9 3.8 53.1 3.8 58 6.6L84.8 22.1C89.7 24.9 92.8 30.2 92.8 35.9V64.1C92.8 69.8 89.7 75.1 84.8 77.9L58 93.4C53.1 96.2 46.9 96.2 42 93.4L15.2 77.9C10.3 75.1 7.2 69.8 7.2 64.1V35.9C7.2 30.2 10.3 24.9 15.2 22.1L42 6.6Z"
            fill="var(--md-custom-color-blue-container)"
          />
        </g>
      </svg>

      {/* 5. Mid-right: Sunny Starburst */}
      <svg
        viewBox="0 0 100 100"
        className="m3e-ambient-spin absolute top-[42%] -right-6 size-18 opacity-45 sm:right-[11%] sm:size-22"
      >
        <g
          className="m3e-shape-enter"
          style={{ '--shape-delay': '240ms' } as CSSProperties}
        >
          <path
            d="M50 2L58.5 11.2L70.5 7.5L74.2 19.5L86.8 21.8L85.2 34.3L96 41.2L89.5 52L96 62.8L85.2 69.7L86.8 82.2L74.2 84.5L70.5 96.5L58.5 92.8L50 100L41.5 92.8L29.5 96.5L25.8 84.5L13.2 82.2L14.8 69.7L4 62.8L10.5 52L4 41.2L14.8 34.3L13.2 21.8L25.8 19.5L29.5 7.5L41.5 11.2L50 2Z"
            fill="var(--md-custom-color-amber-container)"
            stroke="var(--md-custom-color-amber-container)"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      {/* 6. Mid-left: Squircle (shifted just clear of the top-left Scallop) */}
      <svg
        viewBox="0 0 100 100"
        className="m3e-ambient-drift-3 absolute top-[44%] left-[22%] hidden size-16 opacity-45 sm:block"
      >
        <g
          className="m3e-shape-enter"
          style={{ '--shape-delay': '300ms' } as CSSProperties}
        >
          <path
            d="M50 4C82 4 96 18 96 50C96 82 82 96 50 96C18 96 4 82 4 50C4 18 18 4 50 4Z"
            fill="var(--md-custom-color-teal-container)"
          />
        </g>
      </svg>
    </div>
  );
}
