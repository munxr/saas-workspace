import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard'; // Import the new component
import ProjectTasks from './pages/ProjectTasks';
import Team from './pages/Team';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        {/* Render the actual Dashboard component now */}
        <Route path="/dashboard" element={<Dashboard />} /> 

        <Route path="/projects/:projectId/tasks" element={<ProjectTasks />} />
        
        <Route path="*" element={<Navigate to="/" />} />

        <Route path="/team" element={<Team />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;