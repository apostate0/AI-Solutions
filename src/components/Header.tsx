import React, { useState } from 'react'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="container-max">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/AI-Solution.png" 
              alt="AI Solutions Logo" 
              className="h-12 w-auto mr-3"
            />
            <span className="text-2xl font-bold text-secondary-900">AI Solutions</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('home')}
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('case-studies')}
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Case Studies
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('events')}
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Events
            </button>
            <button 
              onClick={() => scrollToSection('feedback')}
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Feedback
            </button>
            <button 
              onClick={() => scrollToSection('blog')}
              className="text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Blog
            </button>
            
            {/* Search Icon */}
            <button 
              className="text-secondary-700 hover:text-primary-600 transition-colors p-2"
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            <button 
              onClick={() => scrollToSection('contact')}
              className="btn-primary"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="text-secondary-700 hover:text-primary-600 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-secondary-200">
            <div className="py-4 space-y-4">
              <button 
                onClick={() => scrollToSection('home')}
                className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('services')}
                className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium"
              >
                Services
              </button>
              <button 
                onClick={() => scrollToSection('case-studies')}
                className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium"
              >
                Case Studies
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium"
              >
                Testimonials
              </button>
              <button 
                onClick={() => scrollToSection('events')}
                className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium"
              >
                Events
              </button>
              <button 
                onClick={() => scrollToSection('feedback')}
                className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium"
              >
                Feedback
              </button>
              <button 
                onClick={() => scrollToSection('blog')}
                className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium"
              >
                Blog
              </button>
              
              {/* Search in Mobile */}
              <button 
                className="flex items-center w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
              
              <div className="px-4">
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="btn-primary w-full"
                >
                  Contact Us
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
