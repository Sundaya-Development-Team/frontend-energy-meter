import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const PlnSerialCard = ({ plnSerial, productName }) => {
  return (
    <CCard className="mb-4">
      <CCardHeader className="bg-info text-white">
        <strong>📋 PLN Serial Number</strong>
      </CCardHeader>
      <CCardBody className="text-center">
        <div className="mb-3">
          {productName && (
            <div className="mb-2">
              <small className="text-muted">Product</small>
              <div className="fw-semibold">{productName}</div>
            </div>
          )}
        </div>
        <div
          className="p-3 rounded"
          style={{
            backgroundColor: '#e7f3ff',
            border: '2px solid #0d6efd',
          }}
        >
          <h4 className="mb-0 fw-bold text-primary">{plnSerial}</h4>
        </div>
      </CCardBody>
    </CCard>
  )
}

export default PlnSerialCard
