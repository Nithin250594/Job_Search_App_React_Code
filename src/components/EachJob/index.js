import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'

import {MdLocationOn} from 'react-icons/md'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import './index.css'

const EachJob = props => {
  const {eachJob} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJob

  return (
    <Link to={`/jobs/${id}`} className="jobs-link-style" key={id}>
      <li>
        <div className="job-list-item-bg">
          <div className="job-item-top-section">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />
            <div className="title-rating-section">
              <h1 className="company-title">{title}</h1>
              <div className="rating-section">
                <AiFillStar className="star-logo" />
                <p className="jobs-rating-text">{rating}</p>
              </div>
            </div>
          </div>

          <div className="job-item-middle-section">
            <div className="location-employment-type-section">
              <MdLocationOn className="location-logo" />
              <p className="location-text">{location}</p>
              <BsFillBriefcaseFill className="location-logo" />
              <p className="location-text">{employmentType}</p>
            </div>
            <p className="package-text">{packagePerAnnum}</p>
          </div>
          <hr className="jobs-separator" />
          <div className="job-item-bottom-section">
            <h1 className="job-description-title">Description</h1>
            <p className="job-description-para">{jobDescription}</p>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default EachJob
