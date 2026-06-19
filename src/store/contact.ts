import { create } from 'zustand';

/** Controls the shared "send me a message" modal. Triggered from the contact
    section's email button and the footer's Email link; the modal itself is
    rendered once in the root layout. */
interface ContactModalStore {
  open: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useContactModal = create<ContactModalStore>((set) => ({
  open: false,
  openModal: () => set({ open: true }),
  closeModal: () => set({ open: false }),
}));
