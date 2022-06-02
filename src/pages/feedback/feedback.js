import './feedback.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { auth, db } from '../../backend/backend';
import { useHistory } from 'react-router-dom';
import { setCurrentAdmin } from '../../redux/actions'
//sidebar
import Sidebar from '../../components/Sidebar/sidebar';

export default function Feedback({ toSet, selected }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { admin } = useSelector(state => state.Reducer);

    useEffect(() => {
        let user = auth.currentUser;
        if (user !== null) {
            toSet('feedback');
            db.ref('Feedback').on('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    setFeedback(snapshot.val())
                }

            })
            db.ref('Users/').on('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    setUsers(snapshot.val())
                }
            })
        } else {
            if (admin.email !== null) {
                auth.signInWithEmailAndPassword(admin.email, admin.password).then(res => {
                    toSet('feedback');
                    db.ref('Feedback').once('value', (snapshot) => {
                        if (snapshot.val() !== undefined && snapshot.val() !== null) {
                            setFeedback(snapshot.val())
                        }
                    })
                    db.ref('Users/').once('value', (snapshot) => {
                        if (snapshot.val() !== undefined && snapshot.val() !== null) {
                            setUsers(snapshot.val())
                        }
                    })
                })
            } else {
                dispatch(setCurrentAdmin({ email: null, password: null, auth: false }))
                history.push('/login');
            }
        }
    }, [])
    const [feedback, setFeedback] = useState([]);
    const [indFeedback, setIndFeedback] = useState();
    const [users, setUsers] = useState([]);
    const [response, setResponse] = useState()
    const [recipies, setRecipies] = useState([]);

    useEffect(() => {
        db.ref('Feedback/').on('value', (snapshot) => {
            if (snapshot.val() != undefined && snapshot.val() != null) {
                setRecipies(snapshot.val());
            }
        })
    }, []);

    const deletefeedback = (item, ind) => {
        let temp = [];
        if (recipies.length > 0) {
            recipies.map((item, index) => {
                if (index !== ind) {
                    temp.push(item)
                }
            })
            if (temp.length === recipies.length - 1) {
                db.ref('Feedback/').set(temp)
                db.ref('Deletedfed').once('value', (snapshot) => {
                    if (snapshot.val() != undefined && snapshot.val() != null) {
                        let deleted = parseInt(snapshot.val()) + 1
                        db.ref('Deletedfed').set(deleted)
                    } else {
                        db.ref('Deletedfed').set(1)
                    }
                })

            }
            alert('Feedback deleted succesfully')

        }

    }

    return (
        <div className='feedback'>
            <Sidebar value={selected} />
            <div className='Mainbody'>
                <h1 style={{ textAlign: "center" }}>USER FEEDBACK</h1>

                {
                    indFeedback === undefined ?
                        <div className='FeedbackList'>
                            {
                                feedback.map((item, index) => {

                                    return (
                                        <div>
                                            <div className={item.seen === undefined ? 'pendingFeedback' : 'seenFeedback'} key={index} onClick={() => { setIndFeedback(item) }} >


                                                <table>
                                                    <tr>
                                                        <th>Username</th>
                                                        <th>Title</th>
                                                        <th>Subject</th>
                                                        <th>Message</th>
                                                    </tr>
                                                    <tr>
                                                        <td>{(users !== undefined && users[item.id].username !== undefined) ? users[item.id].username : 'users'}</td>
                                                        <td>{item.feedbackTitle}</td>
                                                        <td>{item.feedbackSubject}</td>
                                                        <td>{item.feedback}</td>
                                                        <button className='button' onClick={() => { deletefeedback(item, index) }}>Delete</button>

                                                    </tr>
                                                </table>
                                            </div>

                                        </div>

                                    )
                                })
                            }
                        </div> :
                        <div className='oneFeedback'>
                            <p><span>User:</span> {users[indFeedback.id].username}</p>
                            <p><span>Title:</span>  {indFeedback.feedbackTitle}</p>
                            <p><span>Subject:</span>  {indFeedback.feedbackSubject}</p>
                            <p><span>feedback:</span>  {indFeedback.feedback}</p>
                            {
                                indFeedback.seen === undefined ?
                                    <div className='smallDiv'>
                                        <input className='input' placeholder='write response here' onChange={(e) => { setResponse(e.target.value) }} />
                                        <button className='button' onClick={() => {
                                            let r = response !== undefined ? response : 'Feedback seen'
                                            db.ref('Feedback/' + indFeedback.feedbackNo + '/').update({
                                                seen: r
                                            })
                                            alert('response added')
                                            setIndFeedback()
                                            setResponse()
                                        }}>Add Response</button>
                                    </div>
                                    :
                                    <p>Reply: {indFeedback.seen}</p>
                            }
                            <button className='button' onClick={() => {
                                setIndFeedback()
                                setResponse()
                            }}>Close</button>

                        </div>
                }
            </div>
        </div>
    )
}