import React, { useState, useEffect } from 'react'
import { supabase, type CaseStudy } from '../../lib/supabase'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../Pagination'
import { useToast } from '../ToastContainer'
import ConfirmationModal from '../ConfirmationModal'

interface FormData {
  title: string
  client: string
  industry: string
  challenge: string
  solution: string
  results: string
  technologies: string
  image: string
  published: boolean
}

const AdminCaseStudies: React.FC = () => {
  const { showToast } = useToast()
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    caseStudyId: number | null
    caseStudyTitle: string
  }>({
    isOpen: false,
    caseStudyId: null,
    caseStudyTitle: ''
  })

  // Pagination
  const caseStudiesPerPage = 2
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedCaseStudies,
    goToPage,
    totalItems
  } = usePagination({
    data: caseStudies,
    itemsPerPage: caseStudiesPerPage
  })
  const [formData, setFormData] = useState<FormData>({
    title: '',
    client: '',
    industry: '',
    challenge: '',
    solution: '',
    results: '',
    technologies: '',
    image: 'bg-gradient-to-br from-blue-400 to-purple-600',
    published: true
  })

  useEffect(() => {
    fetchCaseStudies()
  }, [])

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setCaseStudies(data || [])
    } catch (error) {
      console.error('Error fetching case studies:', error)
    } finally {
      setLoading(false)
    }
  }

  const imageOptions = [
    'bg-gradient-to-br from-blue-400 to-purple-600',
    'bg-gradient-to-br from-green-400 to-blue-600',
    'bg-gradient-to-br from-orange-400 to-red-600',
    'bg-gradient-to-br from-purple-400 to-indigo-600',
    'bg-gradient-to-br from-pink-400 to-rose-600',
    'bg-gradient-to-br from-cyan-400 to-blue-600'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const resultsArray = formData.results.split('\n').filter(r => r.trim())
    const technologiesArray = formData.technologies.split(',').map(t => t.trim()).filter(t => t)
    
    const caseStudyData = {
      title: formData.title,
      client: formData.client,
      industry: formData.industry,
      challenge: formData.challenge,
      solution: formData.solution,
      results: resultsArray,
      technologies: technologiesArray,
      image: formData.image,
      published: formData.published
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('case_studies')
          .update(caseStudyData)
          .eq('id', editingId)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('case_studies')
          .insert([caseStudyData])
        
        if (error) throw error
      }
      
      await fetchCaseStudies()
      resetForm()
    } catch (error) {
      console.error('Error saving case study:', error)
      alert('Error saving case study. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      client: '',
      industry: '',
      challenge: '',
      solution: '',
      results: '',
      technologies: '',
      image: 'bg-gradient-to-br from-blue-400 to-purple-600',
      published: true
    })
    setIsCreating(false)
    setEditingId(null)
  }

  const handleEdit = (caseStudy: CaseStudy) => {
    setFormData({
      title: caseStudy.title,
      client: caseStudy.client,
      industry: caseStudy.industry,
      challenge: caseStudy.challenge,
      solution: caseStudy.solution,
      results: caseStudy.results.join('\n'),
      technologies: caseStudy.technologies.join(', '),
      image: caseStudy.image,
      published: caseStudy.published
    })
    setEditingId(caseStudy.id || null)
    setIsCreating(true)
  }

  const handleDeleteClick = (caseStudy: CaseStudy) => {
    setDeleteConfirmation({
      isOpen: true,
      caseStudyId: caseStudy.id!,
      caseStudyTitle: caseStudy.title
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.caseStudyId) return

    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', deleteConfirmation.caseStudyId)
      
      if (error) throw error
      await fetchCaseStudies()
      
      showToast({
        type: 'success',
        title: 'Case Study Deleted',
        message: 'Case study has been successfully deleted.'
      })
    } catch (error) {
      console.error('Error deleting case study:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete case study. Please try again.'
      })
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        caseStudyId: null,
        caseStudyTitle: ''
      })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      caseStudyId: null,
      caseStudyTitle: ''
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-secondary-900">Case Studies Management</h3>
          <p className="text-secondary-600">Create and manage case studies</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary"
        >
          Add Case Study
        </button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h4 className="text-lg font-medium text-secondary-900 mb-4">
            {editingId ? 'Edit Case Study' : 'Create New Case Study'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Client
                </label>
                <input
                  type="text"
                  value={formData.client}
                  onChange={(e) => setFormData(prev => ({ ...prev, client: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Challenge
              </label>
              <textarea
                value={formData.challenge}
                onChange={(e) => setFormData(prev => ({ ...prev, challenge: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Solution
              </label>
              <textarea
                value={formData.solution}
                onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Results (one per line)
              </label>
              <textarea
                value={formData.results}
                onChange={(e) => setFormData(prev => ({ ...prev, results: e.target.value }))}
                rows={4}
                placeholder="45% increase in conversion rates&#10;60% improvement in customer engagement&#10;35% boost in average order value"
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Technologies (comma separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
                placeholder="Python, TensorFlow, AWS, React"
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
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
                {editingId ? 'Update Case Study' : 'Create Case Study'}
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

      {/* Case Studies List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h4 className="text-lg font-medium text-secondary-900">
            Case Studies ({caseStudies.length})
          </h4>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-500">Loading case studies...</p>
          </div>
        ) : caseStudies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-secondary-600 mb-2">No Case Studies</h3>
            <p className="text-secondary-500">Create your first case study to get started.</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-secondary-200">
              {paginatedCaseStudies.map((caseStudy) => (
              <div key={caseStudy.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="text-lg font-medium text-secondary-900">{caseStudy.title}</h5>
                      <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2 py-1 rounded">
                        {caseStudy.industry}
                      </span>
                    </div>
                    <p className="text-secondary-600 mb-2">Client: {caseStudy.client}</p>
                    <p className="text-secondary-700 text-sm mb-3">{caseStudy.challenge}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {caseStudy.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-secondary-100 text-secondary-700 text-xs font-medium px-2 py-1 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(caseStudy)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(caseStudy)}
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
                itemsPerPage={caseStudiesPerPage}
              />
            )}
          </>
        )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Case Study"
        message={`Are you sure you want to delete "${deleteConfirmation.caseStudyTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      </div>
    </div>
  )
}

export default AdminCaseStudies
