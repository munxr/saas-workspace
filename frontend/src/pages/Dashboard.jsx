import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, CheckCircle, ListTodo, Users, LogOut, Plus, Trash2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../api';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [metrics, setMetrics] = useState({ totalProjects: 0, totalTasks: 0, completionPercentage: 0 });
    const [currentUser, setCurrentUser] = useState(null);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDesc, setNewProjectDesc] = useState('');
    const navigate = useNavigate();

    // Mock chart historical data structure matching database aggregates
    const chartData = [
        { name: 'Pending', count: metrics.totalTasks - Math.round((metrics.completionPercentage / 100) * metrics.totalTasks) },
        { name: 'Completed', count: Math.round((metrics.completionPercentage / 100) * metrics.totalTasks) }
    ];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projectsRes, metricsRes, meRes] = await Promise.all([
                api.get('/projects'),
                api.get('/dashboard/metrics'),
                api.get('/users/me')
            ]);
            setProjects(projectsRes.data);
            setMetrics(metricsRes.data);
            setCurrentUser(meRes.data);
        } catch (err) {
            console.error("Error loading dashboard aggregates:", err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', { name: newProjectName, description: newProjectDesc });
            setNewProjectName('');
            setNewProjectDesc('');
            fetchData();
        } catch (err) {
            alert("Failed to create project");
        }
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm("Are you sure you want to delete this entire project? This action cannot be undone.")) return;
        try {
            await api.delete(`/projects/${projectId}`);
            fetchData();
        } catch (err) {
            alert("Failed to delete project.");
        }
    };

    return (
        <div className="max-w-6xl mx-auto mt-12 p-6 font-sans">
            
            {/* Upper Header Section */}
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-200">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <BarChart3 className="w-8 h-8 text-indigo-600" />
                        Workspace Control Center
                    </h2>
                    <p className="text-slate-500 mt-1">Logged in as: <span className="font-semibold text-slate-700">{currentUser?.fullName || currentUser?.email}</span></p>
                </div>
                <div className="flex gap-3">
                    {currentUser?.role === 'ADMIN' && (
                        <button onClick={() => navigate('/team')} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-100 transition-all shadow-sm">
                            <Users className="w-4 h-4" />
                            Team Management
                        </button>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Premium Metrics Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
                    <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600">
                        <FolderKanban className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Projects</h3>
                        <p className="text-3xl font-black text-slate-900 mt-0.5">{metrics.totalProjects}</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
                    <div className="p-4 bg-amber-50 rounded-xl text-amber-500">
                        <ListTodo className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Ecosystem Tasks</h3>
                        <p className="text-3xl font-black text-slate-900 mt-0.5">{metrics.totalTasks}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-5">
                    <div className="p-4 bg-emerald-50 rounded-xl text-emerald-500">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Overall Progress</h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-black text-slate-900 mt-0.5">{metrics.completionPercentage}%</p>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${metrics.completionPercentage}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Visualization and Analytics Layout */}
            {metrics.totalTasks > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Task Distribution Overview</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} precision={0} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={60} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Project Creation Portal */}
            {currentUser?.role === 'ADMIN' && (
                <form onSubmit={handleCreateProject} className="flex flex-col sm:flex-row gap-4 mb-10 bg-slate-100 p-4 rounded-2xl border border-slate-200">
                    <input type="text" placeholder="Project Workspace Identifier" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} required 
                        className="flex-1 px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium" />
                    <input type="text" placeholder="Strategic scopes or milestones description..." value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} 
                        className="flex-[2] px-4 py-3 rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800" />
                    <button type="submit" className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 whitespace-nowrap">
                        <Plus className="w-5 h-5" />
                        Initialize Project
                    </button>
                </form>
            )}

            {/* Interactive Workspace Entries */}
            <h3 className="text-xl font-bold text-slate-900 mb-4">Active Managed Spaces</h3>
            <div className="grid gap-4">
                {projects.map(p => (
                    <div key={p.id} className="group bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h4 className="text-lg font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{p.name}</h4>
                            <p className="text-slate-500 text-sm mt-0.5">{p.description || "No tactical details recorded."}</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto justify-end">
                            <button onClick={() => navigate(`/projects/${p.id}/tasks`)} className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm">
                                Open Board
                            </button>
                            {currentUser?.role === 'ADMIN' && (
                                <button onClick={() => handleDeleteProject(p.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                    <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                        No active project spaces found. Use the configuration form above to initialize one.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;