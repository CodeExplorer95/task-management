import { useState } from 'react';

// import {colorLog} from '../../Utils/colorLog';

export const useProfileModel = () => {
  const [emailInfo, setEmailInfo] = useState<{
    email: string;
    isValidate: boolean;
    isRequired: boolean;
  }>({
    email: '',
    isValidate: false,
    isRequired: false,
  });
  const [passwordInfo, setPasswordInfo] = useState<{
    password: string;
    isValidate: boolean;
    isRequired: boolean;
  }>({
    password: '',
    isValidate: false,
    isRequired: false,
  });
  const getEmail = () => {
    return emailInfo.email;
  };

  const getPassword = () => {
    return passwordInfo.password;
  };

  return {
    setEmailInfo,
    setPasswordInfo,
    emailInfo,
    passwordInfo,
    getEmail,
    getPassword,
  };
};
