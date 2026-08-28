import React from 'react';

export default function Image({ src, alt, className, width, height, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { src?: string; alt?: string }) {
  return <img src={src} alt={alt || ''} className={className} width={width} height={height} {...props} />;
}
