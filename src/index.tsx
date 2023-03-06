import React from 'react';
import ReactDOM from 'react-dom';

import { CssBaseline } from '@material-ui/core';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import AppStateProvider, { useAppState } from './state';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import ErrorDialog from './components/ErrorDialog/ErrorDialog';
import LoginPage from './components/LoginPage/LoginPage';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import theme from './theme';
import './types';
import { ChatProvider } from './components/ChatProvider';
import { ParticipantProvider } from './components/ParticipantProvider';
import { VideoProvider } from './components/VideoProvider';
import useConnectionOptions from './utils/useConnectionOptions/useConnectionOptions';
import UnsupportedBrowserWarning from './components/UnsupportedBrowserWarning/UnsupportedBrowserWarning';

import { StateStorageProvider } from './contexts';
import { ModalProvider } from './contexts/ModalContext';
import { ToastContainer } from 'react-toastify';

const REACT_APP_URL_NEXT_APP = process.env.REACT_APP_URL_NEXT_APP || 'http://localhost:3000';

const VideoApp = () => {
  const { error, setError } = useAppState();
  const connectionOptions = useConnectionOptions();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <ParticipantProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </ParticipantProvider>
    </VideoProvider>
  );
};

export const ReactApp = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <UnsupportedBrowserWarning>
      <Router>
        <AppStateProvider>
          <Switch>
            {/* <PrivateRoute exact path="/">
              <VideoApp />
            </PrivateRoute> */}
            <PrivateRoute path="/room/:URLRoomName/doctor">
              <StateStorageProvider userType={'doctor'}>
                <ModalProvider>
                  <VideoApp />
                </ModalProvider>
              </StateStorageProvider>
            </PrivateRoute>
            <PrivateRoute path="/room/:URLRoomName">
              <StateStorageProvider userType={'student'}>
                <VideoApp />
              </StateStorageProvider>
            </PrivateRoute>
            <Route path="/login">
              <LoginPage />
            </Route>
            {/* <Route path="/">
              {() => {
                window.location.href = REACT_APP_URL_NEXT_APP;
                return null;
              }}
            </Route> */}
          </Switch>
        </AppStateProvider>
      </Router>
    </UnsupportedBrowserWarning>
    <ToastContainer />
  </MuiThemeProvider>
);

ReactDOM.render(<ReactApp />, document.getElementById('root'));
