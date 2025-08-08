import { useState } from 'react';

function SimpleApp() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold">M3Core CRM</h1>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Dashboard</a></li>
              <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Properties</a></li>
              <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Leads</a></li>
              <li><a href="#" className="block p-2 hover:bg-gray-100 rounded">Settings</a></li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-gray-100 rounded">🔔</button>
                <button className="p-2 hover:bg-gray-100 rounded">👤</button>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h1 className="text-3xl font-bold mb-2">Welcome to M3Core CRM</h1>
              <p className="text-gray-600">Your comprehensive real estate CRM solution</p>
              <button 
                onClick={() => setCount(count + 1)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Clicked {count} times
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-1">Properties</p>
                <p className="text-2xl font-bold">152</p>
                <p className="text-green-600 text-sm">+12%</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-1">Leads</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-green-600 text-sm">+23%</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-1">Deals</p>
                <p className="text-2xl font-bold">24</p>
                <p className="text-green-600 text-sm">+8%</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm mb-1">Revenue</p>
                <p className="text-2xl font-bold">$1.2M</p>
                <p className="text-green-600 text-sm">+18%</p>
              </div>
            </div>
          </main>

          {/* Status Bar */}
          <footer className="fixed bottom-0 left-64 right-0 bg-gray-800 text-white text-xs p-2">
            <div className="flex justify-between items-center">
              <span>🟢 Online</span>
              <span>Version 1.0.0</span>
              <span>Last sync: Just now</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default SimpleApp;