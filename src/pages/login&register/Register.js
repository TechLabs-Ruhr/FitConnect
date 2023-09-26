import { Formik, Form, Field } from 'formik';
import * as yup from 'yup';
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import logo from '../../ressources/img/logo.png'
import mediaLogo from '../../ressources/img/logo768.png'
import './authentication.scss';
import user from '../ressources/img/user.png'
import { uploadBytes, ref as storageRef } from "firebase/storage";

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();
  const handleFormSubmit = async (values, { setSubmitting }) => {
    const { username, email, password } = values;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      updateProfile(res.user, {
        displayName: username,
      });

      // const defaultImageURL = user; // Hier den URL des Standardbilds einfügen
      // const storage = storageRef(storage, `avatars/${res.user.uid}`);
      // await uploadBytes(storage, defaultImageURL);

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: username,
        email,
        photoURL: user,
      });

      await setDoc(doc(db, "userMarkers", res.user.uid), { markers: [] });
      await setDoc(doc(db, "userNotifications", res.user.uid), {
        notifications: {
          newNotifications: 0
        }
      });
      await setDoc(doc(db, "userChats", res.user.uid), {});


      navigate("/");
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };

  const validationSchema = yup.object({
    username: yup.string()
      .min(5, 'Username must be at least 5 characters long')
      .required('Username is required'),
    email: yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('Password is required'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required')
  });

  return (
    <div className="fitconnect-wrapper">
      <div className="fitconnect-form">
        <span className="fitconnect-title">Register</span>
        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={validationSchema}
          onSubmit={handleFormSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field name="username" type="text" placeholder="username" />
              {errors.username && touched.username && <div className='fitconnect-error'>{errors.username}</div>}
              <Field name="email" type="email" placeholder="email" />
              {errors.email && touched.email && <div className='fitconnect-error'>{errors.email}</div>}
              <Field name="password" type="password" placeholder="password" />
              {errors.password && touched.password && <div className='fitconnect-error'>{errors.password}</div>}
              <Field name="confirmPassword" type="password" placeholder="repeat your password" />
              {errors.confirmPassword && touched.confirmPassword && <div className='fitconnect-error'>{errors.confirmPassword}</div>}

              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Loading..." : "Sign up"}
              </button>

              {err && <span className='fitconnect-error'>Something went wrong!</span>}
            </Form>
          )}
        </Formik>
        <p>Do you have an account? <Link className="underline" to="/login">Login</Link></p>
      </div>

      <div className="fitconnect-logo">
        <img src={logo} className="default-logo" alt="logo" />
        <img src={mediaLogo} className="media-logo" alt="logo" />
      </div>
    </div>
  )
}

export default Register