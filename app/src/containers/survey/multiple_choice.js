import React from 'react'
import Suggestions from './suggestions'

const RadioButton = ({ id, value, reverse, categoryId, updateSurvey, showAnswer, answer }) =>
  <div className="form-check multiRadio">
    <input
      type="radio"
      className="form-check-input"
      name={`multioptradio ${id}`}
      onClick={() => {
        updateSurvey(categoryId, id, value)
      }}
    />
    {!!showAnswer&&<div className="multipleAnswer">{answer}</div>}
  </div>

const Question = ({ row, id, showAnswer, question, questionClass, reverse, value, updateSurvey, categoryId, validationFailed, submitted, answers }) =>
  <div className={`multipleQuestion ${!value && validationFailed && ' invalid'}`}>
    <span className="question">{question}</span>
    {answers.map((name,value) => <RadioButton showAnswer={showAnswer} answer={name} categoryId={categoryId} id={id} key={value} value={value+1} reverse={reverse} updateSurvey={updateSurvey}/>)}
  </div>


const MultipleChoice = ({ shuffledStandaloneKeys, questions, updateSurvey, submitted, validationFailed, advice, links }) =>
  <div className="multipleChoiceHolder">
    {shuffledStandaloneKeys.map(id => {
      const q = questions[id]
      const { title, answers, value, reverse } = q
        return (
          <Question
            key={id}
            categoryId="multiple"
            id={id}
            question={title}
            reverse={reverse}
            value={value}
            submitted={submitted}
            validationFailed={validationFailed}
            answers={answers}
            showAnswer
            updateSurvey={updateSurvey}
          />
        )
    })}
    <Suggestions advice={advice} links={links} />
  </div>

export default MultipleChoice
