import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/modules/auth/actions';
import LoginModal from '../Auth/LoginModal';
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

import { GiHamburgerMenu } from 'react-icons/gi';
import { RiArrowLeftSLine } from 'react-icons/ri';

export default function Navbar({ title }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const path = useLocation();

  const [openLoginModal, setOpenLoginModal] = useState(false);

  const handleBackBtn = () => {
    const URL = path.pathname;

    const URLParamsArray = URL.split('/');

    let removeBlank = URLParamsArray.filter((value) => value !== '');

    removeBlank.pop();

    if (removeBlank.includes('edit')) {
      removeBlank.pop();
    }

    if (removeBlank.includes('course') && removeBlank.length === 1) {
      removeBlank.pop();
    }

    if (removeBlank.length > 0) {
      const newURL = removeBlank.join('/');
      const path = `/${newURL}`;
      navigate(path);
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
  };

  return (
    <header className='w-full px-4 py-1 bg-white font-bold flex gap-4 items-center justify-center'>
      {path.pathname !== '/' && (
        <button onClick={handleBackBtn}>
          <RiArrowLeftSLine size={30} />
        </button>
      )}
      {path.pathname === '/' ? (
        <Link
          to='/'
          className='block font-poppins text-large leading-6 flex-1 text-left font-bold poppins'
        >
          Leo Nonato
        </Link>
      ) : (
        <span className='block font-poppins text-[17px] leading-[22px] flex-1 text-center font-normal'>
          {title}
        </span>
      )}

      {path.pathname === '/' ? (
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label='Options'
            icon={<GiHamburgerMenu />}
            variant='outline'
            className='!border-none !bg-transparent !outline-none'
          />
          <MenuList className='!border-none !shadow-lg'>
            {!user && (
              <>
                <MenuItem
                  className='!outline-none !border-none focus:!bg-white'
                  onClick={() => setOpenLoginModal(true)}
                >
                  <span className='!w-full !text-center'>Login</span>
                </MenuItem>
                <MenuItem className='!outline-none !border-none focus:!bg-white'>
                  <Link to='/register' className='w-full text-center'>
                    Cadastro
                  </Link>
                </MenuItem>
              </>
            )}

            {user && (
              <>
                <MenuItem className='!outline-none !border-none focus:!bg-white'>
                  <Link to='/profile' className='w-full text-center'>
                    Perfil
                  </Link>
                </MenuItem>
                {user.admin && (
                  <>
                    <MenuItem className='!outline-none !border-none focus:!bg-white'>
                      <Link to='/dashboard' className='w-full text-center'>
                        Dashboard
                      </Link>
                    </MenuItem>
                  </>
                )}
                <MenuItem
                  className='!outline-none !border-none focus:!bg-white'
                  onClick={handleLogout}
                >
                  <span className='w-full text-center'>Sair</span>
                </MenuItem>
              </>
            )}
            <MenuItem className='!outline-none !border-none focus:!bg-white'>
              <Link to='/faq' className='w-full text-center'>
                FAQ
              </Link>
            </MenuItem>
          </MenuList>

          <LoginModal
            openLoginModal={openLoginModal}
            setOpenLoginModal={setOpenLoginModal}
          />
        </Menu>
      ) : (
        path.pathname.includes('dashboard') && (
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label='Options'
              icon={<GiHamburgerMenu />}
              variant='outline'
              className='!border-none !bg-transparent !outline-none'
            />
            <MenuList className='!border-none !shadow-lg'>
              <MenuItem className='!outline-none !border-none focus:!bg-white'>
                <Link to='/dashboard/courses' className='w-full text-center'>
                  Cursos
                </Link>
              </MenuItem>
              <MenuItem className='!outline-none !border-none focus:!bg-white'>
                <Link to='/dashboard/newsletter' className='w-full text-center'>
                  Newsletter
                </Link>
              </MenuItem>
              <MenuItem className='!outline-none !border-none focus:!bg-white'>
                <Link
                  to='/dashboard/notifications'
                  className='w-full text-center'
                >
                  Anúncios
                </Link>
              </MenuItem>
              <MenuItem className='!outline-none !border-none focus:!bg-white'>
                <Link to='/dashboard/forms' className='w-full text-center'>
                  Formulários
                </Link>
              </MenuItem>
              <MenuItem className='!outline-none !border-none focus:!bg-white'>
                <Link to='/dashboard/students' className='w-full text-center'>
                  Alunos
                </Link>
              </MenuItem>
              <MenuItem className='!outline-none !border-none focus:!bg-white'>
                <Link to='/dashboard/faq' className='w-full text-center'>
                  FAQ
                </Link>
              </MenuItem>
            </MenuList>
          </Menu>
        )
      )}
    </header>
  );
}
