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
              className="text-secondary-700 hover:text-primary-600 focus:outline-none transition-colors"
            >
              <svg className="w-6 h-6 transition-transform duration-300 ease-in-out" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12"
                    className="animate-in fade-in duration-200"
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16"
                    className="animate-in fade-in duration-200"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden bg-white border-t border-secondary-200 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className={`py-4 space-y-4 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-y-0' : '-translate-y-4'
          }`}>
            <button 
              onClick={() => scrollToSection('home')}
              className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection('services')}
              className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Services
            </button>
            <button 
              onClick={() => scrollToSection('case-studies')}
              className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Case Studies
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('events')}
              className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Events
            </button>
            <button 
              onClick={() => scrollToSection('feedback')}
              className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Feedback
            </button>
            <button 
              onClick={() => scrollToSection('blog')}
              className="block w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              Blog
            </button>
            
            {/* Search in Mobile */}
            <button 
              className="flex items-center w-full text-left px-4 py-2 text-secondary-700 hover:text-primary-600 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
            
            <div className="px-4">
              <button 
                onClick={() => scrollToSection('contact')}
                className="btn-primary w-full transition-all"
              >
                Contact Us
              </button>
            </div>

            {/* Contact Info */}
            <div className="px-4 pt-4 border-t border-secondary-100 space-y-3">
              <div className="flex items-center text-secondary-600 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                snehasama7@gmail.com
              </div>
              <div className="flex items-center text-secondary-600 text-sm">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +977 981-8032829
              </div>
            </div>

            {/* Stats */}
            <div className="px-4 pt-4 border-t border-secondary-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600">50+</div>
                  <div className="text-xs text-secondary-600">Projects Delivered</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">98%</div>
                  <div className="text-xs text-secondary-600">Client Satisfaction</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">24/7</div>
                  <div className="text-xs text-secondary-600">Support Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
