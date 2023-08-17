import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { verifyAuthentication } from './redux/modules/auth/actions';

import { Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';

import Home from './pages/Home';
import Course from './pages/Course';
import Dashboard from './pages/Dashboard';
import Newsletter from './pages/Newsletter';
import Register from './pages/Register/';
import VerifyPhone from './pages/VerifyPhone';

import Navbar from './components/Navbar';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyAuthentication());
  }, [dispatch]);

  return (
    <FluentProvider theme={webLightTheme}>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/course' element={<Course />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/newsletter' element={<Newsletter />} />
        <Route path='/register' element={<Register />} />
        <Route path='/validate' element={<VerifyPhone />} />
      </Routes>
    </FluentProvider>
  );
}

export default App;
