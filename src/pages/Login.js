import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import './authentication.scss';
import logo from '../ressources/img/logo.png'
import mediaLogo from '../ressources/img/logo768.png'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';

const Login = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    const { email, password } = values;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setErr('User not found');
    } finally {
      setSubmitting(false);
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
          {({ isSubmitting }) => (
            <Form>
              <Field type="email" name="email" placeholder="email" />
              <ErrorMessage name="email" component="div" className="fitconnect-error" />

              <Field type="password" name="password" placeholder="password" />
              <ErrorMessage name="password" component="div" className="fitconnect-error" />

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Sign in"}
              </button>
            </Form>
          )}
        </Formik>
        {err && <span className="fitconnect-error">{err}</span>}
        <p>You don't have an account? <Link className="underline" to="/register">Register</Link></p>
      </div>
      <div className="fitconnect-logo">
        <img src={logo} className="default-logo" alt="logo" />
        <img src={mediaLogo} className="media-logo" alt="logo" />
      </div>
    </div>
  );
};

export default Login;
