import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

import cancel from '../assets/cancel.png'

const Cancel = () => {
  return (
    <div>
      <div>
        <h1> Something went wrong!! </h1>
        <h3> Please retry after sometime </h3>
        <div>
          <img src={cancel} alt="" width={'25%'} />
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

export default Cancel
