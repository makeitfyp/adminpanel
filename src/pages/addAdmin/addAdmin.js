import './addAdmin.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { auth, db } from '../../backend/backend';
import { useHistory } from 'react-router-dom';
import { setCurrentAdmin } from '../../redux/actions'
//sidebar
import Sidebar from '../../components/Sidebar/sidebar';

export default function AddAdmin({ toSet, selected }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { admin } = useSelector(state => state.Reducer);

    useEffect(() => {
        let user = auth.currentUser;
        if (user !== null) {
            toSet('addAdmin')
        } else {
            if (admin.email != null) {
                auth.signInWithEmailAndPassword(admin.email, admin.password).then(res => {
                    toSet('addAdmin')
                })
            } else {
                dispatch(setCurrentAdmin({ email: null, password: null, auth: false }))
                history.push('/login');
            }
        }
    }, [])

    const [newAdmin, setNewAdmin] = useState({ email: '', password: '', repeatPassword: '', yourPassword: '' })

    const addAdmin = (e) => {
        e.preventDefault();
        if (newAdmin.yourPassword == admin.password) {
            if (newAdmin.password.length > 0 && newAdmin.password == newAdmin.repeatPassword) {
                auth.createUserWithEmailAndPassword(newAdmin.email, newAdmin.password).then(res => {
                    db.ref('Admin/' + res.user.uid).update({
                        email: newAdmin.email, password: newAdmin.password
                    }).then(res => {
                        auth.signOut();
                        auth.signInWithEmailAndPassword(admin.email, admin.password).then(res => {
                            alert('NEW ADMIN ADDED')
                            history.push('/')
                        })
                    })
                }).catch(err => {
                    alert(err.code)
                })
            } else {
                alert('New Passwords do not match')
            }
        } else {
            alert('Please enter correct current password')
        }
    }

    return (
        <div className='addadmin'>
            <Sidebar value={selected} />
            <div className='Screen'>
                <form className='Form'>
                    <h1>Add Admin</h1>
                    <input className='input' placeholder='New Email' required onChange={(e) => { setNewAdmin({ ...newAdmin, email: e.target.value }) }} />
                    <input className='input' placeholder='New Password' required onChange={(e) => { setNewAdmin({ ...newAdmin, password: e.target.value }) }} />
                    <input className='input' placeholder='Repeat Password' required onChange={(e) => { setNewAdmin({ ...newAdmin, repeatPassword: e.target.value }) }} />
                    <input className='input' placeholder='Your Password' required onChange={(e) => { setNewAdmin({ ...newAdmin, yourPassword: e.target.value }) }} />
                    <input type='button' className='button' value='Add' onClick={addAdmin} />
                </form>
            </div>
        </div>
    )
}