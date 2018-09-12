import React, { Component } from 'react'

class SearchBar extends Component {
  render() {
    const { type, term, onSearchTermChange } = this.props
    return (
      <input
        id={this.props.id}
        placeholder={ this.props.placeholder }
        className={this.props.overClass || "searchInput"}
        value = { term }
        onChange={ event => { onSearchTermChange(type, event.target.value) }}
        style={ this.props.style }
      />
    )
  }

}

export default SearchBar
