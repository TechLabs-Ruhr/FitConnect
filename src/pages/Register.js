import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import './authentication.scss';

const Register = () => {
  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      updateProfile(res.user, {
        displayName,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
      });

      // await setDoc(doc(db, "userMarkers", res.user.uid), {});
      navigate("/");
    } catch (err) {
      console.log(err);
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">FitConnect</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder='name' />
          <input type="em
          ail" placeholder='email' />
          <input type="password" placeholder='password' />
          <button>Sign up</button>
          {err && <span>Something went wrong!</span>}
        </form>
        <p>Do you have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  )
}

export default Register