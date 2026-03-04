'use client';

import React from 'react';
import { X } from 'lucide-react';

export type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: DrawerSize;
  className?: string;
  showBackdrop?: boolean;
  onBackdropClick?: () => void;
}

const SIZE_MAP: Record<DrawerSize, string> = {
  sm: 'max-w-sm',      // 24rem
  md: 'max-w-md',      // 28rem
  lg: 'max-w-lg',      // 32rem
  xl: 'max-w-2xl',     // 42rem (default)
  full: 'max-w-full',  // full width
};

/**
 * Reusable Drawer Component
 * Used for all create/edit sidebars across the application
 *
 * @param isOpen - Control drawer visibility
 * @param onClose - Callback when drawer should close
 * @param title - Drawer header title
 * @param children - Drawer content
 * @param size - Drawer width (sm, md, lg, xl, full) - default: xl
 * @param className - Additional CSS classes
 * @param showBackdrop - Show backdrop overlay (default: true)
 * @param onBackdropClick - Custom handler for backdrop click
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  size = 'xl',
  className = '',
  showBackdrop = true,
  onBackdropClick,
}: DrawerProps) {
  if (!isOpen) return null;

  const handleBackdropClick = onBackdropClick || onClose;

  return (
    <>
      {/* Backdrop */}
      {showBackdrop && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={handleBackdropClick}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-full ${SIZE_MAP[size]} bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </div>
    </>
  );
}
