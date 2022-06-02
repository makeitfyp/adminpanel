import './users.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { auth, db } from '../../backend/backend';
import { useHistory } from 'react-router-dom';
import { setCurrentAdmin } from '../../redux/actions'
//sidebar
import Sidebar from '../../components/Sidebar/sidebar';

export default function Users({ toSet, selected }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { admin } = useSelector(state => state.Reducer);

    useEffect(() => {
        let user = auth.currentUser;
        if (user !== null) {
            toSet('users')
        } else {
            if (admin.email != null) {
                auth.signInWithEmailAndPassword(admin.email, admin.password).then(res => {
                    toSet('users')
                })
            } else {
                dispatch(setCurrentAdmin({ email: null, password: null, auth: false }))
                history.push('/login');
            }
        }
    }, [])
    useEffect(() => {
        db.ref('Users/').on('value', (snapshot) => {
            if (snapshot.val() !== undefined && snapshot.val() !== null) {
                setAllusers(Object.values(snapshot.val()));
                setAllUsersId(Object.keys(snapshot.val()))
            }
        })
    }, []);

    const [allusers, setAllusers] = useState([]);
    const [alluserIds, setAllUsersId] = useState([]);
    const [addingNewUser, setADdingNewUser] = useState(false);
    const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });

    //add new user
    const adduser = (e) => {
        e.preventDefault();
        if (newUser.username !== '' && newUser !== '' && newUser.password !== '') {
            auth.createUserWithEmailAndPassword(newUser.email, newUser.password).then(res => {
                db.ref('Users/' + res.user.uid).update({
                    email: newUser.email, username: newUser.username
                }).then(res => {
                    auth.signOut()
                    auth.signInWithEmailAndPassword(admin.email, admin.password).then(res => {
                        alert('user added successfully');
                        setADdingNewUser(false);
                        setNewUser({ username: '', email: '', password: '' })
                    })
                }).catch(err => {
                    alert(err.code)
                })
            })
        } else {
            alert('Please fill all details')
        }
    }
    const deleteUser = (id) => {
        db.ref('Users/' + id).update({
            disabled: true
        }).then(res => {
            alert('User disabled succesfully')
        })
    }
    const EnableUser = (id) => {
        db.ref('Users/' + id).update({
            disabled: false
        }).then(res => {
            alert('User added back succesfully')
        })
    }
    return (
        <div className='user'>
            <Sidebar value={selected} />
            {
                addingNewUser ?
                    <div className='MainBody'>
                        <form className='Form'>
                            <h1>New User Details</h1>
                            <input className='input' required placeholder='Name' onChange={e => { setNewUser({ ...newUser, username: e.target.value }) }} />
                            <input className='input' required placeholder='Email' onChange={e => { setNewUser({ ...newUser, email: e.target.value }) }} />
                            <input className='input' required placeholder='Password' onChange={e => { setNewUser({ ...newUser, password: e.target.value }) }} />
                            <div className='buttonsDiv'>
                                <input id='button' type='button' value='Add' onClick={adduser} />
                                <input id='button' type='button' value='Cancel' onClick={() => {
                                    setNewUser({ username: '', email: '', password: '' })
                                    setADdingNewUser(false)
                                }} />
                            </div>
                        </form>
                    </div>
                    :
                    <div className='MainBody'>
                   <h1 className='toptitle'>ACTIVE USERS</h1>

                        <div className='topButotns'>
                            <button id='button' onClick={() => { setADdingNewUser(true) }} >Add New User</button>
                        </div>
                        <div className='userslist'>
                            {
                                allusers.map((user, index) => {
                                    if (user.disabled !== true) {
                                        return (
                                            <div className='userdiv' id={index}>
                                                <label>{user.username}</label>
                                                <label>{user.email}</label>
                                                <button id='button' onClick={() => { deleteUser(alluserIds[index]) }}>DISABLE</button>
                                            </div>
                                        )
                                    } else {
                                        return null
                                    }
                                })
                            }
                        </div>
                        <div className='userslist'>
                            <h1>DISABLED USERS</h1>
                            {
                                allusers.map((user, index) => {
                                    if (user.disabled === true) {
                                        return (
                                            <div className='userdiv' id={index}>
                                                <label>{user.username}</label>
                                                <label>{user.email}</label>
                                                <button id='button' onClick={() => { EnableUser(alluserIds[index]) }}>ENABLE</button>
                                            </div>
                                        )
                                    } else {
                                        return null
                                    }
                                })
                            }
                        </div>
                    </div>
            }
        </div>
    )
}