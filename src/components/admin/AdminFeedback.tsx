import React from 'react'

interface FeedbackSubmission {
  id: number
  name: string
  company: string
  service: string
  rating: number
  comment: string
  date: string
}

const AdminFeedback: React.FC = () => {
  // Data arrays - will be populated from Supabase
  const feedbackSubmissions: FeedbackSubmission[] = []

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-secondary-900">Feedback & Ratings</h3>
        <p className="text-secondary-600">Manage client feedback and monitor service ratings</p>
      </div>

      {feedbackSubmissions.length === 0 ? (
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
        <div className="space-y-6">
          {feedbackSubmissions.map((feedback) => (
            <div key={feedback.id} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h4 className="text-lg font-medium text-secondary-900">{feedback.name}</h4>
                    <span className="text-sm text-secondary-500">{feedback.company}</span>
                    <div className="flex items-center space-x-1">
                      {renderStars(feedback.rating)}
                    </div>
                  </div>
                  <div className="mb-3">
                    <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2 py-1 rounded">
                      {feedback.service}
                    </span>
                  </div>
                  <p className="text-secondary-700">{feedback.comment}</p>
                </div>
                <div className="text-sm text-secondary-500">{feedback.date}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminFeedback
