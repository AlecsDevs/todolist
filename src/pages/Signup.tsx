import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../context/AuthContext';
import bg from '../assets/bg.jpg';

export const Signup = () => {
  const [formData, setFormData] = useState({
    createemail: '',
    createpassword: '',
    confirmpassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.createpassword !== formData.confirmpassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.createpassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.createemail, formData.createpassword);
      navigate('/');
    } catch (error) {
      setError('Failed to create account: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError('');
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign up with Google: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-8">
        <form className="w-full max-w-sm space-y-6" onSubmit={handleSubmit}>
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 lg:mb-10">Sign Up</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <input
            type="email"
            className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 transition"
            placeholder="Create Your Email"
            name="createemail"
            value={formData.createemail}
            onChange={handleChange}
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 transition pr-10"
              placeholder="Create Your Password"
              name="createpassword"
              value={formData.createpassword}
              onChange={handleChange}
              required
              minLength={6}
            />
            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 transition pr-10"
              placeholder="Confirm Your Password"
              name="confirmpassword"
              value={formData.confirmpassword}
              onChange={handleChange}
              required
              minLength={6}
            />
            <span
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <div className="text-center text-gray-400 text-sm">or</div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded hover:bg-gray-100 transition disabled:opacity-50"
          >
            <FcGoogle size={20} />
            <span className="text-sm">Sign up with Google</span>
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?
            <Link to="/login" className="text-blue-600 hover:underline ml-1">
              Log in
            </Link>
          </div>
        </form>
      </div>

      <div
        className="flex-1 h-64 lg:h-auto flex items-center justify-center bg-cover bg-center relative"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-black opacity-80"></div>
        <div className="z-10 text-white max-w-md text-center px-4 py-6 lg:py-0">
          <h1 className="text-5xl lg:text-5xl font-bold mb-4 lg:mb-6">Todo-List</h1>
          <h1 className="text-3xl lg:text-5xl mb-4 lg:mb-6 leading-tight">
            Create Your Free Account
          </h1>
          <p className="text-base lg:text-lg mb-4">
            Start your journey with us by setting up your email and password. Sign up in seconds and enjoy seamless task management.
          </p>
        </div>
      </div>
    </div>
  );
};