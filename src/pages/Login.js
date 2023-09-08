import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import './authentication.scss';
import logo from '../ressources/img/logo.png'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const { email, password } = values;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setErr('User not found');
    }
  };

  const validationSchema = yup.object({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().required('Password is required')
  });

  return (
    <div className="fitconnect-wrapper">
      <div className="fitconnect-form">
        <span className="fitconnect-title">Login</span>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <Field type="email" name="email" placeholder="email" />
              <ErrorMessage name="email" component="div" className="fitconnect-error" />

              <Field type="password" name="password" placeholder="password" />
              <ErrorMessage name="password" component="div" className="fitconnect-error" />

              <button type="submit">Sign in</button>
            </Form>
          )}
        </Formik>
        {err && <span className="fitconnect-error">{err}</span>}
        <p>You don't have an account? <Link className="underline" to="/register">Register</Link></p>
      </div>
      <div className="fitconnect-logo">
        <img src={logo} alt="logo" />
      </div>
    </div>
  );
};

export default Login;
