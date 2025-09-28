import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  user: { username: string } | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved authentication state on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem('ai-solutions-auth')
      const savedUser = localStorage.getItem('ai-solutions-user')
      const savedTimestamp = localStorage.getItem('ai-solutions-timestamp')
      
      if (savedAuth === 'true' && savedUser && savedTimestamp) {
        const userData = JSON.parse(savedUser)
        const timestamp = parseInt(savedTimestamp)
        const now = Date.now()
        const sessionDuration = 24 * 60 * 60 * 1000 // 24 hours in milliseconds
        
        // Check if session is still valid (within 24 hours)
        if (now - timestamp < sessionDuration) {
          setIsAuthenticated(true)
          setUser(userData)
        } else {
          // Session expired, clear localStorage
          localStorage.removeItem('ai-solutions-auth')
          localStorage.removeItem('ai-solutions-user')
          localStorage.removeItem('ai-solutions-timestamp')
        }
      }
    } catch (error) {
      // If there's an error parsing localStorage, clear it
      console.error('Error parsing stored auth data:', error)
      localStorage.removeItem('ai-solutions-auth')
      localStorage.removeItem('ai-solutions-user')
      localStorage.removeItem('ai-solutions-timestamp')
    } finally {
      // Always set loading to false after checking localStorage
      setIsLoading(false)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', username)
      
      // Check credentials against admin_users table
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password_hash', password) // In production, use proper password hashing
        .single()

      console.log('Supabase response:', { data, error })

      if (error) {
        console.error('Supabase error:', error)
        return false
      }

      if (!data) {
        console.log('No user data returned')
        return false
      }

      const userData = { username: data.username }
      setIsAuthenticated(true)
      setUser(userData)
      
      // Save to localStorage for persistence with timestamp
      localStorage.setItem('ai-solutions-auth', 'true')
      localStorage.setItem('ai-solutions-user', JSON.stringify(userData))
      localStorage.setItem('ai-solutions-timestamp', Date.now().toString())
      
      console.log('Login successful for:', userData.username)
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    
    // Clear localStorage
    localStorage.removeItem('ai-solutions-auth')
    localStorage.removeItem('ai-solutions-user')
    localStorage.removeItem('ai-solutions-timestamp')
  }

  const value = {
    isAuthenticated,
    login,
    logout,
    user,
    isLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
