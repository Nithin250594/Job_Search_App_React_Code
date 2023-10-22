import {Component} from 'react'

import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'

import {MdLocationOn} from 'react-icons/md'

import {BsFillBriefcaseFill} from 'react-icons/bs'

import {IoOpenOutline} from 'react-icons/io5'

import Cookies from 'js-cookie'

import Header from '../Header'

import './index.css'

const resultView = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
  not_found: 'NOT_FOUND',
}

class JobItemDetails extends Component {
  state = {
    outputView: resultView.initial,
    jobDetailsObj: {},
    skillsList: [],
    similarJobsList: [],
    lifeAtCompanyObj: {},
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({outputView: resultView.in_progress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')

    const jobItemDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobItemDetailsApiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const modifiedData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }

      const modifiedJobDetails = {
        id: modifiedData.jobDetails.id,
        companyLogoUrl: modifiedData.jobDetails.company_logo_url,
        companyWebsiteUrl: modifiedData.jobDetails.company_website_url,
        employmentType: modifiedData.jobDetails.employment_type,
        jobDescription: modifiedData.jobDetails.job_description,
        lifeAtCompany: modifiedData.jobDetails.life_at_company,
        location: modifiedData.jobDetails.location,
        packagePerAnnum: modifiedData.jobDetails.package_per_annum,
        rating: modifiedData.jobDetails.rating,
        skills: modifiedData.jobDetails.skills,
        title: modifiedData.jobDetails.title,
      }

      const modifiedSkills = modifiedJobDetails.skills.map(eachSkill => ({
        imageUrl: eachSkill.image_url,
        name: eachSkill.name,
      }))

      const modifiedLifeAtCompany = {
        description: modifiedJobDetails.lifeAtCompany.description,
        imageUrl: modifiedJobDetails.lifeAtCompany.image_url,
      }

      const modifiedSimilarJobs = modifiedData.similarJobs.map(
        eachSimilarJob => ({
          companyLogoUrl: eachSimilarJob.company_logo_url,
          employmentType: eachSimilarJob.employment_type,
          id: eachSimilarJob.id,
          jobDescription: eachSimilarJob.job_description,
          location: eachSimilarJob.location,
          rating: eachSimilarJob.rating,
          title: eachSimilarJob.title,
        }),
      )

      this.setState({
        jobDetailsObj: modifiedJobDetails,
        skillsList: modifiedSkills,
        lifeAtCompanyObj: modifiedLifeAtCompany,
        similarJobsList: modifiedSimilarJobs,
        outputView: resultView.success,
      })
    } else {
      this.setState({outputView: resultView.failure})
    }
  }

  jobItemDetailsSection = () => {
    const {jobDetailsObj, skillsList, lifeAtCompanyObj} = this.state

    const {
      companyLogoUrl,
      title,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
    } = jobDetailsObj

    const {description, imageUrl} = lifeAtCompanyObj

    return (
      <div className="job-description-bg">
        <div className="job-item-top-section">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
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
        <div className="job-details-description-section">
          <div className="job-details-description-title-section">
            <h1 className="job-details-description-title">Description</h1>
            <div className="visit-section">
              <a href={companyWebsiteUrl} className="visit-link">
                Visit
              </a>
              <IoOpenOutline className="visit-icon" />
            </div>
          </div>
          <p className="job-details-description-para">{jobDescription}</p>
          <h1 className="job-details-description-title">Skills</h1>
          <ul className="skills-unordered-list">
            {skillsList.map(eachSkillItem => (
              <li key={eachSkillItem.name} className="each-skill-item">
                <img
                  src={eachSkillItem.imageUrl}
                  alt={eachSkillItem.name}
                  className="skill-image"
                />
                <p className="each-skill-name">{eachSkillItem.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="job-details-description-title">Life at Company</h1>
          <div className="life-at-company-section">
            <p className="job-details-description-para description-width">
              {description}
            </p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-image"
            />
          </div>
        </div>
      </div>
    )
  }

  similarJobDetailsSection = () => {
    const {similarJobsList} = this.state

    return (
      <ul className="similar-job-Details-section">
        {similarJobsList.map(eachSimilarJob => (
          <li key={eachSimilarJob.id} className="similar-job-item-bg">
            <div className="job-item-top-section">
              <img
                src={eachSimilarJob.companyLogoUrl}
                alt="similar job company logo"
                className="company-logo"
              />
              <div className="title-rating-section">
                <h1 className="company-title">{eachSimilarJob.title}</h1>
                <div className="rating-section">
                  <AiFillStar className="star-logo" />
                  <p className="jobs-rating-text">{eachSimilarJob.rating}</p>
                </div>
              </div>
            </div>
            <h1 className="job-details-description-title">Description</h1>
            <p className="job-details-description-para">
              {eachSimilarJob.jobDescription}
            </p>
            <div className="location-employment-type-section">
              <MdLocationOn className="location-logo" />
              <p className="location-text">{eachSimilarJob.location}</p>
              <BsFillBriefcaseFill className="location-logo" />
              <p className="location-text">{eachSimilarJob.employmentType}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  retryOnFailure = () => this.getJobItemDetails()

  loadingView = () => (
    <div className="profile-failure-loading-bg" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  jobItemDetailsFailureRender = () => (
    <div className="jobs-not-found-failure-loading-bg ">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs_failure_image"
      />
      <h1 className="jobs-failure-title">Oops! Something Went Wrong </h1>
      <p className="jobs-failure-para">
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.retryOnFailure}
      >
        Retry
      </button>
    </div>
  )

  switchCaseRender = () => {
    const {outputView} = this.state

    switch (outputView) {
      case resultView.success:
        return this.jobItemDetailsRender()
      case resultView.failure:
        return this.jobItemDetailsFailureRender()
      case resultView.in_progress:
        return this.loadingView()
      default:
        return null
    }
  }

  jobItemDetailsRender = () => (
    <div className="job-details-section-bg">
      {this.jobItemDetailsSection()}
      <h1 className="similar-job-header">Similar Jobs</h1>
      {this.similarJobDetailsSection()}
    </div>
  )

  render() {
    return (
      <div className="job-item-details-route-bg">
        <Header />
        {this.switchCaseRender()}
      </div>
    )
  }
}

export default JobItemDetails
