import React from 'react'

export default ({ text, title, updateFunction, required }) =>
  <div className="form-group">
    <label >{title}</label>
    <textarea
      className="form-control"
      id="exampleFormControlTextarea1"
      onChange={event => updateFunction(event.target.value) }
      rows="3"
      value={text}
      required={required}
    />
  </div>
