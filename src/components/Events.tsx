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

const EventGallery: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const events: Event[] = []

  const categories = ['All', 'Conference', 'Workshop', 'Roundtable', 'Symposium', 'Competition', 'Showcase', 'Bootcamp', 'Forum']

  const filteredEvents = selectedCategory === 'All' 
    ? events 
    : events.filter(event => event.category === selectedCategory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const openLightbox = (event: Event) => {
    setSelectedEvent(event)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedEvent(null)
    document.body.style.overflow = 'unset'
  }

  const navigateEvent = (direction: 'prev' | 'next') => {
    if (!selectedEvent) return
    
    const currentIndex = filteredEvents.findIndex(event => event.id === selectedEvent.id)
    let newIndex
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredEvents.length - 1
    } else {
      newIndex = currentIndex < filteredEvents.length - 1 ? currentIndex + 1 : 0
    }
    
    setSelectedEvent(filteredEvents[newIndex])
  }

  return (
    <section id="events" className="section-padding bg-secondary-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Events & Workshops
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Explore our past and upcoming events, workshops, and conferences where we share knowledge 
            and connect with the AI community.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-secondary-700 hover:bg-secondary-100 border border-secondary-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <div className="text-secondary-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-secondary-600 mb-2">No Events Available</h3>
              <p className="text-secondary-500">Events will be displayed here once scheduled.</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
            <div 
              key={event.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              onClick={() => openLightbox(event)}
            >
              {/* Event Image */}
              <div className={`h-48 ${event.image} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-colors duration-300"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white bg-opacity-90 text-secondary-800 text-xs font-medium px-2 py-1 rounded">
                    {event.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-sm font-medium">{formatDate(event.date)}</div>
                  <div className="text-xs opacity-90">{event.attendees} attendees</div>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2 line-clamp-2">
                  {event.title}
                </h3>
                <div className="flex items-center text-sm text-secondary-500 mb-3">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.location}</span>
                </div>
                <p className="text-secondary-600 text-sm line-clamp-3">
                  {event.description}
                </p>
              </div>
            </div>
            ))
          )}
        </div>

        {/* Lightbox Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto relative">
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={() => navigateEvent('prev')}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => navigateEvent('next')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-black bg-opacity-50 text-white rounded-full flex items-center justify-center hover:bg-opacity-70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Event Header */}
              <div className={`${selectedEvent.image} p-8 text-white relative`}>
                <div className="max-w-3xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="bg-white bg-opacity-20 text-white text-sm font-medium px-3 py-1 rounded-full">
                      {selectedEvent.category}
                    </span>
                    <span className="text-sm">{selectedEvent.attendees} attendees</span>
                  </div>
                  <h1 className="text-3xl font-bold mb-4">{selectedEvent.title}</h1>
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(selectedEvent.date)}
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedEvent.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Event Content */}
              <div className="p-8">
                <div className="prose max-w-none">
                  <p className="text-secondary-700 leading-relaxed text-lg">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Event Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-secondary-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">{selectedEvent.attendees}</div>
                    <div className="text-secondary-600 text-sm">Attendees</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">4.8</div>
                    <div className="text-secondary-600 text-sm">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">95%</div>
                    <div className="text-secondary-600 text-sm">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">8h</div>
                    <div className="text-secondary-600 text-sm">Duration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default EventGallery
