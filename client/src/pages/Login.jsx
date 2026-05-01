import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 p-12 text-white flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative z-10 flex items-center gap-3 font-extrabold text-2xl tracking-tight">
          <div className="w-10 h-10 rounded-xl bg-white text-primary-600 flex items-center justify-center shadow-lg">
            <span className="text-xl leading-none">P</span>
          </div>
          Plannr
        </div>
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Manage your team's work in one unified space.
          </h1>
          <p className="text-primary-200 text-lg">
            Join thousands of teams who use Plannr to streamline their workflow, track progress, and hit their goals faster.
          </p>
        </div>
        <div className="relative z-10 text-primary-300 text-sm">
          &copy; {new Date().getFullYear()} Plannr Inc. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold leading-none">E</span>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sign in to your account</h2>
            <p className="mt-2 text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                Start for free
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6 bg-white p-8 rounded-3xl shadow-[var(--shadow-card)] border border-gray-100" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <Input
                label="Email address"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer transition-all"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                  Forgot password?
                </a>
              </div>
            </div>

            <Button type="submit" className="w-full py-2.5 text-base" isLoading={loading}>
              Sign in
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
