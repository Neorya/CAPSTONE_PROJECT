import { useState, useCallback } from 'react';
import { Form } from 'antd';


export const useEditProfileModal = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [form] = Form.useForm();

  /**
   * Opens the edit modal and populates form with current profile data
   * @param {Object} profile - Current profile data
   */
  const open = useCallback((profile) => {
    if (profile) {
      form.setFieldsValue({
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
      });
    }
    setIsVisible(true);
  }, [form]);


  const close = useCallback(() => {
    setIsVisible(false);
    form.resetFields();
  }, [form]);


  const getFormValues = useCallback(async () => {
    return await form.validateFields();
  }, [form]);

  return {
    isVisible,
    form,
    open,
    close,
    getFormValues,
  };
};

export default useEditProfileModal;
