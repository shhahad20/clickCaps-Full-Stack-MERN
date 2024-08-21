import { useSelector, useDispatch } from 'react-redux'
import { AppDispatch, RootState } from '../redux/store'
import { useEffect, ChangeEvent, useState, FormEvent } from 'react'

import {
  deleteProduct,
  fetchData,
  fetchSingleProduct,
  searchProduct,
  updatedProduct
} from '../redux/slices/products/productSlice'

import { ProductsDispatch } from '../types/types'
import Sort from './Sort'
import { Link } from 'react-router-dom'
import { addToCart } from '../redux/slices/products/cartSlice'

import style from './styles/productsList.module.css'
import { Alert } from '@mui/material'

import categorystyle from './styles/sortAndCategory.module.css'
import { fetchCategory } from '../redux/slices/products/categorySlice'

const Products = () => {
  const { search, products, pagination } = useSelector((state: RootState) => state.productsReducer)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [alertMessage, setAlertMessage] = useState(false)
  const [productId, setProductId] = useState('')
  const { userData, isLoggedIn } = useSelector((state: RootState) => state.usersReducer)

  const [updateProduct, setUpdateProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: undefined
  })
  const { categories } = useSelector((state: RootState) => state.categoryReducer)
  const [showCheckBoxes, setShowCheckBoxes] = useState(false)
  const [checkedCategories, setCheckedCategories] = useState<string[]>([])

  const [currentPage, setCurrentPage] = useState(1)
  // Make a selecting limit 6 12 24
  const [itemsPerPage, setItemsPerPage] = useState(12)

  const dispatchProducts: ProductsDispatch = useDispatch()
  const dispatch: AppDispatch = useDispatch()
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        await dispatch(fetchData({ page: currentPage, limit: itemsPerPage }))
      } catch (error) {
        console.log(error)
      }
    }
    fetchProducts()
  }, [currentPage])

  useEffect(() => {
    dispatch(fetchCategory(1))
  }, [])
  const categoryFilter = products.filter((product) => {
    const categoryMatch =
      checkedCategories.length > 0 ? checkedCategories.includes(product.category._id) : true

    const filteredProducts =
      search !== '' ? product.name.toLowerCase().includes(search.toString().toLowerCase()) : true
    return categoryMatch && filteredProducts
  })

  const handleCheckedCategories = async (categoryId: string) => {
    if (checkedCategories.includes(categoryId)) {
      const filteredCategory = checkedCategories.filter((c) => c !== categoryId)
      setCheckedCategories(filteredCategory)
    } else {
      setCheckedCategories((prevState) => {
        return [...prevState, categoryId]
      })
    }
  }

  const handelSearch = (event: ChangeEvent<HTMLInputElement>) => {
    dispatchProducts(searchProduct(event.target.value))
  }

  const handelChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === 'file') {
      const imageFile = event.target.files?.[0]
      const { name } = event.target
      setUpdateProduct((prevProduct) => {
        return { ...prevProduct, [name]: imageFile }
      })
    } else {
      const { value, name } = event.target
      setUpdateProduct((prevProduct) => {
        return { ...prevProduct, [name]: value }
      })
    }
  }
  const handelSave = async (event: FormEvent) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('name', updateProduct.name)
    formData.append('price', updateProduct.price)
    formData.append('description', updateProduct.description)
    if (updateProduct.image) {
      formData.append('image', updateProduct.image as Blob)
    }
    try {
      const response = await dispatch(updatedProduct({ id: productId, updatedData: formData }))
      // Meassage
    } catch (error) {
      console.log(error)
    }
    dispatch(fetchData({ page: currentPage, limit: itemsPerPage }))
    setIsFormOpen(false)
  }
  const handelEdit = async (productId: string) => {
    setIsFormOpen(true)
    try {
      const actionResult = await dispatch(fetchSingleProduct(productId))
      const productDetails = actionResult.payload
      setUpdateProduct({
        name: productDetails.name,
        price: productDetails.price,
        description: productDetails.description,
        image: productDetails.image
      })
      setIsFormOpen(true)
      setProductId(productId)
    } catch (error) {
      console.error('Error fetching product details:', error)
    }
  }
  const getProductId = (productId: string) => {
    setProductId(productId)
  }
  const handelDeleteProduct = async (id: string) => {
    try {
      const response = await dispatch(deleteProduct(id))
      //Message
    } catch (error) {
      console.log(error)
    }
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
  for (let i = 1; i <= pagination.totalPages; i++) {
    buttonElement.push(
      <button className={style.number_of_pages}
        onClick={() => {
          handelPageButtons(i)
        }}>
        {i}
      </button>
    )
  }

  return (
    <div className={style.products_list_contanier}>
      {alertMessage && <Alert severity="success">Product added to the cart</Alert>} <br />
      <div>
        {isFormOpen && (
          <div>
            <form action="">
              <input
                className={style.edit_input}
                type="text"
                name="name"
                value={updateProduct.name}
                onChange={handelChange}
                placeholder="Product name"
              />
              <input
                className={style.edit_input}
                type="file"
                name="image"
                accept="image/*"
                onChange={handelChange}
              />
              <input
                className={style.edit_input}
                type="text"
                name="description"
                value={updateProduct.description}
                onChange={handelChange}
                placeholder="Product description"
              />
              <input
                className={style.edit_input}
                type="number"
                name="price"
                value={updateProduct.price}
                onChange={handelChange}
                placeholder="Price"
              />
              <button className={style.save_btn} onClick={handelSave}>
                Save
              </button>
            </form>
          </div>
        )}
      </div>
      <div className={style.top_bar}>
        <input type="text" placeholder="Search . . ." onChange={handelSearch} value={search} />
        <Sort />
        <div className={style.category_area}>
          <div className={categorystyle.dropdown}>
            <button onClick={() => setShowCheckBoxes(!showCheckBoxes)}>
              {showCheckBoxes ? 'Categories' : 'Categories'}
            </button>
          </div>
          {showCheckBoxes && (
            <div className={categorystyle.checkboxOptions}>
              {categories.length > 0 &&
                categories.map((category) => {
                  const { title, _id } = category
                  return (
                    <>
                      <div key={category._id} className={categorystyle.options}>
                        <label className={categorystyle.option_label}>
                          <input
                            name="category"
                            className={categorystyle.option_input}
                            type="checkbox"
                            value={_id}
                            onChange={() => {
                              handleCheckedCategories(_id)
                            }}
                          />
                              <span className={categorystyle.custom_checkbox}></span>

                          {title}
                        </label>
                      </div>
                    </>
                  )
                })}
            </div>
          )}
        </div>
      </div>
      <div className={style.contanier}>
        <div></div>
        <div className={style.product_grid}>
          {/* {cuurentProducts.length>0 &&
            cuurentProducts.map((product) => { */}
          {categoryFilter.length > 0 &&
            categoryFilter.map((product) => {
              const { _id, name, image, description, price } = product || {}
              return (
                <div className={style.product_card} key={product._id}>
                  <Link to={`/products/${product._id}`}>
                    <img src={product.image as string} alt="" width="200px" height="116px" />
                    <h2 className={style.product_name}>{product.name}</h2>
                    <p className={style.product_description}>{product.description}</p>{' '}
                  </Link>
                  <div className={style.button_container}>
                    {/* <button className={style.heart_icon}>❤</button> */}
                    <button className={style.price_btn}>{product.price}$</button>
                    <button
                      className={style.buy_btn}
                      onClick={() => {
                        dispatch(addToCart({ _id, name, price, image, description }))
                        setAlertMessage(true)
                        setTimeout(() => {
                          setAlertMessage(false)
                        }, 1000)
                      }}>
                      Add to Cart
                    </button>
                    {isLoggedIn && userData?.isAdmin === true ? (
                      <>
                        <button
                          className={style.edit_btn}
                          onClick={() => {
                            handelEdit(product._id)
                            getProductId(product._id)
                          }}
                          // value={updateProduct.id}
                        >
                          Edit
                        </button>

                        <button
                          className={style.delete_btn}
                          onClick={() => {
                            handelDeleteProduct(product._id)
                          }}>
                          Delete
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              )
            })}
        </div>
      </div>
      <div className={style.pagination}>
        <button
          className={style.pagination_buttons}
          onClick={handelprevPage}
          disabled={currentPage === 1}>
          &lt;
        </button>
        {/* <div>{buttonElement}</div> */}
        <div className={style.number_of_pages}>
          {buttonElement}
        </div>
        <button
          className={style.pagination_buttons}
          onClick={handelNextPage}
          disabled={currentPage === pagination.totalPages}>
          &gt;
        </button>
        
      </div>
      <span>{`Page ${currentPage} of ${pagination.totalPages}`}</span>
    </div>
  )
}

export default Products
