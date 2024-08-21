import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { AppDispatch, RootState } from '../redux/store'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import style from './styles/profile.module.css'
import formStyle from './styles/login.module.css'
import { fetchUserById, updateUser } from '../redux/slices/products/userSlice'

const Profile = () => {
  const { userData } = useSelector((state: RootState) => state.usersReducer)
  const [showEditPopup, setShowEditPopup] = useState(false)
  const [showProfile, setshowProfile] = useState(true)

  const [userId, setUserId] = useState('')
  const [editUserData, setEditUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    image: undefined,
    address: '',
    phone: ''
  })
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    userData
  }, [])

  const handleEditPopup = () => {
    setshowProfile(false)
    setShowEditPopup(true)
  }
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === 'file') {
      const imageFile = event.target.files?.[0]
      const { name } = event.target
      setEditUserData((prevData) => {
        return { ...prevData, [name]: imageFile }
      })
    } else {
      const { value, name } = event.target
      setEditUserData((prevData) => {
        return { ...prevData, [name]: value }
      })
    }
  }
  const handelEdit = async (userId: string) => {
    setshowProfile(false)
    setShowEditPopup(true)

    try {
      const actionResult = await dispatch(fetchUserById(userId))
      const userDetails = actionResult.payload
      setEditUserData({
        first_name: userDetails.first_name,
        last_name: userDetails.last_name,
        phone: userDetails.phone,
        email: userDetails.email,
        image: userDetails.image,
        address: userDetails.address
      })
      setUserId(userId)
    } catch (error) {
      console.error('Error fetching user details:', error)
    }
  }
  const handelSave = async (event: FormEvent) => {
    event.preventDefault()

    const formData = new FormData()

    formData.append('first_name', editUserData.first_name)
    formData.append('last_name', editUserData.last_name)
    formData.append('phone', editUserData.phone)
    formData.append('email', editUserData.email)
    formData.append('address', editUserData.address)
    if (editUserData.image) {
      formData.append('image', editUserData.image as Blob)
    }
    try {
      const response = await dispatch(updateUser({ id: userId, updatedData: formData }))
      // Meassage
      console.log(userData)
    } catch (error) {
      console.log(error)
    }
    setshowProfile(true)
    setShowEditPopup(false)
  }
  return (
    <>
      {showEditPopup && (
        <div className={formStyle.edit_container}>
          <div className={formStyle.login_box}>
            <h2 className={formStyle.edit_header}>Edite Profile</h2>
            <form className={formStyle.form} action="">
              <div className={formStyle.user_box}>
                <input
                  type="text"
                  name="first_name"
                  value={editUserData.first_name}
                  onChange={handleInputChange}
                  required
                />
                <label className={formStyle.label} htmlFor="first-name">
                  First Name:
                </label>
              </div>
              <div className={formStyle.user_box}>
                <input
                  type="text"
                  name="last_name"
                  value={editUserData.last_name}
                  onChange={handleInputChange}
                  required
                />
                <label className={formStyle.label} htmlFor="last-name">
                  Last Name:
                </label>
              </div>
              <div className={formStyle.user_box}>
                <input
                  type="text"
                  name="email"
                  value={editUserData.email}
                  onChange={handleInputChange}
                  required
                />
                <label className={formStyle.label} htmlFor="email">
                  Email:
                </label>
              </div>
              <div className={formStyle.user_box}>
                <input
                  type="text"
                  name="address"
                  value={editUserData.address}
                  onChange={handleInputChange}
                  required
                />
                <label className={formStyle.label} htmlFor="Address">
                  Address:
                </label>
              </div>
              <div className={formStyle.user_box}>
                <input
                  type="text"
                  name="phone"
                  value={editUserData.address}
                  onChange={handleInputChange}
                  required
                />
                <label className={formStyle.label} htmlFor="phone">
                  Phone:
                </label>
              </div>
              <div className={formStyle.user_box}>
                <input type="file" name="image" accept="image/*" onChange={handleInputChange} />
              </div>
              <div className={formStyle.user_box}>
                <a>
                  <Link to="/forget-password">Change Password</Link>
                </a>
              </div>

              <button className={formStyle.form_button} onClick={handelSave}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Save Changes
              </button>
              <div className={formStyle.under_button}></div>
            </form>
          </div>
        </div>
      )}
      {showProfile && (
        <div className={style.layout}>
          <div className={style.profile}>
            {userData?.image && (
              <div className={style.profile__picture}>
                {userData?.image instanceof File ? (
                  <img
                    className={style.preview_img}
                    src={URL.createObjectURL(userData?.image)}
                    alt="image preview"
                  />
                ) : (
                  <img src={userData?.image as string} alt="image preview" />
                )}
              </div>
            )}
            <div className={style.profile__header}>
              <div className={style.profile__account}>
                <h4 className={style.profile__username}>
                  {userData.first_name} {userData.last_name}
                </h4>
              </div>
              <div className={style.profile__edit}>
                <button
                  className={style.profile__button}
                  onClick={() => {
                    handleEditPopup
                    handelEdit(userData?._id as string)
                  }}>
                  Edit Profile
                </button>
              </div>
            </div>
            <div className={style.other_user_info}>
              <p>{userData?.email}</p>
              <p>Address: {userData?.address}</p>
              <p>Number: {userData?.phone}</p>
            </div>
            <div className={style.profile__stats}>
              <div className={style.profile__stat}>
                <div className={style.profile__icon}>
                  <i className={style.fa_wallet}></i>
                </div>
                <div className={style.profile__key}>Orders</div>
              </div>
              <div className={style.profile__stat}>
                <div className={style.profile__icon}>
                  <i className={style.fa_signal}></i>
                </div>
                <div className={style.profile__value}>23</div>
                <div className={style.profile__key}>Products</div>
              </div>
              <div className={style.profile__stat}>
                <div className={style.profile__icon}>
                  <i className={style.fa_heart}></i>
                </div>
                <div className={style.profile__value}>4</div>
                <div className={style.profile__key}>Reviews</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile
