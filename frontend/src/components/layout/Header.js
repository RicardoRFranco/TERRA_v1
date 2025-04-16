import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';

const Header = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <header className="header">
      <Navbar isAuthenticated={isAuthenticated} user={user} />
    </header>
  );
};

export default Header;