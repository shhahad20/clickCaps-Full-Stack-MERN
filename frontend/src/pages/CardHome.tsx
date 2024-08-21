import { Link } from 'react-router-dom'

import style from '../pages/styles/cardHome.module.css'

const CardHome = () => {
  return (
    <>
      <div className={style.card_contanier}>
        <article className={style.card}>
          <h1 className={style.card__title}>
            <mark>Audit</mark> your work
          </h1>
          <p className={style.card__description}>
            As your business expands, we&apos;ll provide you with a computer equipped to handle your
            evolving software needs.{' '}
          </p>
          <div className={style.media_object}>
            <div>
              <h2 className={style.media_object__title}>
                Your office do not <br /> have to be a mess.
              </h2>
              <Link to="/products" className={style.media_object__button}>
                Get Your Computer
                <svg
                  width="19"
                  height="20"
                  viewBox="0 0 19 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.54461 12.3572L10.7229 13.5355L14.2596 9.9997L10.7238 6.46387L9.54544 7.64303L11.0679 9.16637H4.78711V10.833H11.0679L9.54461 12.3572Z"
                    fill="#F8F8F8"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.9823 16.4813C19.5623 12.9013 19.5623 7.09801 15.9823 3.51801C12.4023 -0.061992 6.59898 -0.061992 3.01898 3.51801C-0.561015 7.09801 -0.561015 12.9013 3.01898 16.4813C6.59898 20.0613 12.4023 20.0613 15.9823 16.4813ZM14.804 15.303C15.5004 14.6066 16.0529 13.7798 16.4298 12.8698C16.8067 11.9599 17.0007 10.9846 17.0007 9.99967C17.0007 9.01475 16.8067 8.03948 16.4298 7.12953C16.0529 6.21958 15.5004 5.39278 14.804 4.69634C14.1075 3.9999 13.2807 3.44745 12.3708 3.07053C11.4608 2.69362 10.4856 2.49963 9.50065 2.49963C8.51573 2.49963 7.54045 2.69362 6.63051 3.07054C5.72056 3.44745 4.89376 3.9999 4.19732 4.69634C2.79079 6.10287 2.0006 8.01054 2.0006 9.99967C2.0006 11.9888 2.79079 13.8965 4.19732 15.303C5.60385 16.7095 7.51151 17.4997 9.50065 17.4997C11.4898 17.4997 13.3975 16.7095 14.804 15.303Z"
                    fill="#F8F8F8"
                  />
                </svg>
              </Link>
            </div>
            <div className={style.media_object__thumbnail}></div>
          </div>
          <div className={style.card__actions}>
            <Link to="/products" className={style.card__button} target="_blank">
              SUBSCRIBE TO NEWSLETTER
            </Link>
            <Link to="/signup" className={style.card__button}>
              SIGN UP
            </Link>
          </div>
        </article>
        <a className={style.source_link}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            fill="none"
            viewBox="0 0 131 131">
            <g clipPath="url(#a)">
              <path fill="#F94062" d="M130.618,-0.03h-130.618v130.678h130.618v-130.678z" />
              <path
                fill="#F2F0F7"
                d="M36.324,87.116c-3.308,0,-5.862,-2.477,-5.862,-5.407v-42.158c0,-3.083,2.704,-5.411,5.862,-5.411h12.7c11.273,0,16.907,7.213,16.907,14.728c0,5.259,-3.38,8.493,-7.891,10.67c4.66,1.878,9.32,5.26,9.32,11.8c0,8.793,-7.063,15.778,-18.639,15.778h-12.397zm13.3,-32.235c2.63,0,5.788,-1.804,5.788,-5.862c0,-2.856,-1.353,-5.41,-5.26,-5.41h-9.172v11.272h8.643zm-8.643,9.619v13.075h8.418c4.962,0,7.438,-2.48,7.438,-6.387c0,-4.284,-3.006,-6.688,-6.987,-6.688h-8.87z"
              />
              <path
                fill="#2E0276"
                d="M95.033,86.934c2.63,0,5.184,2.106,5.184,4.81c0,2.708,-2.256,4.734,-5.184,4.734h-20.013c-2.932,0,-5.186,-2.026,-5.186,-4.734c0,-2.704,2.556,-4.81,5.186,-4.81h20.013z"
              />
            </g>
            <defs>
              <clipPath id="a">
                <path fill="#fff" d="M0,0h130.618v130.618h-130.618z" />
              </clipPath>
            </defs>
          </svg>
          Read the blog
        </a>
      </div>
    </>
  )
}

export default CardHome
