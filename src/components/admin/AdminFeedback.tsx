import React, { useState, useEffect } from 'react'
import { supabase, type FeedbackSubmission } from '../../lib/supabase'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../Pagination'
import { useToast } from '../ToastContainer'
import ConfirmationModal from '../ConfirmationModal'

const AdminFeedback: React.FC = () => {
  const { showToast } = useToast()
  const [feedbackSubmissions, setFeedbackSubmissions] = useState<FeedbackSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    feedbackId: number | null
    feedbackName: string
  }>({
    isOpen: false,
    feedbackId: null,
    feedbackName: ''
  })

  // Pagination
  const feedbackPerPage = 6
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedFeedback,
    goToPage,
    totalItems
  } = usePagination({
    data: feedbackSubmissions,
    itemsPerPage: feedbackPerPage
  })

  useEffect(() => {
    fetchFeedbackSubmissions()
  }, [])

  const fetchFeedbackSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback_submissions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setFeedbackSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching feedback submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublished = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({ published: !currentStatus })
        .eq('id', id)
      
      if (error) throw error
      await fetchFeedbackSubmissions()
    } catch (error) {
      console.error('Error updating feedback status:', error)
    }
  }

  const toggleTestimonial = async (id: number, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .update({ is_testimonial: !currentStatus })
        .eq('id', id)
      
      if (error) throw error
      await fetchFeedbackSubmissions()
    } catch (error) {
      console.error('Error updating testimonial status:', error)
    }
  }

  const handleDeleteClick = (feedback: FeedbackSubmission) => {
    setDeleteConfirmation({
      isOpen: true,
      feedbackId: feedback.id!,
      feedbackName: feedback.name
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.feedbackId) return

    try {
      const { error } = await supabase
        .from('feedback_submissions')
        .delete()
        .eq('id', deleteConfirmation.feedbackId)
      
      if (error) throw error
      await fetchFeedbackSubmissions()
      
      showToast({
        type: 'success',
        title: 'Feedback Deleted',
        message: 'Feedback has been successfully deleted.'
      })
    } catch (error) {
      console.error('Error deleting feedback:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete feedback. Please try again.'
      })
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        feedbackId: null,
        feedbackName: ''
      })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      feedbackId: null,
      feedbackName: ''
    })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
      </svg>
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-secondary-200">
        <h3 className="text-lg font-medium text-secondary-900">Feedback & Ratings</h3>
        <p className="text-sm text-secondary-500 mt-1">Manage client feedback and monitor service ratings</p>
      </div>

      {/* Pagination at top */}
      {!loading && feedbackSubmissions.length > 0 && totalPages > 1 && (
        <div className="px-6 py-4 border-b border-secondary-100">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            totalItems={totalItems}
            itemsPerPage={feedbackPerPage}
          />
        </div>
      )}
      
      {loading ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-500">Loading feedback submissions...</p>
        </div>
      ) : feedbackSubmissions.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="text-secondary-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-secondary-600 mb-2">No Feedback Available</h3>
          <p className="text-secondary-500">Client feedback will appear here when submitted through the website.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {paginatedFeedback.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h4 className="text-lg font-medium text-secondary-900">{feedback.name}</h4>
                    <span className="text-sm text-secondary-500">{feedback.company || 'No company'}</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  <div className="mb-3 flex items-center space-x-2">
                    <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2 py-1 rounded">
                      {feedback.position || 'Client'}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      feedback.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {feedback.published ? 'Published' : 'Pending Review'}
                    </span>
                    {feedback.is_testimonial && (
                      <span className="text-xs font-medium px-2 py-1 rounded bg-purple-100 text-purple-800">
                        Testimonial
                      </span>
                    )}
                  </div>
                  <p className="text-secondary-700 mb-3">{feedback.feedback}</p>
                  <p className="text-xs text-secondary-500">
                    Email: {feedback.email} • Submitted: {new Date(feedback.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 pt-3 border-t">
                <button
                  onClick={() => togglePublished(feedback.id!, feedback.published || false)}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    feedback.published
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {feedback.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => toggleTestimonial(feedback.id!, feedback.is_testimonial || false)}
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    feedback.is_testimonial
                      ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {feedback.is_testimonial ? 'Remove from Testimonials' : 'Add to Testimonials'}
                </button>
                <button
                  onClick={() => handleDeleteClick(feedback)}
                  className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
            ))}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Feedback"
        message={`Are you sure you want to delete the feedback from ${deleteConfirmation.feedbackName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

export default AdminFeedback
