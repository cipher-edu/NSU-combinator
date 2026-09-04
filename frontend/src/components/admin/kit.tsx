'use client'

import { TONE } from '@/lib/admin-labels'
import { useEffect, useState, type ReactNode } from 'react'

export function PageHead({
  kicker,
  title,
  lead,
  actions,
}: {
  kicker?: string
  title: string
  lead?: string
  actions?: ReactNode
}) {
  return (
    <div className="fa-head">
      <div>
        {kicker && <p className="fa-kicker">{kicker}</p>}
        <h1 className="fa-title">{title}</h1>
        {lead && <p className="fa-lead">{lead}</p>}
      </div>
      {actions && <div className="fa-head-actions">{actions}</div>}
    </div>
  )
}

export function Btn({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled,
  small,
}: {
  children: ReactNode
  onClick?: () => void
  type?: 'button' | 'submit'
  variant?: 'primary' | 'ghost' | 'danger' | 'ink'
  disabled?: boolean
  small?: boolean
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`fa-btn fa-btn-${variant}${small ? ' fa-btn-sm' : ''}`}
    >
      {children}
    </button>
  )
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: keyof typeof TONE | string }) {
  const t = (TONE[String(tone)] || tone || 'neutral') as string
  const mapped = ['neutral', 'warn', 'ok', 'bad', 'brand'].includes(t) ? t : 'neutral'
  return <span className={`fa-badge fa-badge-${mapped}`}>{children}</span>
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string
  children: ReactNode
  hint?: string
}) {
  return (
    <label className="fa-field">
      <span>{label}</span>
      {children}
      {hint && <em>{hint}</em>}
    </label>
  )
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`fa-input ${props.className || ''}`} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`fa-input fa-textarea ${props.className || ''}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`fa-input ${props.className || ''}`} />
}

export function Card({
  children,
  className = '',
  style,
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <div className={`fa-card ${className}`} style={style}>
      {children}
    </div>
  )
}

export function Table({
  columns,
  rows,
  onRow,
  empty = 'Hozircha yozuv yo‘q',
}: {
  columns: { key: string; label: string; width?: string }[]
  rows: Record<string, ReactNode>[]
  onRow?: (row: Record<string, ReactNode>) => void
  empty?: string
}) {
  if (!rows.length) {
    return <div className="fa-empty">{empty}</div>
  }
  return (
    <div className="fa-table-wrap">
      <table className="fa-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={String(r._key || i)} onClick={onRow ? () => onRow(r) : undefined} className={onRow ? 'fa-row-click' : ''}>
              {columns.map((c) => (
                <td key={c.key}>{r[c.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Drawer({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fa-drawer-root" onClick={onClose}>
      <aside className={`fa-drawer ${wide ? 'fa-drawer-wide' : ''}`} onClick={(e) => e.stopPropagation()}>
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Yopish">
            ×
          </button>
        </header>
        <div className="fa-drawer-body">{children}</div>
      </aside>
    </div>
  )
}

export function Search({
  value,
  onChange,
  placeholder = 'Qidirish',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ maxWidth: 280 }}
    />
  )
}

export function Err({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <p className="fa-err">{children}</p>
}

export function Ok({ children }: { children?: ReactNode }) {
  if (!children) return null
  return <p className="fa-ok">{children}</p>
}

export function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: ReactNode
  hint?: string
}) {
  return (
    <div className="fa-stat">
      <p className="fa-kicker">{label}</p>
      <p className="fa-stat-n">{value}</p>
      {hint && <p className="fa-stat-h">{hint}</p>}
    </div>
  )
}

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: { id: string; label: string }[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div className="fa-tabs">
      {items.map((t) => (
        <button
          key={t.id}
          type="button"
          className={t.id === value ? 'on' : ''}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

export function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return v
}
