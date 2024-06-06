import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BiSearch} from 'react-icons/bi'
import Header from '../Header'
import EachJob from '../EachJob'
import './index.css'

const resultView = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
  not_found: 'NOT_FOUND',
}

class Jobs extends Component {
  state = {
    jobsFetchStatus: resultView.initial,
    searchInput: '',
    profileDetails: {},
    jobsData: [],
    profileFetchStatus: resultView.initial,
    activeEmploymentTypeList: [],
    activeSalaryId: '',
    activeLocationList: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsListRender()
  }

  onClickEmploymentCheckBox = event => {
    const {activeEmploymentTypeList} = this.state

    if (activeEmploymentTypeList.includes(event.target.id)) {
      this.setState(
        prev => ({
          activeEmploymentTypeList: prev.activeEmploymentTypeList.filter(
            eachId => eachId !== event.target.id,
          ),
        }),
        this.getJobsListRender,
      )
    } else {
      this.setState(
        prev => ({
          activeEmploymentTypeList: [
            ...prev.activeEmploymentTypeList,
            event.target.id,
          ],
        }),
        this.getJobsListRender,
      )
    }
  }

  onClickLocationCheckbox = event => {
    const {activeLocationList} = this.props

    const checkLLocationId = activeLocationList.includes(event.target.id)
    if (checkLLocationId) {
      this.setState(
        prevState => ({
          activeLocationList: prevState.activeLocationList.filter(
            eachLocation => eachLocation.locationId !== event.target.id,
          ),
        }),
        this.getJobsListRender,
      )
    } else {
      this.setState(
        prevState => ({
          activeLocationList: [
            ...prevState.activeLocationList,
            event.target.id,
          ],
        }),
        this.getJobsListRender,
      )
    }
  }

  onClickSalaryCheckBox = event => {
    const salaryId = event.target.id
    this.setState({activeSalaryId: salaryId}, this.getJobsListRender)
  }

  getJobsListRender = async () => {
    this.setState({jobsFetchStatus: resultView.in_progress})

    const {
      activeEmploymentTypeList,
      activeLocationList,
      activeSalaryId,
      searchInput,
    } = this.state
    const stringOfActiveEmploymentTypeList = activeEmploymentTypeList.join()
    const stringOfActiveLocationList = activeLocationList.join()

    const jwtToken = Cookies.get('jwt_token')
    const jobsApi = `https://apis.ccbp.in/jobs?employment_type=${stringOfActiveEmploymentTypeList}&minimum_package=${activeSalaryId}&job_location=${stringOfActiveLocationList}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(jobsApi, options)

    if (response.ok === true) {
      const data = await response.json()

      if (data.jobs.length !== 0) {
        const modifiedJobsData = data.jobs.map(eachJobItem => ({
          id: eachJobItem.id,
          companyLogoUrl: eachJobItem.company_logo_url,
          employmentType: eachJobItem.employment_type,
          jobDescription: eachJobItem.job_description,
          location: eachJobItem.location,
          packagePerAnnum: eachJobItem.package_per_annum,
          rating: eachJobItem.rating,
          title: eachJobItem.title,
        }))

        this.setState({
          jobsData: modifiedJobsData,
          jobsFetchStatus: resultView.success,
        })
      } else {
        this.setState({
          jobsFetchStatus: resultView.not_found,
        })
      }
    } else {
      this.setState({jobsFetchStatus: resultView.failure})
    }
  }

  jobsRender = () => {
    const {jobsData} = this.state
    console.log(this.props)

    return (
      <ul className="jobs-unordered-list">
        {jobsData.map(eachJob => (
          <EachJob eachJob={eachJob} />
        ))}
      </ul>
    )
  }

  listOfSalaryRange = () => {
    const {salaryRangesList} = this.props

    return salaryRangesList.map(eachSalaryItem => (
      <li key={eachSalaryItem.salaryRangeId} className="each-filter-list-item">
        <input
          id={eachSalaryItem.salaryRangeId}
          type="radio"
          name="radio"
          className="input-check-box"
          value="eachSalaryItem.label"
          onChange={this.onClickSalaryCheckBox}
        />
        <label
          htmlFor={eachSalaryItem.salaryRangeId}
          className="label-employment"
        >
          {eachSalaryItem.label}
        </label>
      </li>
    ))
  }

  salaryRangeRender = () => (
    <>
      <h1 className="filterTitle"> Salary Range </h1>
      <ul className="employmentTypeList">{this.listOfSalaryRange()}</ul>
    </>
  )

  listOfEmployment = () => {
    const {employmentTypesList} = this.props

    return employmentTypesList.map(eachEmployment => (
      <li
        key={eachEmployment.employmentTypeId}
        className="each-filter-list-item"
      >
        <input
          type="checkbox"
          id={eachEmployment.employmentTypeId}
          onClick={this.onClickEmploymentCheckBox}
          className="input-check-box"
        />
        <label
          htmlFor={eachEmployment.employmentTypeId}
          className="label-employment"
        >
          {eachEmployment.label}
        </label>
      </li>
    ))
  }

  typeOfEmploymentRender = () => (
    <>
      <h1 className="filterTitle">Type of Employment</h1>
      <ul className="employmentTypeList">{this.listOfEmployment()}</ul>
    </>
  )

  listOfLocation = () => {
    const {locationList} = this.props

    return locationList.map(eachLocation => (
      <li key={eachLocation.locationId} className="each-filter-list-item">
        <input
          type="checkbox"
          id={eachLocation.locationId}
          className="input-check-box"
          onClick={this.onClickLocationCheckbox}
        />
        <label htmlFor={eachLocation.locationId} className="label-employment">
          {eachLocation.label}
        </label>
      </li>
    ))
  }

  locationRender = () => (
    <>
      <h1 className="filterTitle">Location</h1>
      <ul className="employmentTypeList">{this.listOfLocation()}</ul>
    </>
  )

  jobsListFetchStatusRender = () => {
    const {jobsFetchStatus} = this.state

    switch (jobsFetchStatus) {
      case resultView.success:
        return this.jobsRender()
      case resultView.failure:
        return this.jobsFailureView()
      case resultView.in_progress:
        return this.loadingView()
      case resultView.not_found:
        return this.jobsNotFoundView()
      default:
        return null
    }
  }

  profileFetchStatusRender = () => {
    const {profileFetchStatus} = this.state

    switch (profileFetchStatus) {
      case resultView.success:
        return this.profileRender()
      case resultView.failure:
        return this.profileFailureView()
      case resultView.in_progress:
        return this.loadingView()
      default:
        return null
    }
  }

  profileFailureView = () => (
    <div className="profile-failure-loading-bg">
      <button
        type="button"
        className="retry-button"
        onClick={this.getProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  onClickRetryUponJobsFailure = () => {
    this.getJobsListRender()
  }

  jobsFailureView = () => (
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
        onClick={this.onClickRetryUponJobsFailure}
      >
        Retry
      </button>
    </div>
  )

  jobsNotFoundView = () => (
    <div className="jobs-not-found-failure-loading-bg ">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="jobs_failure_image"
      />
      <h1 className="jobs-failure-title">No Jobs Found</h1>
      <p className="jobs-failure-para">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  loadingView = () => (
    <div className="profile-failure-loading-bg" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  getProfileDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const profileApi = 'https://apis.ccbp.in/profile'

    this.setState({profileFetchStatus: resultView.in_progress})

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(profileApi, options)

    if (response.ok === true) {
      const data = await response.json()
      const modifiedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileDetails: modifiedData,
        profileFetchStatus: resultView.success,
      })
    } else {
      this.setState({profileFetchStatus: resultView.failure})
    }
  }

  profileRender = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-section">
        <img src={profileImageUrl} alt="profile" className="profile-image" />
        <h1 className="profile-title">{name}</h1>
        <p className="profile-sub-title">{shortBio}</p>
      </div>
    )
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onPressEnter = event => {
    if (event.key === 'Enter') {
      this.getJobsListRender()
    }
  }

  onClickSearch = () => {
    this.getJobsListRender()
  }

  render() {
    const {searchInput} = this.state

    return (
      <div className="jobs-route-bg">
        <Header />
        <div className="jobs-section">
          <div className="jobs-left-section">
            {this.profileFetchStatusRender()}
            <hr className="separator" />
            {this.typeOfEmploymentRender()}
            <hr className="separator" />
            {this.salaryRangeRender()}
            <hr className="separator" />
            {this.locationRender()}
          </div>
          <div className="jobs-right-section">
            <div className="search-section">
              <input
                type="search"
                placeholder="Search"
                className="input-search-box"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onPressEnter}
              />
              <div className="search-icon-bg">
                <button
                  type="button"
                  className="button-search"
                  onClick={this.onClickSearch}
                  data-testid="searchButton"
                >
                  <BiSearch className="search-icon" />
                </button>
              </div>
            </div>

            {this.jobsListFetchStatusRender()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
