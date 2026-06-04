import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';
import { addChannel, renameChannel, deleteChannel, closeModal } from '../store/chatSlice';

const getValidationSchema = (channels, currentName = '') => {
  return Yup.object({
    name: Yup.string()
      .trim()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .test('unique', 'Такое имя уже существует', (value) => {
        if (!value) return true;
        const trimmed = value.trim();
        const isSameAsCurrent = trimmed === currentName;
        return isSameAsCurrent || !channels.some(ch => ch.name === trimmed);
      })
      .required('Обязательное поле'),
  });
};

function ChannelModals() {
  const dispatch = useDispatch();
  const { modal, channels, currentChannelId } = useSelector((state) => state.chat);
  const inputRef = useRef(null);

  useEffect(() => {
    if (modal.isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [modal.isOpen]);

  const handleClose = () => dispatch(closeModal());

  const handleAdd = async (values, { setSubmitting }) => {
    await dispatch(addChannel(values.name.trim())).unwrap();
    setSubmitting(false);
  };

  const handleRename = async (values, { setSubmitting }) => {
    const channel = channels.find(ch => ch.id === modal.channelId);
    if (channel?.name === values.name.trim()) {
      dispatch(closeModal());
      setSubmitting(false);
      return;
    }
    await dispatch(renameChannel({ id: modal.channelId, name: values.name.trim() })).unwrap();
    setSubmitting(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteChannel(modal.channelId)).unwrap();
  };

  const currentChannel = channels.find(ch => ch.id === modal.channelId);
  const isDefaultChannel = currentChannel?.name === 'general';

  // Модалка добавления
  if (modal.type === 'add') {
    const validationSchema = getValidationSchema(channels);
    return (
      <Modal show={modal.isOpen} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Добавить канал</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={handleAdd}
        >
          {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
            <FormikForm>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Имя канала</Form.Label>
                  <Field
                    name="name"
                    innerRef={inputRef}
                    className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                    placeholder="например: general"
                  />
                  {errors.name && touched.name && (
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  )}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Отмена</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Добавление...' : 'Добавить'}
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    );
  }

  // Модалка переименования
  if (modal.type === 'rename') {
    const validationSchema = getValidationSchema(channels, currentChannel?.name);
    return (
      <Modal show={modal.isOpen} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Переименовать канал</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ name: currentChannel?.name || '' }}
          validationSchema={validationSchema}
          onSubmit={handleRename}
        >
          {({ errors, touched, isSubmitting, values, handleChange, handleBlur }) => (
            <FormikForm>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>Новое имя</Form.Label>
                  <Field
                    name="name"
                    innerRef={inputRef}
                    className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                  />
                  {errors.name && touched.name && (
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  )}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Отмена</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Сохранение...' : 'Сохранить'}
                </Button>
              </Modal.Footer>
            </FormikForm>
          )}
        </Formik>
      </Modal>
    );
  }

  // Модалка удаления
  if (modal.type === 'remove') {
    return (
      <Modal show={modal.isOpen} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Удалить канал</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Вы уверены, что хотите удалить канал <strong>#{currentChannel?.name}</strong>?</p>
          <p className="text-muted small">Все сообщения канала будут безвозвратно удалены.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Отмена</Button>
          <Button variant="danger" onClick={handleDelete}>
            Удалить
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return null;
}

export default ChannelModals;