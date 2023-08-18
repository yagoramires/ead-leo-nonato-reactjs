import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../redux/modules/auth/actions';

export default function Navbar() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  console.log(user);
  return (
    <header>
      <Link to='/'> Home </Link>

      {!user && <Link to='/register'> Register </Link>}

      {user && (
        <>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </header>
  );
}
