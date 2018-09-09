import React from 'react'
import Suggestions from './suggestions'

const RadioButton = ({ id, value, reverse, categoryId, updateSurvey }) => {
  return (
    <div className="form-check-inline radio">
      <input
        type="radio"
        className="form-check-input"
        name={`optradio ${id} ${categoryId}`}
        onClick={() => {
          updateSurvey(categoryId, id, value)
        }}
      />
    </div>
  )
}


const Question = ({ row, id, question, reverse, value, updateSurvey, categoryId, validationFailed, submitted, answers }) => {
  const rowClass = row%2 ? 'oddQuestion' : 'evenQuestion'
  const needsValidation = !value && validationFailed
  return (
    <div className={`questionHolder ${rowClass} ${needsValidation && ' invalid'}`}>
      <span className="question">{question}</span>
      {answers.map((name,value) => <RadioButton categoryId={categoryId} id={id} key={value} value={value+1} reverse={reverse} updateSurvey={updateSurvey}/>)}
    </div>
  )
}

const Category = ({ shuffledQuestionKeys, showAdvice, advice, links, id: categoryId, name, title, questions, updateSurvey, submitted, validationFailed, answers }) => {
  return (
    <div className="surveyCategory">
      <div className="categoryTitle">{title}</div>
      <div className='answerHolder'>
        <div className="question"></div>
        {answers.map((answer,i) => <div key={i} className="answerHeader">{answer}</div>)}
      </div>
      {shuffledQuestionKeys.map((id,row) => {
        const q = questions[id]
        const { question, reverse, value } = q
          return (
            <Question
              key={id}
              categoryId={categoryId}
              id={id}
              row={row}
              question={question}
              reverse={reverse}
              value={value}
              submitted={submitted}
              validationFailed={validationFailed}
              answers={answers}
              updateSurvey={updateSurvey}
            />
          )
      })}
      {submitted && <Suggestions advice={advice} links={links} />}
    </div>
  )
}

export default Category
