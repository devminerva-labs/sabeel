import type { ReactNode } from 'react'

interface ArabicTextProps {
  children: ReactNode
  className?: string
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3'
}

export function ArabicText({ children, className = '', as: Tag = 'span' }: ArabicTextProps) {
  return (
    <Tag dir="rtl" lang="ar" className={className}>
      {children}
    </Tag>
  )
}
