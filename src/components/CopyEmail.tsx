import { useEffect, useRef, useState } from 'react'

export function CopyEmail({ email }: { email: string }) {
  const [message, setMessage] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = async () => {
    clearTimeout(timer.current)
    try {
      await navigator.clipboard.writeText(email)
      setMessage('Correo copiado.')
    } catch {
      setMessage('No se pudo copiar. Puedes seleccionar el correo para copiarlo.')
    }
    timer.current = setTimeout(() => setMessage(''), 5000)
  }

  return <div className="copy-email">
    <button type="button" className="copy-email-button" onClick={copy} aria-label={`Copiar correo ${email}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="1" /><path d="M16 8V4H4v12h4" /></svg>
      Copiar correo
    </button>
    <span className="copy-email-status" role="status" aria-live="polite">{message}</span>
  </div>
}
