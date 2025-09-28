import React, { useState } from 'react'

interface FeedbackItem {
  id: number
  name: string
  company: string
  rating: number
  comment: string
  date: string
  service: string
  avatar: string
}

const FeedbackRatings: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [newFeedback, setNewFeedback] = useState({
    name: '',
    company: '',
    service: '',
    comment: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const feedbackData: FeedbackItem[] = []

  const services = [
    "AI Strategy & Consulting",
    "Machine Learning Solutions", 
    "Data Analytics & BI",
    "Chatbots & NLP",
    "AI Security & Ethics",
    "Process Automation"
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewFeedback(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedRating === 0) {
      alert('Please select a rating')
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate form submission (replace with actual Supabase integration later)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubmitStatus('success')
      setNewFeedback({ name: '', company: '', service: '', comment: '' })
      setSelectedRating(0)
    } catch (error) {
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

                <div>
                  <label htmlFor="feedback-service" className="block text-sm font-medium text-secondary-700 mb-2">
                    Service Used *
                  </label>
                  <select
                    id="feedback-service"
                    name="service"
                    value={newFeedback.service}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
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
              {feedbackData.length === 0 ? (
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
                feedbackData.map((feedback) => (
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
                          <p className="text-xs text-secondary-500">{formatDate(feedback.date)}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded">
                          {feedback.service}
                        </span>
                      </div>
                      
                      <p className="text-secondary-700 leading-relaxed">
                        {feedback.comment}
                      </p>
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeedbackRatings
