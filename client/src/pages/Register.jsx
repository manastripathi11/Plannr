import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password, role);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Registration failed');
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
            Start organizing your work today.
          </h1>
          <p className="text-primary-200 text-lg">
            Create an account and discover a better way to collaborate, plan, and deliver on your projects.
          </p>
        </div>
        <div className="relative z-10 text-primary-300 text-sm">
          &copy; {new Date().getFullYear()} Plannr Inc. All rights reserved.
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-50 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-6 my-8"
        >
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold leading-none">E</span>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create your account</h2>
            <p className="mt-2 text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-500 transition-colors">
                Sign in instead
              </Link>
            </p>
          </div>

          <form className="bg-white p-8 rounded-3xl shadow-[var(--shadow-card)] border border-gray-100 space-y-5" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Work Email"
              type="email"
              placeholder="jane@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <select
                className="block w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer appearance-none"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Member">Team Member</option>
                <option value="Admin">Workspace Admin</option>
              </select>
            </div>

            <Button type="submit" className="w-full py-2.5 text-base mt-2" isLoading={loading}>
              Create account
            </Button>
            <p className="text-xs text-center text-gray-500 mt-4">
              By clicking "Create account", you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
