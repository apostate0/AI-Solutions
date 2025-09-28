import React from 'react'

const Hero: React.FC = () => {
  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToServices = () => {
    const element = document.getElementById('services')
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
    <section id="home" className="pt-20 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 leading-tight">
                  Transform Your Business with 
                  <span className="text-primary-600"> AI-Driven Solutions</span>
                </h1>
                <p className="text-xl text-secondary-600 leading-relaxed">
                  We're a leading IT consulting firm specializing in cutting-edge artificial intelligence solutions 
                  that drive innovation, efficiency, and growth for modern businesses.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={scrollToContact}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Get Started Today
                </button>
                <button 
                  onClick={scrollToServices}
                  className="btn-secondary text-lg px-8 py-4"
                >
                  Explore Services
                </button>
              </div>
              
              {/* Quick Contact */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-secondary-200">
                <button
                  onClick={(e) => handleEmailClick(e, 'AI Solutions Inquiry', 'Hi Sneha,\n\nI\'m interested in learning more about your AI solutions for my business.\n\nBest regards,')}
                  className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>snehasama7@gmail.com</span>
                </button>
                <a
                  href="tel:+9779818032829"
                  className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+977 981-8032829</span>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-secondary-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">50+</div>
                  <div className="text-secondary-600 font-medium">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">98%</div>
                  <div className="text-secondary-600 font-medium">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600">24/7</div>
                  <div className="text-secondary-600 font-medium">Support Available</div>
                </div>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl p-8 shadow-2xl">
                <div className="bg-white rounded-xl p-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-secondary-200 rounded w-3/4"></div>
                    <div className="h-4 bg-primary-200 rounded w-1/2"></div>
                    <div className="h-4 bg-secondary-200 rounded w-5/6"></div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="h-20 bg-primary-100 rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-primary-500 rounded"></div>
                      </div>
                      <div className="h-20 bg-secondary-100 rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-secondary-500 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-secondary-500 rounded-full opacity-20 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
