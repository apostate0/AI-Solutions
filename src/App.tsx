import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Services from './components/Services'
import CaseStudies from './components/CaseStudies'
import Testimonials from './components/Testimonials'
import Blog from './components/Blog'
import FeedbackRatings from './components/FeedbackRatings'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AIChatbot from './components/AIChatbot'
import AdminLogin from './components/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import AdminOverview from './components/admin/AdminOverview'
import AdminCaseStudies from './components/admin/AdminCaseStudies'
import AdminBlogs from './components/admin/AdminBlogs'
import AdminEvents from './components/admin/AdminEvents'
import AdminTestimonials from './components/admin/AdminTestimonials'
import AdminContacts from './components/admin/AdminContacts'
import AdminFeedback from './components/admin/AdminFeedback'
import ProtectedRoute from './components/admin/ProtectedRoute'

const HomePage = () => (
  <div className="min-h-screen bg-white">
    <Header />
    <main>
      <Hero />
      <Services />
      <CaseStudies />
      <Testimonials />
      <Blog />
      <FeedbackRatings />
      <Contact />
    </main>
    <Footer />
    <AIChatbot />
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminOverview />} />
            <Route path="case-studies" element={<AdminCaseStudies />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="feedback" element={<AdminFeedback />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
