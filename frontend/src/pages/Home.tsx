import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store'
import { Link } from 'react-router-dom'

import { ProductsDispatch } from '../types/types'

import style from './styles/home.module.css'
import { fetchData } from '../redux/slices/products/productSlice'

const Home = () => {
  const { products } = useSelector((state: RootState) => state.productsReducer)
  const dispatchProducts: ProductsDispatch = useDispatch()

  useEffect(() => {
    dispatchProducts(fetchData(1))
  }, [])
  const filteredProduct = products.filter(
    (product) =>
      product._id === '658557911a2bd797f535e43c' ||
      product._id === '658557ba1a2bd797f535e442' ||
      product._id === '658558261a2bd797f535e44e' ||
      product._id === '658559231a2bd797f535e478' ||
      product._id === '658558e31a2bd797f535e46c' 
  )
  const UPDATE = ({ target, x, y }) => {
    const bounds = target.getBoundingClientRect()
    target.style.setProperty('--x', x - bounds.left)
    target.style.setProperty('--y', y - bounds.top)
  }
  useEffect(() => {
    const BTNS = document.querySelectorAll('button')
    BTNS.forEach((BTN) => BTN.addEventListener('pointermove', UPDATE))
    return () => {
      BTNS.forEach((BTN) => BTN.removeEventListener('pointermove', UPDATE))
    }
  }, [])
  return (
    <div className={style.home}>
      <div className={style.small_devices_intro_text}>
        <h1>
          Latest MacBook Pro <br />
        </h1>
        <p>Mind-Blowing. Head-turning.</p>
        <p className={style.avaliable_text}>Available Now!</p>
        <a className={style.learn_more_btn} href="#">
          Learn more &gt;
        </a>
      </div>
      <div className={style.section_two}>
        <div className={style.image_container}>
          <video autoPlay loop muted playsInline>
            <source src="../../public/images/large_2x.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className={style.intro_text_two}>
          <h1>
            Latest MacBook Pro <br />
          </h1>
          <p>Mind-Blowing. Head-turning.</p>
          <p className={style.avaliable_text}>Available Now!</p>
          <a className={style.learn_more_btn} href="#">
            Learn more &gt;
          </a>
        </div>
      </div>
      <div className={style.animation_text_section}>
        <div className={style.animation_text_conatiner}>
          <div className={style.animation_text_small}>
            {' '}
            <h1>
              Immerse in{' '}
              <span>
                Sound, <br /> Craft and Connection
              </span>
            </h1>
          </div>
          <div className={style.animation_text_content}>
            <h1 className={style.animation_text}>
              <span className={style.animation_text_span}>Immerse in</span>
              <div className={style.message}>
                <div className={style.word1}>Sound</div>
                <div className={style.word2}>Craft</div>
                <div className={style.word3}>Connection</div>
              </div>
            </h1>
          </div>

          <div className={style.animation_image_continaer}>
            <div className={style.images_wrapper}>
              <img src="../../public/images/appleHaedphone.jpg" alt="" />
              <img src="../../public/images/appleHeadphone2.jpg" alt="" />
            </div>
          </div>
          <div className={style.music_button_conatiner}>
            <button className={style.mouse_button}>
              <span className={style.back}>
                <span></span>
              </span>
              Expolre Headphone
            </button>
          </div>
        </div>
      </div>
      <div className={style.music_section}></div>
 
      <div className={style.section_three}>
        <div className={style.products_header_container}>
          <div className={style.products_header}>
            <h1>Most Wanted Products</h1>
          </div>
        </div>
        <div>
          <div className={style.product_grid}>
            {filteredProduct &&
              filteredProduct.map((product) => {
                const { _id, name, image, description, price } = product

                return (
                  <div className={style.product_card} key={_id}>
                    <Link to={`/products/${_id}`}>
                      <img src={image as string} alt="" width="200px" height="116px" />
                      <h2 className={style.product_name}>{name}</h2>
                      <p className={style.product_description}>{description}</p>{' '}
                    </Link>
                    <div className={style.button_container}>
                      <button className={style.price_btn}>{price}$</button>
                      <button
                        className={style.buy_btn}
                        onClick={() => {
                          // dispatch(addToCart({ id, name, price, image, description }))
                          // setAlertMessage(true);
                          // setTimeout(() => {
                          //   setAlertMessage(false);
                          // }, 1000);
                        }}>
                        Add to Cart
                      </button>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
        <div className={style.music_button_conatiner}>
          <button className={style.mouse_button}>
            <span className={style.back}>
              <span></span>
            </span>
            <Link to="/products">Expolre Products</Link>
            {/* Expolre Products */}
          </button>
        </div>
      </div>

      <div className={style.mouse_section}>
        <div className={style.mouse_container}>
          <div className={style.mouse_content}>
            <div className={style.mouse_image}>
              <img src="../../public/images/mouse.png" alt="" />
              <img src="../../public/images/mouse2.png" alt="" />
            </div>

            <div className={style.mouse_text}>
              <p>Fraegment</p>
              <h1>
                Precision at Your Fingertips <br /> Unleash Your <span>Gaming Potential!</span>
              </h1>
              <button className={style.mouse_button}>
                <span className={style.back}>
                  <span></span>
                </span>
                Expolre Gaming assets
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={style.last_section}>
        <div>
          <div className={style.newsletter_container}>
            <form id="newsletterForm">
              <h3>Subscribe to our newsletter:</h3>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                required
                className={style.newsletter_input}
              />
              <div className={style.email_button_conatiner}>
                <button className={style.mouse_button}>
                  <span className={style.back}>
                    <span></span>
                  </span>
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
