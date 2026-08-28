import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function Link({ href, children, className, style, onClick }: LinkProps) {
  return <RouterLink to={href} className={className} style={style} onClick={onClick}>{children}</RouterLink>;
}
