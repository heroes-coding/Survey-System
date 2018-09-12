import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { selectSurveyId, updateStudentData, populateSurveyDraft, selectStudentId, selectStudentName, searchStudentName, searchStudentId, addSurveyIds, addStudentNames, addStudentIds, addSurveyData } from '../../actions'
import { getUserLists, getUserResults, getSurveyResults } from '../auth/auth_functions'
import _ from "lodash"
import DropDown from '../../components/drop_down'
import { defaultSurvey } from '../../constants'
import SearchBar from '../../components/search_bar'
import ReportDataSelector from '../../selectors/reports_selector'
import Stats from './stats'

class SurveyEditor extends Component {
  constructor(props) {
    super(props)
    this.changeSurvey = this.changeSurvey.bind(this)
    this.populateSurveyDraft = this.populateSurveyDraft.bind(this)
    this.search = this.search.bind(this)
    this.updateStudentName = this.updateStudentName.bind(this)
    this.updateStudentId = this.updateStudentId.bind(this)
    this.resetFilters = this.resetFilters.bind(this)
    this.resetStudent = this.resetStudent.bind(this)
    this.resetSurvey = this.resetSurvey.bind(this)
    this.state = {
      survey: null,
      error: null,
      nameSearch: '',
      idSearch: ''
    }
    axios.get('/getSurveyIds').then(res => {
      this.props.addSurveyIds(res.data)
    })
    getUserLists().then(lists => {
      this.props.addStudentIds(lists.userIds)
      this.props.addStudentNames(lists.userNames)
    })
  }

  populateSurveyDraft(e) {
    if (e) e.preventDefault()
    this.props.populateSurveyDraft({... this.state.survey})
    this.setState({...this.state, error: null})
  }
  search(type,term) {
    if (type==="fullName") {
      this.props.searchStudentName(term)
    } else if (type==="studentId") {
      this.props.searchStudentId(term)
    }
  }
  changeSurvey(surveyId) {
    axios.get(`/getSurvey/${surveyId}`).then(r => {
      this.setState({...this.state, survey: r.data })
      setTimeout(this.populateSurveyDraft, 500)
    })
    getSurveyResults(surveyId).then(r => {
      const surveyData = r
      this.props.selectSurveyId(surveyId)
      this.props.addSurveyData(r)
    })

  }
  resetFilters() {
    this.props.selectStudentName(null)
    this.props.selectStudentId(null)
    this.props.selectSurveyId(null)
    this.props.searchStudentName(null)
    this.props.searchStudentId(null)
    this.props.addSurveyData([])
    this.props.updateStudentData([])
    this.setState({...this.state, idSearch:"", nameSearch:"" })
  }
  resetStudent() {
    this.props.selectStudentName(null)
    this.props.selectStudentId(null)
    this.props.updateStudentData([])
  }
  resetSurvey() {
    this.props.addSurveyData([])
    this.props.selectSurveyId(null)
    this.setState({...this.state, survey: null})
  }
  updateStudentName(name) {
    this.props.selectStudentName(name)
    getUserResults(false,name).then(r => {
      this.props.updateStudentData(r)
    })
  }
  updateStudentId(id) {
    this.props.selectStudentId(id)
    getUserResults(true, id).then(r => {
      this.props.updateStudentData(r)
    })
  }
  render() {
    const searchDebounce = _.debounce((type,term) => {
      this.search(type,term)
      if (term) {
        setTimeout(() => {
          if (window.$(`#${type}SearchDropdown`).attr('aria-expanded') === 'false') {
            window.document.getElementById(`${type}SearchDropdown`).click()
            window.document.getElementById(`${type}Search`).focus()
          }
        }, 200)
      }
    }, 500)
    const search = (type,term) => {
      if (type === "fullName") this.setState({...this.state, nameSearch: term})
      else this.setState({...this.state, idSearch: term})
      searchDebounce(type,term)
    }
    const { error, nameSearch, idSearch } = this.state
    let { studentName, studentId, studentIds, studentNames, surveyIds, surveyId } = this.props
    return (
      <div className="reportsHolder">
        <button onClick={this.resetFilters} className="btn btn-primary btn-sm btn-block" >Reset all filters</button>
        <div className="resultFilters">
          <DropDown
            currentSelection={""}
            name={surveyId ? `Selected Survey: ${surveyId}` : 'Select Survey to View Reports For'}
            id='surveySelector'
            dropdowns={surveyIds}
            updateFunction={(survey) => this.changeSurvey(survey)}
            renderDropdownName={true}
            containerClass="filterDropDown"
            currentID={0}
            resetFunction={this.resetSurvey}
          />
          <SearchBar type="fullName" placeholder="Name Search" term={nameSearch} id="fullNameSearch" overClass="btn btn-small searchFilter input-group" onSearchTermChange={search} noautoclear={true} />
          <DropDown
            info={null}
            resetFunction={null}
            currentSelection={studentName || 'Names'}
            name=''
            id='fullNameSearchDropdown'
            containerClass="filterDropDown"
            dropdowns={studentNames}
            updateFunction={this.updateStudentName}
            leftComponentRenderer={null}
            rightComponentRenderer={null}
            renderDropdownName={true}
            currentID=' '
            resetFunction={this.resetStudent}
          />
          <SearchBar type="studentId" placeholder="Id Search" term={idSearch} id="studentIdSearch" overClass="btn btn-small searchFilter input-group" onSearchTermChange={search} noautoclear={true} />
          <DropDown
            info={null}
            resetFunction={null}
            currentSelection= {studentId || 'Ids'}
            name=''
            id='studentIdSearchDropdown'
            containerClass="filterDropDown"
            dropdowns={studentIds}
            updateFunction={this.updateStudentId}
            leftComponentRenderer={null}
            rightComponentRenderer={null}
            renderDropdownName={true}
            currentID=' '
            resetFunction={this.resetStudent}
          />
        </div>
        { error && <div className="alert alert-primary" role="alert">{error.message || error }</div> }
        <Stats {...this.props} />

      </div>

    )
  }
}




function mapStateToProps(state, ownProps, terms) {
  const { surveyId } = state
  return { ...ReportDataSelector(state), surveyId }
}

export default connect(mapStateToProps, { selectSurveyId, updateStudentData, selectStudentId, selectStudentName, populateSurveyDraft, populateSurveyDraft, searchStudentId, searchStudentName, addSurveyIds, addStudentNames, addStudentIds, addSurveyData } )(SurveyEditor)
