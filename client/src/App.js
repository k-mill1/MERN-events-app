import React, { useState } from "react"
import Dashboard from "./Dashboard"
import { ApiClient } from "./apiClient"

import Login from './Login'

function App() {
  const [token, changeToken] = useState(window.localStorage.getItem('token'))
  const client = new ApiClient(
    () => token,
    () => logout()
  )

  const login = (t) => {
    window.localStorage.setItem('token', t)
    changeToken(t)
  }

  const logout = () => {
    window.localStorage.removeItem('token')
    changeToken(undefined)
  }

  return (
    <div>
    {token ? (
      <Dashboard client={client} />
    ) : (
      <Login loggedIn = {(t => login(t))} client = {client} />
    )}
    </div>
  );
}

export default App
