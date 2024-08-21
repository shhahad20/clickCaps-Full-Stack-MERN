import { ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'

import { ProductsDispatch } from '../types/types'
import { sortProduct } from '../redux/slices/products/productSlice'

import style from './styles/sortAndCategory.module.css'

const Sort = () => {
  const dispatch: ProductsDispatch = useDispatch()

  const handleOptions = (event: ChangeEvent<HTMLSelectElement>) => {
    const sortValue = event.target.value
    dispatch(sortProduct(sortValue))
  }

  return (
    <div>
      <label htmlFor="sort">Sort by:</label>
      <select className={style.selcet} name="sort" id="sort" onChange={handleOptions}>
        <option className={style.option} value="name">
          Name
        </option>
        <option className={style.option} value="price">
          Lower Price
        </option>
        <option className={style.option} value="h-price">
          Higher Price
        </option>
      </select>
    </div>
  )
}

export default Sort
