import './App.css';

import { useEffect, useState } from "react";
//pages
//no auth
import Login from './pages/login/login';
//auth
import Dashboard from './pages/dashboard/dashboard';
import Users from './pages/users/users';
import Recipies from './pages/managerecipies/recipies';
import Ar from './pages/AR/ar';
import Feedback from './pages/feedback/feedback';
import AddAdmin from './pages/addAdmin/addAdmin';
import Profile from './pages/profile/profile';
import Posts from './pages/posts/posts';
//redux
import { useSelector, } from 'react-redux';
//router
import { BrowserRouter as Router, Route, Switch, useHistory, Redirect } from 'react-router-dom';
//auth
import { auth } from './backend/backend';

export default function App() {
    const { admin } = useSelector(state => state.Reducer);
    const [selected, setSelected] = useState('');
    return (
        <Router>
            <div className="AuthApp">
                <Switch>
                    <Route exact path='/' >
                        {
                            admin !== undefined && admin.auth ?
                                <Dashboard toSet={setSelected} selected={selected} />
                                :
                                <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/addadmin' >
                        {
                            admin !== undefined && admin.auth ?
                                <AddAdmin toSet={setSelected} selected={selected} />
                                :
                                <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/users' >
                        {
                            admin !== undefined && admin.auth ?
                                <Users toSet={setSelected} selected={selected} />
                                :
                                <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/recipies' >
                        {
                            admin !== undefined && admin.auth ?
                                <Recipies toSet={setSelected} selected={selected} />
                                :
                                <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/ar' >
                        {
                            admin !== undefined && admin.auth ?
                                <Ar toSet={setSelected} selected={selected} />
                                :
                                <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/feedback' >
                        {
                            admin !== undefined && admin.auth ?
                                <Feedback toSet={setSelected} selected={selected} />
                                :
                                <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/profile' >
                        {
                            admin !== undefined && admin.auth ?
                                <Profile toSet={setSelected} selected={selected} />
                                :
                                <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/posts' >
                        {
                            admin !== undefined && admin.auth ?
                                <Posts toSet={setSelected} selected={selected} />
                                :
                                <Redirect to='/login' />
                        }
                    </Route>
                    <Route exact path='/login' >
                        {
                            <div className="Content" >
                                <Login toSet={setSelected} />
                            </div>
                        }
                    </Route>
                </Switch>
            </div>
        </Router >
    )

}
