import { useEffect, useState } from 'react'
import './styles/styles.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { IMenu, MENU_LIST } from './settings/menu-settings'
import MainTemplate from './templates/main-template'
import { UserProvider } from './contexts/user-context'
import { NavigatorProvider } from './contexts/navigator-context'

function App() {

  return (
    <BrowserRouter>
      <NavigatorProvider>
        <UserProvider>
          <MainTemplate>
            <Routes>
              {
                MENU_LIST.map((menu : IMenu, index : number) =>
                  <Route path={menu.path} element={menu.element} key={index}/>
                )
              }
            </Routes>
          </MainTemplate>
        </UserProvider>
      </NavigatorProvider>
    </BrowserRouter>
  )
}

export default App
