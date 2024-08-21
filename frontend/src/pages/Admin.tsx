import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store'

import { Tabs, Tab } from '@mui/material'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import CategoryIcon from '@mui/icons-material/Category'
import Inbox from '@mui/icons-material/Inbox'
import LocalOffer from '@mui/icons-material/LocalOffer'
import People from '@mui/icons-material/People'
import Info from '@mui/icons-material/Info'

import Orders from './Orders'
import Products from './Products'
import Category from './Category'
import NewProductForm from './NewProductForm'
import Profile from './Profile'
import Users from './Users'

const Admin = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const { userData } = useSelector((state: RootState) => state.usersReducer)

  return (
    <div>
      <Tabs
        className="tabs-container"
        value={tabIndex}
        onChange={(e, index) => setTabIndex(index)}
        TabIndicatorProps={{
          children: <div className={`MuiIndicator-${tabIndex}`} />
        }}
        scrollButtons="auto"
        textColor="primary"
        indicatorColor="primary">
        <Tab disableTouchRipple label={'Profile'} icon={<AssignmentIndIcon />} />
        <Tab disableTouchRipple label={'Orders'} icon={<Inbox />} />
        <Tab
          disableTouchRipple
          label={
            <div className={'MuiTabItem-labelGroup'}>
              <div className={'MuiTabItem-subLabel'}>Users</div>
            </div>
          }
          icon={<People />}
        />
        <Tab disableTouchRipple label={'Products'} icon={<LocalOffer />} />
        <Tab disableTouchRipple label={'Category'} icon={<CategoryIcon />} />
        <Tab disableTouchRipple label={'Updates'} icon={<Info />} />
      </Tabs>
      {tabIndex === 0 && <Profile></Profile>}

      {tabIndex === 1 && (
        <div>
          <Orders />
        </div>
      )}

      {tabIndex === 2 && (
        <div>
          {/* <UsersList /> */}
          <Users />
        </div>
      )}
      {tabIndex === 3 && (
        <div>
          <div>
            <NewProductForm />
          </div>
          <div>
            <Products />
          </div>
        </div>
      )}
      {tabIndex === 4 && (
        <div>
          {' '}
          <Category />
        </div>
      )}
      {tabIndex === 5 && <div></div>}
    </div>
  )
}

export default Admin
