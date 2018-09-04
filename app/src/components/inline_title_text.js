import React from 'react'

export default ({ updateFunction, value, title, inputType, type="text" }) =>
  <div className="input-group mb-3">
    <div className="input-group-prepend"><span className="input-group-text">{title}</span></div>
    <input
      type={type}
      className="form-control"
      value={value}
      onChange={event => updateFunction(event.target.value)}
      required
    ></input>
  </div>
