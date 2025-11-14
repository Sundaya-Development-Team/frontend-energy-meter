import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const SuccessCard = ({ serialNumber, message, additionalInfo }) => {
  return (
    <CCard className="mb-4 h-100 d-flex flex-column success-card">
      <CCardHeader className="success-card-header">
        <strong>✓ Success</strong>
      </CCardHeader>
      <CCardBody className="d-flex flex-column justify-content-center align-items-center flex-grow-1 success-card-body">
        <div className="text-center">
          <div className="success-icon">✓</div>
          <h4 className="success-title">VALID</h4>
          {serialNumber && (
            <div className="success-serial-number">Serial: {serialNumber}</div>
          )}
          {message && <p className="success-message">{message}</p>}
          {additionalInfo && <div className="success-additional-info">{additionalInfo}</div>}
        </div>
      </CCardBody>
    </CCard>
  )
}

export default SuccessCard

