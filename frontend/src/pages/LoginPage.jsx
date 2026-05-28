import { Formik, Form, Field, ErrorMessage } from 'formik';

function LoginPage() {
  const initialValues = {
    username: '',
    password: '',
  };

  const handleSubmit = (values) => {
    // Отправка формы будет реализована позже
    console.log('Данные формы:', values);
  };

  return (
    <div>
      <h2>Вход в чат</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        <Form>
          <div>
            <label htmlFor="username">Имя пользователя:</label>
            <Field
              type="text"
              id="username"
              name="username"
              placeholder="Введите имя"
            />
            <ErrorMessage name="username" component="div" />
          </div>

          <div>
            <label htmlFor="password">Пароль:</label>
            <Field
              type="password"
              id="password"
              name="password"
              placeholder="Введите пароль"
            />
            <ErrorMessage name="password" component="div" />
          </div>

          <button type="submit">Войти</button>
        </Form>
      </Formik>
    </div>
  );
}

export default LoginPage;