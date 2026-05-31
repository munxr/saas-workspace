import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, Mail, Shield, User as UserIcon, AlertCircle } from 'lucide-react';
import api from '../api';

const Team = () => {
    const [team, setTeam] = useState([]);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        try {
            const response = await api.get('/users');
            setTeam(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load team database.");
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/users/invite', { email, fullName });
            // Add the new user to the screen instantly
            setTeam([...team, response.data]);
            setEmail('');
            setFullName('');
        } catch (err) {
            console.error(err);
            setError("Failed to invite user. Make sure the email isn't already taken!");
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to extract initials for the avatar circle
    const getInitials = (name, userEmail) => {
        if (name) {
            return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        }
        return userEmail.substring(0, 2).toUpperCase();
    };

    return (
        <div className="max-w-5xl mx-auto mt-12 p-6 font-sans">
            
            {/* Top Navigation */}
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>

            {/* Header */}
            <div className="mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                    <Users className="w-8 h-8 text-indigo-600" />
                    Team Management
                </h2>
                <p className="text-slate-500 mt-2">View active members and provision access for new collaborators.</p>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Invite Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">
                        <div className="flex items-center gap-2 mb-6">
                            <UserPlus className="w-5 h-5 text-slate-700" />
                            <h3 className="text-lg font-bold text-slate-800">Invite Member</h3>
                        </div>
                        
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input type="text" placeholder="Alex Chen" value={fullName} onChange={(e) => setFullName(e.target.value)} required 
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input type="email" placeholder="alex@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required 
                                        className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm font-medium" />
                                </div>
                            </div>

                            <button type="submit" disabled={isLoading} 
                                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70 mt-2">
                                {isLoading ? 'Sending...' : 'Send Invitation'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Team Roster */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Active Directory</h3>
                            <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-xs font-bold">
                                {team.length} Members
                            </span>
                        </div>
                        
                        <div className="divide-y divide-slate-100">
                            {team.map((user) => (
                                <div key={user.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        {/* Avatar Bubble */}
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                            {getInitials(user.fullName, user.email)}
                                        </div>
                                        
                                        {/* User Details */}
                                        <div>
                                            <p className="font-bold text-slate-900">{user.fullName || "Pending User"}</p>
                                            <p className="text-sm text-slate-500">{user.email}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Role Badge */}
                                    <div>
                                        {user.role === 'ADMIN' ? (
                                            <div className="flex items-center gap-1.5 bg-rose-50 text-rose-700 px-3 py-1.5 rounded-lg border border-rose-100 shadow-sm">
                                                <Shield className="w-4 h-4" />
                                                <span className="text-xs font-bold tracking-wide">ADMIN</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
                                                <UserIcon className="w-4 h-4" />
                                                <span className="text-xs font-bold tracking-wide">MEMBER</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {team.length === 0 && (
                                <div className="p-12 text-center text-slate-400">
                                    No team members found.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Team;