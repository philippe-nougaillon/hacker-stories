import * as React from 'react';

const InputWithLabel = ({ id, label, value, type = 'text', onInputChange, children }) => (
  <>
    <label htmlFor={id}>{children}</label>
    <br />
    <input
      id={id}
      type={type}
      value={value}
      onChange={onInputChange}
    />
  </>
);

export { InputWithLabel };
