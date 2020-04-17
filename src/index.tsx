import React from "react";
import ReactDOM from "react-dom";
import { IonApp, IonContent } from "@ionic/react";

import { CssBaseline } from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";

import App from "./App";
import AppStateProvider, { useAppState } from "./state";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import { ConnectOptions } from "twilio-video";
import ErrorDialog from "./components/ErrorDialog/ErrorDialog";
import LoginPage from "./components/LoginPage/LoginPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import theme from "./theme";
import "./types";
import { VideoProvider } from "./components/VideoProvider";
import * as serviceWorker from "./serviceWorker";

//ReactDOM.render(<App />, document.getElementById('root'));

// See: https://media.twiliocdn.com/sdk/js/video/releases/2.0.0/docs/global.html#ConnectOptions
// for available connection options.
const connectionOptions: ConnectOptions = {
  bandwidthProfile: {
    video: {
      mode: "collaboration",
      dominantSpeakerPriority: "standard",
      renderDimensions: {
        high: { height: 1080, width: 1920 },
        standard: { height: 720, width: 1280 },
        low: { height: 90, width: 160 }
      }
    }
  },
  dominantSpeaker: true,
  maxAudioBitrate: 12000,
  networkQuality: { local: 1, remote: 1 },
  preferredVideoCodecs: [{ codec: "VP8", simulcast: true }]
};

const VideoApp = () => {
  const { error, setError } = useAppState();

  return (
    <VideoProvider options={connectionOptions} onError={setError}>
      <ErrorDialog dismissError={() => setError(null)} error={error} />
      <App />
    </VideoProvider>
  );
};

ReactDOM.render(
  <IonApp>
    <Router>
      <AppStateProvider>
        <Switch>
          <PrivateRoute exact path="/">
            <VideoApp />
          </PrivateRoute>
          <PrivateRoute path="/room/:URLRoomName">
            <VideoApp />
          </PrivateRoute>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </AppStateProvider>
    </Router>
  </IonApp>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
