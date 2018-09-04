import React, { Component } from 'react'
import { getUsers } from '../auth/auth_functions'
import { connect } from 'react-redux'
import InlineTitleText from '../../components/inline_title_text'
import { newUser } from '../../constants'
import { addOrModifyElevatedUser, deleteElevatedUser } from '../auth/auth_functions'

const User = ({ email, name, i, role, updateUser, notYetExists, isSelf }) =>
  <form
    id={notYetExists ? 'newUser' : i}
    className="userHolder"
    onSubmit={(e) => {
      e.preventDefault()
    }}
  >
    <div className="userHeader">
      <h6>{`${name} (${email} - ${role})`}</h6>
      {!notYetExists && <button className="btn btn-sm btn-primary" type="button" data-toggle="collapse" data-target={`#collapse${i}`}>Edit User</button>}
    </div>
    <div className={`collapse ${notYetExists ? "show" : ""}`} id={`collapse${i}`}>
      <InlineTitleText value={name} title="User Name: " updateFunction={(value) => updateUser(i,"name",value)} />
      {notYetExists && <InlineTitleText value={email} type="email" title="User Email: " updateFunction={(value) => updateUser(i,"email",value)} />}
      {!isSelf && <div className="roleSelector">Role: {["admin","coach"].map(r => <RadioButton checked={role===r} updateUser={updateUser} id={i} key={r} role={r} /> )}</div>}
      {isSelf && <div>Cannot change your own role from admin or delete your account.  To delete this user as an admin, first create at least one other admin, log into that account, and modfiy or delete this user from that account</div>}
      {!notYetExists && !isSelf && <button type="button" className="btn btn-danger btn-sm btn-block" onClick={() => {
        if (window.confirm(`Are you sure you want to delete ${name} from ${role} privileges?`)) updateUser(i,"delete")
      }}>Delete Above User</button>}
      {!notYetExists && <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => updateUser(i,"modify")} >Modify Above User</button>}
      {notYetExists && <button type="button" className="btn btn-primary btn-sm btn-block" onClick={() => {
        if (window.$('#newUser')[0].checkValidity()) updateUser(i,"add")
      }} >Add New User</button>}
    </div>
  </form>

  const RadioButton = ({ id, role, updateUser, checked }) =>
    <div className="form-check multiRadio">
      <input
        type="radio"
        className="form-check-input"
        name={`multioptradio ${id}`}
        checked={checked}
        onChange={() => {}}
        onClick={() => {
          updateUser(id, "role", role)
        }}
      />
      <div className="multipleAnswer">{role}</div>
    </div>

class UserEditor extends Component {
  constructor(props) {
    super(props)
    this.updateUser = this.updateUser.bind(this)
    this.state = {
      users:[],
      newUser:JSON.parse(JSON.stringify(newUser)),
      error: null
    }
  }
  updateUser(id,key,value) {
    if (key==="delete") {
      const user = this.state.users.splice(id,1)[0]
      deleteElevatedUser(user).then((r) => {
        console.log(r)
        if (r.data === 'okay') this.setState({...this.state,error: `User ${user.email} successfully deleted!`})
        else this.setState({...this.state,error: r.data})
      })
    } else if (key==="modify") {
      addOrModifyElevatedUser(this.state.users[id]).then((r) => {
        if (r.data === 'okay') this.setState({...this.state,error: `User ${this.state.users[id].email} successfully modified!`})
        else this.setState({...this.state,error: r.data})
      })
    } else if (key==="add") {
      const { email, name } = this.state.newUser
      if (this.state.users.map(u => u.email).includes(email)) {
        this.setState({...this.state, error: `Cannot add a second user with the email ${email}`})
        return
      } else if (!email || !name) {
        this.setState({...this.state, error: `Cannot add a user without both a name and email address`})
        return
      }
      addOrModifyElevatedUser(this.state.newUser).then((r) => {
        if (r.data === 'okay') this.setState({...this.state,error: `User ${email} successfully added!`})
        else this.setState({...this.state,error: r.data})
      })
      this.state.users.push(this.state.newUser)
      this.state.newUser = JSON.parse(JSON.stringify(newUser))
    } else if (id==="new") {
      this.state.newUser[key] = value
    } else {
      this.state.users[id][key] = value
    }
    this.state.error = null
    this.setState(this.state)
  }
  componentDidMount() {
    getUsers().then(users => {
      users.sort((a,b) => a.name > b.name)
      this.setState({ ...this.state, users })
    }).catch((error) => {
      this.setState({ ...this.state, error })
    })
  }

  render() {
    const { error, users, newUser } = this.state
    const { authUser, role } = this.props
    console.log({users,authUser})
    return (
      <div>
        { error && <div className="alert alert-primary" role="alert">{error.message || error }</div> }
        <h4>Users:</h4>
        (You must click modify user to save any changes to users)
        {users.map((u,i) => <User updateUser={this.updateUser} {...u} i={i} key={i} isSelf={u.email === authUser.email}/> )}
        <h4>New User</h4>
        <User updateUser={this.updateUser} {...newUser} i="new" key="new" notYetExists />
      </div>
    )
  }
}

function mapStateToProps(state, ownProps, terms) {
  const { authUser, role } = ownProps
  return { authUser, role }
}

export default connect(mapStateToProps,{})(UserEditor)
