import './ar.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { auth, db } from '../../backend/backend';
import { useHistory } from 'react-router-dom';
import { setCurrentAdmin } from '../../redux/actions'
//sidebar
import Sidebar from '../../components/Sidebar/sidebar';

export default function Ar({ toSet, selected }) {
    const history = useHistory();
    const dispatch = useDispatch();
    const { admin } = useSelector(state => state.Reducer);

    useEffect(() => {
        let user = auth.currentUser;
        if (user !== null) {
            toSet('ar')
        } else {
            if (admin.email != null) {
                auth.signInWithEmailAndPassword(admin.email, admin.password).then(res => {
                    toSet('ar')
                })
            } else {
                dispatch(setCurrentAdmin({ email: null, password: null, auth: false }))
                history.push('/login');
            }
        }
    }, []);
    useEffect(() => {
        db.ref('model/').on('value', (snapshot) => {
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
                db.ref('model/').set(temp)
                db.ref('DeletedModel').once('value', (snapshot) => {
                    if (snapshot.val() != undefined && snapshot.val() != null) {
                        let deleted = parseInt(snapshot.val()) + 1
                        db.ref('DeletedModel').set(deleted)
                    } else {
                        db.ref('DeletedModel').set(1)
                    }
                })

            }
            alert('Model deleted succesfully')

        }

    }
    const [newRecipie, setNewRecipie] = useState({
        name: '', ingredients: '', details: '', image: '', modelurl: ''

    });
    const addRec = () => {
        let number = recipies.length;
        db.ref('model/' + number).set(newRecipie)
    }

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
                                    name: '', ingredients: '', details: '', modelurl: '', image: ''

                                })
                            }}>View All</button>
                        </div>
                        <form className='Form'>
                            <h2>ADD AR MODELS</h2>
                            <input className='recInput' placeholder='Name' onChange={(e) => { setNewRecipie({ ...newRecipie, name: e.target.value }) }} required />
                            <input className='recInput' placeholder='Ingredient e-g inr1,ingr2' onChange={(e) => { setNewRecipie({ ...newRecipie, ingredients: e.target.value }) }} required />
                            <input className='recInput' placeholder='Instruction' onChange={(e) => { setNewRecipie({ ...newRecipie, details: e.target.value }) }} required />
                            <input className='recInput' type='url' placeholder='Image Url' onChange={(e) => { setNewRecipie({ ...newRecipie, image: e.target.value }) }} required />
                            <input className='recInput' type='url' placeholder='Model Url' onChange={(e) => { setNewRecipie({ ...newRecipie, modelurl: e.target.value }) }} required />

                            <button className='button' onClick={addRec}>Add Model</button>
                        </form>
                    </div> :
                    <div className='MainBody'>
                        <h1 style={{ textAlign: "center" }}>AR MODELS</h1>

                        <div className='topButtons'>
                            <button className='button' onClick={() => { setAddingRecipie(true) }}>Add AR Models</button>

                        </div>
                        <div className='recipieList'>
                            {
                                recipies.map((item, index) => {
                                    return (
                                        <div className='recipieCard' key={index}>
                                            <p><span>Name:</span> {item.name}</p>
                                            <img src={item.image} alt='image not found' id='reciepieImage' />
                                            <p style={{ overflow: 'hidden' }}> <span>Ingredient:</span>{item.ingredients}</p>
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