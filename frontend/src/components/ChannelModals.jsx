import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field } from 'formik';
import * as Yup from 'yup';
import { addChannel, renameChannel, deleteChannel, closeModal } from '../store/chatSlice';
import { useTranslation } from 'react-i18next';
import { containsProfanity, filterProfanity } from '../services/profanityFilter';
import { toast } from 'react-toastify';

const getValidationSchema = (channels, t, currentName = '') => {
  return Yup.object({
    name: Yup.string()
      .trim()
      .min(3, t('yup.usernameMin'))
      .max(20, t('yup.usernameMax'))
      .test('unique', t('errors.unique'), (value) => {
        if (!value) return true;
        const trimmed = value.trim();
        const isSameAsCurrent = trimmed === currentName;
        return isSameAsCurrent || !channels.some(ch => ch.name === trimmed);
      })
      .required(t('errors.required')),
  });
};

function ChannelModals() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { modal, channels } = useSelector((state) => state.chat);
  const inputRef = useRef(null);

  useEffect(() => {
    if (modal.isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [modal.isOpen]);

  const handleClose = () => dispatch(closeModal());

  const handleAdd = async (values, { setSubmitting }) => {
    let name = values.name.trim();
    
    // Фильтруем нецензурные слова
    if (containsProfanity(name)) {
      name = filterProfanity(name);
      toast.warning(t('errors.profanity'));
    }
    
    await dispatch(addChannel(name)).unwrap();
    setSubmitting(false);
  };

  const handleRename = async (values, { setSubmitting }) => {
    let name = values.name.trim();
    const channel = channels.find(ch => ch.id === modal.channelId);
    
    if (channel?.name === name) {
      dispatch(closeModal());
      setSubmitting(false);
      return;
    }
    
    // Фильтруем нецензурные слова
    if (containsProfanity(name)) {
      name = filterProfanity(name);
      toast.warning(t('errors.profanity'));
    }
    
    await dispatch(renameChannel({ id: modal.channelId, name })).unwrap();
    setSubmitting(false);
  };

  const handleDelete = async () => {
    await dispatch(deleteChannel(modal.channelId)).unwrap();
  };

  const currentChannel = channels.find(ch => ch.id === modal.channelId);

  // Модалка добавления
  if (modal.type === 'add') {
    const validationSchema = getValidationSchema(channels, t);
    return (
      <Modal show={modal.isOpen} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('modals.addChannel')}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={handleAdd}
        >
          {({ errors, touched, isSubmitting }) => (
            <FormikForm>
              <Modal.Body>
                <Form.Group>
                  <Form.Label htmlFor="channel-name">{t('modals.channelName')}</Form.Label>
                  <Field
                    id="channel-name"
                    name="name"
                    innerRef={inputRef}
                    className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                    placeholder={t('modals.channelNamePlaceholder')}
                  />
                  {errors.name && touched.name && (
                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                  )}
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>{t('modals.cancel')}</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? t('errors.loading') : t('modals.add')}
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
    const validationSchema = getValidationSchema(channels, t, currentChannel?.name);
    return (
      <Modal show={modal.isOpen} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{ name: currentChannel?.name || '' }}
          validationSchema={validationSchema}
          onSubmit={handleRename}
        >
          {({ errors, touched, isSubmitting }) => (
            <FormikForm>
              <Modal.Body>
                <Form.Group>
                  <Form.Label htmlFor="rename-channel">{t('modals.channelName')}</Form.Label>
                  <Field
                    id="rename-channel"
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
                <Button variant="secondary" onClick={handleClose}>{t('modals.cancel')}</Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? t('errors.loading') : t('modals.rename')}
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
          <Modal.Title>{t('modals.deleteChannel')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {t('modals.deleteConfirm')} <strong>#{currentChannel?.name}</strong>?
          </p>
          <p className="text-muted small">{t('modals.deleteWarning')}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>{t('modals.cancel')}</Button>
          <Button variant="danger" onClick={handleDelete}>
            {t('modals.delete')}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return null;
}

export default ChannelModals;