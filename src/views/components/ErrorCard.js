import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const ErrorCard = ({ serialNumber, message }) => {
  return (
    <CCard className="mb-4 h-100 d-flex flex-column error-card">
      <CCardHeader className="error-card-header">
        <strong>⚠️ Error</strong>
      </CCardHeader>
      <CCardBody className="d-flex flex-column justify-content-center align-items-center flex-grow-1 error-card-body">
        <div className="text-center">
          <div className="error-icon">❌</div>
          <h4 className="error-title">ERROR</h4>
          {serialNumber && <div className="error-serial-number">Serial: {serialNumber}</div>}
          {message && <p className="error-message">{message}</p>}
        </div>
      </CCardBody>
    </CCard>
  )
}

export default ErrorCard

