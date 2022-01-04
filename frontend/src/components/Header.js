import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const Header = () => {

  return (
    <Navbar bg="dark" >
    <Container>
      <Navbar.Brand className="navbar-brand" href="/">TML_IDS</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link className="navbar-link" href="/">Home</Nav.Link>
          <Nav.Link className="navbar-link" href="/History">History</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  );
};

export default Header;
