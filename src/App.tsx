import React from 'react'
import { Login } from './pages/Login'
import { Signup } from './pages/Signup'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { RedirectIfAuthenticated } from './components/RedirectIfAuthenticated'
import { NotFound } from './pages/NotFound'
import { DarkModeProvider } from './context/Darkmode'
import { MyTask } from './pages/MyTask'
import { Project } from './pages/Project'
import { Calendar } from './pages/Calendar'
import { Settings } from './pages/Settings'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'

const App = () => {
  return (
    <AuthProvider>
      <DarkModeProvider>
          <Routes>
            <Route
              path='/login'
              element={
                <RedirectIfAuthenticated>
                  <Login />
                </RedirectIfAuthenticated>
              }
            />
            <Route
              path='/signup'
              element={
                <RedirectIfAuthenticated>
                  <Signup />
                </RedirectIfAuthenticated>
              }
            />
    
            <Route 
              path='/'
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyTask/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path='/project'
              element={
                <ProtectedRoute>
                  <Layout>
                    <Project/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path='/calendar'
              element={
                <ProtectedRoute>
                  <Layout>
                    <Calendar/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route 
              path='/settings'
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings/>
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
   
      </DarkModeProvider>
    </AuthProvider>
  )
}

export default App