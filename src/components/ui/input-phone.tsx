import React from 'react';
export const PhoneInput = React.forwardRef((props: any, ref: any) => <input ref={ref} {...props} type="tel" />);
PhoneInput.displayName = 'PhoneInput';
export const InputPhone = PhoneInput;
