import React from "react";
import { Container } from "react-bootstrap";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import HistoryPage from "./components/HistoryPage";
import HomePage from "./components/HomePage";

function App() {
  return (
    <Container>
    <div className="App">
    
     <BrowserRouter>
     <Header />
     <Routes>
       <Route exact path="/" element={<HomePage/>}/>
       <Route path="/History"  element={<HistoryPage/>}/>
       </Routes>
     </BrowserRouter>
    </div>
    </Container>
  );
}

export default App;
