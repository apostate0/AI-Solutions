import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface OverviewStats {
  totalContacts: number
  newContacts: number
  totalFeedback: number
  avgRating: number
  totalBlogPosts: number
}

const AdminOverview: React.FC = () => {
  const [stats, setStats] = useState<OverviewStats>({
    totalContacts: 0,
    newContacts: 0,
    totalFeedback: 0,
    avgRating: 0,
    totalBlogPosts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOverviewData()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('metrics_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'metrics' }, 
        () => fetchOverviewData()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  const fetchOverviewData = async () => {
    try {
      setLoading(true)
      
      const { data: metrics, error } = await supabase
        .from('metrics')
        .select('*')
        .in('metric_name', [
          'total_contacts',
          'new_contacts',
          'total_feedback',
          'average_rating',
          'total_blog_posts'
        ])

      if (error) throw error

      // Convert metrics array to object for easier access
      const metricsObj = metrics.reduce((acc, metric) => {
        acc[metric.metric_name] = metric.metric_value
        return acc
      }, {} as Record<string, number>)

      setStats({
        totalContacts: Number(metricsObj.total_contacts) || 0,
        newContacts: Number(metricsObj.new_contacts) || 0,
        totalFeedback: Number(metricsObj.total_feedback) || 0,
        avgRating: Number(metricsObj.average_rating) || 0,
        totalBlogPosts: Number(metricsObj.total_blog_posts) || 0
      })

    } catch (error) {
      console.error('Error fetching metrics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const renderMetricCard = (title: string, value: string | number, icon: React.ReactNode, color: string) => (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center">
        <div className={`flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center bg-${color}-100`}>
          {icon}
        </div>
        <div className="ml-5">
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd className="text-2xl font-semibold text-gray-900">
            {loading ? '...' : value}
          </dd>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time metrics and insights about your website
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {renderMetricCard(
          'Total Contacts',
          formatNumber(stats.totalContacts),
          <svg className={`w-6 h-6 text-${stats.totalContacts > 0 ? 'blue' : 'gray'}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>,
          'blue'
        )}

        {renderMetricCard(
          'New Contacts (7d)',
          `+${formatNumber(stats.newContacts)}`,
          <svg className={`w-6 h-6 text-${stats.newContacts > 0 ? 'green' : 'gray'}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>,
          'green'
        )}

        {renderMetricCard(
          'Total Feedback',
          formatNumber(stats.totalFeedback),
          <svg className={`w-6 h-6 text-${stats.totalFeedback > 0 ? 'purple' : 'gray'}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>,
          'purple'
        )}

        {renderMetricCard(
          'Avg. Rating',
          stats.avgRating > 0 ? `${stats.avgRating.toFixed(1)}/5` : 'N/A',
          <svg className={`w-6 h-6 text-${stats.avgRating >= 3 ? 'yellow' : 'gray'}-600`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>,
          'yellow'
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Content Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Blog Posts</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">
                {loading ? '...' : formatNumber(stats.totalBlogPosts)}
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Case Studies</div>
              <div className="mt-1 text-2xl font-semibold text-gray-900">0</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => window.location.href = '/admin/blog/new'}
              className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              New Blog Post
            </button>
            <button
              onClick={() => window.location.href = '/admin/contacts'}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Contacts
            </button>
            <button
              onClick={() => window.location.href = '/admin/feedback'}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View All Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminOverview
