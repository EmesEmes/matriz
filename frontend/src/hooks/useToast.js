import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Date.now() + Math.random();
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }));
    
    // Auto-remover después de la duración especificada
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id)
      }));
    }, toast.duration || 5000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
}));

export const useToast = () => {
  const { addToast } = useToastStore();

  return {
    success: (message, duration = 5000) => 
      addToast({ type: 'success', message, duration }),
    error: (message, duration = 5000) => 
      addToast({ type: 'error', message, duration }),
    info: (message, duration = 5000) => 
      addToast({ type: 'info', message, duration }),
    warning: (message, duration = 5000) => 
      addToast({ type: 'warning', message, duration })
  };
};

export default useToastStore;