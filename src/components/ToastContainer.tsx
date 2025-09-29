import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast, { ToastProps } from './Toast'

interface ToastContextType {
  showToast: (toast: Omit<ToastProps, 'id' | 'onClose'>) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const showToast = useCallback((toast: Omit<ToastProps, 'id' | 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: (toastId: string) => {
        setToasts(prev => prev.filter(t => t.id !== toastId))
      }
    }
    setToasts(prev => [...prev, newToast])
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto z-[9999] space-y-3 max-w-sm sm:w-full pointer-events-none">
        <div className="space-y-3">
          {toasts.map((toast, index) => (
            <div 
              key={toast.id} 
              className="pointer-events-auto transform transition-all duration-300 ease-in-out animate-slide-in-right"
              style={{
                transform: `translateY(${index * 4}px)`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <Toast {...toast} />
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

export default ToastProvider
