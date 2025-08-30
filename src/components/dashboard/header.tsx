'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Bell, Plus, MessageSquare } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Academic Dashboard</h1>
          <p className="text-sm text-gray-600">Monitor student performance and institutional metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200">
            <MessageSquare className="w-5 h-5" />
          </button>
          
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 hover:scale-[1.02] shadow-sm hover:shadow-md">
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </button>
        </div>
      </div>
    </header>
  );
}