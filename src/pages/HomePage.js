import React, { useState } from 'react';
import Lottie from 'lottie-react';
import LandingPageAnimation from '../assets/LandingPageAnimation.json';

const HomePage = () => {
    const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Register form

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className='min-h-screen bg-gradient-to-r from-teal-500 via-indigo-500 to-violet-950 flex flex-col items-center justify-center'>
            {/* Website Title */}
            <div className='text-center text-gray-200 p-4'>
                <h1 className='text-4xl font-bold mt-8 mb-4 text-teal-200'>Smart Personal Diary</h1>
                <h3 classname='text-xl mb-4'>
                    A simple and secure way to keep your thoughts and ideas organized, gain AI-driven insights, and track your mood!
                </h3>
            </div>
            
            {/* Main Content */}
            <div className='grid grid-cols-1 md:grid-cols-2 w-full max-w-6xl gap-8 p-4'>
                
                {/* Left Side (Lottie Animation) */}
                <div className='flex justify-center items-center'>
                    <Lottie animationData={LandingPageAnimation} loop={true} className='w-full h-full'/>
                </div>

                {/* Right Side (Login/Register Form) */}
                <div className='flex justify-center items-center'>
                    <div className='p-8 rounded-lg shadow-lg w-full max-w-md min-h-[400px] flex flex-col justify-center border-2 border-teal-900'>
                        <h2 className='text-2xl font-bold mb-4 text-teal-200 flex items-center justify-center'>
                            {isLogin ? 'Login' : 'Register'}
                        </h2>
                        <form>
                            {!isLogin && (
                                <input
                                    type='text'
                                    className='w-full p-2 mb-4 border border-teal-500 rounded bg-gray-300 placeholder-opacity-25 focus:outline-none focus:border-violet-800'
                                    placeholder='Username'
                                />
                            )}
                            <input
                                type='email'
                                className='w-full p-2 mb-4 border border-teal-500 rounded bg-gray-300 placeholder-opacity-25 focus:outline-none focus:border-violet-800'
                                placeholder='Email'
                            />
                            <input
                                type='password'
                                className='w-full p-2 mb-4 border border-teal-500 rounded bg-gray-300 placeholder-opacity-25 focus:outline-none focus:border-violet-800'
                                placeholder='Password'
                            />
                            <button
                                type='submit'
                                className='w-full p-2 bg-teal-600 text-white rounded hover:bg-teal-500 focus:outline-none'
                            >
                                {isLogin ? 'Login' : 'Register'}
                            </button>
                        </form>
                        <p className='mt-4 text-sm text-gray-300'>
                            {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}{' '}
                            <button
                                onClick={toggleForm}
                                className='text-teal-300 hover:text-teal-200 hover:underline focus:outline-none'
                            >
                                {isLogin ? 'Register here' : 'Login here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className='text-gray-300 text-center py-4'>
                <p>
                    Made with ❤️ by{' '}
                    <a
                        href='/'
                        className='text-teal-300 hover:text-teal-200 hover:underline focus:outline-none'
                    >
                        Full-Stack Forces
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default HomePage;
