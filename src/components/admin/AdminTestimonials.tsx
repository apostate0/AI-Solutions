import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useToast } from '../ToastContainer'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../Pagination'

interface FeedbackSubmission {
  id: number
  name: string
  email: string
  rating: number
  feedback: string
  position?: string
  company?: string
  avatar?: string
  is_testimonial?: boolean
  published?: boolean
  created_at: string
}

const AdminTestimonials: React.FC = () => {
  const { showToast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [showTestimonialsModal, setShowTestimonialsModal] = useState(false)
  const [availableReviews, setAvailableReviews] = useState<FeedbackSubmission[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [testimonials, setTestimonials] = useState<FeedbackSubmission[]>([])
  const [loadingTestimonials, setLoadingTestimonials] = useState(true)

  // Pagination for testimonials
  const testimonialsPerPage = 2
  const {
    currentPage: testimonialsPage,
    totalPages: testimonialsTotalPages,
    paginatedData: paginatedTestimonials,
    goToPage: goToTestimonialsPage,
    totalItems: totalTestimonials
  } = usePagination({
    data: testimonials,
    itemsPerPage: testimonialsPerPage
  })

  // Pagination for available reviews
  const reviewsPerPage = 10
  const {
    currentPage: reviewsPage,
    totalPages: reviewsTotalPages,
    paginatedData: paginatedReviews,
    goToPage: goToReviewsPage,
    totalItems: totalReviews
  } = usePagination({
    data: availableReviews,
    itemsPerPage: reviewsPerPage
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoadingTestimonials(true)
      const { data, error } = await supabase
        .from('feedback_submissions')
        .select('*')
        .eq('is_testimonial', true)
        .eq('published', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setTestimonials(data || [])
    } catch (err) {
      console.error('Error fetching testimonials:', err)
      setError('Failed to load testimonials. Please try again later.')
    } finally {
      setLoadingTestimonials(false)
    }
  }

  const handleSelectTestimonial = async (feedback: FeedbackSubmission) => {
    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({ is_testimonial: true, published: true })
        .eq('id', feedback.id)
      
      if (error) throw error
      
      // Remove from available reviews and refresh testimonials
      setAvailableReviews(prev => prev.filter(item => item.id !== feedback.id))
      await fetchTestimonials()
      
      showToast({
        type: 'success',
        title: 'Testimonial Added',
        message: 'Review has been successfully featured as a testimonial!'
      })
    } catch (err) {
      console.error('Error selecting testimonial:', err)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to select testimonial. Please try again.'
      })
    }
  }

  const handleRemoveTestimonial = async (testimonialId: number) => {
    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({ is_testimonial: false, published: false })
        .eq('id', testimonialId)
      
      if (error) throw error
      
      await fetchTestimonials()
      
      showToast({
        type: 'success',
        title: 'Testimonial Removed',
        message: 'Testimonial has been removed from the website.'
      })
    } catch (err) {
      console.error('Error removing testimonial:', err)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to remove testimonial. Please try again.'
      })
    }
  }

  const fetchAvailableReviews = async () => {
    try {
      setLoadingReviews(true)
      
      const { data, error } = await supabase
        .from('feedback_submissions')
        .select('*')
        .in('rating', [4, 5])
        .eq('is_testimonial', false)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setAvailableReviews(data || [])
    } catch (err) {
      console.error('Error fetching available reviews:', err)
      setError('Failed to load available reviews. Please try again later.')
    } finally {
      setLoadingReviews(false)
    }
  }


  const generateAvatar = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </span>
    ))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-secondary-900">Testimonials Management</h3>
        <p className="text-secondary-600">Select feedback to feature as testimonials on the website</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}


      {/* Featured Testimonials Section */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h4 className="text-lg font-medium text-secondary-900">Featured Testimonials</h4>
            <p className="text-sm text-secondary-500">These testimonials are currently displayed on the website</p>
          </div>
          <button
            onClick={() => {
              setShowTestimonialsModal(true)
              fetchAvailableReviews()
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <svg className="-ml-1 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Testimonial
          </button>
        </div>
        
        <div className="p-6">
          {loadingTestimonials ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-500">Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-secondary-100">
                <svg className="h-6 w-6 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10m0 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2m0 0v10a2 2 0 002 2h8a2 2 0 002-2V8M9 12h6" />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-medium text-secondary-900">No testimonials yet</h3>
              <p className="mt-1 text-sm text-secondary-500">Start by adding some testimonials from customer feedback.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {paginatedTestimonials.map((testimonial) => (
                  <div key={testimonial.id} className="bg-secondary-50 rounded-lg p-6 border border-secondary-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                          {generateAvatar(testimonial.name)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h5 className="text-sm font-medium text-secondary-900">
                                {testimonial.name}
                              </h5>
                              <p className="text-sm text-secondary-500">
                                {testimonial.position && `${testimonial.position}, `}
                                {testimonial.company}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {renderStars(testimonial.rating)}
                              </div>
                            </div>
                          </div>
                          <p className="text-secondary-700 mb-3">"{testimonial.feedback}"</p>
                          <p className="text-xs text-secondary-400">
                            Featured on {new Date(testimonial.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveTestimonial(testimonial.id)}
                        className="ml-4 inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {testimonialsTotalPages > 1 && (
                <Pagination
                  currentPage={testimonialsPage}
                  totalPages={testimonialsTotalPages}
                  onPageChange={goToTestimonialsPage}
                  totalItems={totalTestimonials}
                  itemsPerPage={testimonialsPerPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Testimonials Modal */}
    {showTestimonialsModal && (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowTestimonialsModal(false)}>
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl leading-6 font-medium text-gray-900">
                    Choose a Review
                  </h3>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => setShowTestimonialsModal(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-500">Loading reviews...</p>
                  </div>
                ) : availableReviews.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                      <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No high-rated reviews available</h3>
                    <p className="mt-1 text-sm text-gray-500">Only 4 and 5-star reviews that aren't already testimonials can be selected.</p>
                  </div>
                ) : (
                  <>
                    <div className="max-h-[60vh] overflow-y-auto">
                      <div className="space-y-4">
                        {paginatedReviews.map((review) => (
                          <div key={review.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-primary-300 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start space-x-4 flex-1">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-medium">
                                  {generateAvatar(review.name)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <div>
                                      <h5 className="text-sm font-medium text-secondary-900">
                                        {review.name}
                                      </h5>
                                      <p className="text-sm text-secondary-500">
                                        {review.position && `${review.position}, `}
                                        {review.company}
                                      </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="flex">
                                        {renderStars(review.rating)}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-secondary-700 mb-3">"{review.feedback}"</p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleSelectTestimonial(review)}
                                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                              >
                                Select as Testimonial
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {reviewsTotalPages > 1 && (
                      <div className="mt-4">
                        <Pagination
                          currentPage={reviewsPage}
                          totalPages={reviewsTotalPages}
                          onPageChange={goToReviewsPage}
                          totalItems={totalReviews}
                          itemsPerPage={reviewsPerPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={() => setShowTestimonialsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  )
}

export default AdminTestimonials
