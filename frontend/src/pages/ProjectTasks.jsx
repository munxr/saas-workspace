import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ArrowLeft, Plus, Trash2, User, KanbanSquare, CheckCircle2, CircleDashed, Clock } from 'lucide-react';
import api from '../api';

const ProjectTasks = () => {
    const { projectId } = useParams(); 
    const navigate = useNavigate();
    
    const [tasks, setTasks] = useState([]);
    const [team, setTeam] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [filter, setFilter] = useState('ALL');
    
    const [loading, setLoading] = useState(true);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [assignedToId, setAssignedToId] = useState('');

    useEffect(() => {
        fetchData();
    }, [projectId]);

    const fetchData = async () => {
        try {
            const [tasksRes, usersRes, meRes] = await Promise.all([
                api.get(`/tasks/project/${projectId}`),
                api.get('/users'),
                api.get('/users/me')
            ]);
            setTasks(tasksRes.data);
            setTeam(usersRes.data);
            setCurrentUser(meRes.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert("Failed to load workspace data.");
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/tasks', {
                title: newTaskTitle,
                projectId: projectId,
                assignedToId: assignedToId || null,
                status: 'TODO'
            });
            setTasks([...tasks, response.data]);
            setNewTaskTitle('');
        } catch (err) {
            alert("Could not create task.");
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (err) {
            alert("Could not delete the task.");
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const newStatus = destination.droppableId;

        setTasks(prevTasks => prevTasks.map(task => 
            task.id === draggableId ? { ...task, status: newStatus } : task
        ));

        try {
            await api.put(`/tasks/${draggableId}/status`, { status: newStatus });
        } catch (err) {
            alert("Failed to sync move with server.");
            fetchData();
        }
    };

    const displayedTasks = filter === 'ME' 
        ? tasks.filter(task => task.assignedTo && task.assignedTo.id === currentUser?.id)
        : tasks;

    const getTasksByStatus = (status) => displayedTasks.filter(t => t.status === status);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4 text-slate-400">
                    <CircleDashed className="w-10 h-10 animate-spin text-indigo-600" />
                    <p className="font-semibold tracking-wide">Loading workspace...</p>
                </div>
            </div>
        );
    }

    // Column configurations to keep the UI code clean and maintainable
    const boardColumns = [
        { id: 'TODO', title: 'To Do', icon: <CircleDashed className="w-5 h-5 text-slate-500" />, bgHeader: 'bg-slate-200 text-slate-700', bgColumn: 'bg-slate-100/50' },
        { id: 'IN_PROGRESS', title: 'In Progress', icon: <Clock className="w-5 h-5 text-amber-500" />, bgHeader: 'bg-amber-100 text-amber-800', bgColumn: 'bg-amber-50/50' },
        { id: 'DONE', title: 'Done', icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, bgHeader: 'bg-emerald-100 text-emerald-800', bgColumn: 'bg-emerald-50/50' }
    ];

    return (
        <div className="max-w-7xl mx-auto mt-10 p-6 font-sans">
            
            {/* Top Navigation */}
            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-semibold transition-colors mb-8">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </button>
            
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                        <KanbanSquare className="w-8 h-8 text-indigo-600" />
                        Project Board
                    </h2>
                    <p className="text-slate-500 mt-2">Manage tasks, track progress, and collaborate seamlessly.</p>
                </div>
                
                <div className="flex bg-slate-200 p-1 rounded-xl">
                    <button onClick={() => setFilter('ALL')} className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                        All Tasks
                    </button>
                    <button onClick={() => setFilter('ME')} className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all ${filter === 'ME' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                        My Tasks
                    </button>
                </div>
            </div>

            {/* Task Creation Portal */}
            <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="What needs to be done?" required 
                    className="flex-[2] px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium" />
                
                <select value={assignedToId} onChange={(e) => setAssignedToId(e.target.value)} 
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-700 cursor-pointer">
                    <option value="">Unassigned</option>
                    {team.map(user => <option key={user.id} value={user.id}>{user.fullName || user.email}</option>)}
                </select>
                
                <button type="submit" className="flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
                    <Plus className="w-5 h-5" />
                    Add Task
                </button>
            </form>

            {/* The Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-[600px]">
                    
                    {boardColumns.map(column => (
                        <div key={column.id} className={`flex flex-col rounded-3xl border border-slate-200 p-4 ${column.bgColumn}`}>
                            
                            {/* Column Header */}
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl mb-4 font-bold ${column.bgHeader}`}>
                                {column.icon}
                                {column.title}
                                <span className="ml-auto bg-white/50 px-2 py-0.5 rounded-full text-sm">
                                    {getTasksByStatus(column.id).length}
                                </span>
                            </div>
                            
                            {/* Droppable Area */}
                            <Droppable droppableId={column.id}>
                                {(provided, snapshot) => (
                                    <div 
                                        {...provided.droppableProps} 
                                        ref={provided.innerRef}
                                        className={`flex-1 rounded-2xl transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-slate-200/50' : 'bg-transparent'}`}
                                    >
                                        {getTasksByStatus(column.id).map((task, index) => (
                                            <Draggable key={task.id} draggableId={task.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        // Mixing Tailwind classes with the inline styles required by the drag-and-drop library
                                                        className={`group p-5 mb-4 rounded-2xl border bg-white cursor-grab active:cursor-grabbing transition-all ${
                                                            snapshot.isDragging 
                                                                ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 rotate-2 opacity-90' 
                                                                : 'border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300'
                                                        }`}
                                                        style={{ ...provided.draggableProps.style }}
                                                    >
                                                        <div className="flex justify-between items-start gap-2 mb-4">
                                                            <div className="font-semibold text-slate-800 leading-tight">{task.title}</div>
                                                            <button onClick={() => handleDeleteTask(task.id)} className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        
                                                        <div className="flex items-center justify-between mt-auto">
                                                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-lg">
                                                                <User className="w-3.5 h-3.5 text-slate-400" />
                                                                <span className="text-xs font-semibold text-slate-600">
                                                                    {task.assignedTo ? (task.assignedTo.fullName || task.assignedTo.email) : 'Unassigned'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}

                </div>
            </DragDropContext>
        </div>
    );
};

export default ProjectTasks;