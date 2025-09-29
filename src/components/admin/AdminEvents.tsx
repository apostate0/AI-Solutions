import React, { useState, useEffect } from 'react'
import { supabase, type Event } from '../../lib/supabase'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../Pagination'
import { useToast } from '../ToastContainer'
import ConfirmationModal from '../ConfirmationModal'

interface FormData {
  title: string
  date: string
  time: string
  location: string
  description: string
  category: string
  image: string
  attendees: number
  duration: string
  rating: number
  satisfaction: number
  published: boolean
}

const AdminEvents: React.FC = () => {
  const { showToast } = useToast()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    eventId: number | null
    eventTitle: string
  }>({
    isOpen: false,
    eventId: null,
    eventTitle: ''
  })

  // Pagination
  const eventsPerPage = 2
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedEvents,
    goToPage,
    totalItems
  } = usePagination({
    data: events,
    itemsPerPage: eventsPerPage
  })
  const [formData, setFormData] = useState<FormData>({
    title: '',
    date: '',
    time: '12:00',
    location: '',
    description: '',
    category: 'Conference',
    image: 'bg-gradient-to-br from-blue-500 to-purple-600',
    attendees: 0,
    duration: '2h',
    rating: 4.5,
    satisfaction: 90,
    published: true
  })
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState({ hour: 12, minute: 0, ampm: 'PM' })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Conference', 'Workshop', 'Roundtable', 'Symposium', 'Competition', 'Showcase', 'Bootcamp', 'Forum']

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.category-dropdown')) {
        setIsCategoryDropdownOpen(false)
      }
      if (!target.closest('.date-picker')) {
        setIsDatePickerOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    // Fix timezone offset issue by creating date in local timezone
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const dateString = `${year}-${month}-${day}`
    setFormData(prev => ({ ...prev, date: dateString }))
  }

  const handleTimeChange = (type: 'hour' | 'minute', value: number) => {
    setSelectedTime(prev => ({ ...prev, [type]: value }))
  }

  const confirmDateTime = () => {
    if (selectedDate) {
      // Fix timezone offset issue
      const year = selectedDate.getFullYear()
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0')
      const day = selectedDate.getDate().toString().padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
      // Convert 12-hour to 24-hour format
      let hour24 = selectedTime.hour
      if (selectedTime.ampm === 'AM' && selectedTime.hour === 12) {
        hour24 = 0
      } else if (selectedTime.ampm === 'PM' && selectedTime.hour !== 12) {
        hour24 = selectedTime.hour + 12
      }
      
      const timeString = `${hour24.toString().padStart(2, '0')}:${selectedTime.minute.toString().padStart(2, '0')}`
      setFormData(prev => ({ ...prev, date: dateString, time: timeString }))
      setIsDatePickerOpen(false)
    }
  }

  const getCurrentMonth = () => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const eventData = {
      title: formData.title,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      description: formData.description,
      category: formData.category,
      image: formData.image,
      attendees: formData.attendees,
      duration: formData.duration,
      rating: formData.rating,
      satisfaction: formData.satisfaction,
      published: formData.published
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingId)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData])
        
        if (error) throw error
      }
      
      await fetchEvents()
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Error saving event. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      date: '',
      time: '12:00',
      location: '',
      description: '',
      category: 'Conference',
      image: 'bg-gradient-to-br from-blue-500 to-purple-600',
      attendees: 0,
      duration: '2h',
      rating: 4.5,
      satisfaction: 90,
      published: true
    })
    setSelectedDate(null)
    setSelectedTime({ hour: 12, minute: 0, ampm: 'PM' })
    setIsCreating(false)
    setEditingId(null)
  }

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time || '12:00',
      location: event.location,
      description: event.description,
      category: event.category,
      image: event.image,
      attendees: event.attendees,
      duration: event.duration || '2h',
      rating: event.rating || 4.5,
      satisfaction: event.satisfaction || 90,
      published: event.published
    })
    
    // Set selected date for date picker
    if (event.date) {
      setSelectedDate(new Date(event.date))
    }
    
    // Set selected time for time picker
    if (event.time) {
      const [hour24, minute] = event.time.split(':').map(Number)
      const ampm = hour24 >= 12 ? 'PM' : 'AM'
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
      setSelectedTime({ hour: hour12, minute, ampm })
    }
    
    setEditingId(event.id || null)
    setIsCreating(true)
  }

  const handleDeleteClick = (event: Event) => {
    setDeleteConfirmation({
      isOpen: true,
      eventId: event.id!,
      eventTitle: event.title
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.eventId) return

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', deleteConfirmation.eventId)
      
      if (error) throw error
      await fetchEvents()
      
      showToast({
        type: 'success',
        title: 'Event Deleted',
        message: 'Event has been successfully deleted.'
      })
    } catch (error) {
      console.error('Error deleting event:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete event. Please try again.'
      })
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        eventId: null,
        eventTitle: ''
      })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      eventId: null,
      eventTitle: ''
    })
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
              <div className="relative date-picker">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Choose Release Date
                </label>
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-primary-500 focus:border-transparent flex items-center justify-between"
                >
                  <span className="text-secondary-700">
                    {formData.date ? (
                      <>
                        {new Date(formData.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        {formData.time && (
                          <span className="ml-2 text-primary-600">
                            • {(() => {
                              const [hour24, minute] = formData.time.split(':').map(Number)
                              const ampm = hour24 >= 12 ? 'PM' : 'AM'
                              const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
                              return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
                            })()}
                          </span>
                        )}
                      </>
                    ) : 'Select date and time'}
                  </span>
                  <svg className="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                
                {isDatePickerOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg p-4">
                    <div className="text-center mb-4">
                      <div className="flex items-center justify-between mb-4">
                        <button type="button" className="p-1 hover:bg-secondary-100 rounded">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <h3 className="text-lg font-medium text-secondary-900">
                          {getCurrentMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button type="button" className="p-1 hover:bg-secondary-100 rounded">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-xs font-medium text-secondary-500 p-2 text-center">
                            {day}
                          </div>
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-7 gap-1">
                        {getDaysInMonth(getCurrentMonth()).map((date, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => date && handleDateSelect(date)}
                            disabled={!date}
                            className={`p-2 text-sm rounded-full hover:bg-primary-100 ${
                              date && selectedDate && date.toDateString() === selectedDate.toDateString()
                                ? 'bg-orange-400 text-white'
                                : date
                                ? 'text-secondary-700 hover:text-primary-600'
                                : 'text-transparent'
                            }`}
                          >
                            {date ? date.getDate() : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="text-center mb-4">
                        <h4 className="text-sm font-medium text-secondary-700 mb-3">Enter Time</h4>
                        <div className="flex items-center justify-center space-x-2">
                          <div className="text-center">
                            <div className="text-xs text-secondary-500 mb-1">Hour</div>
                            <input
                              type="number"
                              min="1"
                              max="12"
                              value={selectedTime.hour}
                              onChange={(e) => handleTimeChange('hour', parseInt(e.target.value) || 1)}
                              className="w-16 px-2 py-1 text-center border border-secondary-300 rounded"
                            />
                          </div>
                          <div className="text-2xl font-bold text-secondary-400">:</div>
                          <div className="text-center">
                            <div className="text-xs text-secondary-500 mb-1">Minute</div>
                            <input
                              type="number"
                              min="0"
                              max="59"
                              value={selectedTime.minute}
                              onChange={(e) => handleTimeChange('minute', parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 text-center border border-secondary-300 rounded"
                            />
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-secondary-500 mb-1">Period</div>
                            <div className="flex">
                              <button
                                type="button"
                                onClick={() => setSelectedTime(prev => ({ ...prev, ampm: 'AM' }))}
                                className={`px-3 py-1 text-sm font-medium rounded-l border ${
                                  selectedTime.ampm === 'AM' 
                                    ? 'bg-primary-600 text-white border-primary-600' 
                                    : 'bg-white text-secondary-700 border-secondary-300 hover:bg-secondary-50'
                                }`}
                              >
                                AM
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedTime(prev => ({ ...prev, ampm: 'PM' }))}
                                className={`px-3 py-1 text-sm font-medium rounded-r border-l-0 border ${
                                  selectedTime.ampm === 'PM' 
                                    ? 'bg-primary-600 text-white border-primary-600' 
                                    : 'bg-white text-secondary-700 border-secondary-300 hover:bg-secondary-50'
                                }`}
                              >
                                PM
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsDatePickerOpen(false)}
                          className="flex-1 py-2 px-4 text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const now = new Date()
                            handleDateSelect(now)
                            const hour24 = now.getHours()
                            const ampm = hour24 >= 12 ? 'PM' : 'AM'
                            const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24
                            setSelectedTime({ hour: hour12, minute: now.getMinutes(), ampm })
                          }}
                          className="flex-1 py-2 px-4 text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Now
                        </button>
                      </div>
                      
                      <button
                        type="button"
                        onClick={confirmDateTime}
                        className="w-full mt-2 py-2 px-4 bg-secondary-900 text-white rounded-lg hover:bg-secondary-800 font-medium"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
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
              <div className="relative category-dropdown">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Category
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-primary-500 focus:border-transparent flex items-center justify-between"
                >
                  <span className="text-secondary-700">{formData.category}</span>
                  <svg 
                    className={`w-5 h-5 text-secondary-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isCategoryDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, category }))
                            setIsCategoryDropdownOpen(false)
                          }}
                          className={`w-full text-left p-3 hover:bg-secondary-50 rounded-lg transition-colors ${
                            formData.category === category ? 'bg-primary-50 text-primary-700' : 'text-secondary-700'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g., 2h, 3h 30m"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: parseFloat(e.target.value) || 4.5 }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Satisfaction (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.satisfaction}
                  onChange={(e) => setFormData(prev => ({ ...prev, satisfaction: parseInt(e.target.value) || 90 }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-secondary-700">Published</span>
              </label>
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
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-500">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
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
          <>
            <div className="divide-y divide-secondary-200">
              {paginatedEvents.map((event) => (
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
                          {event.time && <span>🕐 {event.time}</span>}
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
                        onClick={() => handleDeleteClick(event)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                totalItems={totalItems}
                itemsPerPage={eventsPerPage}
              />
            )}
          </>
        )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleteConfirmation.eventTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      </div>
    </div>
  )
}

export default AdminEvents
