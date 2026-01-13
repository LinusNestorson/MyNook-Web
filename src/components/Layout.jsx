import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const location = useLocation();
  const { logout } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', href: '/' },
    { name: 'House Map', href: '/house' },
    { name: 'Colors', href: '/colors' },
    { name: 'Bank Import', href: '/import' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">MyNook</h1>
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`block px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
            <button
                onClick={logout}
                className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
                Sign Out
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
          <span className="font-bold text-lg">MyNook</span>
          {/* Mobile menu button placeholder - can be added later */}
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
