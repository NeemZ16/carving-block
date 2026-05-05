// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router';
import './app.css';
import Home from './pages/home';
import ViewManageBooking from './pages/viewManageBooking';
import CompletedProjects from './pages/completedProjects';
import ListProject from './pages/listProject';

function App() {
  // TODO: load CarvingBlock abi
  // TODO: load IERC20 abi for yoda token
  // TODO: connect metmask wallet and contracts

  // hooks:
  // useState user type address default address(0)
  // useState walletConnected bool false

  return (
    <>
      <BrowserRouter basename='/carving-block'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/view-proj/:projectID" element={<ViewManageBooking />} />
          <Route path="/list-proj" element={<ListProject />}/>
          <Route path="/completed" element={<CompletedProjects />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
