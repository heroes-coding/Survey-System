import React from 'react'

export default ({ name, value, property, placeholder, updateForm, type="text", pattern="(.*?)" }) =>
  <div className="form-group">
    <label>{name}</label>
    <input
      type={type}
      className="form-control"
      value={value || ""}
      placeholder={placeholder}
      pattern={pattern}
      onChange={event => updateForm(property, event.target.value)}
      required
    />
  </div>
