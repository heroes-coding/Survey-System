import React from 'react'

const Suggestions = ({advice, links, isCoach}) => {
  if (!advice && (!links || !links.length)) return null
  return (
    <div className="alert alert-warning" role="alert">
      {isCoach && <div className="adviceHeader">Advice for coaches: </div>}
      {!!advice && <div className="adviceHolder">{advice}</div>}
      {!!links && !!links.length && <div className="linksHolder">{Object.entries(links).map(d => {
        const [i, l] = d
        return <div key={i} className="linkHolder"><a href={l.link}>{l.name}</a></div>})
      }</div>}
    </div>
  )
}

export default Suggestions
