import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import Home from './containers/home/Home';
import Signin from './containers/signin/Signin';
import Signup from './containers/signup/Signup';
import Users from './containers/users/Users';
import Box from './containers/box-detail/BoxDetail';
import NoMatchedRoute from './containers/NonMatch';
import { APPLICATION_ROUTES } from './Constants';
import Header from './components/header/Header';

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path={APPLICATION_ROUTES.ROOT}
        element={
          <>
            <Header />
            <Outlet />
          </>
        }
      >
        <Route index element={<Home />} />
        <Route path={APPLICATION_ROUTES.SIGNUP} element={<Signup />} />
        <Route path={APPLICATION_ROUTES.SIGNIN} element={<Signin />} />
        <Route path={APPLICATION_ROUTES.USERS} element={<Users />} />
        <Route path={`${APPLICATION_ROUTES.BOX}/:boxId`} element={<Box />} />
        <Route path="*" element={<NoMatchedRoute />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
