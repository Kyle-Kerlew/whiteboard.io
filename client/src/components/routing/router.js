import React, {
  useEffect,
} from 'react';
import {
  useDispatch,
} from 'react-redux';
import {
  Switch,
  Route,
  useLocation,
} from 'react-router-dom';
import BoardList from '../drawing/boardList';
import Canvas from '../drawing/canvas';
import NavBar from '../navigation/navBar';
import CreateAccount from '../page/createAccount';
import Home from '../page/home';
import SignIn from '../page/signIn';
import {
  Authentication as getAuthentication,
} from '../shared/authentication';
import 'dotenv/config';

const Router = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    getAuthentication(dispatch)();
  }, [
    location,
  ]);

  return (
    <>
      <NavBar />
      <Switch>
        <Route component={Home} exact path='/' />
        <Route component={SignIn} path='/sign-in' />
        <Route component={CreateAccount} path='/create-account' />
        <Route component={BoardList} path='/my-boards' />
        <Route component={Canvas} path='/boards/:canvasId' />
      </Switch>
    </>
  );
};

export default Router;
