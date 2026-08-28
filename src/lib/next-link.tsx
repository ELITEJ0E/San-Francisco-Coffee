import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function Link({ href, children, className }: any) {
  return <RouterLink to={href} className={className}>{children}</RouterLink>;
}
