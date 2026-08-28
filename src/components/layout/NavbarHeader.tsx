import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export const NavbarHeader = ({ title = '', backUrl = '', onBack = undefined, onClose = undefined, className, iconClass }: { title?: React.ReactNode, backUrl?: string, onBack?: () => void, onClose?: () => void, className?: string, iconClass?: string }) => {
  const navigate = useNavigate();
  return (
    <div className={cn("flex items-center p-4 border-b", className)}>
      <button onClick={() => {
        if (onClose) onClose();
        else if (onBack) onBack();
        else if (backUrl) navigate(backUrl);
        else navigate(-1);
      }} className="mr-4">
        <ArrowLeft className={cn("w-6 h-6", iconClass)} />
      </button>
      {typeof title === 'string' ? <h1 className="text-xl font-bold">{title}</h1> : title}
    </div>
  );
};

