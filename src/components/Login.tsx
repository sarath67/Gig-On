import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Login: React.FC = () => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await fetch('https://gig-onapi.sarath-s2022cse.workers.dev/users/' + username, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer 1234',
                },
            });
            const data = await response.json();
            if (data.results[0].password === password) {
                console.log('Login successful');
                login(username);
                navigate('/');
            } else {
                console.log('Invalid username or password');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex font-poppins items-center justify-center overflow bg-gradient-to-r from-black to-slate-900 " >
            <div className="h-screen w-screen grid grid-cols-1 sm:grid-cols-2">
                <div className="flex justify-center items-center sm:col-span-full">
                    <div className="grid gap-8">
                        <div id="back-div" className="bg-gradient-to-r from-black to-slate-800 rounded-[28px] m-4 ">
                            <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-200 bg-white shadow-lg xl:p-5 2xl:p-5 lg:p-5 md:p-5 sm:p-2 m-2">
                                <h1 className="pb-3 font-bold dark:text-black text-2xl text-center cursor-default">
                                    Login into your account
                                </h1>
                                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                    <input type="hidden" name="remember" value="true" />
                                    <div className="rounded-md shadow-sm -space-y-px">
                                        <div>
                                            <label id="username" className="mb-2 dark:text-slate-700 text-lg">Username</label>
                                            <input id="username" name="username" type="text" autoComplete="username" required className="border p-3 :bg-white-700 dark:text-black dark:border-gray-700 shadow-md placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                                        </div>
                                        <div>
                                            <label id="password" className="mb-2 dark:text-slate-700 text-lg">Password</label>
                                            <input id="password" name="password" type="password" autoComplete="current-password" required className="border p-3 shadow-md :bg-white-700 dark:text-black dark:border-gray-700 placeholder:text-base focus:scale-105 ease-in-out duration-300 border-gray-300 rounded-lg w-full" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <button type="submit" className="bg-gradient-to-r dark:text-white from-black to-blue-950 shadow-lg p-2 text-white rounded-lg w-full hover:scale-105 hover:from-blue-950 hover:to-black transition duration-300 ease-in-out " onClick={handleLogin}>
                                            Log in
                                        </button>
                                    </div>
                                    <div className="flex flex-row gap-1 mx-7">                      
                                        <Link to="/signup"><p className="text-gray-500 font-medium" > don't have an account? </p><p className="text-blue-500 ">Sign Up</p></Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
