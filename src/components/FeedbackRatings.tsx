import React, { useState, useEffect } from 'react'
import { supabase, type FeedbackSubmission } from '../lib/supabase'

const FeedbackRatings: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [newFeedback, setNewFeedback] = useState({
    name: '',
    company: '',
    services: [] as string[],
    comment: ''
  })
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [feedbackData, setFeedbackData] = useState<FeedbackSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    fetchFeedback()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.service-dropdown')) {
        setIsServiceDropdownOpen(false)
      }
    }

    if (isServiceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isServiceDropdownOpen])

  const fetchFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback_submissions')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setFeedbackData(data || [])
    } catch (error) {
      console.error('Error fetching feedback:', error)
    } finally {
      setLoading(false)
    }
  }

  const services = [
    "AI Strategy & Consulting",
    "Machine Learning Solutions", 
    "Data Analytics & BI",
    "Chatbots & NLP",
    "AI Security & Ethics",
    "Process Automation"
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewFeedback(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleService = (service: string) => {
    setNewFeedback(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const clearAllServices = () => {
    setNewFeedback(prev => ({
      ...prev,
      services: []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRating === 0) {
      alert('Please select a rating')
      return
    }
    if (newFeedback.services.length === 0) {
      alert('Please select at least one service')
      return
    }

    setIsSubmitting(true)
    
    try {
      const feedbackSubmission = {
        name: newFeedback.name,
        email: `${newFeedback.name.toLowerCase().replace(/\s+/g, '.')}@example.com`, // Generate email for now
        rating: selectedRating,
        feedback: newFeedback.comment,
        position: 'Client',
        company: newFeedback.company || 'Not specified',
        avatar: newFeedback.name.charAt(0).toUpperCase(),
        is_testimonial: false,
        published: true // Auto-publish feedback
      }

      const { error } = await supabase
        .from('feedback_submissions')
        .insert([feedbackSubmission])

      if (error) throw error

      setSubmitStatus('success')
      setNewFeedback({ name: '', company: '', services: [], comment: '' })
      setSelectedRating(0)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  const renderStars = (rating: number, interactive = false, size = 'w-5 h-5') => {
    return Array.from({ length: 5 }, (_, i) => (
      <button
        key={i}
        type={interactive ? 'button' : undefined}
        onClick={interactive ? () => setSelectedRating(i + 1) : undefined}
        onMouseEnter={interactive ? () => setHoverRating(i + 1) : undefined}
        onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
        className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
      >
        <svg
          className={`${size} ${
            i < (interactive ? (hoverRating || selectedRating) : rating) 
              ? 'text-yellow-400' 
              : 'text-secondary-300'
          } transition-colors`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const averageRating = feedbackData.length > 0 
    ? feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length 
    : 0
  const ratingCounts = [5, 4, 3, 2, 1].map(rating => 
    feedbackData.filter(item => item.rating === rating).length
  )

  // Show only first 6 reviews initially
  const displayedReviews = showAllReviews ? feedbackData : feedbackData.slice(0, 6)
  const hasMoreReviews = feedbackData.length > 6

  return (
    <section id="feedback" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Client Feedback & Ratings
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            See what our clients say about working with us and share your own experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Rating Overview */}
          <div className="lg:col-span-1">
            <div className="bg-primary-50 rounded-xl p-8 text-center">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-4">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-secondary-600 mb-6">
                Based on {feedbackData.length} reviews
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating, index) => (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm text-secondary-600 w-8">{rating}</span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="flex-1 bg-secondary-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${(ratingCounts[index] / feedbackData.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-secondary-600 w-8">{ratingCounts[index]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Feedback Form */}
            <div className="bg-secondary-50 rounded-xl p-8 mt-8">
              <h3 className="text-xl font-semibold text-secondary-900 mb-6">
                Share Your Experience
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Your Rating *
                  </label>
                  <div className="flex space-x-1">
                    {renderStars(selectedRating, true, 'w-8 h-8')}
                  </div>
                </div>

                <div>
                  <label htmlFor="feedback-name" className="block text-sm font-medium text-secondary-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="feedback-name"
                    name="name"
                    value={newFeedback.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="feedback-company" className="block text-sm font-medium text-secondary-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="feedback-company"
                    name="company"
                    value={newFeedback.company}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>

                <div className="relative service-dropdown">
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Services Used *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsServiceDropdownOpen(!isServiceDropdownOpen)}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-primary-500 focus:border-transparent flex items-center justify-between"
                    >
                      <span className="text-secondary-700">
                        {newFeedback.services.length === 0 
                          ? "Select services" 
                          : `${newFeedback.services.length} service${newFeedback.services.length > 1 ? 's' : ''} selected`
                        }
                      </span>
                      <svg 
                        className={`w-5 h-5 text-secondary-400 transition-transform ${isServiceDropdownOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {isServiceDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        <div className="p-3 border-b border-secondary-100">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-secondary-700">Choose services</span>
                            <button
                              type="button"
                              onClick={clearAllServices}
                              className="text-sm text-primary-600 hover:text-primary-700"
                            >
                              Clear All
                            </button>
                          </div>
                        </div>
                        <div className="p-2">
                          {services.map((service) => (
                            <label
                              key={service}
                              className="flex items-center p-2 hover:bg-secondary-50 rounded cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={newFeedback.services.includes(service)}
                                onChange={() => toggleService(service)}
                                className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                              />
                              <span className="ml-3 text-sm text-secondary-700">{service}</span>
                            </label>
                          ))}
                        </div>
                        <div className="p-3 border-t border-secondary-100 bg-secondary-50">
                          <button
                            type="button"
                            onClick={() => setIsServiceDropdownOpen(false)}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Selected Services Display */}
                  {newFeedback.services.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newFeedback.services.map((service) => (
                        <span
                          key={service}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {service}
                          <button
                            type="button"
                            onClick={() => toggleService(service)}
                            className="ml-2 text-primary-600 hover:text-primary-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="feedback-comment" className="block text-sm font-medium text-secondary-700 mb-2">
                    Your Feedback *
                  </label>
                  <textarea
                    id="feedback-comment"
                    name="comment"
                    value={newFeedback.comment}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Share your experience with our services..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                    isSubmitting
                      ? 'bg-secondary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  } text-white`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>

                {submitStatus === 'success' && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800 text-sm">
                      Thank you for your feedback! It helps us improve our services.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">
                      Sorry, there was an error submitting your feedback. Please try again.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Feedback List */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-secondary-500">Loading feedback...</p>
                </div>
              ) : feedbackData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-secondary-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-secondary-600 mb-2">No Feedback Available</h3>
                  <p className="text-secondary-500">Client feedback will be displayed here once submitted.</p>
                </div>
              ) : (
                <>
                  {displayedReviews.map((feedback) => (
                <div key={feedback.id} className="bg-white border border-secondary-200 rounded-xl p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                      {feedback.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-secondary-900">{feedback.name}</h4>
                          <p className="text-sm text-secondary-600">{feedback.company}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            {renderStars(feedback.rating)}
                          </div>
                          <p className="text-xs text-secondary-500">{formatDate(feedback.created_at || '')}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded">
                          {feedback.position} at {feedback.company}
                        </span>
                      </div>
                      
                      <p className="text-secondary-700 leading-relaxed">
                        {feedback.feedback}
                      </p>
                    </div>
                  </div>
                </div>
                  ))}
                  
                  {/* See More Button */}
                  {hasMoreReviews && !showAllReviews && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setShowAllReviews(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        See More Reviews ({feedbackData.length - 6} more)
                      </button>
                    </div>
                  )}
                  
                  {/* Show Less Button */}
                  {showAllReviews && (
                    <div className="text-center mt-8">
                      <button
                        onClick={() => setShowAllReviews(false)}
                        className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Show Less
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeedbackRatings
