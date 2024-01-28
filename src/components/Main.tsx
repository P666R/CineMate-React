import React from 'react';

export type MainProps = {
  children: React.ReactNode;
};

//! Main (structural component)
export default function Main({ children }: MainProps): React.JSX.Element {
  return <main className="main">{children}</main>;
}
