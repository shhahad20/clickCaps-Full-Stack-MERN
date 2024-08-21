import { AppDispatch, RootState } from '../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import {
  addCategory,
  deleteCategory,
  fetchCategory,
  searchCategory,
  sortCategories, 
  updateCategory
} from '../redux/slices/products/categorySlice'

import style from './styles/categories.module.css'
import { Alert } from '@mui/material'

const Category = () => {
  const { search, categories, pagination } = useSelector(
    (state: RootState) => state.categoryReducer
  )
  const { userData, isLoggedIn } = useSelector((state: RootState) => state.usersReducer)

  const [categoryName, setNewCategory] = useState('')
  const [editedCategory, setEditedCategory] = useState(false)
  const [categoryId, setCategoryId] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const [alertMessage, setAlertMessage] = useState('')
  const [successAlertMessage, setSuccessAlertMessage] = useState('')

  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchCategory(currentPage))
  }, [dispatch])

  const handleClick = async () => {
    try {
      await dispatch(fetchCategory(currentPage))
    } catch (error) {
      setAlertMessage(`Error fetching categories: ${error}`)
      console.error('Error fetching categories:', error)
    }
  }

  const handelDelete = async (id: string) => {
    try {
      const response = await dispatch(deleteCategory(id))
      dispatch(fetchCategory(currentPage))
      //Message
    } catch (error) {
      setAlertMessage(`${error}`)
      console.log(error)
    }
  }
  const handelChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewCategory(event.target.value)
  }

  const handelCreateCategory = async (event: FormEvent) => {
    event.preventDefault()
    if (categoryName.length < 2) {
      setAlertMessage('Category name must have at least 2 characters.')
      setTimeout(() => {
        setAlertMessage('')
      }, 1000)
    }
    if (!editedCategory) {
      try {
        const response = await dispatch(addCategory(categoryName))
        dispatch(fetchCategory(currentPage))
        setSuccessAlertMessage('Category added successfully')
        setTimeout(() => {
          setSuccessAlertMessage('')
        }, 2000)
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const updatedCategory = { title: categoryName }
        const response = await dispatch(
          updateCategory({ id: categoryId, updatedData: updatedCategory })
        )
        dispatch(fetchCategory(currentPage))

        setSuccessAlertMessage('Category updated successfully')
        setTimeout(() => {
          setSuccessAlertMessage('')
        }, 1000)
      } catch (error) {
        console.log(error)
      }
    }
    setNewCategory('')
    setEditedCategory(false)
    setCategoryId('')
  }

  const handelEdit = async (id: string, title: string) => {
    setEditedCategory(true)
    setCategoryId(id)
    setNewCategory(title)
  }
  const handelSearch = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(searchCategory(event.target.value))
  }
  const searchFilter = categories.filter((category) => {
    const filteredUsers =
      search !== ''
        ? category.title.toLowerCase().includes(search.toString().toLowerCase())
        : categories
    return filteredUsers
  })
  const handleOptions = (event: ChangeEvent<HTMLSelectElement>) => {
    const sortValue = event.target.value
    dispatch(sortCategories(sortValue))
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
    <div className={style.categories_bar}>
      {successAlertMessage && <Alert severity="success">{successAlertMessage}</Alert>}
      {alertMessage && <Alert severity="error">{alertMessage}</Alert>}
      <div>
        <label htmlFor="search">Search:</label>
        <input type="text" placeholder="Search . . ." onChange={handelSearch} value={search} />
        <label htmlFor="sort">Sort by:</label>
        <select className={style.selcet} name="sort" id="sort" onChange={handleOptions}>
          <option className={style.option} value="title">
            Title
          </option>
          <option className={style.option} value="createdAt">
            createdAt
          </option>
        </select>
      </div>
      <div className={style.create_category}>
        <form action="" onSubmit={handelCreateCategory}>
          <label>Create & Uodate Category: </label>
          <input
            type="text"
            name="category"
            value={categoryName}
            placeholder="Category name"
            onChange={handelChange}
          />
          <button type="submit">{editedCategory ? 'Upadte' : 'Create'}</button>
        </form>
        {alertMessage && <Alert severity="error">{alertMessage}</Alert>} <br />
        {successAlertMessage && <Alert severity="success">{successAlertMessage}</Alert>} <br />
      </div>
      <ul className={style.category_list}>
        <h2 className={style.category_header}>Categories List</h2>
        {searchFilter.length > 0 &&
          searchFilter.map((category) => {
            const { title, _id } = category
            return (
              <div key={_id} className={style.category_item}>
                <p>
                  <a href="">{title}</a>
                </p>
                {/* {isLoggedIn && userData?.role === 'admin' ? (
                  <> */}
                <div className={style.category_actions}>
                  <button
                    className={style.delete_btn}
                    onClick={() => {
                      handelDelete(_id)
                    }}>
                    Delete
                  </button>
                  <button
                    className={style.edit_btn}
                    onClick={() => {
                      handelEdit(_id, title)
                    }}>
                    Edit
                  </button>
                </div>
                {/* </>
                ) : (
                  <></>
                )}  */}
              </div>
            )
          })}
      </ul>
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
  )
}

export default Category
