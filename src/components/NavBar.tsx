import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import logo from '../assets/gigonlogo.png';

const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleProfile = () => {
    navigate(`/profile/${user}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleConnections = () => {
    navigate(`/connections/`);
  };

  return (
    <aside className="fixed top-0 left-0 bottom-0 w-64 bg-gray-200 text-black overflow-y-auto z-50">
      <div className="h-full flex flex-col justify-between">
        <div className="py-4 px-6">
          <div onClick={() => navigate('/')} className="flex items-center mb-8 cursor-pointer">
            <img src={logo} alt="App logo" className="h-8 w-16 sm:h-10 sm:w-20" />
            <span className="text-2xl font-custom text-black font-bold ml-2 whitespace-nowrap">Gig-On</span>
          </div>
          <nav>
          <div onClick={() => navigate('/')} className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-950 hover:text-white">
          <i className="bi bi-house-door-fill"></i>
          <div  className="text-[15px] ml-4 font-bold">Home</div>
        </div>

            <div className="my-4 bg-black h-[1px]"></div>
            {user ? (
              <div>
                <div onClick={handleProfile} className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-950 hover:text-white">
                  <i className="bi bi-person-fill"></i>
                  <div className="text-[15px] ml-4  font-bold">Profile</div>
                </div>
                <div onClick={handleConnections} className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-950 hover:text-white">
                  <i className="bi bi-people-fill"></i> 
                  <div className="text-[15px] ml-4 font-bold">Connections</div>
                </div>
                <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-950 hover:text-white" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-in-right"></i>
                  <div className="text-[15px] ml-4 font-bold">Logout</div>
                </div>
              </div>
            ) : (
              <div>
                <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-950 hover:text-white" onClick={handleLogin}>
                  <i className="bi bi-box-arrow-in-right"></i>
                  <div className="text-[15px] ml-4 font-bold">Login</div>
                </div>
                <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-blue-950 hover:text-white" onClick={handleSignup}>
                  <i className="bi bi-box-arrow-in-right"></i>
                  <div className="text-[15px] ml-4  font-bold">Sign up</div>
                </div>
              </div>
            )}
          </nav>
        </div>
        <div className="sm:hidden">

        </div>
      </div>
    </aside>
  );
};

export default Navbar;
