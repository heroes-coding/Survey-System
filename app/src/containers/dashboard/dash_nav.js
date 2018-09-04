import React from 'react'
import DashButton from './dash_button'
export const SURVEY_EDITOR = 2
export const USER_EDITOR = 1
export const REPORT_VIEWER = 3

const DashNav = ({ signOut, setPage, authUser, idToken }) =>
  <div id="dashNav">
    {authUser && idToken=== "admin" &&<DashButton clickFunction={() => setPage(USER_EDITOR)} name="Edit/Add Users" />}
    {authUser && idToken=== "admin" &&<DashButton clickFunction={() => setPage(SURVEY_EDITOR)} name="Edit/Add Surveys" />}
    {authUser && (idToken=== "admin" || idToken==="coach") && <DashButton clickFunction={() => setPage(REPORT_VIEWER)} name="View Reports" />}
    <DashButton clickFunction={signOut} name="Sign Out" />
  </div>

export default DashNav
