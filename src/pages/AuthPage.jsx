import React, { useState } from 'react';
import AuthContainer from '../components/AuthContainer';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="app-wrapper">
      <AuthContainer>
        {isLogin ? (
          <LoginForm toggleForm={toggleForm} />
        ) : (
          <SignUpForm toggleForm={toggleForm} />
        )}
      </AuthContainer>
    </div>
  );
};

export default AuthPage;
