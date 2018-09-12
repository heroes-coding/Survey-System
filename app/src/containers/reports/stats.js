import React from 'react'
import * as d3 from 'd3'
import KDensity from './kdensity'
import Graph from './graph'
import { formatNumber, getMessage } from '../../helpers/tiny_helpers'
import Suggestions from '../survey/suggestions'

const getStats = (scores) => {
  const std = Math.round(d3.deviation(scores)*100)/100
  return {  mean: Math.round(d3.mean(scores)*100)/100,
            std: isNaN(std) ? '-' : std,
            median: d3.median(scores) }
}

const Score = ({label, value, overClass}) =>
  <div className={overClass || "catStat"}>
    <div className="scoreLabel">{label}</div>
    <div className="scoreValue">{value}</div>
  </div>

const Question = ({ nAnswers, mean, std, median, studentResults, question, reverse, bars, firstName }) =>
  <div className="questionResults">
    <div className="resultQuestionHolder">
      <div className="resultQuestion">{question}{reverse && <div className="reverse">(<i className="fa fa-backward" aria-hidden="true"></i> reverse-encoded)</div>}</div>
      {nAnswers && <div className="questionStatHolder">
        <Score overClass="qStat" label={'μ: '} value={mean} />
        <Score overClass="qStat" label={'Med.: '} value={median} />
        <Score overClass="qStat" label={'σ²: '} value={std} />
      </div>}
      {nAnswers && studentResults.map(([r,date],i) =>
        <div key={i} className="studentQResult">
          {`${firstName} scored `}
          <span className="scoreResult">{r}</span>
          {reverse && ` (answer ${nAnswers+1-r})`}
          {` on ${date}`}
        </div>
      )}
      {!nAnswers && studentResults.map(([r,date],i) =>
        <div key={i} className="studentQResult">
          {`${firstName} answered `}
          <span className="scoreResult">{r}</span>
          {` on ${date}`}
        </div>
      )}
    </div>
    <Graph
      graphClass="heroStat winrateGraph barGraph"
      containerClass="barHolder"
      bars={bars}
      xLabel="Score"
      yLabel="Responses"
      title={`Histogram of responses by score${reverse ? ' (already reverse encoded)' :''} to question`}
      xRatio={1000}
      yRatio={150}
      xOff={0}
      yOff={25}
      noArea={true}
      formatter={formatNumber}
      yFormatter={formatNumber}
    />
  </div>

const CatQuestion = (props) => {
  const { dates, firstName, nAnswers, qI, cI, question, studentData, reverse, results } = props
  const bars = Array(nAnswers).fill(1).map((x,i) => { return [i+1,0] })
  results.map(r => {
    bars[r-1][1] += 1
  })
  let studentResults = []
  studentData.map((d,i) => {
    if (!d.categoryResults.hasOwnProperty(cI)) return
    const value = d.categoryResults[cI][qI]
    if (value) studentResults.push([reverse ? nAnswers+1 - value : value,dates[i]])
  })
  return <Question nAnswers={nAnswers} {...getStats(results)} bars={bars} firstName={firstName} studentResults={studentResults} question={question} reverse={reverse} />
}

const Category = (props) => {
  console.log({props})
  let { firstName, name, questions, coachLinks, coachAdvice, cutoffScore, cI, survey, results, studentData, dates, hasStudent, answers } = props

  const scores = survey.categories[cI].results
  if (!scores) return <div></div>
  const nAnswers = answers.length
  const { mean, std, median } = getStats(scores)
  return (
    <div className="catHolder">
      <div className="statCat">
        <div className="catSummaryStats">
          <div className="statCatHeader">{`Category: ${name}`}</div>
          <Score label={'Mean score:'} value={mean} />
          <Score label={'Median score:'} value={median} />
          <Score label={'σ² of score:'} value={std} />
          <Score label={'Current cutoff:'} value={cutoffScore} />
          <Score label={'Score range:'} value={`1-${nAnswers}`} />
          {hasStudent && studentData.map((x,i) => {

            if (!x.categoryResults.hasOwnProperty(cI)) return null
            const results = Object.entries(x.categoryResults[cI]).map(([qI, v]) => survey.categories[cI].questions[qI].reverse ? nAnswers + 1 - v : v)
            const result = d3.mean(results)
            return (
              <div key={i} className="studentCatResult">
                {`${firstName} scored `}
                <span className="scoreResult">{result}</span>
                {` on ${dates[i]}`}
              </div>
            )
          })}
          <button className="btn btn-sm btn-primary catExpander collapsed" type="button" data-toggle="collapse" data-target={`#collapse${cI}`}></button>
        </div>
        <div className="catGraph">
          <KDensity
            graphClass="distributionGraph"
            X={scores}
            xLabel="Average Score"
            title={`Avg. Scores distribution for ${name}`}
            xRatio={600}
            yRatio={250}
            xOff={70}
            yOff={40}
            formatter={formatNumber}
          />
        </div>
      </div>
      <div className="collapse" id={`collapse${cI}`}>
        <div className="answersHolder">
          <div className="answerTitle">{name} answers:</div>
          {answers.map((a,i) => <div key={i} className="answerHolder">{a} ({i+1})</div>)}
        </div>
        {Object.entries(questions).map(([qI, q]) => <CatQuestion nAnswers={nAnswers} firstName={firstName} dates={dates} studentData={studentData} nAnswers={nAnswers} key={qI} qI={qI} cI={cI} {...q} />)}
      </div>
      <Suggestions isCoach advice={coachAdvice} links={coachLinks} />
    </div>
  )
}

export default (props) => {
  let { studentName, studentId, surveyId, studentData, results, survey } = props
  const { overallSuccess, positiveSuccess, negativeSuccess, categories, additionalQuestions, title, id, description } = survey
  let dates
  let firstName
  let lastName
  if (studentData.length) {
    dates = studentData.map(x => String(new Date(x.time)).slice(4,15))
    firstName = studentData[0].firstName
    lastName = studentData[0].lastName
  }
  const hasStudent = !!studentData.length && studentName
  const hasSurvey = surveyId && !!results.length
  if (!hasSurvey) return null
  return (
    <div id="statsHolder">
      {hasStudent && <div
        id="studentHeader"
        className="alert alert-primary">
        <div id="studentTitle">{`Survey ${surveyId} results${studentName && ` for ${firstName} ${lastName}`}${studentId ? ` (id: ${studentId})` : ''}`}</div>
        <div id="studentDates">{`(Taken on ${getMessage(null,null,dates)})`}</div>
      </div>}
      <div className="reportHeader">Category results:</div>
      {Object.entries(categories).map(([cI,c]) => <Category firstName={firstName} hasStudent={hasStudent} dates={dates} key={cI} cI={cI} {...c} studentData={studentData} survey={survey} results={results} />)}
      <div className="reportHeader">Additional question results:</div>
      {Object.entries(additionalQuestions).map(([qI,q]) => {
        let studentResults = []
        const { title, answers, results } = q
        const nAnswers = answers.length
        const bars = Array(nAnswers).fill(1).map((x,i) => { return [i+1,0,answers[i]] })
        results.map(r => {
          bars[r-1][1] += 1
        })
        studentData.map((d,i) => {
          if (!d.additionalResults.hasOwnProperty(qI)) return
          const value = d.additionalResults[qI]
          if (value) studentResults.push([answers[value-1],dates[i]])
        })
        console.log({studentResults})
        return <Question key={qI} question={title} bars={bars} studentResults={studentResults} firstName={firstName} hasStudent={hasStudent} />
      })}
    </div>
  )

}
