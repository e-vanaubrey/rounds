import React, { useRef, useEffect } from "react";
import { IVideoTrack } from "../../types";
import { styled } from "@material-ui/core/styles";
import { Track } from "twilio-video";

import "./VideoTrack.css";

import useRoomState from "../../hooks/useRoomState/useRoomState";

const Video = styled("video")({});

interface VideoTrackProps {
  track: IVideoTrack;
  isLocal?: boolean;
  priority?: Track.Priority | null;
}

export default function VideoTrack({
  track,
  isLocal,
  priority
}: VideoTrackProps) {
  const ref = useRef<HTMLVideoElement>(null!);
  const roomState = useRoomState();

  useEffect(() => {
    const el = ref.current;
    el.muted = true;
    if (track.setPriority && priority) {
      track.setPriority(priority);
    }
    track.attach(el);
    return () => {
      track.detach(el);
      if (track.setPriority && priority) {
        // Passing `null` to setPriority will set the track's priority to that which it was published with.
        track.setPriority(null);
      }
    };
  }, [track, priority]);

  // The local video track is mirrored.
  const style = isLocal ? { transform: "rotateY(180deg)" } : {};

  return (
    <Video
      ref={ref}
      className={roomState === "disconnected" ? "preview" : "connected"}
      style={style}
    />
  );
  //return <Video ref={ref} style={style} />;
}
