import React, { useState, useEffect } from 'react'
import { supabase, BlogPost } from '../../lib/supabase'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../Pagination'
import { useToast } from '../ToastContainer'
import ConfirmationModal from '../ConfirmationModal'


const AdminBlogs: React.FC = () => {
  const { showToast } = useToast()
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    blogId: number | null
    blogTitle: string
  }>({
    isOpen: false,
    blogId: null,
    blogTitle: ''
  })

  // Pagination
  const blogsPerPage = 2
  const {
    currentPage,
    totalPages,
    paginatedData: paginatedBlogs,
    goToPage,
    totalItems
  } = usePagination({
    data: blogPosts,
    itemsPerPage: blogsPerPage
  })
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Sneha Yadav',
    category: 'AI Trends',
    read_time: '5 min read',
    image: 'bg-gradient-to-br from-blue-400 to-purple-600',
    tags: '',
    published: true
  })

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setBlogPosts(data || [])
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['AI Trends', 'Machine Learning', 'Security', 'Business Strategy', 'NLP', 'AI Ethics']
  const imageOptions = [
    'bg-gradient-to-br from-blue-400 to-purple-600',
    'bg-gradient-to-br from-green-400 to-blue-600',
    'bg-gradient-to-br from-orange-400 to-red-600',
    'bg-gradient-to-br from-purple-400 to-indigo-600',
    'bg-gradient-to-br from-pink-400 to-rose-600',
    'bg-gradient-to-br from-teal-400 to-green-600'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t)
    
    const blogData = {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author,
      category: formData.category,
      read_time: formData.read_time,
      image: formData.image,
      tags: tagsArray,
      published: formData.published
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('blog_posts')
          .update(blogData)
          .eq('id', editingId)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([blogData])
        
        if (error) throw error
      }
      
      await fetchBlogPosts()
      resetForm()
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Error saving blog post. Please try again.')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'Sneha Yadav',
      category: 'AI Trends',
      read_time: '5 min read',
      image: 'bg-gradient-to-br from-blue-400 to-purple-600',
      tags: '',
      published: true
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
      read_time: post.read_time,
      image: post.image,
      tags: post.tags.join(', '),
      published: post.published
    })
    setEditingId(post.id || null)
    setIsCreating(true)
  }

  const handleDeleteClick = (post: BlogPost) => {
    setDeleteConfirmation({
      isOpen: true,
      blogId: post.id!,
      blogTitle: post.title
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.blogId) return

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', deleteConfirmation.blogId)
      
      if (error) throw error
      await fetchBlogPosts()
      
      showToast({
        type: 'success',
        title: 'Blog Post Deleted',
        message: 'Blog post has been successfully deleted.'
      })
    } catch (error) {
      console.error('Error deleting blog post:', error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete blog post. Please try again.'
      })
    } finally {
      setDeleteConfirmation({
        isOpen: false,
        blogId: null,
        blogTitle: ''
      })
    }
  }

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      blogId: null,
      blogTitle: ''
    })
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
                  value={formData.read_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
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

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-secondary-700">Published</span>
              </label>
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
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-500">Loading blog posts...</p>
          </div>
        ) : blogPosts.length === 0 ? (
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
          <>
            <div className="divide-y divide-secondary-200">
              {paginatedBlogs.map((post) => (
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
                      By {post.author} • {new Date(post.created_at || '').toLocaleDateString()} • {post.read_time}
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
                      onClick={() => handleDeleteClick(post)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              ))}
            </div>
            
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                totalItems={totalItems}
                itemsPerPage={blogsPerPage}
              />
            )}
          </>
        )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteConfirmation.blogTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
      </div>
    </div>
  )
}

export default AdminBlogs
