import React from 'react';
import Logo from './Logo';

type NavBarProps = {
  children: React.ReactNode;
};

//! Navbar (structural component)
export default function NavBar({ children }: NavBarProps): React.JSX.Element {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
