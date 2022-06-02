import './sidebar.css';
import { setCurrentAdmin } from '../../redux/actions';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';;


export default function Sidebar({ value }) {
    const history = useHistory();
    const dispatch = useDispatch()
    const signout = () => {
        dispatch(setCurrentAdmin({ email: null, password: null, auth: null }))
        history.push('./login');
    }

    return (
        <div className='sidebar'>
            <button className={value === 'dashboard' ? 'selected' : 'button'} onClick={() => { history.push('/') }}>Admin Dashboard</button>
            <button className={value === 'users' ? 'selected' : 'button'} onClick={() => { history.push('/users') }}>Manage Users</button>
            <button className={value === 'recipies' ? 'selected' : 'button'} onClick={() => { history.push('./recipies') }}>Manage Recipes</button>
            <button className={value === 'ar' ? 'selected' : 'button'} onClick={() => { history.push('./ar') }}>Manage AR Models</button>
            <button className={value === 'feedback' ? 'selected' : 'button'} onClick={() => { history.push('/feedback') }}>Manage Feedback</button>
            <button className={value === 'posts' ? 'selected' : 'button'} onClick={() => { history.push('/posts') }}>Manage Posts</button>
            <button className={value === 'addAdmin' ? 'selected' : 'button'} onClick={() => { history.push('/addadmin') }}>Manage Admin</button>
            <button className={value === 'profile' ? 'selected' : 'button'} onClick={() => { history.push('/profile') }}>Manage Profile</button>
            <button className={value === 'logout' ? 'selected' : 'button'} onClick={signout}>Logout</button>
        </div>
    )
}