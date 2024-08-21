import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'

import { Tabs, Tab } from '@mui/material'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import CategoryIcon from '@mui/icons-material/Category'
import Inbox from '@mui/icons-material/Inbox'
import LocalOffer from '@mui/icons-material/LocalOffer'
import People from '@mui/icons-material/People'
import Info from '@mui/icons-material/Info'
import { fetchUser } from '../redux/slices/products/userSlice'

import style from './styles/profile.module.css'
import Profile from './Profile'
import Orders from './Orders'
import UsersList from './UsersList'
import Products from './Products'
import Category from './Category'
import NewProductForm from './NewProductForm'
import UserOrdersComponent from './UserOrders'
const User = () => {
  const { userData } = useSelector((state: RootState) => state.usersReducer)
  const [tabIndex, setTabIndex] = useState(0)

  const dispatch: AppDispatch = useDispatch()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [user, setUser] = useState({
    firstName: userData?.first_name,
    lastName: userData?.last_name
  })
  useEffect(() => {
    dispatch(fetchUser())
  }, [])

  const handelEdite = () => {
    setIsFormOpen(true)
  }
  // const handelSave = (event: FormEvent) => {
  //   event.preventDefault()
  //   const updateUserData = { id: userData?.id, ...user }
  //   dispatch(updateUser(updateUserData))
  //   setIsFormOpen(false)
  // }
  const handelChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = event.target
    setUser((prevUser) => {
      return { ...prevUser, [name]: value }
    })
  }
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
        {/* <Tab
          disableTouchRipple
          label={
            <div className={'MuiTabItem-labelGroup'}>
              <div className={'MuiTabItem-subLabel'}>Users</div>
            </div>
          }
          icon={<People />}
        /> */}
        <Tab disableTouchRipple label={'Products'} icon={<LocalOffer />} />
        {/* <Tab disableTouchRipple label={'Category'} icon={<CategoryIcon />} /> */}
        <Tab disableTouchRipple label={'Updates'} icon={<Info />} />
      </Tabs>
      {tabIndex === 0 && <Profile></Profile>}

      {tabIndex === 1 && (
        <div>
          {/* <h1>Here I should display user orders</h1> */}
          <UserOrdersComponent/>
        </div>
      )}

      {/* {tabIndex === 2 && (
        <div>
        </div>
      )} */}
      {tabIndex === 2 && (
        <div>
          <h1>Here I should display user Fav products</h1>
        </div>
      )}
      {/* {tabIndex === 4 && (
        <div>
          {' '}
          <Category />
        </div>
      )} */}
      {tabIndex === 3 && <div></div>}
    </div>
  )
}

export default User
