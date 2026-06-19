'use client';

import { useContactModal } from '@/store/contact';

type Props = {
  className?: string;
  children: React.ReactNode;
  'aria-label'?: string;
  'data-delay'?: string; // scroll-reveal stagger hook
};

/** A button that opens the shared contact modal — used in place of the old
    mailto: links so both the contact section and the footer share one panel. */
export function ContactButton({ className, children, ...rest }: Props) {
  const openModal = useContactModal((s) => s.openModal);
  return (
    <button type="button" className={className} onClick={openModal} {...rest}>
      {children}
    </button>
  );
}
