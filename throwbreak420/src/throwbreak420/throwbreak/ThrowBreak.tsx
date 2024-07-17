import { ReactNode, createRef, useEffect, useState } from "react";

import Buttons from "./Buttons";
import Center from "./Center";
import ControllerListener from "./ControllerListener";
import Settings from "./Settings";
import UserGuide from "./UserGuide";
import Video from "./Video";
import firebase from "./firebase";
import css from "./index.module.css";

export const VERSION = "1.4.0";

const CONFIG = {
  frameStart: 42,
  breakWindow: 20,
  correctSleepMs: 250,
  incorrectSleepMs: 2000,
  framesPerSecond: 60,
};

export const params = new URLSearchParams(window.location.search);

const shortcutToInput: { [k: string]: string } = {
  1: "1",
  2: "2",
  3: "1+2",
  u: "1",
  i: "2",
  o: "1+2",
};
var shortcutToSet = "";

const videoCache: { [p: string]: string } = {};

var initialized = false;
var initialize = () => {};
var onEnded = () => {};
var speed = 1;
var nextStreak = 0;
var answer: string | null = null;
var videoTimeout: NodeJS.Timeout;
var inputTimeout: NodeJS.Timeout;
var keysPressed: { [k: string]: boolean } = {};

enum Correctness {
  right = "✅",
  slow = "⚠️",
  wrong = "❌",
}

export const historyLog: {
  answer: string;
  button: string;
  frame: number;
  streak: number;
  correctness: Correctness;
}[] = [];

export default function ThrowBreak() {
  firebase();
  const mainRef = createRef<HTMLVideoElement>();
  const backupRef = createRef<HTMLVideoElement>();

  // return <SlicePreview />;

  function Helper(props: { children: ReactNode }) {
    const [_shortcutToSet, _updateShortcutToSet] = useState("");
    const updateShortcutToSet = (v: string) => {
      shortcutToSet = v;
      _updateShortcutToSet(v);
    };
    const [isP1, updateIsP1] = useState(true);
    const [isStanding, updateIsStanding] = useState(true);
    const [possibles, updatePossibles] = useState<{ [k: string]: boolean }>({
      "1": true,
      "2": true,
      "1+2": true,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, _updateSpeed] = useState(1);
    const updateSpeed = (newSpeed: number) => {
      const video = mainRef.current;
      if (!video) return;
      newSpeed = parseFloat(newSpeed.toFixed(2));
      video.playbackRate = newSpeed;
      speed = newSpeed;
      _updateSpeed(newSpeed);
    };
    const [streak, updateStreak] = useState(0);
    const [highestStreak, updateHighestStreak] = useState(
      parseInt(localStorage.getItem("streak") || "0")
    );
    const [lastAnswer, updateLastAnswer] = useState("");
    const [lastInput, updateLastInput] = useState("");
    const [lastFrame, updateLastFrame] = useState(0);
    const [isLoading, updateIsLoading] = useState(false);
    const [userGuideIsOpen, _updateUserGuideIsOpen] = useState(
      VERSION > (localStorage.getItem("VERSION") || "")
    );
    const updateUserGuideIsOpen = (_userGuideIsOpen: boolean) => {
      localStorage.setItem("VERSION", _userGuideIsOpen ? "" : VERSION);
      _updateUserGuideIsOpen(_userGuideIsOpen);
      if (initialized) {
        // @ts-ignore
        window.location.reload(true);
      }
    };
    const [backgroundColor, updateBackgroundColor] = useState<
      string | undefined
    >(undefined);

    const getPath = (choice: string) =>
      `video/4_2_2024/${isP1 ? "p1" : "p2"}/${
        isStanding ? "standing" : "grounded"
      }/${choice.replace("+", "")}.mp4`;

    const prepVideo = () => {
      if (!initialized) return;
      clearTimeout(videoTimeout);
      const choices = Object.entries(possibles)
        .map(([k, v]) => ({ k, v }))
        .filter(({ v }) => v)
        .map(({ k }) => k);
      const missing = choices
        .map((choice) => getPath(choice))
        .filter((p) => videoCache[p] === undefined);
      if (missing.length > 0) {
        updateIsLoading(true);
        Promise.all(
          missing.map((p) =>
            fetch(p, { cache: "force-cache" })
              .then((r) => r.blob())
              .then((blob) => window.URL.createObjectURL(blob))
              .then((src) => (videoCache[p] = src))
          )
        )
          .then(() => updateIsLoading(false))
          .then(() => prepVideo());
        return;
      }
      const nextChoice = choices[Math.floor(Math.random() * choices.length)];
      if (nextChoice === undefined) {
        return;
      }
      updateStreak(nextStreak);
      answer = nextChoice;
      backupRef.current!.src = videoCache[getPath(nextChoice)];
    };

    initialize = () => {
      initialized = true;
      prepVideo();
      ControllerListener(onKeyDownHelper);
    };

    useEffect(() => {
      nextStreak = 0;
      prepVideo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isP1, isStanding, possibles]);
    const handleInput = (button: string) => {
      const video = mainRef.current;
      if (!video) return;
      if (answer === null) return;
      const rawFrame = Math.ceil(video.currentTime * CONFIG.framesPerSecond);
      const frame = rawFrame - CONFIG.frameStart;
      if (frame < 0) return;
      video.pause();
      const incorrect = frame > CONFIG.breakWindow || button !== answer;
      const correctness = !incorrect
        ? Correctness.right
        : button === answer
        ? Correctness.slow
        : Correctness.wrong;
      updateBackgroundColor(
        {
          [Correctness.right]: "rgba(0,0,90)",
          [Correctness.slow]: "rgba(100,80,0)",
          [Correctness.wrong]: "rgba(90,0,0)",
        }[correctness]
      );
      nextStreak = incorrect ? 0 : streak + 1;
      if (!incorrect) {
        updateStreak(nextStreak);
        if (nextStreak > highestStreak) {
          updateHighestStreak(nextStreak);
          localStorage.setItem("streak", nextStreak.toString());
        }
      }
      historyLog.push({
        answer,
        button,
        frame,
        streak: nextStreak,
        correctness,
      });
      updateLastAnswer(answer);
      updateLastInput(button);
      updateLastFrame(frame);
      answer = null;
      videoTimeout = setTimeout(
        () => prepVideo(),
        incorrect ? CONFIG.incorrectSleepMs : CONFIG.correctSleepMs
      );
    };
    onEnded = () => handleInput("-");
    const onKeyDownHelper = (key: string, pressed: boolean) => {
      if (!pressed) return;
      clearTimeout(inputTimeout);
      if (params.has("debug")) {
        alert(
          JSON.stringify({
            debug: 193,
            key,
          })
        );
      }
      if (userGuideIsOpen) {
        return;
      }
      if (shortcutToSet !== "") {
        shortcutToInput[key] = shortcutToSet;
        updateShortcutToSet(
          { "1": "2", "2": "1+2", "1+2": "" }[shortcutToSet]!
        );
        return;
      }
      const button = shortcutToInput[key];
      if (button === undefined) {
        initialized = false;
        updateShortcutToSet("1");
        return;
      }
      keysPressed[button] = true;
      inputTimeout = setTimeout(() => {
        const allButtons =
          Object.keys(keysPressed).length === 1 ? button : shortcutToInput[3];
        keysPressed = {};
        handleInput(allButtons);
        // wait for half a frame - idk
      }, 1000 / CONFIG.framesPerSecond / 2);
    };
    return (
      <div
        tabIndex={1}
        ref={(c) => c?.focus()}
        onKeyDown={(e) => {
          if (["Alt", "Control", "Meta", "Shift"].includes(e.key)) {
            return;
          }
          onKeyDownHelper(e.key, true);
        }}
        style={{
          fontFamily: "Courier New",
          color: "#f3f3f8",
          backgroundColor: "#282a3a",
          height: "100vH",
          width: "100vW",
          display: "flex",
        }}
      >
        {userGuideIsOpen ? (
          <UserGuide updateUserGuideIsOpen={updateUserGuideIsOpen} />
        ) : _shortcutToSet !== "" ? (
          <div>set button {_shortcutToSet}</div>
        ) : (
          <div
            className={css.main}
            style={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor,
            }}
          >
            <Settings
              get={() => ({
                isP1,
                updateIsP1,
                isStanding,
                updateIsStanding,
                possibles,
                updatePossibles,
                speed,
                updateSpeed,
              })}
            />
            <div
              style={{
                flexGrow: 1,
              }}
            >
              {isLoading ? (
                <h1 style={{ textAlign: "center" }}>LOADING...</h1>
              ) : null}
              <Center
                get={() => ({
                  isLoading,
                  lastAnswer,
                  lastInput,
                  lastFrame,
                  streak,
                  highestStreak,
                  updateUserGuideIsOpen,
                })}
              >
                {props.children}
              </Center>
            </div>
            <Buttons get={() => ({ possibles, handleInput })} />
          </div>
        )}
      </div>
    );
  }

  return (
    <Helper>
      <Video
        get={() => ({
          mainRef,
          backupRef,
          onEnded,
          initialized,
          initialize,
          speed,
        })}
      />
    </Helper>
  );
}
