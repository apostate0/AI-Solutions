import React from 'react'

interface ContactSubmission {
  id: number
  name: string
  email: string
  company: string
  message: string
  date: string
  status: 'new' | 'contacted' | 'closed'
}

const AdminContacts: React.FC = () => {
  // Data arrays - will be populated from Supabase
  const contactSubmissions: ContactSubmission[] = []

  const updateContactStatus = (id: number, status: 'new' | 'contacted' | 'closed') => {
    // In real implementation, update in Supabase
    console.log(`Updating contact ${id} to status: ${status}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'contacted': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-secondary-200">
        <h3 className="text-lg font-medium text-secondary-900">Contact Submissions</h3>
      </div>
      
      {contactSubmissions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-secondary-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-secondary-600 mb-2">No Contact Submissions</h3>
          <p className="text-secondary-500">Contact submissions will appear here when users submit the contact form.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-secondary-200">
            <thead className="bg-secondary-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-secondary-200">
              {contactSubmissions.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-secondary-900">{contact.name}</div>
                      <div className="text-sm text-secondary-500">{contact.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-900">{contact.company}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-secondary-900 max-w-xs truncate">{contact.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">{contact.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={contact.status}
                      onChange={(e) => updateContactStatus(contact.id, e.target.value as any)}
                      className="text-sm border border-secondary-300 rounded px-2 py-1"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminContacts
