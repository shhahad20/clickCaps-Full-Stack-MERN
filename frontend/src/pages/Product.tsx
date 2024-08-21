import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { useEffect } from 'react'

import { fetchCategoryById } from '../redux/slices/products/categorySlice'
import { fetchData, fetchSingleProduct } from '../redux/slices/products/productSlice'

import style from './styles/singleProduct.module.css'
import { ProductsDispatch } from '../types/types'

const Product = () => {
  const { id } = useParams<{ id: string }>()
  const { isLoading, error, singleProduct } = useSelector(
    (state: RootState) => state.productsReducer
  )
  const { category } = useSelector((state: RootState) => state.categoryReducer)
  const dispatch: ProductsDispatch = useDispatch()

  useEffect(() => {
    if (id) {
      dispatch(fetchData(1)).then(() => dispatch(fetchSingleProduct(id)))
    }
    // dispatch(fetchCategory())
  }, [id])
  const categoryID = String(singleProduct?.category)
  useEffect(() => {
    if (categoryID) {
      dispatch(fetchCategoryById(categoryID))
    }
  }, [])

  if (isLoading) {
    return <p>Product data is loading . . . </p>
  }
  if (error) {
    return <p>{error}</p>
  }
  return (
    <>
      <div className={style.upper_product}>
        <h4>Breadcrumbs / test / product name</h4>
      </div>
      {singleProduct && (
        <div className={style.single_product_container} key={singleProduct._id}>
          <div className={style.left_column}>
            <img src={singleProduct.image} alt={singleProduct.name} />
          </div>
          <div className={style.right_column}>
            <div className={style.product_description}>
              <span>Product Category | Product Id: #{singleProduct._id}</span>
              <h1>{singleProduct.name}</h1>
              <p> Description: {singleProduct.description}</p>
            </div>
            <div className={style.product_details}>
              <div className={style.product_variants}>
                <div>
                  <span>Variants: </span>
                  {/* {singleProdcut.variants &&
//                     singleProdcut.variants.map((v) => {
//                       return (
//                         <p key={id} className={style.variant}>
//                           {v}
//                         </p>
//                       )
//                     })} */}
                </div>
                <div>
                  <span>Sizes: </span>
                  {/* {singleProdcut.sizes &&
                    singleProdcut.sizes.map((s) => {
                       return (
                         <p key={id} className={style.variant}>
                           {s}
                        </p>
                       )
                    })} */}
                </div>
                <div>
                  <span>Categories: </span>
                  {category?.title ? category?.title : 'No category found.'}
                </div>
              </div>
            </div>
            <div className={style.product_price}>
              <span>{singleProduct.price}$</span>
              <button className={style.add_btn}>Add to cart</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Product
