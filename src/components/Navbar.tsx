import React from 'react';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppNavbar: React.FC = () => {
  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="shadow">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          🎬 Фільмотека
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>
              Головна
            </Nav.Link>
            <Nav.Link as={NavLink} to="/movies/add">
              Додати фільм
            </Nav.Link>
            <Nav.Link as={NavLink} to="/catalog">
              Каталог збережених фільмів
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
