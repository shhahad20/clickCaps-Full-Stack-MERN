import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { fetchCategory } from '../redux/slices/products/categorySlice'

import style from './styles/productForm.module.css'
import { Alert } from '@mui/material'
import { createProduct, fetchData } from '../redux/slices/products/productSlice'

const NewProductForm = () => {
  const { categories } = useSelector((state: RootState) => state.categoryReducer)
  const dispatch: AppDispatch = useDispatch()
  const [selectedCategory, setCategory] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [successAlertMessage, setSuccessAlertMessage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: selectedCategory,
    image: undefined,
    sold: '',
    shipping: '',
    quantity: ''
  })

  const handleOptions = (event: ChangeEvent<HTMLSelectElement>) => {
    const categoryValue = event.target.value
    setCategory(categoryValue)
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      category: categoryValue
    }))
  }

  const handelChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === 'file') {
      const imageFile = event.target.files?.[0]
      const { name } = event.target

      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [name]: imageFile
      }))
    } else {
      const { value, name } = event.target
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        [name]: value
      }))
    }
  }

  const handelCreateProduct = async (event: FormEvent) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('name', newProduct.name)
    formData.append('description', newProduct.description)
    formData.append('price', newProduct.price.toString())
    formData.append('category', newProduct.category)
    formData.append('sold', newProduct.sold.toString())
    formData.append('shipping', newProduct.shipping.toString())
    formData.append('quantity', newProduct.quantity.toString())
    // formData.append('image', newProduct.image as Blob)
    if (newProduct.image) {
      // Check if newProduct.image is defined before appending it to FormData
      formData.append('image', newProduct.image as Blob)
    }
    try {
      const response = await dispatch(createProduct(formData))
      dispatch(fetchData({ page: currentPage, limit: itemsPerPage}))
    } catch (error) {
      setAlertMessage(`Something went wrong: ${error}`)
      console.error(error)
    }
    setSuccessAlertMessage('New Product added successfully!')
  }

  useEffect(() => {
    dispatch(fetchCategory(1))
    dispatch(fetchData({ page: 1, limit: 6 }))
  }, [dispatch])

  return (
    <div className={style.product_form_container}>
      <h2 className={style.header}>New Product</h2>
      <form onSubmit={handelCreateProduct}>
        <div className={style.items_container}>
          <select name="categories" className={style.select} onChange={handleOptions}>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
          </select>
          <input
            className={style.product_input}
            type="text"
            name="name"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={handelChange}
            required
          />
          <input
            className={style.product_input}
            type="number"
            name="price"
            placeholder="Price"
            value={newProduct.price}
            onChange={handelChange}
            required
          />
          <input
            className={style.product_input}
            type="text"
            name="description"
            placeholder="description"
            value={newProduct.description}
            onChange={handelChange}
            required
          />
          <input
            className={style.product_input}
            type="text"
            placeholder="sold"
            name="sold"
            value={newProduct.sold}
            onChange={handelChange}
            required
          />
          <input
            className={style.product_input}
            type="text"
            placeholder="quantity"
            name="quantity"
            value={newProduct.quantity}
            onChange={handelChange}
            required
          />
          <input
            className={style.input}
            type="file"
            name="image"
            accept="image/*"
            onChange={handelChange}
            required
          />
          {newProduct.image && (
            <div>
              {newProduct.image instanceof File ? (
                <img
                  src={URL.createObjectURL(newProduct.image)}
                  alt="preview"
                  width={50}
                  height={50}
                />
              ) : (
                <img src={newProduct.image as string} alt="preview" width={50} height={50} />
              )}
            </div>
          )}
        </div>
        {alertMessage && <Alert severity="error">{alertMessage}</Alert>} <br />
        {successAlertMessage && <Alert severity="success">{successAlertMessage}</Alert>} <br />
        <button className={style.submit_btn} type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}

export default NewProductForm
