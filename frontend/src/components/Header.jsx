import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Navbar, Button, Container } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {t('header.brand')}
        </Navbar.Brand>
        {user && (
          <Button variant="outline-danger" size="sm" onClick={logout}>
            {t('header.logout')}
          </Button>
        )}
      </Container>
    </Navbar>
  );
}

export default Header;