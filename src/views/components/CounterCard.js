import React from 'react'
import { CCard, CCardBody } from '@coreui/react'

const CounterCard = ({ title, value }) => (
  <CCard className="mb-3">
    <CCardBody>
      <h6 className="text-muted">{title}</h6>
      <h4>{value}</h4>
    </CCardBody>
  </CCard>
)

export default CounterCard
