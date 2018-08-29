import React from 'react'

const DashButton = ({ clickFunction, name }) =>
  <div className="dashButtonHolder">
    <button
      type="button"
      className ="btn btn-secondary btn-sm btn-block dashButton"
      onClick={clickFunction}
    >
      {name}
    </button>
  </div>

export default DashButton
