import React from 'react';

export const PhoneInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => (
  <input ref={ref} {...props} type="tel" />
));
PhoneInput.displayName = 'PhoneInput';
export const InputPhone = PhoneInput;
