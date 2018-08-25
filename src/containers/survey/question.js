import React from 'react'

const RadioButton = (props) => {
  const { id, value, reverse, categoryId, updateSurvey } = props
  return (
    <div className="form-check-inline radio">
      <input
        type="radio"
        className="form-check-input"
        name={`optradio ${id}`}
        onClick={() => {
          updateSurvey(categoryId, id, value)
        }}
      />
    </div>
  )
}


const Question = (props) => {
  const { row, id, question, reverse, value, updateSurvey, categoryId, validationFailed, submitted, answers }  = props
  const rowClass = row%2 ? 'oddQuestion' : 'evenQuestion'
  const needsValidation = !value && validationFailed
  return (
    <div className={`questionHolder ${rowClass} ${needsValidation && ' invalid'}`}>
      <span className="question">{question}</span>
      {answers.map((name,value) => <RadioButton categoryId={categoryId} id={id} key={value} value={value+1} reverse={reverse} updateSurvey={updateSurvey}/>)}
    </div>
  )
}

export default Question
