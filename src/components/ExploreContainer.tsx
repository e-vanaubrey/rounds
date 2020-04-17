import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
import "./ExploreContainer.css";

import {
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput
} from "@ionic/react";

import { styled } from "@material-ui/core/styles";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import Controls from "./Controls/Controls";
import LocalVideoPreview from "./LocalVideoPreview/LocalVideoPreview";
import MenuBar from "./MenuBar/MenuBar";
import ReconnectingNotification from "./ReconnectingNotification/ReconnectingNotification";
import Room from "./Room/Room";

import useRoomState from "../hooks/useRoomState/useRoomState";
import { useAppState } from "../state";
import { useParams } from "react-router-dom";
import useVideoContext from "../hooks/useVideoContext/useVideoContext";

const Container = styled("div")({
  height: "100%"
});

const Main = styled("main")({
  height: "100%",
  position: "relative"
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      textAlign: "center"
    },
    loadingSpinner: {
      marginLeft: "1em"
    },
    displayName: {
      marginLeft: "2.2em",
      minWidth: "200px",
      fontWeight: 600
    }
  })
);

const ExploreContainer: React.FC = () => {
  const classes = useStyles();
  const { URLRoomName } = useParams();
  const { user, getToken, isFetching } = useAppState();
  const { isConnecting, connect } = useVideoContext();
  const roomState = useRoomState();

  const [name] = useState<string>(user?.displayName || "");
  const [roomName, setRoomName] = useState<string>("");

  useEffect(() => {
    if (URLRoomName) {
      setRoomName(URLRoomName);
    }
  }, [URLRoomName]);

  const handleRoomNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // If this app is deployed as a twilio function, don't change the URL beacuse routing isn't supported.
    if (!window.location.origin.includes("twil.io")) {
      window.history.replaceState(
        null,
        "",
        window.encodeURI(`/room/${roomName}${window.location.search || ""}`)
      );
    }
    getToken(name, roomName).then(token => connect(token));
  };

  return (
    <IonContent className="container">
      <Controls />
      <ReconnectingNotification />
      {roomState === "disconnected" ? (
        <div className="previewContainer">
          <LocalVideoPreview />

          <div className="formContainer">
            <div className={classes.header}>Create a room</div>
            <form className="roomInput" onSubmit={handleSubmit}>
              <input
                id="menu-room"
                placeholder="Room name"
                value={roomName}
                onChange={handleRoomNameChange}
                autoComplete="off"
              />
              <IonButton
                className="joinButton"
                type="submit"
                disabled={isConnecting || !name || !roomName || isFetching}
              >
                Continue
              </IonButton>
              {(isConnecting || isFetching) && (
                <CircularProgress className={classes.loadingSpinner} />
              )}
            </form>
          </div>
        </div>
      ) : (
        <Room />
      )}
    </IonContent>
  );
};

export default ExploreContainer;
