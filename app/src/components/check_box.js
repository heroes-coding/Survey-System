import React from 'react'

export default ({ label, checked, updateFunction }) =>
  <div className="form-check form-check-inline">
    <label className="form-check-label">{label}<input className={`form-check-input ${label}`} type="checkbox" checked={checked} onChange={(e) => updateFunction(e.target.checked)} /></label>
  </div>
