import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const DefaultLayout = ({ children }) => {
  return (
    <div className="app d-flex">
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <div className="container-lg">{children ? children : <AppContent />}</div>
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
