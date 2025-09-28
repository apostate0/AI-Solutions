import React from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const AdminLayout: React.FC = () => {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const navItems = [
    { id: 'overview', label: 'Overview', path: '/admin' },
    { id: 'case-studies', label: 'Case Studies', path: '/admin/case-studies' },
    { id: 'blogs', label: 'Blog Posts', path: '/admin/blogs' },
    { id: 'events', label: 'Events', path: '/admin/events' },
    { id: 'testimonials', label: 'Testimonials', path: '/admin/testimonials' },
    { id: 'contacts', label: 'Contact Submissions', path: '/admin/contacts' },
    { id: 'feedback', label: 'Feedback & Ratings', path: '/admin/feedback' }
  ]

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img 
                src="/AI-Solution.png" 
                alt="AI Solutions Logo" 
                className="h-10 w-auto mr-3"
              />
              <div>
                <h1 className="text-xl font-bold text-secondary-900">Admin Dashboard</h1>
                <p className="text-sm text-secondary-600">AI Solutions Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-secondary-600">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-secondary-600 hover:text-secondary-900 font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-6 overflow-x-auto pb-2">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/admin'}
                className={({ isActive }) =>
                  `py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Content */}
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
