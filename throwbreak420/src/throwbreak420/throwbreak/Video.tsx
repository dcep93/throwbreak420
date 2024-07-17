import { RefObject } from "react";
import css from "./index.module.css";

export default function Video(props: {
  get: () => {
    mainRef: RefObject<HTMLVideoElement>;
    backupRef: RefObject<HTMLVideoElement>;
    onEnded: () => void;
    initialized: boolean;
    initialize: () => void;
    speed: number;
  };
}) {
  return (
    <div style={{ height: "100%" }}>
      <video
        className={css.video}
        ref={props.get().mainRef}
        style={{
          position: "absolute",
          height: "100%",
          maxWidth: "100%",
          zIndex: 1,
        }}
        playsInline
        autoPlay
        muted
        onEnded={() => props.get().onEnded()}
      ></video>
      <video
        className={css.video}
        src={`video/blank.mp4`}
        ref={props.get().backupRef}
        style={{
          position: "absolute",
          height: "100%",
          maxWidth: "100%",
        }}
        autoPlay
        playsInline
        onCanPlay={() => {
          const t = props.get().backupRef.current!;
          t.pause();
          if (!props.get().initialized) {
            props.get().initialize();
            return;
          }
          const video = props.get().mainRef.current!;
          video.src = t.src;
          video.playbackRate = props.get().speed;
        }}
      ></video>
    </div>
  );
}
