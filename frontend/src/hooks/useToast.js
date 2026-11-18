import { useState, useCallback } from 'react';

let _nextId = 1;

/**
 * useToast — lightweight toast state manager
 *
 * Usage:
 *   const { toasts, addToast, removeToast } = useToast();
 *
 *   addToast({ type: 'success', title: 'Done!', message: 'Optional detail', duration: 4500 });
 *
 * Pair with <ToastContainer toasts={toasts} removeToast={removeToast} />
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4500 }) => {
    const id = _nextId++;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    return id; // caller can use this to dismiss early if needed
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
};

export default useToast;
