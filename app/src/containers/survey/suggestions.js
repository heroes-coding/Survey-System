import React from 'react'

const Suggestions = ({advice, links}) => {
  if (!advice && !links) return null
  return (
    <div className="alert alert-warning" role="alert">
      <div className="adviceHolder">{advice}</div>
      <div className="linksHolder">{Object.entries(links).map(d => {
        const [i, l] = d
        console.log({i,l})
        return <a key={i} href={l.link} className="linkHolder">{l.name}</a>})
      }</div>
    </div>
  )
}

export default Suggestions
