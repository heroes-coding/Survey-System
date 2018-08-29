import React from 'react'
import DashButton from './dash_button'
import { signOut } from '../auth/auth_functions'

const DashNav = ({ openSurveyEditor, openSurveyStats, openUserAdmin, authUser, idToken }) =>
  <div id="dashNav">
    {true &&<DashButton clickFunction={openUserAdmin} name="Edit/Add Users" />}
    {true &&<DashButton clickFunction={openSurveyEditor} name="Edit/Add Surveys" />}
    <DashButton clickFunction={openSurveyStats} name="View Reports" />
    <DashButton clickFunction={signOut} name="Sign Out" />
  </div>

export default DashNav
