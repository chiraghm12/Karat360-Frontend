import React from 'react';
import AuthLayout from '../../layout/AuthLayout';
import SignInForm from '../../components/auth/SignInForm';

const Login = () => {
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
};

export default Login;
