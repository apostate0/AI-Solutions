import React, { useState } from 'react'

interface Event {
  id: number
  title: string
  date: string
  location: string
  description: string
  category: string
  image: string
  attendees: number
}

const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    category: 'Conference',
    image: 'bg-gradient-to-br from-blue-500 to-purple-600',
    attendees: 0
  })

  const categories = ['Conference', 'Workshop', 'Roundtable', 'Symposium', 'Competition', 'Showcase', 'Bootcamp', 'Forum']
  const imageOptions = [
    'bg-gradient-to-br from-blue-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-teal-600',
    'bg-gradient-to-br from-orange-500 to-red-600',
    'bg-gradient-to-br from-purple-500 to-indigo-600',
    'bg-gradient-to-br from-pink-500 to-rose-600',
    'bg-gradient-to-br from-cyan-500 to-blue-600',
    'bg-gradient-to-br from-emerald-500 to-green-600',
    'bg-gradient-to-br from-slate-500 to-gray-600',
    'bg-gradient-to-br from-red-500 to-pink-600'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const eventData: Event = {
      id: editingId || Date.now(),
      title: formData.title,
      date: formData.date,
      location: formData.location,
      description: formData.description,
      category: formData.category,
      image: formData.image,
      attendees: formData.attendees
    }

    if (editingId) {
      setEvents(prev => prev.map(event => event.id === editingId ? eventData : event))
      setEditingId(null)
    } else {
      setEvents(prev => [...prev, eventData])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      location: '',
      description: '',
      category: 'Conference',
      image: 'bg-gradient-to-br from-blue-500 to-purple-600',
      attendees: 0
    })
    setIsCreating(false)
    setEditingId(null)
  }

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      category: event.category,
      image: event.image,
      attendees: event.attendees
    })
    setEditingId(event.id)
    setIsCreating(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.id !== id))
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-secondary-900">Events Management</h3>
          <p className="text-secondary-600">Create and manage events</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary"
        >
          Add Event
        </button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h4 className="text-lg font-medium text-secondary-900 mb-4">
            {editingId ? 'Edit Event' : 'Create New Event'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Expected Attendees
                </label>
                <input
                  type="number"
                  value={formData.attendees}
                  onChange={(e) => setFormData(prev => ({ ...prev, attendees: parseInt(e.target.value) || 0 }))}
                  min="0"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Background Color
              </label>
              <div className="grid grid-cols-3 gap-2">
                {imageOptions.map((option, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: option }))}
                    className={`h-12 rounded-lg ${option} border-2 ${
                      formData.image === option ? 'border-primary-600' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                {editingId ? 'Update Event' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h4 className="text-lg font-medium text-secondary-900">
            Events ({events.length})
          </h4>
        </div>
        
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-secondary-600 mb-2">No Events</h3>
            <p className="text-secondary-500">Create your first event to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-200">
            {events.map((event) => (
              <div key={event.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="text-lg font-medium text-secondary-900">{event.title}</h5>
                      <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2 py-1 rounded">
                        {event.category}
                      </span>
                    </div>
                    <div className="text-secondary-600 text-sm mb-2">
                      <div className="flex items-center space-x-4">
                        <span>📅 {formatDate(event.date)}</span>
                        <span>📍 {event.location}</span>
                        <span>👥 {event.attendees} attendees</span>
                      </div>
                    </div>
                    <p className="text-secondary-700 text-sm line-clamp-2">{event.description}</p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminEvents
