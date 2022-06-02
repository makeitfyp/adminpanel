import './App.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { db, auth, fs } from './DataDump'
import { setUserEmail, setUserPassword, setUserUSerName } from './redux/action';
import { useDispatch, useSelector } from 'react-redux';

function Login() {
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate();
  var SubmitForm = (event) => {
    event.preventDefault();
    try {
      auth.signInWithEmailAndPassword(userName, password).then(user => {

        db.ref('Administrator/' + user.user.uid).once('value', (snapshot) => {
          console.log(snapshot.val())
          if (snapshot.val() != undefined && snapshot.val() != null) {
            if (snapshot.val().username == userName && snapshot.val().password == password) {
              setUserName(user.user.uid);
              dispatch(setUserEmail(snapshot.val().username))
              dispatch(setUserPassword(snapshot.val().password))
              dispatch(setUserUSerName(snapshot.val().name))
              navigate({ pathname: '/Dashboard/signedIn/' + String(snapshot.val().name), })
              setUserName('')
              setPassword('')
            }
          }
        }).catch(err => {
          alert('Please etner valid admin email and password')
        })
      }).catch(err => {
        alert('please enter valid email and pass')
      })
      {/* firebase.database().ref('Administrators/' + userName).on('value', (snapshot) => {
        var pass = snapshot.val();
        console.log(pass)
        if (pass != null) {
          if (pass.password == password) {
            console.log("SUbmited " + userName + "  " + password + " end")
            navigate({ pathname: '/Dashboard/signedIn/' + userName })
            setUserName('')
            setPassword('')
          } else {
            alert('Invalid Credentials')
          }
        } else {
          alert('Invalid')

        }
      });*/}
    } catch (err) {
      console.log(err)
      alert('Connection Error')
    }
  }
  return (
    <div className="App">
      <form className="loginBg" onSubmit={SubmitForm}>
        <div className='inputHeader'>
          <p>LOGIN</p>
        </div>
        <div className='inputCover'>
          <p>Email</p>
          <input
            type="text"
            value={userName}
            placeholder='email@email.com'
            onChange={(name) => { setUserName(name.target.value) }}
          />
        </div>
        <div className='inputCover'>
          <p>Password</p>
          <input
            type="password"
            placeholder='**********'
            value={password}
            onChange={(name) => { setPassword(name.target.value) }}

          />
        </div>
        <div className='inputCover'>
          <input
            type="submit"
          />
        </div>
      </form>
    </div>
  );
}

export default Login;
