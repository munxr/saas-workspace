import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hexagon, Mail, Lock, Building2, User, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../api';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        companyName: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const response = await api.post(endpoint, formData);
            
            const token = response.data;
            localStorage.setItem('token', token);
            
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Logo and Header */}
                <div className="flex justify-center">
                    <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
                        <Hexagon className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                    {isLogin ? 'Welcome back' : 'Initialize Workspace'}
                </h2>
                <p className="mt-2 text-center text-sm text-slate-500 font-medium">
                    {isLogin ? 'Sign in to access your projects.' : 'Create a new tenant environment for your team.'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
                    
                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-red-700 font-medium">{error}</p>
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        
                        {/* Conditional Registration Fields */}
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Company Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Building2 className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input type="text" name="companyName" placeholder="Acme Corp" onChange={handleChange} required 
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm font-medium" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Admin Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input type="text" name="fullName" placeholder="Jane Doe" onChange={handleChange} required 
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm font-medium" />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Always Visible Fields */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-400" />
                                </div>
                                <input type="email" name="email" placeholder="you@company.com" onChange={handleChange} required 
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm font-medium" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400" />
                                </div>
                                <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required 
                                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all sm:text-sm font-medium" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-200 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2">
                            {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Establish Workspace')}
                            {!isLoading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </form>

                    {/* Form Toggle */}
                    <div className="mt-8 pt-6 border-t border-slate-100">
                        <button onClick={() => setIsLogin(!isLogin)} 
                            className="w-full text-center text-sm text-slate-600 hover:text-indigo-600 font-semibold transition-colors">
                            {isLogin ? (
                                <span>New to the platform? <span className="text-indigo-600">Create a workspace &rarr;</span></span>
                            ) : (
                                <span>Already have an account? <span className="text-indigo-600">Sign in &rarr;</span></span>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthPage;