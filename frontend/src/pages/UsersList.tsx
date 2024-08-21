import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../redux/store'
import {
  adminUser,
  banUser,
  deleteUser,
  fetchUser,
  fetchUserById,
  searchUser,
  sortUsers,
  unadminUser,
  unbanUser,
  updateUser
} from '../redux/slices/products/userSlice'

import style from './styles/usersList.module.css'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { baseURL } from '../api'

const UsersList = () => {
  const { search, users } = useSelector((state: RootState) => state.usersReducer)
  const dispatch: AppDispatch = useDispatch()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [userId, setUserId] = useState('')

  const [updateUserData, setUpdateUser] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    image: '',
    address: ''
  })
  useEffect(() => {
    dispatch(fetchUser())
  }, [dispatch])

  const handelChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === 'file') {
      const imageFile = event.target.files?.[0]
      const { name } = event.target
      setUpdateUser((prevUser) => {
        return { ...prevUser, [name]: imageFile }
      })
    } else {
      const { value, name } = event.target
      setUpdateUser((prevUser) => {
        return { ...prevUser, [name]: value }
      })
    }
  }
  const getUserId = (productId: string) => {
    setUserId(productId)
  }
  const handelEdit = async (userId: string) => {
    setIsFormOpen(true)
    try {
      // const productDetails = await fetchSingleProduct(productId)
      const actionResult = await dispatch(fetchUserById(userId))
      const userDetails = actionResult.payload
      setUpdateUser({
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        phone: userDetails.phone,
        email: userDetails.email,
        image: userDetails.image,
        address: userDetails.address
      })
      setIsFormOpen(true)
      setUserId(userId)
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }
  const searchFilter =
    users && users.length > 0
      ? users.filter((user) => {
          const filteredUsers =
            search !== ''
              ? user.first_name.toLowerCase().includes(search.toString().toLowerCase())
              : users
          return filteredUsers
        })
      : users

  const handelSave = async (event: FormEvent) => {
    event.preventDefault()
    // const updatedImagePath = `http://localhost:5050/public/images/usersImages/${updateUserData.image}`
    // const updatedUser = { ...updateUserData, image: updatedImagePath }
    // const updateUserinfo = updateUserData
    const formData = new FormData()
    formData.append('first_name', updateUserData.first_name)
    formData.append('last_name', updateUserData.last_name)
    formData.append('phone', updateUserData.phone)
    formData.append('image', updateUserData.image)
    formData.append('email', updateUserData.email)
    formData.append('address', updateUserData.address)

    try {
      const response = await dispatch(updateUser({ id: userId, updatedData: formData }))
      // Meassage
    } catch (error) {
      console.log(error)
    }
    dispatch(fetchUser())
    // dispatch(updatedProduct(updateProductData))
    setIsFormOpen(false)
  }

  const handelDelete = async (id: string) => {
    try {
      const response = await dispatch(deleteUser(id))
      dispatch(fetchUser())
      // Messages notification
    } catch (error) {
      console.log(error)
      // Error Message notification
    }
  }

  const handelBanUnban = async (id: string, isBanned: boolean) => {
    try {
      const response = isBanned ? await unbanUser(id) : await banUser(id)
      dispatch(fetchUser())
      // Messages notification
    } catch (error) {
      console.log(error)
      // Error Message notification
    }
  }

  const handelAdminRole = async (id: string, isAdmin: boolean) => {
    try {
      const response = isAdmin ? await unadminUser(id) : await adminUser(id)
      dispatch(fetchUser())
      // Messages notification
    } catch (error) {
      console.log(error)
      // Error Message notification
    }
  }
  const handleOptions = (event: ChangeEvent<HTMLSelectElement>) => {
    const sortValue = event.target.value
    dispatch(sortUsers(sortValue))
  }
  const handelSearch = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(searchUser(event.target.value))
  }

  return (
    <div className={style.user_list_container}>
      <div>
        <label htmlFor="search">Search:</label>
        <input type="text" placeholder="Search . . ." onChange={handelSearch} value={search} />
        <label htmlFor="sort">Sort by:</label>
        <select className={style.selcet} name="sort" id="sort" onChange={handleOptions}>
          <option className={style.option} value="first_name">
            Name
          </option>
          <option className={style.option} value="createdAt">
            createdAt
          </option>
          {/* <option className={style.option} value="h-price">
          Higher Price
        </option> */}
        </select>
      </div>

      {isFormOpen && (
        <form action="">
          <div className={style.items_container}>
            <input
              className={style.product_input}
              type="text"
              name="first_name"
              placeholder="first_name"
              value={updateUserData.first_name}
              onChange={handelChange}
              required
            />
            <input
              className={style.product_input}
              type="text"
              name="last_name"
              placeholder="last_name"
              value={updateUserData.last_name}
              onChange={handelChange}
              required
            />
            <input
              className={style.product_input}
              type="text"
              name="email"
              placeholder="email"
              value={updateUserData.email}
              onChange={handelChange}
              required
            />
            <input
              className={style.input}
              type="number"
              placeholder="+966"
              name="phone"
              value={updateUserData.phone}
              onChange={handelChange}
              required
            />
            <input
              className={style.input}
              type="text"
              placeholder="Address"
              name="address"
              value={updateUserData.address}
              onChange={handelChange}
              required
            />
            <input
              className={style.input}
              type="file"
              name="image"
              accept="image/*"
              onChange={handelChange}
            />
            {/* <input className={style.product_input} type="file" id="files" name="files" multiple /> */}
          </div>
          {/* {alertMessage && <Alert severity="error">{alertMessage}</Alert>} <br />
        {successAlertMessage && <Alert severity="success">{successAlertMessage}</Alert>} <br /> */}
          <button className={style.submit_btn} type="submit" onClick={handelSave}>
            Submit
          </button>
        </form>
      )}

      <ul>
        {searchFilter.length > 0 &&
          searchFilter.map((user) => {
            const { _id, first_name, last_name, email, phone, image, isBanned, address, isAdmin } =
              user
            return (
              <div key={_id} className={style.users_item}>
                <li>
                  <img src={`${baseURL}/${image}`} alt="" width={'10%'} />
                  <h2 className={style.user_info}>
                    {isBanned ? (
                      <span className={`${style.user_span} ${style.banned}`}>User is Banned</span>
                    ) : (
                      // <span className={style.user_span}>Not Banned</span>
                      ''
                    )}
                  </h2>
                  <h2 className={style.user_info}>
                    {isAdmin ? (
                      <span className={`${style.user_span} ${style.admin}`}>Admin</span>
                    ) : (
                      // <span className={style.user_span}>Not Banned</span>
                      ''
                    )}
                  </h2>
                  <h2 className={style.user_info}>
                    ID: <span className={style.user_span}>{_id}</span>
                  </h2>
                  {/* <h2 className={style.user_info}>
                    Role: <span className={style.user_span}>{isAdmin}</span>
                  </h2> */}
                  <h2 className={style.user_info}>
                    First name:<span className={style.user_span}> {first_name}</span>
                  </h2>
                  <h2 className={style.user_info}>
                    Last name:<span className={style.user_span}> {last_name}</span>
                  </h2>
                  <h2 className={style.user_info}>
                    Email:<span className={style.user_span}> {email}</span>
                  </h2>
                  <h2 className={style.user_info}>
                    Phone:<span className={style.user_span}> {phone}</span>
                  </h2>
                  <h2 className={style.user_info}>
                    Address:<span className={style.user_span}> {address}</span>
                  </h2>
                  <div className={style.button_area}>
                    <button
                      className={style.delete_button}
                      onClick={() => {
                        handelDelete(_id)
                      }}>
                      <DeleteIcon />
                    </button>
                    <button
                      className={style.edit_button}
                      onClick={() => {
                        handelEdit(_id)
                        getUserId(_id)
                      }}>
                      <EditIcon />
                    </button>
                    <button
                      className={style.edit_button}
                      onClick={() => {
                        handelBanUnban(_id, isBanned)
                      }}>
                      {isBanned ? 'Unban' : 'Ban'}
                    </button>
                    <button
                      className={style.edit_button}
                      onClick={() => {
                        handelAdminRole(_id, isAdmin)
                      }}>
                      {isAdmin ? 'Change Role to User' : 'Make Admin'}
                    </button>
                  </div>
                </li>
              </div>
            )
          })}
      </ul>
    </div>
  )
}

export default UsersList
