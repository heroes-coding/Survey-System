import React from 'react'
// this dropdown is overly complicated for the task set before it, but I know how it works and copied it over from heroes.report


function DropdownItem(props) {
  const { d, updateFunction, dropdownClass } = props
  const dClass = `dropdown-item dropdownHolder ${dropdownClass || ''}`
  return (
    <button
      className={dClass}
      type="button"
      key={d}
      onClick={(event) => {
        event.preventDefault()
        updateFunction(d)
      }}
    >
      {d}
    </button>
  )
}

function renderButtonLabel(props) {
  if (props.buttonLabel) {
    return <span>{props.buttonLabel}&nbsp;&nbsp;</span>
  }
  return (
    <span className={props.textClass}>
      {props.name}{props.currentSelection}&nbsp;&nbsp;
    </span>
  )
}

export default (props) => {
  console.log({props})
  return (
    <form className={`${props.containerClass ? props.containerClass : 'input-group filterGroup '}` + ' justify-content-center'} >
      {props.resetFunction && <button
        className='btn btn-small btn-link iconFilter'
        onClick={(event) => {
          event.preventDefault()
          props.resetFunction('A')
        }}
      ><i className="fa fa-undo iconOnButton" aria-hidden="true"></i><span className=" d-none d-sm-block"> {props.updateType && `${props.updateType}:`}</span></button>}
      <button
        className={`btn btn-small btn-link ${props.overClass ? props.overClass : 'iconFilter'}`}
        id={props.id}
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={(event) => { event.preventDefault() }}
      >
        {renderButtonLabel(props)}
        {!props.hideArrow&&<span className="iconOnButton"><i className="fa fa-chevron-circle-down" aria-hidden="true"></i></span>}
      </button>
      <div className="dropdown-menu" aria-labelledby={props.id}>
        {props.dropdownHeader && props.dropdownHeader}
        {props.dropdowns.map((d,i) => {
          return (
            <DropdownItem
              key={i}
              d={d}
              updateFunction={props.updateFunction}
              renderName={props.renderDropdownName}
              dropdownClass={props.dropdownClass}
            />
          )
        })}
      </div>
      {props.extraButton}
      {props.info && <i title={props.info} className="fa fa-info-circle infoButton" aria-hidden="true"></i>}
    </form>
  )
}
