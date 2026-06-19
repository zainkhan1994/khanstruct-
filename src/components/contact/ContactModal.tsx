'use client';

/* ════════════════════════════════════════════════════════════════════════
   CONTACT MODAL — a "send me a message" panel that delivers straight to the
   inbox via Web3Forms (no backend). Rendered once in the root layout; opened
   from the contact section + footer through the useContactModal store.
   ──────────────────────────────────────────────────────────────────────── */

import { useEffect, useRef, useState } from 'react';
import { useContactModal } from '@/store/contact';
import { EMAIL } from '@/lib/content';
import styles from './ContactModal.module.css';

// Web3Forms access key — public by design (spam-guarded server-side + honeypot).
// Set NEXT_PUBLIC_WEB3FORMS_KEY in .env.local (and in your host's env).
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? '';

type Status = 'idle' | 'sending' | 'success' | 'error';

export function ContactModal() {
  const open = useContactModal((s) => s.open);
  const closeModal = useContactModal((s) => s.closeModal);

  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  // Open side-effects: lock scroll, remember + restore focus, focus first field.
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => firstFieldRef.current?.focus(), 40);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus?.();
    };
  }, [open]);

  // Reset to a clean form whenever the modal is closed.
  useEffect(() => {
    if (!open) {
      setStatus('idle');
      setError('');
    }
  }, [open]);

  // Esc to close + a simple focus trap so Tab stays inside the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, closeModal]);

  if (!open) return null;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — a real user never fills this hidden field.
    if (data.get('botcheck')) {
      closeModal();
      return;
    }

    setStatus('sending');
    setError('');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `New message from ${data.get('name') || 'a portfolio visitor'}`,
          from_name: 'Khanstruct Portfolio',
          name: data.get('name'),
          email: data.get('email'),
          message: data.get('message'),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setError(json.message || 'Could not send right now. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Network error — please check your connection and try again.');
    }
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        ref={dialogRef}
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button type="button" className={styles.close} onClick={closeModal} aria-label="Close">
          ×
        </button>

        {status === 'success' ? (
          <div className={styles.success} role="status">
            <div className={styles.check} aria-hidden="true">
              ✓
            </div>
            <h2 id="contact-modal-title" className={styles.title}>
              Message sent
            </h2>
            <p className={styles.subtitle}>
              Thanks — it&apos;s on its way to my inbox. I&apos;ll get back to you soon.
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondary}
                onClick={() => setStatus('idle')}
              >
                Send another
              </button>
              <button type="button" className={styles.primary} onClick={closeModal}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className={styles.eyebrow}>Get in touch</p>
            <h2 id="contact-modal-title" className={styles.title}>
              Send me a message
            </h2>
            <p className={styles.subtitle}>
              Write below and it lands straight in my inbox — no email app needed.
            </p>

            <form className={styles.form} onSubmit={onSubmit}>
              {/* Honeypot (visually hidden) */}
              <input
                type="checkbox"
                name="botcheck"
                className={styles.honeypot}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Name</span>
                <input
                  ref={firstFieldRef}
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className={styles.input}
                  autoComplete="name"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className={styles.input}
                  autoComplete="email"
                />
              </label>

              <label className={styles.field}>
                <span className={styles.fieldLabel}>Message</span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  rows={5}
                  placeholder="Tell me about your project…"
                  className={styles.textarea}
                />
              </label>

              {status === 'error' && (
                <p className={styles.errorMsg} role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className={styles.primary} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
                <span aria-hidden="true">→</span>
              </button>

              <p className={styles.fallback}>
                Prefer your own email app?{' '}
                <a href={`mailto:${EMAIL}`} className={styles.fallbackLink}>
                  {EMAIL}
                </a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
