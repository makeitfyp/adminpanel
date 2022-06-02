import './recipies.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { auth, db } from '../../backend/backend';
import { useHistory } from 'react-router-dom';
import { setCurrentAdmin } from '../../redux/actions'
//sidebar
import Sidebar from '../../components/Sidebar/sidebar';

export default function Recipies({ toSet, selected }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { admin } = useSelector(state => state.Reducer);

    useEffect(() => {
        let user = auth.currentUser;
        if (user !== null) {
            toSet('recipies')
        } else {
            if (admin.email != null) {
                auth.signInWithEmailAndPassword(admin.email, admin.password).then(res => {
                    toSet('recipies')
                })
            } else {
                dispatch(setCurrentAdmin({ email: null, password: null, auth: false }))
                history.push('/login');
            }
        }
    }, []);
    useEffect(() => {
        db.ref('Recipies/').on('value', (snapshot) => {
            if (snapshot.val() != undefined && snapshot.val() != null) {
                setRecipies(snapshot.val());
            }
        })
    }, []);
    //get pending recipies
    useEffect(() => {
        db.ref('submittedRecipies').on('value', (snapshot) => {
            setPendingRecipeis([])
            if (snapshot.val() != undefined && snapshot.val() != null) {
                setPendingRecipeis(snapshot.val());
            }
        })
    }, []);
    //approve pending recipies
    const approve = (item, index) => {
        let number = recipies.length;
        db.ref('Recipies/' + number).set(item).then(res => {
            let temp = [];
            pendingRecipies.map((rec, ind) => {
                if (ind !== index) {
                    temp.push(rec)
                }
            })
            db.ref('submittedRecipies').set(temp);
            let date = new Date();
            let time = date.getTime();
            db.ref('ApprovedRec').once('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    let appnumber = snapshot.val() + 1;
                    db.ref('ApprovedRec').set(appnumber)
                } else {
                    db.ref('ApprovedRec').set(1)
                }
            })
            let notification = { title: 'Approval', subject: 'Recipie Approve', body: item, time: time, status: '0' };
            db.ref('Notification/' + item.userid).once('value', (snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    let notNumber = Object.values(snapshot.val()).length;
                    db.ref('Notification/' + item.userid + '/' + notNumber).set(notification)
                } else {
                    db.ref('Notification/' + item.userid + '/' + '0').set(notification)
                }
            })
            alert('Recipie approved')
        })
    }
    //
    const disapprove = (item, index) => {
        let temp = [];
        pendingRecipies.map((rec, ind) => {
            if (ind !== index) {
                temp.push(rec)
            }
        })
        db.ref('submittedRecipies').set(temp);
        let date = new Date();
        let time = date.getTime();
        db.ref('DisapprovedRec').once('value', (snapshot) => {
            if (snapshot.val() !== undefined && snapshot.val() !== null) {
                let appnumber = snapshot.val() + 1;
                db.ref('DisapprovedRec').set(appnumber)
            } else {
                db.ref('DisapprovedRec').set(0)
            }
        })
        let notification = { title: 'Disapproved', subject: 'Recipie disapproved', body: item, time: time, status: '0' };
        db.ref('Notification/' + item.userid).once('value', (snapshot) => {
            if (snapshot.val() !== undefined && snapshot.val() !== null) {
                let notNumber = Object.values(snapshot.val()).length;
                db.ref('Notification/' + item.userid + '/' + notNumber).set(notification)
            } else {
                db.ref('Notification/' + item.userid + '/' + '0').set(notification)
            }
        })
        alert('Recipe Deleted')
    }

    const [addingRecipie, setAddingRecipie] = useState(false);
    const [watchPending, setWatchPending] = useState(false)
    const [recipies, setRecipies] = useState([]);
    const [pendingRecipies, setPendingRecipeis] = useState([]);
    const deleteRecipie = (item, ind) => {
        let temp = [];
        if (recipies.length > 0) {
            recipies.map((item, index) => {
                if (index !== ind) {
                    temp.push(item)
                }
            })
            if (temp.length === recipies.length - 1) {
                db.ref('Recipies/').set(temp)
                db.ref('DeletedRec').once('value', (snapshot) => {
                    if (snapshot.val() != undefined && snapshot.val() != null) {
                        let deleted = parseInt(snapshot.val()) + 1
                        db.ref('DeletedRec').set(deleted)
                    } else {
                        db.ref('DeletedRec').set(1)
                    }
                })

            }
            alert('Recipe deleted succesfully')

        }

    }
    const [newRecipie, setNewRecipie] = useState({
        TranslatedRecipeName: '', Cuisine: '', CleanedIngredients: '', Ingredientcount: '', TotalTimeInMins: '', TranslatedIngredients: '', TranslatedInstructions: '',
        URL: '', imageurl: ''

    });
    const addRec = () => {
        let number = recipies.length;
        db.ref('Recipies/' + number).set(newRecipie)
        alert('Recipe added')
    }
    if (watchPending) {
        return (
            <div className='recipies'>
                <Sidebar value={selected} />
                <div className='MainBody'>
                    <div className='topButtons'>
                        <button className='button' onClick={() => {
                            setAddingRecipie(true)
                            setWatchPending(false)
                        }}>Add recipie</button>
                        <button className='button' onClick={() => {
                            setWatchPending(false)
                            setAddingRecipie(false)
                        }}>View Recipies</button>
                    </div>
                    <div className='recipieList'>
                        {
                            pendingRecipies.map((item, index) => {
                                return (
                                    <div className='recipieCard' key={index}>
                                        <p>Name: {item.TranslatedRecipeName}</p>
                                        <p>Cusines: {item.Cuisine}</p>
                                        <img src={item.imageurl} alt='image not found' id='reciepieImage' />
                                        <p>Ingredient: {item.CleanedIngredients}</p>
                                        <p>Time: {item.TotalTimeInMins}</p>
                                        <a href={item.URL} target="_blank" className='button'>See Complete</a>
                                        <button className='button' onClick={() => { approve(item, index) }}>Approve</button>
                                        <button className='button' onClick={() => { disapprove(item, index) }}>Delete</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className='recipies'>

                <Sidebar value={selected} />
                {
                    addingRecipie ?
                        <div className='MainBody'>
                            <div className='topButtons'>
                                <button className='button' onClick={() => {
                                    setAddingRecipie(false)
                                    setNewRecipie({
                                        TranslatedRecipeName: '', Cuisine: '', CleanedIngredients: '', Ingredientcount: '', TotalTimeInMins: '', TranslatedIngredients: '', TranslatedInstructions: '',
                                        URL: '', imageurl: ''

                                    })
                                }}>View All</button>
                                <button className='button' onClick={() => {
                                    setAddingRecipie(false)
                                    setWatchPending(true)
                                }}>View Pending</button>
                            </div>
                            <form className='Form'>
                                <h2>Recipe</h2>
                                <input className='recInput' placeholder='Name' onChange={(e) => { setNewRecipie({ ...newRecipie, TranslatedRecipeName: e.target.value }) }} required />
                                <input className='recInput' placeholder='Cusines' onChange={(e) => { setNewRecipie({ ...newRecipie, Cuisine: e.target.value }) }} required />
                                <input className='recInput' placeholder='Ingredient e-g inr1,ingr2' onChange={(e) => { setNewRecipie({ ...newRecipie, CleanedIngredients: e.target.value }) }} required />
                                <input className='recInput' placeholder='ing. count' onChange={(e) => { setNewRecipie({ ...newRecipie, Ingredientcount: e.target.value }) }} required />
                                <input className='recInput' placeholder='Total Time(mins)' onChange={(e) => { setNewRecipie({ ...newRecipie, TotalTimeInMins: e.target.value }) }} required />
                                <input className='recInput' placeholder='Detailed Ing. e-g 1/2ing 1 cup ing2' onChange={(e) => { setNewRecipie({ ...newRecipie, TranslatedIngredients: e.target.value }) }} required />
                                <input className='recInput' placeholder='Instruction' onChange={(e) => { setNewRecipie({ ...newRecipie, TranslatedInstructions: e.target.value }) }} required />
                                <input className='recInput' type='url' placeholder='Recipei Url' onChange={(e) => { setNewRecipie({ ...newRecipie, URL: e.target.value }) }} required />
                                <input className='recInput' type='url' placeholder='Image Url' onChange={(e) => { setNewRecipie({ ...newRecipie, imageurl: e.target.value }) }} required />
                                <button className='button' onClick={addRec}>Add</button>
                            </form>
                        </div> :
                        <div className='MainBody'>
                            <h1 style={{ textAlign: "center" }}>ALL RECIPES</h1>

                            <div className='topButtons'>
                                <button className='button' onClick={() => { setAddingRecipie(true) }}>Add recipe</button>
                                <button className='button' onClick={() => {
                                    setAddingRecipie(false)
                                    setWatchPending(true)
                                }}>View Pending</button>
                            </div>
                            <div className='recipieList'>
                                {
                                    recipies.map((item, index) => {
                                        return (
                                            <div className='recipieCard' key={index}>
                                                <p>Name: {item.TranslatedRecipeName}</p>
                                                <p>Cusines: {item.Cuisine}</p>
                                                <img src={item.imageurl} alt='image not found' id='reciepieImage' />
                                                <p style={{ overflow: 'hidden' }}>Ingredient: {item.CleanedIngredients}</p>
                                                <p>Time: {item.TotalTimeInMins}</p>
                                                <a href={item.URL} target="_blank" className='button'>See Complete</a>
                                                <button className='button' onClick={() => { deleteRecipie(item, index) }}>Delete</button>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                }
            </div>
        )
    }
}