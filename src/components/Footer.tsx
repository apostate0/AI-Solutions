import React from 'react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleEmailClick = (e: React.MouseEvent, subject: string = '', body: string = '') => {
    e.preventDefault()
    
    // Check if it's a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // On mobile, use mailto to open native app
      const mailtoUrl = `mailto:snehasama7@gmail.com${subject ? `?subject=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`
      window.location.href = mailtoUrl
    } else {
      // On desktop, open Gmail in new tab
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=snehasama7@gmail.com${subject ? `&su=${encodeURIComponent(subject)}` : ''}${body ? `&body=${encodeURIComponent(body)}` : ''}`
      window.open(gmailUrl, '_blank')
    }
  }

  return (
    <footer className="bg-secondary-900 text-white">
        <div className="section-padding">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <img 
                  src="/AI-Solution.png" 
                  alt="AI Solutions Logo" 
                  className="h-12 w-auto mr-3"
                />
                <span className="text-2xl font-bold text-white">AI Solutions</span>
              </div>
              <p className="text-secondary-300 mb-6 max-w-md">
                Leading IT consulting firm specializing in cutting-edge artificial intelligence solutions 
                that drive innovation, efficiency, and growth for modern businesses.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <button 
                    onClick={(e) => handleEmailClick(e)}
                    className="text-secondary-300 hover:text-primary-400 transition-colors text-left"
                  >
                    snehasama7@gmail.com
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a 
                    href="tel:+9779818032829" 
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    +977 981-8032829
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-secondary-300">Sneha Yadav - Lead Consultant</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection('home')}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('services')}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('case-studies')}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    Case Studies
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('testimonials')}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    Testimonials
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('events')}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    Events
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('feedback')}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    Feedback
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('blog')}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="text-secondary-300 hover:text-primary-400 transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Our Services</h3>
              <ul className="space-y-3">
                <li className="text-secondary-300">AI Strategy & Consulting</li>
                <li className="text-secondary-300">Machine Learning Solutions</li>
                <li className="text-secondary-300">Data Analytics & BI</li>
                <li className="text-secondary-300">Chatbots & NLP</li>
                <li className="text-secondary-300">AI Security & Ethics</li>
                <li className="text-secondary-300">Process Automation</li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-secondary-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-secondary-400 text-sm">
                © {currentYear} AI-Solutions. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-secondary-400 hover:text-primary-400 transition-colors">
                  Cookie Policy
                </a>
                <a href="/admin" className="text-secondary-400 hover:text-primary-400 transition-colors">
                  Admin
                </a>
              </div>
            </div>
          </div>
        </div>
    </footer>
  )
}

export default Footer
