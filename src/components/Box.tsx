import React, { useState } from 'react';

export type ListBoxProps = {
  children: React.ReactNode;
};

//! Box (stateful component) made resusable using component composition
export default function Box({ children }: ListBoxProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? '–' : '+'}
      </button>

      {isOpen && children}
    </div>
  );
}
