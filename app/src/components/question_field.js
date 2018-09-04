import React from 'react'

export default ({ cat, question, reverse, number, updateQuestion, isOld }) =>
  <div className="input-group mb-3">
    <div className="input-group-prepend"><span className="input-group-text">{`Question ${number}:`}</span></div>
    <input
      type="text"
      className="form-control"
      id={`category${cat}Question${number}`}
      value={question}
      onChange={event => updateQuestion("question",event.target.value)}
      required
    ></input>
    <button type="button" className="btn btn-light" data-toggle="button" onClick={event => {
      event.preventDefault()
      updateQuestion("reverse",!reverse)
    }} >
      {reverse ? 'Reverse Encoded' : 'Encoded Normally'}
    </button>
    {!isOld&&<button type="button" className="btn btn-danger" onClick={event => updateQuestion("question",number)}>Del</button>}
  </div>
