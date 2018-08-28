import React from 'react';

import {signOut } from './auth_functions';

const SignOutButton = () =>
  <button
    type="button"
    className ="btn btn-secondary btn-md"
    onClick={signOut}
  >
    Sign Out
  </button>

export default SignOutButton
