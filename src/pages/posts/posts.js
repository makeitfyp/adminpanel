import './post.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { auth, db } from '../../backend/backend';
import { useHistory } from 'react-router-dom';
import { setCurrentAdmin } from '../../redux/actions'
//sidebar
import Sidebar from '../../components/Sidebar/sidebar';

export default function Posts({ toSet, selected }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { admin } = useSelector(state => state.Reducer);

    useEffect(() => {
        let user = auth.currentUser;
        if (user !== null) {
            toSet('posts')
        } else {
            if (admin.email != null) {
                auth.signInWithEmailAndPassword(admin.email, admin.password).then(res => {
                    toSet('posts')
                })
            } else {
                dispatch(setCurrentAdmin({ email: null, password: null, auth: false }))
                history.push('/login');
            }
        }
    }, [])
    const [allPosts, setAllPosts] = useState([])
    useEffect(() => {
        db.ref('Posts').on('value', (snapshot) => {
            setAllPosts(Object.values(snapshot.val()))
        })
    }, []);
    const enable = (item) => {
        db.ref('Posts/' + item.postid).update({
            status: 'enabled'
        }).then(res => {
            alert('Post added to user feed')
        }).catch(err => {
            alert('Error Please try again')
        })
    }
    const disable = (item) => {
        db.ref('Posts/' + item.postid).update({
            status: 'disabled'
        }).then(res => {
            alert('Post removed from user feed')
        }).catch(err => {
            alert('Error Please try again')
        })
    }

    useEffect(() => {
        db.ref('Posts/').on('value', (snapshot) => {
            if (snapshot.val() != undefined && snapshot.val() != null) {
                setRecipies(snapshot.val());
            }
        })
    }, []);
   

    const [addingRecipie, setAddingRecipie] = useState(false);
    const [recipies, setRecipies] = useState([]);

  const deleteRecipie = (item, ind) => {
        let temp = [];
        if (recipies.length > 0) {
            recipies.map((item, index) => {
                if (index !== ind) {
                    temp.push(item)
                }
            })
            if (temp.length === recipies.length - 1) {
                db.ref('Posts/').set(temp)
                db.ref('DeletedPosts').once('value', (snapshot) => {
                    if (snapshot.val() != undefined && snapshot.val() != null) {
                        let deleted = parseInt(snapshot.val()) + 1
                        db.ref('DeletedPosts').set(deleted)
                    } else {
                        db.ref('DeletedPosts').set(1)
                    }
                })

            }
            alert('Posts deleted succesfully')

        }

    }

    return (
        <div className='Posts'>
            <Sidebar value={selected} />

            <div className='Mainbody'>

                    <div className='ActivePosts'>
                        <h1>Active Posts</h1>
                        {
                            allPosts.map((item, index) => {
                                if (item.status === undefined || (item.status !== undefined && item.status !== 'disabled')) {
                                    return (
                                        <div className='PostCard' key={item.postid}>
                                            <div className='userandtime'>
                                                <p>{String(new Date(parseInt(item.time))).substring(4, 25)}</p>
                                                <p className='posttext'>{item.text}</p>

                                            </div>
                                            {
                                                item.type == 'text' ?
                                                    null :
                                                    <div className='image'>
                                                        {
                                                            item.type === 'image' ?
                                                                <img id='image' src={item.media} alt='post url not valid' /> :
                                                                <video id='image' src={item.media} controls>
                                                                    Your browser does not support the video tag.
                                                                </video>

                                                        }
                                                    </div>
                                            }
                                            <p>Likes {item.likes !== undefined ? parseInt(item.likes) : 0}</p>

                                            <button className='button' onClick={() => { disable(item) }}>Disable</button>
                                            <button className='button' onClick={() => { deleteRecipie(item, index) }}>Delete</button>

                                        </div>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
                    <div className='DisabledPosts'>
                        <h1>Disabled Posts</h1>
                        {
                            allPosts.map((item, index) => {
                                if (item.status !== undefined && item.status === 'disabled') {
                                    return (
                                        <div className='PostCard' key={item.postid}>
                                            <div className='userandtime'>
                                                <p>{String(new Date(parseInt(item.time))).substring(4, 25)}</p>
                                                <p className='posttext'>{item.text}</p>
                                            </div>
                                            {
                                                item.type == 'text' ?
                                                    null :
                                                    <div className='image'>
                                                        {
                                                            item.type === 'image' ?
                                                                <img id='image' src={item.media} alt='post url not valid' /> :
                                                                <video id='image' src={item.media} controls>
                                                                    Your browser does not support the video tag.
                                                                </video>

                                                        }
                                                    </div>
                                            }
                                            <p>Likes {item.likes !== undefined ? parseInt(item.likes) : 0}</p>
                                            <button className='button' onClick={() => { enable(item) }}>Enable</button>
                                            <button className='button' onClick={() => { deleteRecipie(item, index) }}>Delete</button>

                                        </div>
                                    )
                                } else {
                                    return null
                                }
                            })
                        }
                    </div>
            </div>
        </div>
    )
}