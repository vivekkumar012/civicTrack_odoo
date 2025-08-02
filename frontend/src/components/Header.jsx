import React from 'react'
import { MapPin, Plus, Filter, Flag, Eye, Clock, CheckCircle, AlertTriangle, Camera, User, Settings, Bell, Search, X, Upload, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className='bg-gray-50 min-h-screen'>
        {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-8 w-8 text-blue-600" />
                <h1 className="text-xl font-bold text-gray-900">CivicTrack</h1>
              </div>
              <span className="text-sm text-gray-500">Raipur, Chhattisgarh</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Bell className="h-5 w-5" />
              </button>
              <button 
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-400" />
                <Link to={'/login'} className="text-sm font-medium text-gray-700">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header
