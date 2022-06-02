import './profile.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { auth, db } from '../../backend/backend';
import { useHistory } from 'react-router-dom';
import { setCurrentAdmin } from '../../redux/actions'
//sidebar
import Sidebar from '../../components/Sidebar/sidebar';

export default function Profile({ toSet, selected }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { admin } = useSelector(state => state.Reducer);
    useEffect(() => {
        let user = auth.currentUser;
        if (user !== null) {
            toSet('profile')
        } else {
            if (admin.email != null) {
                auth.signInWithEmailAndPassword(admin.email, admin.password).then(res => {
                    toSet('profile')
                })
            } else {
                dispatch(setCurrentAdmin({ email: null, password: null, auth: false }))
                history.push('/login');
            }
        }
    }, []);

    const [newEmail, setNewEmail] = useState();
    const [newpassword, setNewPassword] = useState();
    const [currentPassword, setCurrentPassword] = useState()
    const [isChangeEmail, setIsChangeEmail] = useState(false);

    const ChangePassword = (e) => {
        if (newpassword != undefined && newpassword.length >= 6) {
            if (currentPassword != '' && currentPassword == admin.password) {
                auth.signInWithEmailAndPassword(admin.email, admin.password).then(user => {
                    auth.currentUser.updatePassword(newpassword).then(res => {
                        dispatch(setCurrentAdmin({ email: admin.email, password: newpassword, auth: true }))
                        db.ref('Admin/' + user.user.uid + '/').update({
                            password: newpassword
                        })
                        alert('Password update succesfully')
                        history.push('/')
                    }).catch(err => {
                        alert(err.code)
                    })
                }).catch(err => {
                    alert(err.code)
                })
            } else {
                alert('Please enter correct current password')
            }
        } else {
            alert('Please enter valid new password')
        }
    }

    const ChangeEmail = (e) => {
        if (newEmail != undefined && newEmail != '') {
            if (currentPassword != '' && currentPassword == admin.password) {
                auth.signInWithEmailAndPassword(admin.email, admin.password).then(user => {
                    auth.currentUser.updateEmail(newEmail).then(res => {
                        dispatch(setCurrentAdmin({ email: newEmail, password: admin.password, auth: true }));
                        db.ref('Admin/' + user.user.uid + '/').update({
                            email: newEmail
                        })
                        alert('Email update succesfully')
                        history.push('/')
                    }).catch(err => {
                        alert(err.code)
                    })
                }).catch(err => {
                    alert(err.code)
                })
            } else {
                alert('Please enter correct current password')
            }
        } else {
            alert('Please enter valid email')
        }
    }

    return (
        <div className='Profile'>
            <Sidebar value={selected} />
            <div className='Content'>
                {
                    isChangeEmail ?
                        <div className='Email'>
                            <h1>Change Email</h1>
                            <input className='input' type='email' placeholder='New Email' onChange={(e) => { setNewEmail(e.target.value) }} />
                            <input className='input' placeholder='Current Password' onChange={(e) => { setCurrentPassword(e.target.value) }} />
                            <input type='button' className='button' value='Change Email' onClick={ChangeEmail} />
                            <input type='button' className='button' value='Edit Password' onClick={() => { setIsChangeEmail(false) }} />

                        </div> :
                        <div className='Password'>
                            <h1>Change Password</h1>
                            <input className='input' placeholder='New Password' onChange={(e) => { setNewPassword(e.target.value) }} />
                            <input className='input' placeholder='Current Password' onChange={(e) => { setCurrentPassword(e.target.value) }} />
                            <input type='button' className='button' value='Change Password' onClick={ChangePassword} />
                            <input type='button' className='button' value='Edit Email' onClick={() => { setIsChangeEmail(true) }} />
                        </div>
                }
            </div>
        </div>
    )
}