import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Alert, Button, Container, Row, Col } from 'react-bootstrap';
import { setToken } from '../store/slices/authSlice';
import { authAPI } from '../services/api';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    username: '',
    password: '',
  };

  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Обязательное поле';
    }
    if (!values.password) {
      errors.password = 'Обязательное поле';
    }
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(values.username, values.password);
      dispatch(setToken(response.data.token));
      navigate('/');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка авторизации';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Вход в чат</h2>
          
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
                    Имя пользователя
                  </label>
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="form-control"
                    placeholder="Введите имя пользователя"
                  />
                  <ErrorMessage name="username" component="div" className="text-danger" />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Пароль
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Введите пароль"
                  />
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </div>

                <Button 
                  type="submit" 
                  variant="primary" 
                  className="w-100"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Вход...' : 'Войти'}
                </Button>
              </Form>
            )}
          </Formik>
          <div className="text-center mt-3">
  <Link to="/signup">Нет аккаунта? Зарегистрируйтесь</Link>
</div>
          <div className="text-center mt-3 text-muted">
            <small>Тестовые данные: admin / admin</small>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;