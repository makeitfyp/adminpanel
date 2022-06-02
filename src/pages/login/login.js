import { useState } from 'react';
import './login.css';
import { useHistory } from 'react-router-dom';
//redux
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentAdmin } from '../../redux/actions';
import makitlogo from '../../assets/images/logo.png'

import { auth, db } from '../../backend/backend';
export default function Login({ toSet }) {
    const [user, setUser] = useState({ email: '', password: '' });
    const history = useHistory();
    const dispatch = useDispatch();

    const submit = async (e) => {
        e.preventDefault();
        await auth.signInWithEmailAndPassword(user.email, user.password).then(res => {
            db.ref('Admin/' + res.user.uid).once('value', async (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    let admin = { auth: true, email: user.email, password: user.password }
                    dispatch(setCurrentAdmin(admin))
                    alert('Log in succesfull')
                    history.push('/');
                } else {
                    auth.signOut();
                    let admin = { auth: false, email: null, password: null }
                    dispatch(setCurrentAdmin(admin))
                    alert('Please enter valid credentials')
                }
            })
        }).catch(Err => {
            alert(Err.code);
            console.log(Err)
        })
    }

    return (
        <div className='Login'>
            <div className='Form'>
                    <form onSubmit={submit}>
                    <img src={makitlogo} alt="MAKE IT" id="image" width="24%" height="14%" />

                    <h1>Admin Login</h1>
                    <input type='email' required className='input' placeholder='Email' onChange={(e) => { setUser({ ...user, email: e.target.value }) }} />
                    <input type='password' required className='input' placeholder='Password' onChange={(e) => { setUser({ ...user, password: e.target.value }) }} />
                    <input type='button' value='Login' id='button' onClick={submit} />
                </form>
            </div>
        </div>
    )
}