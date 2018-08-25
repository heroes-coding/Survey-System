import React from 'react'
import Question from './question'

const Category = (props) => {
  const { id: categoryId, name, title, questions, updateSurvey, submitted, validationFailed, answers } = props
  return (
    <div className="categoryHolder">
      <div className="categoryTitle">{title}</div>
      <div className='questionHolder'>
        <div className="question"></div>
        {answers.map((answer,i) => <div key={i} className="answerHeader">{answer}</div>)}
      </div>
      {Object.entries(questions).map((entry,row) => {
        const [ id, q ] = entry
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
    </div>
  )
}

export default Category