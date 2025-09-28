import React, { useState, useRef, useEffect } from 'react'

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
  options?: string[]
}

interface FAQ {
  question: string
  answer: string
  keywords: string[]
  category: string
}

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I can help you with questions about our services, pricing, implementation process, and more. How can I assist you today?",
      isBot: true,
      timestamp: new Date(),
      options: ["Our Services", "Pricing Information", "Implementation Process", "Contact Sales"]
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const faqs: FAQ[] = [
    {
      question: "What AI services do you offer?",
      answer: "We offer comprehensive AI services including AI Strategy & Consulting, Machine Learning Solutions, Data Analytics & BI, Chatbots & NLP, AI Security & Ethics, and Process Automation. Each service is tailored to meet your specific business needs.",
      keywords: ["services", "ai services", "what do you offer", "solutions"],
      category: "services"
    },
    {
      question: "How much do your services cost?",
      answer: "Our pricing varies based on project scope, complexity, and duration. We offer flexible pricing models including project-based, hourly rates, and retainer agreements. Contact us for a personalized quote based on your specific requirements.",
      keywords: ["price", "cost", "pricing", "how much", "budget"],
      category: "pricing"
    },
    {
      question: "How long does implementation take?",
      answer: "Implementation timelines vary by project complexity. Simple chatbot implementations can take 2-4 weeks, while comprehensive AI strategy implementations may take 3-6 months. We provide detailed timelines during our initial consultation.",
      keywords: ["timeline", "how long", "implementation", "duration", "time"],
      category: "implementation"
    },
    {
      question: "Do you provide ongoing support?",
      answer: "Yes! We provide 24/7 technical support, regular system monitoring, performance optimization, and maintenance services. Our support packages are designed to ensure your AI solutions continue to deliver value.",
      keywords: ["support", "maintenance", "ongoing", "help", "assistance"],
      category: "support"
    },
    {
      question: "What industries do you work with?",
      answer: "We work across various industries including healthcare, finance, manufacturing, retail, technology, and more. Our AI solutions are adaptable to different industry requirements and compliance standards.",
      keywords: ["industries", "sectors", "healthcare", "finance", "manufacturing", "retail"],
      category: "industries"
    },
    {
      question: "How do you ensure data security?",
      answer: "We implement enterprise-grade security measures including data encryption, secure access controls, compliance with GDPR and other regulations, regular security audits, and secure cloud infrastructure.",
      keywords: ["security", "data protection", "privacy", "gdpr", "compliance", "safe"],
      category: "security"
    },
    {
      question: "Can you integrate with existing systems?",
      answer: "Absolutely! We specialize in seamless integration with existing business systems, databases, CRMs, ERPs, and third-party applications. We ensure minimal disruption to your current operations.",
      keywords: ["integration", "existing systems", "compatibility", "connect", "apis"],
      category: "integration"
    },
    {
      question: "Do you offer training for our team?",
      answer: "Yes, we provide comprehensive training programs for your team including technical training for IT staff, user training for end-users, and executive briefings for leadership teams.",
      keywords: ["training", "education", "learn", "team training", "workshops"],
      category: "training"
    },
    {
      question: "What is your success rate?",
      answer: "We maintain a 98% client satisfaction rate with over 50+ successful AI implementations. Our clients typically see ROI within the first quarter of deployment.",
      keywords: ["success rate", "track record", "results", "roi", "satisfaction"],
      category: "results"
    },
    {
      question: "How do I get started?",
      answer: "Getting started is easy! Contact Sneha Yadav at snehasama7@gmail.com or call +977 981-8032829 to schedule a free consultation. We'll assess your needs and provide a customized proposal.",
      keywords: ["get started", "begin", "contact", "consultation", "first step"],
      category: "contact"
    }
  ]

  const quickResponses = {
    "Our Services": "We offer AI Strategy & Consulting, Machine Learning Solutions, Data Analytics & BI, Chatbots & NLP, AI Security & Ethics, and Process Automation. Which service interests you most?",
    "Pricing Information": "Our pricing is customized based on your specific needs. Factors include project scope, complexity, and timeline. Would you like to schedule a consultation for a detailed quote?",
    "Implementation Process": "Our implementation follows a structured approach: 1) Consultation & Assessment, 2) Strategy Development, 3) Solution Design, 4) Development & Testing, 5) Deployment, 6) Training & Support. Which phase would you like to know more about?",
    "Contact Sales": "You can reach our sales team directly: Email: snehasama7@gmail.com, Phone: +977 981-8032829, or use our contact form. We typically respond within 24 hours."
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const findBestMatch = (userInput: string): FAQ | null => {
    const input = userInput.toLowerCase()
    let bestMatch: FAQ | null = null
    let highestScore = 0

    faqs.forEach(faq => {
      let score = 0
      faq.keywords.forEach(keyword => {
        if (input.includes(keyword.toLowerCase())) {
          score += keyword.length
        }
      })
      
      if (score > highestScore) {
        highestScore = score
        bestMatch = faq
      }
    })

    return highestScore > 0 ? bestMatch : null
  }

  const generateBotResponse = (userMessage: string): string => {
    // Check for quick responses first
    if (quickResponses[userMessage as keyof typeof quickResponses]) {
      return quickResponses[userMessage as keyof typeof quickResponses]
    }

    // Find FAQ match
    const match = findBestMatch(userMessage)
    if (match) {
      return match.answer
    }

    // Default responses for common greetings
    const input = userMessage.toLowerCase()
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! How can I help you today? I can answer questions about our AI services, pricing, implementation, and more."
    }

    if (input.includes('thank') || input.includes('thanks')) {
      return "You're welcome! Is there anything else I can help you with regarding our AI solutions?"
    }

    if (input.includes('bye') || input.includes('goodbye')) {
      return "Thank you for your interest in AI-Solutions! Feel free to contact us anytime at snehasama7@gmail.com or +977 981-8032829. Have a great day!"
    }

    // Default fallback
    return "I'd be happy to help! I can provide information about our AI services, pricing, implementation process, and more. You can also contact our team directly at snehasama7@gmail.com or +977 981-8032829 for personalized assistance."
  }

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputText,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText)
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date(),
        options: botResponse.includes('Which service interests you') ? 
          ["AI Strategy", "Machine Learning", "Data Analytics", "Chatbots", "Security", "Automation"] :
          botResponse.includes('Which phase would you like') ?
          ["Consultation", "Strategy", "Design", "Development", "Deployment", "Support"] :
          undefined
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleOptionClick = (option: string) => {
    handleQuickResponse(option)
  }

  const handleQuickResponse = (response: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: response,
      isBot: false,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const botResponse = generateBotResponse(response)
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 ${
          isOpen ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'
        } text-white`}
      >
        {isOpen ? (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 z-30 sm:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-20 sm:bottom-24 sm:right-6 sm:left-auto sm:w-80 h-[min(60vh,400px)] sm:h-[400px] max-h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">ChatBot</h3>
                <p className="text-xs text-gray-500">AI Solutions expert 🤖 How can I help you today?</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                {message.isBot && (
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[80%] ${
                  message.isBot 
                    ? 'bg-white border border-gray-200 text-gray-800' 
                    : 'bg-blue-600 text-white ml-auto'
                } rounded-2xl px-3 py-2 shadow-sm`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isBot ? 'text-gray-500' : 'text-blue-100'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                  
                  {/* Quick Options */}
                  {message.options && (
                    <div className="mt-2 space-y-1">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg px-2 py-1 transition-colors border border-blue-200"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-3 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex space-x-2 items-end">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Write your question"
                  className="w-full px-3 py-2 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 resize-none"
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-2xl transition-colors flex-shrink-0 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              ChatBot may produce inaccurate information
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default AIChatbot
