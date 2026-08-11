import { useState } from 'react'
import { cn } from '../../utils/cn'
import { initials } from '../../utils/format'

export default function Avatar({ name, src, size = 'md', className }) {
  const [failed, setFailed] = useState(false)
  const sizes = {
    sm: 'h-10 w-10 text-sm',
    md: 'h-14 w-14 text-base',
    lg: 'h-20 w-20 text-xl',
    xl: 'h-28 w-28 text-2xl',
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-full bg-gradient-to-br from-[#2F74B4] to-[#0D4669] ring-2 ring-white/10',
        sizes[size],
        className
      )}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={name || 'Player'}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center font-bold text-white">
          {initials(name)}
        </span>
      )}
    </div>
  )
}
