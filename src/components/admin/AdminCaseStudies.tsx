import React, { useState } from 'react'

interface CaseStudy {
  id: number
  title: string
  client: string
  industry: string
  challenge: string
  solution: string
  results: string[]
  technologies: string[]
  image: string
}

const AdminCaseStudies: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    client: '',
    industry: '',
    challenge: '',
    solution: '',
    results: '',
    technologies: '',
    image: 'bg-gradient-to-br from-blue-400 to-purple-600'
  })

  const imageOptions = [
    'bg-gradient-to-br from-blue-400 to-purple-600',
    'bg-gradient-to-br from-green-400 to-blue-600',
    'bg-gradient-to-br from-orange-400 to-red-600',
    'bg-gradient-to-br from-purple-400 to-indigo-600',
    'bg-gradient-to-br from-pink-400 to-rose-600',
    'bg-gradient-to-br from-cyan-400 to-blue-600'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const resultsArray = formData.results.split('\n').filter(r => r.trim())
    const technologiesArray = formData.technologies.split(',').map(t => t.trim()).filter(t => t)
    
    const caseStudyData: CaseStudy = {
      id: editingId || Date.now(),
      title: formData.title,
      client: formData.client,
      industry: formData.industry,
      challenge: formData.challenge,
      solution: formData.solution,
      results: resultsArray,
      technologies: technologiesArray,
      image: formData.image
    }

    if (editingId) {
      setCaseStudies(prev => prev.map(cs => cs.id === editingId ? caseStudyData : cs))
      setEditingId(null)
    } else {
      setCaseStudies(prev => [...prev, caseStudyData])
    }

    resetForm()
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
      image: 'bg-gradient-to-br from-blue-400 to-purple-600'
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
      image: caseStudy.image
    })
    setEditingId(caseStudy.id)
    setIsCreating(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this case study?')) {
      setCaseStudies(prev => prev.filter(cs => cs.id !== id))
    }
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
        
        {caseStudies.length === 0 ? (
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
          <div className="divide-y divide-secondary-200">
            {caseStudies.map((caseStudy) => (
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
                      onClick={() => handleDelete(caseStudy.id)}
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

export default AdminCaseStudies
