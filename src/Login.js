import './App.css';
import React, {useState,useEffect} from 'react';
import { useNavigate,useParams } from "react-router-dom";
import firebase from 'firebase';
var config = {
  apiKey: "AIzaSyCrtUrEBF8X0pQQU7_-GS9F5IaxX8mGtXU",
  authDomain: "make-it-cde4f.firebaseapp.com",
  databaseURL: "https://make-it-cde4f-default-rtdb.firebaseio.com",
  projectId: "make-it-cde4f",
  storageBucket: "make-it-cde4f.appspot.com",
  messagingSenderId: "835509810208",
  appId: "1:835509810208:web:cc696476ad076d008ef845"
  };


function Login() {
 const [userName,setUserName] = useState('')
 const [password,setPassword] = useState('')
 const navigate = useNavigate();
  useEffect(()=>{
      if (!firebase.apps.length) {
      firebase.initializeApp(config);
      console.log("initalized")
      }else {
        firebase.app(); // if already initialized, use that one
      }
  },[])   
  var SubmitForm = (event)=>{
    event.preventDefault();
    try{
    firebase.database().ref('Administrators/'+userName).on('value', (snapshot) => {
    var pass= snapshot.val();
    console.log(pass)
    if(pass!=null){
    if(pass.password == password){
      console.log("SUbmited "+userName+"  "+password+" end")  
      navigate({pathname:'/Dashboard/signedIn/'+userName  })
      setUserName('')
      setPassword('')
    }else{
    alert('Invalid Credentials')
    }
  }else{
    alert('Invalid')
    
  }
  });
  }catch(err){
    console.log(err)
    alert('Connection Error')
  }
}
  return (
    <div className="App">
      <form className="loginBg" onSubmit={SubmitForm}>
        
        <div className='inputHeader'>
          <p>LOGIN FORM</p>
        </div>
        <div className='inputCover'>
        <p>USER NAME</p>
        <input
          type="text"
          value={userName}
          onChange={(name)=>{setUserName(name.target.value)}}
        />
        </div>
        <div className='inputCover'>
        <p>PASSWORD</p>
        <input
          type="password"
          value={password}
          onChange={(name)=>{setPassword(name.target.value)}}

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
