import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import success from '../assets/success.png'

const Success = () => {
  return (
    <div>
      <div>
        <h1> Payment successful </h1>
        <h3> Your order has been received! </h3>
        <div>
          <img src={success} alt="" width={'25%'} />
        </div>
        <div>
          <Link to="/">
            <FontAwesomeIcon icon={faChevronLeft} size="sm" />
            Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Success
