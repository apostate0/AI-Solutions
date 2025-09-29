import React, { useState, useEffect } from 'react'
import { supabase, CaseStudy } from '../lib/supabase'
import SeeMoreModal from './SeeMoreModal'

const CaseStudies: React.FC = () => {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchCaseStudies()
  }, [])

  const fetchCaseStudies = async () => {
    try {
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setCaseStudies(data || [])
    } catch (error) {
      console.error('Error fetching case studies:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderCaseStudyCard = (study: CaseStudy, index: number) => (
    <div 
      key={index}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header Image */}
      <div className={`h-48 ${study.image} flex items-center justify-center`}>
        <div className="text-white text-center">
          <h3 className="text-2xl font-bold mb-2">{study.title}</h3>
          <p className="text-white/90">{study.client}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-2">
          <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
            {study.industry}
          </span>
        </div>

        <div>
          <h4 className="font-semibold text-secondary-900 mb-2">Challenge</h4>
          <p className="text-secondary-600 text-sm">{study.challenge}</p>
        </div>

        <div>
          <h4 className="font-semibold text-secondary-900 mb-2">Solution</h4>
          <p className="text-secondary-600 text-sm">{study.solution}</p>
        </div>

        <div>
          <h4 className="font-semibold text-secondary-900 mb-2">Results</h4>
          <ul className="space-y-1">
            {study.results?.map((result: string, idx: number) => (
              <li key={idx} className="text-secondary-600 text-sm flex items-center">
                <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {result}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-secondary-900 mb-2">Technologies</h4>
          <div className="flex flex-wrap gap-2">
            {study.technologies?.map((tech: string, idx: number) => (
              <span 
                key={idx}
                className="bg-secondary-100 text-secondary-700 text-xs font-medium px-2 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const displayedCaseStudies = caseStudies.slice(0, 6)
  const hasMore = caseStudies.length > 6

  return (
    <section id="case-studies" className="section-padding bg-secondary-50">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Discover how we've helped businesses across various industries transform 
            their operations with cutting-edge AI solutions.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-secondary-500 mt-4">Loading case studies...</p>
            </div>
          ) : caseStudies.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-secondary-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-secondary-600 mb-2">No Case Studies Available</h3>
              <p className="text-secondary-500">Case studies will be displayed here once added.</p>
            </div>
          ) : (
            displayedCaseStudies.map((study: CaseStudy, index: number) => renderCaseStudyCard(study, index))
          )}
        </div>

        {/* See More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowModal(true)}
              className="bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              See More Case Studies ({caseStudies.length - 6} more)
            </button>
          </div>
        )}

        <div className="text-center mt-12">
          <button 
            onClick={() => {
              const element = document.getElementById('contact')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="btn-primary text-lg px-8 py-4"
          >
            Start Your Success Story
          </button>
        </div>
      </div>

      {/* See More Modal */}
      <SeeMoreModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="All Case Studies"
      >
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {caseStudies.map((study: CaseStudy, index: number) => renderCaseStudyCard(study, index))}
        </div>
      </SeeMoreModal>
    </section>
  )
}

export default CaseStudies
