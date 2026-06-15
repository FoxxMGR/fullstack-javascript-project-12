import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

function SignupPage() {
  const { t } = useTranslation();
  const { signup, error: authError, loading: authLoading } = useAuth();

  const getValidationSchema = () => Yup.object({
    username: Yup.string()
      .min(3, t('yup.usernameMin'))
      .max(20, t('yup.usernameMax'))
      .required(t('yup.required')),
    password: Yup.string()
      .min(6, t('yup.passwordMin'))
      .required(t('yup.required')),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], t('yup.passwordConfirm'))
      .required(t('yup.required')),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    await signup(values.username, values.password);
    setSubmitting(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">{t('signup.title')}</h2>

          {authError && (
            <Alert variant="danger" className="mb-3">
              {authError}
            </Alert>
          )}

          <Formik
            initialValues={{ username: '', password: '', confirmPassword: '' }}
            validationSchema={getValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    {t('signup.username')}
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder={t('signup.usernamePlaceholder')}
                  />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    {t('signup.password')}
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder={t('signup.passwordPlaceholder')}
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    {t('signup.confirmPassword')}
                  </label>
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    placeholder={t('signup.confirmPasswordPlaceholder')}
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 mb-3"
                  disabled={isSubmitting || authLoading}
                >
                  {authLoading ? '...' : t('signup.submit')}
                </Button>

                <div className="text-center">
                  <Link to="/login">{t('signup.loginLink')}</Link>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
}

export default SignupPage;
