import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {t('header.brand')}
        </Navbar.Brand>
        <Nav className="ms-auto">
          {user ? (
            <Button variant="outline-danger" size="sm" onClick={handleLogout}>
              {t('header.logout')}
            </Button>
          ) : (
            <Button variant="outline-primary" size="sm" as={Link} to="/login">
              {t('header.login')}
            </Button>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;