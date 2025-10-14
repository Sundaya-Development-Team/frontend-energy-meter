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
          {/*Logo utama (LCP) */}
          <CImage
            className="sidebar-brand-full sidebar-thumbnail"
            src="/images/white.webp"
            alt="Sundaya Logo"
            width={200}
            height={50}
            loading="eager" // load secepat mungkin
            decoding="sync" // segera decode
            fetchpriority="high" //modern browser hint
            style={{
              display: 'block',
              width: '200px',
              height: '50px',
              objectFit: 'contain',
            }}
          />

          {/* logo kecil untuk sidebar collapse */}
          {/* <CImage
            className="sidebar-brand-narrow"
            src="/images/white_logo.webp"
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
          /> */}
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
