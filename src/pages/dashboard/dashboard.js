import './dashboard.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { auth, db } from '../../backend/backend';
import { useHistory } from 'react-router-dom';
import { setCurrentAdmin } from '../../redux/actions'
//sidebar
import Sidebar from '../../components/Sidebar/sidebar';


export default function Dashboard({ toSet, selected }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { admin } = useSelector(state => state.Reducer);

    useEffect(() => {
        let user = auth.currentUser;
        if (user !== null) {
            toSet('dashboard');
            //get users details
            db.ref('Users/').on('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    let total = Object.keys(snapshot.val()).length
                    let disabled = 0;
                    let loop = Object.values(snapshot.val()).map(item => {
                        if (item.disabled !== undefined && item.disabled === true) {
                            disabled = disabled + 1;
                        }
                    })
                    let enabled = total - disabled;
                    setUserData({ ...userData, total: total, disabled: disabled, active: enabled })
                }
            })
            db.ref('Posts').on('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    let p = Object.keys(snapshot.val()).length;
                    setPosts(p)
                }
            })
            db.ref('Deitplan').on('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    setDietPlan(Object.keys(snapshot.val()).length)
                }
            })
            db.ref('submittedRecNumber').on('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    setAllSubmitted(snapshot.val())
                }
            })
            db.ref('ApprovedRec').on('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    setApprovedRec(snapshot.val())
                }
            })
            db.ref('DeletedRec').on('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    setDeletedRec(snapshot.val())
                }
            })
            db.ref('Recipies/').on('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    setAllRecipies(Object.keys(snapshot.val()).length)
                }
            })
            db.ref('submittedRecipies').on('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    setPendingRec(Object.keys(snapshot.val()).length)
                }
            })

        } else {
            if (admin.email != null) {
                auth.signInWithEmailAndPassword(admin.email, admin.password).then(res => {
                    toSet('dashboard');

                    db.ref('Users/').once('value', (snapshot) => {
                        if (snapshot.val() !== undefined && snapshot.val() !== null) {
                            let total = Object.keys(snapshot.val()).length
                            let disabled = 0;
                            let loop = Object.values(snapshot.val()).map(item => {
                                if (item.disabled !== undefined && item.disabled === true) {
                                    disabled = disabled + 1;
                                }
                            })
                            let enabled = total - disabled;
                            setUserData({ ...userData, total: total, disabled: disabled, active: enabled })
                        }
                    })
                    db.ref('Posts').once('value', (snapshot) => {
                        if (snapshot.val() !== undefined && snapshot.val() !== null) {
                            let posts = Object.keys(snapshot.val()).length;
                            setPosts(posts)
                        }
                    })
                    db.ref('Deitplan').once('value', (snapshot) => {
                        if (snapshot.val() !== undefined && snapshot.val() !== null) {
                            setDietPlan(Object.keys(snapshot.val()).length)
                        }
                    })
                    db.ref('submittedRecNumber').once('value', (snapshot) => {
                        if (snapshot.val() !== undefined && snapshot.val() !== null) {
                            setAllSubmitted(snapshot.val())
                        }
                    })
                    db.ref('ApprovedRec').once('value', (snapshot) => {
                        if (snapshot.val() !== undefined && snapshot.val() !== null) {
                            setApprovedRec(snapshot.val())
                        }
                    })
                    db.ref('DeletedRec').once('value', (snapshot) => {
                        if (snapshot.val() !== undefined && snapshot.val() !== null) {
                            setDeletedRec(snapshot.val())
                        }
                    })
                    db.ref('Recipies/').once('value', (snapshot) => {
                        if (snapshot.val() !== undefined && snapshot.val() !== null) {
                            setAllRecipies(Object.keys(snapshot.val()).length)
                        }
                    })
                    db.ref('submittedRecipies').once('value', (snapshot) => {
                        if (snapshot.val() !== undefined && snapshot.val() !== null) {
                            setPendingRec(Object.keys(snapshot.val()).length)
                        }
                    })

                })
            } else {
                dispatch(setCurrentAdmin({ email: null, password: null, auth: false }))
                history.push('/login');
            }
        }
    }, [selected]);
    const [userData, setUserData] = useState({ total: 0, active: 0, disabled: 0 });
    const [posts, setPosts] = useState(0);
    const [dietplan, setDietPlan] = useState(0)
    const [allSuubmitted, setAllSubmitted] = useState(0)
    const [ApprovedRec, setApprovedRec] = useState(0);
    const [deletedRec, setDeletedRec] = useState(0);
    const [allRecipies, setAllRecipies] = useState(0);
    const [pendingRec, setPendingRec] = useState(0);


    return (

        <div className='Dashboard'>

            <Sidebar value={selected} />
            <div className='Details'>
                <h1 style={{ textAlign: "center" }}>STATISTICS</h1>

                <h1>Users</h1>
                <div className='DetailsGroup'>

                    <div className='userGroup'>
                        <h4>Total</h4>
                        <p> {userData.total}</p>
                    </div>
                    <div className='userGroup'>
                        <h4>Active</h4>
                        <p>{userData.active}</p>
                    </div>
                    <div className='userGroup'>
                        <h4>Disbaled</h4>
                        <p> {userData.disabled}</p>
                    </div>
                    <div className='userGroup'>
                        <h4>Posts</h4>
                        <p> {posts}</p>
                    </div>
                    <div className='userGroup'>
                        <h4>DietPlans</h4>
                        <p>{dietplan}</p>
                    </div>
                </div>
                <h1>Recipes</h1>
                <div className='DetailsGroup'>

                    <div className='usergroup'>
                        <h4>Total</h4>
                        <p>{allRecipies}</p>
                    </div>
                    <div className='pending'>
                        <h4>Pending</h4>
                        <p>{pendingRec}</p>
                    </div>
                    <div className='userGroup'>
                        <h4>Approved</h4>
                        <p>{ApprovedRec}</p>
                    </div>
                    <div className='userGroup'>
                        <h4>Deleted</h4>
                        <p>{deletedRec}</p>
                    </div>
                    <div className='userGroup'>
                        <h4>Submitted</h4>
                        <p>{allSuubmitted}</p>
                    </div>

                </div>

            </div>

        </div>
    )
}