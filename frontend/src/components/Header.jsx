import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Hexlet Chat
        </Navbar.Brand>
        <Nav className="ms-auto">
          {token ? (
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              Выйти
            </Button>
          ) : (
            <Button variant="outline-primary" size="sm" as={Link} to="/login">
              Войти
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;