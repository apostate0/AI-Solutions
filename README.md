# AI-Solutions Promotional Website

A modern, responsive promotional website for AI-Solutions, a leading IT consulting firm specializing in AI-driven solutions.

## 🚀 Features

### Phase 1 - Core Website (Completed)
- ✅ **Modern Homepage** - Company introduction with AI-driven services showcase
- ✅ **Responsive Design** - Mobile, tablet, and desktop optimized
- ✅ **Contact Form** - Secure form with validation (ready for Supabase integration)
- ✅ **Client Testimonials** - Interactive testimonial carousel
- ✅ **Case Studies** - Detailed success stories with results
- ✅ **Professional UI** - Clean, modern design with TailwindCSS

### Phase 2 - Extended Features (Completed)
- ✅ **Blog/News Section** - Dynamic blog with category filtering and modal view
- ✅ **Event Gallery with Lightbox** - Interactive gallery with navigation and event details
- ✅ **Feedback/Ratings System** - Star ratings, reviews, and submission form
- ✅ **AI Chatbot for FAQs** - Intelligent chatbot with contextual responses

### Phase 3 - Advanced Features (Completed)
- ✅ **Admin Dashboard (Password Protected)** - Complete admin interface with authentication
- 🔄 Advanced Search/Filter (Future Enhancement)
- 🔄 Multi-language Support (Future Enhancement)

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Backend**: Supabase (planned)
- **Deployment**: Vercel (recommended)
- **Code Quality**: ESLint + TypeScript

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn package manager

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-solutions-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Main website: `http://localhost:3000`
   - Admin dashboard: `http://localhost:3000/admin`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design System

### Colors
- **Primary**: Blue shades (#3b82f6)
- **Secondary**: Gray shades (#64748b)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-700)
- **Body**: Regular weight (400)

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 📞 Contact Information

**Primary Contact**: Sneha Yadav
- **Email**: snehasama7@gmail.com
- **Phone**: +977 981-8032829
- **Role**: Lead AI Solutions Consultant

## 🔐 Admin Dashboard

Access the admin dashboard at `/admin` with these credentials:
- **Username**: Sneha
- **Password**: SigmaSnehaSS69

**Admin Routes**:
- `/admin` - Overview dashboard
- `/admin/services` - Create and manage services
- `/admin/case-studies` - Create and manage case studies
- `/admin/blogs` - Create and manage blog posts
- `/admin/events` - Create and manage events
- `/admin/testimonials` - Create and manage testimonials
- `/admin/contacts` - Contact submission management
- `/admin/feedback` - Feedback and ratings overview
- `/admin/analytics` - Website analytics
- `/admin/login` - Admin login page

**Content Management Features**:
- **Services** - Complete service management with icons, colors, features, and descriptions
- **Case Studies** - Full CRUD operations with client info, challenges, solutions, results
- **Blog Posts** - Rich content creation with categories, tags, and author management
- **Events** - Event scheduling with dates, locations, categories, and attendee tracking
- **Testimonials** - Client testimonial management with ratings and company details
- **Form Validation** - Comprehensive validation for all content types
- **Visual Customization** - Icons, colors, and background selection for visual appeal
- **Live Preview** - Real-time preview of content as you create it

**System Features**:
- **Persistent authentication state** - Stays logged in after browser refresh
- **Session management** - 24-hour session timeout for security
- **Protected routes** - Automatic redirect to login if not authenticated
- **Loading states** - Prevents flashing during auth state checks
- **Responsive design** - Works perfectly on all devices
- **Real-time updates** - Instant content updates without page refresh

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Follow prompts** to deploy

### Manual Build

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

## 🔧 Configuration

### Environment Variables (Future)
Create a `.env.local` file for Supabase integration:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🎯 Performance Targets

- ✅ **Load Time**: < 3 seconds
- ✅ **Mobile Responsive**: All devices
- ✅ **Accessibility**: WCAG 2.1 compliant
- ✅ **SEO Optimized**: Meta tags and semantic HTML

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary to AI-Solutions. All rights reserved.

## 📞 Support

For technical support or questions:
- **Email**: snehasama7@gmail.com
- **Phone**: +977 981-8032829

---

**Built with ❤️ by the AI-Solutions Team**
