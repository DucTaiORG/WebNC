import React from 'react';
import {Route, Redirect} from 'react-router-dom';
import Auth from '../../auth';

export const ProtectedRoute = ({component: Component, ...rest}) =>(
    <Route {...rest} render={(props) => (
        Auth.isAuthenticated() === true
          ? <Component {...props} />
          : <Redirect to={{
              pathname: '/',
              state: { from: props.location }
            }} />
      )} />
)
