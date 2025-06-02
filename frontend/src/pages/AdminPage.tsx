import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Users Management Card */}
          <div className="bg-[#1E2130] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Users Management</h2>
            <p className="text-gray-400 mb-4">Manage user accounts and permissions</p>
            <button 
              onClick={() => navigate('/admin/users')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Manage Users
            </button>
          </div>

          {/* Content Management Card */}
          <div className="bg-[#1E2130] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Content Management</h2>
            <p className="text-gray-400 mb-4">Manage music, albums, and playlists</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              Manage Content
            </button>
          </div>

          {/* Analytics Card */}
          <div className="bg-[#1E2130] p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-400 mb-4">View platform statistics and reports</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
              View Analytics
            </button>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <div className="bg-[#1E2130] rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div>
                  <p className="font-medium">New user registration</p>
                  <p className="text-sm text-gray-400">2 minutes ago</p>
                </div>
                <span className="text-green-500">View</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-700 pb-4">
                <div>
                  <p className="font-medium">New album uploaded</p>
                  <p className="text-sm text-gray-400">15 minutes ago</p>
                </div>
                <span className="text-green-500">View</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">System update completed</p>
                  <p className="text-sm text-gray-400">1 hour ago</p>
                </div>
                <span className="text-green-500">View</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 