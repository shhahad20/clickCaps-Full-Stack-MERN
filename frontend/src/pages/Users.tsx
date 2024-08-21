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
import style from './styles/users.module.css'

const Users = () => {
  const { search, users,pagination } = useSelector((state: RootState) => state.usersReducer)
  const dispatch: AppDispatch = useDispatch()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [userId, setUserId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)


  const [updateUserData, setUpdateUser] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    image: undefined,
    address: ''
  })

  useEffect(() => {
    const fetchUsers =async () => {
      try {
         await dispatch(fetchUser(currentPage))
      } catch (error) {
        console.log(error)
      }
    }
    fetchUsers()
  }, [currentPage])

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
    const formData = new FormData()
    formData.append('first_name', updateUserData.first_name)
    formData.append('last_name', updateUserData.last_name)
    formData.append('phone', updateUserData.phone)
    // formData.append('image', updateUserData.image)
    formData.append('email', updateUserData.email)
    formData.append('address', updateUserData.address)
    if (updateUserData.image) {
      formData.append('image', updateUserData.image as Blob);
    } 
    try {
      const response = await dispatch(updateUser({ id: userId, updatedData: formData }))
      // Meassage
    } catch (error) {
      console.log(error)
    }
    dispatch(fetchUser(currentPage))
    // dispatch(updatedProduct(updateProductData))
    setIsFormOpen(false)
  }

  const handelDelete = async (id: string) => {
    try {
      const response = await dispatch(deleteUser(id))
      // Messages notification
    } catch (error) {
      console.log(error)
      // Error Message notification
    }
    dispatch(fetchUser(currentPage))
  }
  const handelBanUnban = async (id: string, isBanned: boolean) => {
    try {
      if (isBanned) {
        await dispatch(unbanUser(id))
      } else {
        await dispatch(banUser(id))
      }
      dispatch(fetchUser(currentPage))
    } catch (error) {
      console.log(error)
    }
  }

  const handelAdminRole = async (id: string, isAdmin: boolean) => {
    try {
      const response = isAdmin ? await dispatch(unadminUser(id)) : await dispatch(adminUser(id))
      dispatch(fetchUser(currentPage))
      // Messages notification
    } catch (error) {
      console.log(error)
      // Error Message notification
    }
  }

  const getStatusText = (isAdmin: boolean, isBanned: boolean) => {
    if (isBanned) {
      if (!isAdmin) {
        return 'Banned User'
      } else {
        return 'Banned Admin'
      }
    } else {
      if (!isAdmin) {
        return 'Active User'
      } else {
        return 'Active Admin'
      }
    }
  }
  const getStatusClassName = (isBanned: boolean) => {
    if (isBanned) {
      return `${style.banned_badge}`
    } else {
      return style.success_badge
    }
  }

  const handleOptions = (event: ChangeEvent<HTMLSelectElement>) => {
    const sortValue = event.target.value
    dispatch(sortUsers(sortValue))
  }
  const handelSearch = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(searchUser(event.target.value))
  }
  const handelNextPage = () => {
    setCurrentPage(currentPage + 1)
  }
  const handelprevPage = () => {
    setCurrentPage(currentPage - 1)
  }
  const handelPageButtons = (page: number) => {
    setCurrentPage(page)
  }
  const buttonElement = []
  for (let i = 1; i <= pagination.totalPages - 1; i++) {
    buttonElement.push(
      <button
        onClick={() => {
          handelPageButtons(i)
        }}>
        {i}
      </button>
    )
  }
  return (
    <>
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
        </select>
      </div>
      {/* //////////////////////////////////////////////////// */}
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

      {/* ////////////////////////////////////////////////////////////////////// */}
      <div className={style.container}>
        <div className={style.row}>
          <div className={style.custom_col}>
            <table className={style.table_contanier}>
              <thead>
                <tr>
                  <th>User Name</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Status</th>
                  <th>Setting</th>
                </tr>
              </thead>
              {searchFilter.length > 0 &&
                searchFilter.map((user) => {
                  const {
                    _id,
                    first_name,
                    last_name,
                    email,
                    phone,
                    image,
                    isBanned,
                    address,
                    isAdmin
                  } = user
                  return (
                    <tbody key={_id}>
                      <tr>
                        <td>
                          <a href="#">
                            <div className={style.first_line}>
                              <div
                                className={`${style.avatar} ${style['avatar_blue']} ${style['avatar_sm']}`}>
                                UI
                              </div>
                              {/* <img src='' alt="User Avatar" className={style['avatar_img']} /> */}

                              <div className="">
                                <p className={style.user_name}>
                                  {user.first_name} {user.last_name}
                                </p>
                              </div>
                            </div>
                          </a>
                        </td>
                        <td>{user.phone}</td>
                        <td>{user.email}</td>
                        <td>{user.address}</td>
                        <td>
                          <div className={getStatusClassName(isBanned)}>
                            {/* {isAdmin ? (
                              <span className={`${style.user_span} ${style.admin}`}>Admin</span>
                            ) : (
                              // <span className={style.user_span}>Not Banned</span>
                              'Active User'
                            )} */}
                            <span>{getStatusText(isAdmin, isBanned)}</span>
                          </div>
                        </td>
                        <td>
                          <div className={style.dropdown}>
                            <button
                              className={`${style.btn} ${style['btn_sm']} ${style['btn_icon']}`}
                              type="button"
                              id="dropdownMenuButton2"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false">
                              <i
                                className={`${style.bx} ${style['bx_dots_horizontal_rounded']}`}
                                data-toggle="tooltip"
                                data-placement="top"
                                title="Actions">
                                •••
                              </i>
                            </button>
                            <div
                              className={style.dropdown_menu}
                              aria-labelledby="dropdownMenuButton2">
                              {/* <a className={style.dropdown_item} href="#">
                                <i className={`${style.bx} ${style['bxs_pencil']}`}></i> */}
                              <button
                                className={style.dropdown_btn_item}
                                onClick={() => {
                                  handelEdit(_id)
                                  getUserId(_id)
                                }}>
                                Edit
                              </button>
                              {/* </a> */}
                              {/* <a className={style.dropdown_item} href="#">
                                <i className={`${style.bx} ${style['bxs_trash']}`}></i>{' '} */}
                              <button
                                className={style.dropdown_btn_item}
                                onClick={() => {
                                  handelDelete(_id)
                                }}>
                                Remove
                              </button>
                              {/* </a> */}
                              {/* <a className={style.dropdown_item} href="#"> */}
                              {/* <i className={`${style.bx} ${style['bxs_ban']}`}></i>{' '} */}
                              <button
                                className={style.dropdown_btn_item}
                                onClick={() => {
                                  handelBanUnban(_id, isBanned)
                                }}>
                                {isBanned ? 'Unban' : 'Ban'}
                              </button>
                              <button
                                className={style.dropdown_btn_item}
                                onClick={() => {
                                  handelAdminRole(_id, isAdmin)
                                }}>
                                {isAdmin ? 'Make User' : 'Make Admin'}
                              </button>
                              {/* </a> */}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  )
                })}
            </table>
          </div>
        </div>
        <div className={style.pagination}>
        <button
          className={style.pagination_buttons}
          onClick={handelprevPage}
          disabled={currentPage === 1}>
          &lt;
        </button>
        <div>{buttonElement}</div>
        <button
          className={style.pagination_buttons}
          onClick={handelNextPage}
          disabled={currentPage === pagination.totalPages}>
          &gt;
        </button>
      </div>
      </div>
    </>
  )
}

export default Users
