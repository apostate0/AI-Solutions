import React, { useState, useEffect } from 'react'
import { supabase, type ContactSubmission } from '../../lib/supabase'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../Pagination'
import { useToast } from '../ToastContainer'
import ConfirmationModal from '../ConfirmationModal'

const AdminContacts: React.FC = () => {
  const { showToast } = useToast()
  const [contactSubmissions, setContactSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    contactId: number | null
    contactName: string
  }>({
    isOpen: false,
    contactId: null,
    contactName: ''
  })

  // Pagination
  const contactsPerPage = 2
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedContacts,
    goToPage,
    totalItems
  } = usePagination({
    data: contactSubmissions,
    itemsPerPage: contactsPerPage
  })

  useEffect(() => {
    fetchContactSubmissions()
  }, [])

  const fetchContactSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setContactSubmissions(data || [])
    } catch (error) {
      console.error('Error fetching contact submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (contact: ContactSubmission) => {
    setDeleteConfirmation({
      isOpen: true,
      contactId: contact.id!,
      contactName: contact.name
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.contactId) return

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', deleteConfirmation.contactId)
      
      if (error) throw error
      await fetchContactSubmissions()
      
      showToast({
        type: 'success',
        title: 'Contact Deleted',
        message: 'Contact submission has been successfully deleted.'
      })
    } catch (error) {
      console.error('Error deleting contact:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete contact submission. Please try again.'
      })
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        contactId: null,
        contactName: ''
      })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      contactId: null,
      contactName: ''
    })
  }


  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-secondary-200">
        <h3 className="text-lg font-medium text-secondary-900">Contact Submissions</h3>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-secondary-500">Loading contact submissions...</p>
        </div>
      ) : contactSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-secondary-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-secondary-600 mb-2">No Contact Submissions</h3>
          <p className="text-secondary-500">Contact submissions will appear here when users submit the contact form.</p>
        </div>
      ) : (
        <>
          <div className="p-4 space-y-4">
            {paginatedContacts.map((contact) => (
              <div key={contact.id} className="bg-secondary-50 rounded-lg p-4 border border-secondary-200 hover:border-secondary-300 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                  <div className="flex-1 min-w-0">
                    {/* Contact Info */}
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-secondary-900 truncate">{contact.name}</h4>
                        <p className="text-sm text-secondary-500 truncate">{contact.email}</p>
                        {contact.company && (
                          <p className="text-xs text-secondary-400 mt-1">
                            <span className="inline-flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {contact.company}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="mb-3">
                      <p className="text-sm text-secondary-700 line-clamp-3">{contact.message}</p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-xs text-secondary-400">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {new Date(contact.created_at || '').toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleDeleteClick(contact)}
                      className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
              itemsPerPage={contactsPerPage}
            />
          )}
        </>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Contact Submission"
        message={`Are you sure you want to delete the contact submission from ${deleteConfirmation.contactName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  )
}

export default AdminContacts
