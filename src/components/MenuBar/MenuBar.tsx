import React, {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useRef,
  useCallback
} from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar
} from "@ionic/react";

import LocalAudioLevelIndicator from "./LocalAudioLevelIndicator/LocalAudioLevelIndicator";

import AboutDialog from "./AboutDialog/AboutDialog";
import IconButton from "@material-ui/core/IconButton";
import MenuContainer from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreIcon from "@material-ui/icons/MoreVert";
import UserAvatar from "./UserAvatar/UserAvatar";

import { useAppState } from "../../state";

import useVideoContext from "../../hooks/useVideoContext/useVideoContext";

export default function MenuBar() {
  const { user } = useAppState();

  const { signOut } = useAppState();
  const { room, localTracks } = useVideoContext();

  const [aboutOpen, setAboutOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const anchorRef = useRef<HTMLDivElement>(null);

  const handleSignOut = useCallback(() => {
    room.disconnect?.();
    localTracks.forEach(track => track.stop());
    signOut?.();
  }, [room.disconnect, localTracks, signOut]);

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonButtons slot="end">
          <LocalAudioLevelIndicator />
          {/* <ToggleFullscreenButton /> */}
          <div ref={anchorRef}>
            <IconButton
              color="inherit"
              onClick={() => setMenuOpen(state => !state)}
            >
              {user ? <UserAvatar user={user} /> : <MoreIcon />}
            </IconButton>
          </div>
          <MenuContainer
            open={menuOpen}
            onClose={() => setMenuOpen(state => !state)}
            anchorEl={anchorRef.current}
          >
            {user?.displayName && (
              <MenuItem disabled>{user.displayName}</MenuItem>
            )}
            <MenuItem onClick={() => setAboutOpen(true)}>About</MenuItem>
            {user && <MenuItem onClick={handleSignOut}>Logout</MenuItem>}
          </MenuContainer>
        </IonButtons>

        <AboutDialog
          open={aboutOpen}
          onClose={() => {
            setAboutOpen(false);
            setMenuOpen(false);
          }}
        />
      </IonToolbar>
    </IonHeader>
  );
}
