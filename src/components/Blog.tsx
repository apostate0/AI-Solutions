import React, { useState } from 'react'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  readTime: string
  image: string
  tags: string[]
}

const Blog: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)

  const blogPosts: BlogPost[] = []

  const categories = ['All', 'AI Trends', 'Machine Learning', 'Security', 'Business Strategy', 'NLP', 'AI Ethics']

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const openPost = (post: BlogPost) => {
    setSelectedPost(post)
    document.body.style.overflow = 'hidden'
  }

  const closePost = () => {
    setSelectedPost(null)
    document.body.style.overflow = 'unset'
  }

  return (
    <section id="blog" className="section-padding bg-white">
      <div className="container-max">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-secondary-900 mb-4">
            Latest Insights & News
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Stay updated with the latest trends, insights, and best practices in AI and digital transformation.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <div className="text-secondary-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-secondary-600 mb-2">No Blog Posts Available</h3>
              <p className="text-secondary-500">Blog posts will be displayed here once published.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
            <article 
              key={post.id}
              className="bg-white border border-secondary-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              onClick={() => openPost(post)}
            >
              {/* Post Image */}
              <div className={`h-48 ${post.image} flex items-center justify-center`}>
                <div className="text-white text-center p-4">
                  <div className="text-sm font-medium mb-2">{post.category}</div>
                  <div className="text-xs opacity-90">{formatDate(post.date)}</div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                <div className="flex items-center justify-between text-sm text-secondary-500 mb-3">
                  <span>{post.author}</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-xl font-semibold text-secondary-900 mb-3 line-clamp-2">
                  {post.title}
                </h3>

                <p className="text-secondary-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
            ))
          )}
        </div>

        {/* Blog Post Modal */}
        {selectedPost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className={`${selectedPost.image} p-8 text-white relative`}>
                <button
                  onClick={closePost}
                  className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="max-w-3xl">
                  <div className="text-sm font-medium mb-2">{selectedPost.category}</div>
                  <h1 className="text-3xl font-bold mb-4">{selectedPost.title}</h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>By {selectedPost.author}</span>
                    <span>•</span>
                    <span>{formatDate(selectedPost.date)}</span>
                    <span>•</span>
                    <span>{selectedPost.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8">
                <div className="prose max-w-none">
                  {selectedPost.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-secondary-700 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t border-secondary-200">
                  {selectedPost.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Blog
