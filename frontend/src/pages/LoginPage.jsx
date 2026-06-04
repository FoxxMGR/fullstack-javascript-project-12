import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useAuth } from '../hooks/useAuth';
import { Alert, Button, Container, Row, Col } from 'react-bootstrap';

function LoginPage() {
  const { t } = useTranslation();
  const { login, error, loading } = useAuth();

  const initialValues = {
    username: '',
    password: '',
  };

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = t('errors.required');
    }
    if (!values.password) {
      errors.password = t('errors.required');
    }
    return errors;
  };

  const handleSubmit = async (values) => {
    await login(values.username, values.password);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">{t('login.title')}</h2>
          
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}
          
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {t('login.username')}
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder={t('login.username')}
                  />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {t('login.password')}
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder={t('login.password')}
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100"
                  disabled={isSubmitting || loading}
                >
                  {loading ? '...' : t('login.submit')}
                </Button>
              </Form>
            )}
          </Formik>
          
          <div className="text-center mt-3">
            <Link to="/signup">{t('login.signupLink')}</Link>
          </div>
          <div className="text-center mt-3 text-muted">
            <small>{t('login.testData')}</small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;