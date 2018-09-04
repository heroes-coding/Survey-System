import React from 'react'

export default ({ standalone, cat, answer, points, placeholder, updateAnswer, isOld }) =>
  <div className="input-group mb-3">
    {!standalone&&<div className="input-group-prepend"><span className="input-group-text">{`${points} point answer:`}</span></div>}
    <input
      type="text"
      className="form-control"
      id={`category${cat}Answer${answer}`}
      value={answer}
      onChange={event => updateAnswer(event.target.value)}
      required
    ></input>
    {!isOld&&<button type="button" className="btn btn-danger" onClick={event => updateAnswer(points)}>Del</button>}
  </div>
