import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CImage,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'
import { useAuth } from '../context/AuthContext'
import { filterNavByPermissions } from '../utils/FilterNavPermission'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { user } = useAuth()

  const filteredNav = filterNavByPermissions(navigation, user?.permissions || [])

  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
          {/* ⚡ LOGO UTAMA (LCP) */}
          <CImage
            className="sidebar-brand-full sidebar-thumbnail"
            src="http://192.168.100.226:3000/images/white.webp"
            alt="Sundaya Logo"
            width={192}
            height={42}
            fetchpriority="high"
            loading="eager"
            decoding="async"
            style={{
              display: 'block',
              width: '192px',
              height: '42px',
              objectFit: 'contain',
            }}
          />

          {/*Logo kecil (hanya muncul saat sidebar collapse) */}
          <CImage
            className="sidebar-brand-narrow d-none"
            src="http://192.168.100.226:3000/images/white_logo.webp"
            alt="Sundaya Logo Narrow"
            width={40}
            height={40}
            loading="lazy"
            decoding="async"
            style={{
              display: 'block',
              width: '40px',
              height: '40px',
              objectFit: 'contain',
            }}
          />
        </CSidebarBrand>

        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* Navigasi yang difilter berdasarkan permission */}
      <AppSidebarNav items={filteredNav} />

      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
