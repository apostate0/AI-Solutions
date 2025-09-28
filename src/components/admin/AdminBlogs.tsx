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

const AdminBlogs: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Sneha Yadav',
    category: 'AI Trends',
    readTime: '5 min read',
    image: 'bg-gradient-to-br from-blue-400 to-purple-600',
    tags: ''
  })

  const categories = ['AI Trends', 'Machine Learning', 'Security', 'Business Strategy', 'NLP', 'AI Ethics']
  const imageOptions = [
    'bg-gradient-to-br from-blue-400 to-purple-600',
    'bg-gradient-to-br from-green-400 to-blue-600',
    'bg-gradient-to-br from-orange-400 to-red-600',
    'bg-gradient-to-br from-purple-400 to-indigo-600',
    'bg-gradient-to-br from-pink-400 to-rose-600',
    'bg-gradient-to-br from-teal-400 to-green-600'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t)
    
    const blogData: BlogPost = {
      id: editingId || Date.now(),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      date: new Date().toISOString().split('T')[0],
      category: formData.category,
      readTime: formData.readTime,
      image: formData.image,
      tags: tagsArray
    }

    if (editingId) {
      setBlogPosts(prev => prev.map(post => post.id === editingId ? blogData : post))
      setEditingId(null)
    } else {
      setBlogPosts(prev => [...prev, blogData])
    }

    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'Sneha Yadav',
      category: 'AI Trends',
      readTime: '5 min read',
      image: 'bg-gradient-to-br from-blue-400 to-purple-600',
      tags: ''
    })
    setIsCreating(false)
    setEditingId(null)
  }

  const handleEdit = (post: BlogPost) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      readTime: post.readTime,
      image: post.image,
      tags: post.tags.join(', ')
    })
    setEditingId(post.id)
    setIsCreating(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogPosts(prev => prev.filter(post => post.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-secondary-900">Blog Management</h3>
          <p className="text-secondary-600">Create and manage blog posts</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="btn-primary"
        >
          Add Blog Post
        </button>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h4 className="text-lg font-medium text-secondary-900 mb-4">
            {editingId ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
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
                Excerpt
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={2}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                rows={8}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Read Time
                </label>
                <input
                  type="text"
                  value={formData.readTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
                  placeholder="5 min read"
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="AI, Business, Trends, 2024"
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                {editingId ? 'Update Post' : 'Create Post'}
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

      {/* Blog Posts List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h4 className="text-lg font-medium text-secondary-900">
            Blog Posts ({blogPosts.length})
          </h4>
        </div>
        
        {blogPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-secondary-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-secondary-600 mb-2">No Blog Posts</h3>
            <p className="text-secondary-500">Create your first blog post to get started.</p>
          </div>
        ) : (
          <div className="divide-y divide-secondary-200">
            {blogPosts.map((post) => (
              <div key={post.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="text-lg font-medium text-secondary-900">{post.title}</h5>
                      <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2 py-1 rounded">
                        {post.category}
                      </span>
                    </div>
                    <p className="text-secondary-600 text-sm mb-2">
                      By {post.author} • {post.date} • {post.readTime}
                    </p>
                    <p className="text-secondary-700 text-sm mb-3 line-clamp-2">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-secondary-100 text-secondary-700 text-xs font-medium px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(post)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
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

export default AdminBlogs
