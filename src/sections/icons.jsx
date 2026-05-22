/* Ícones inline (SVG) reutilizados pelas seções. */

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export const IconShield = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)

export const IconBalance = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 3v18M5 21h14M7 7l-4 7h8L7 7ZM17 7l-4 7h8l-4-7ZM4 7h16" />
  </svg>
)

export const IconEye = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const IconUsers = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3.5 20c0-3 2.5-5 5.5-5s5.5 2 5.5 5M16 5.3a3.2 3.2 0 0 1 0 5.4M17 15c2.6.4 4 2.4 4 5" />
  </svg>
)

export const IconDoc = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
)

export const IconLock = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3M12 15v2" />
  </svg>
)

export const IconArrow = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const IconDownload = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M12 3v12M7 11l5 5 5-5M5 21h14" />
  </svg>
)

export const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
)

export const IconUpload = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M4 15v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    <path d="M12 16V3M7 8l5-5 5 5" />
  </svg>
)

export const IconX = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
