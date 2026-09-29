import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { AIChatDrawer } from '../components/AIChatDrawer';
import { JobAnalyzerModal } from '../components/JobAnalyzerModal';

export const DashboardLayout = () => {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isJobAnalyzerOpen, setIsJobAnalyzerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <Navbar
          onOpenAI={() => setIsAIOpen(true)}
          onOpenJobAnalyzer={() => setIsJobAnalyzerOpen(true)}
        />
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating AI Career Assistant Drawer */}
      <AIChatDrawer
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />

      {/* Job Description Analyzer Modal */}
      <JobAnalyzerModal
        isOpen={isJobAnalyzerOpen}
        onClose={() => setIsJobAnalyzerOpen(false)}
      />
    </div>
  );
};
