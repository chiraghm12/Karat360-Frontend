import React from 'react';
import AuthLayout from '../../layout/AuthLayout';
import OTPVerificationForm from '../../components/auth/OTPVerificationForm';

const OTPVerification = () => {
  return (
    <AuthLayout>
      <OTPVerificationForm />
    </AuthLayout>
  );
};

export default OTPVerification;
