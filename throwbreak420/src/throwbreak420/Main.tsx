import { ReactNode, createRef, useEffect, useState } from "react";

import css from "./index.module.css";

const VERSION = "1.0.0";

const CONFIG = {
  frameStart: 42 + 11,
  breakWindow: 20,
  correctSleepMs: 250,
  incorrectSleepMs: 2000,
};

const shortcutToInput: { [k: string]: string } = {
  1: "1",
  2: "2",
  3: "1+2",
  u: "1",
  i: "2",
  o: "1+2",
};

const videoCache: { [p: string]: string } = {};

var initialzed = false;
var prepVideo = () => {};
var onEnded = () => {};
var _speed = 1;
var nextStreak = 0;
var answer: string | null = null;
var timeout: NodeJS.Timeout;

export default function Main() {
  const mainRef = createRef<HTMLVideoElement>();
  const backupRef = createRef<HTMLVideoElement>();

  function Video() {
    return (
      <div style={{ height: "100%" }}>
        <video
          ref={mainRef}
          style={{
            position: "absolute",
            height: "100%",
            maxWidth: "100%",
            zIndex: 1,
          }}
          playsInline
          autoPlay
          muted
          onEnded={onEnded}
        ></video>
        <video
          src={`video/blank.mp4`}
          ref={backupRef}
          style={{
            position: "absolute",
            height: "100%",
            maxWidth: "100%",
          }}
          autoPlay
          playsInline
          onCanPlay={() => {
            const t = backupRef.current!;
            t.pause();
            if (!initialzed) {
              initialzed = true;
              prepVideo();
              return;
            }
            const video = mainRef.current!;
            video.src = t.src;
            video.playbackRate = _speed;
          }}
        ></video>
      </div>
    );
  }

  function Helper(props: { children: ReactNode }) {
    const [shortcutToSet, updateShortcutToSet] = useState("");
    const [isP1, updateIsP1] = useState(true);
    const [isStanding, updateIsStanding] = useState(true);
    const [possibles, updatePossibles] = useState({
      "1": true,
      "2": true,
      "1+2": true,
    });
    const [speed, _updateSpeed] = useState(1);
    const updateSpeed = (newSpeed: number) => {
      const video = mainRef.current;
      if (!video) return;
      newSpeed = parseFloat(newSpeed.toFixed(2));
      video.playbackRate = newSpeed;
      _speed = newSpeed;
      _updateSpeed(newSpeed);
    };
    const [streak, updateStreak] = useState(0);
    const [lastAnswer, updateLastAnswer] = useState("");
    const [lastInput, updateLastInput] = useState("");
    const [frame, updateFrame] = useState(0);
    const [isLoading, updateIsLoading] = useState(false);
    const [userGuideIsOpen, _updateUserGuideIsOpen] = useState(
      VERSION > (localStorage.getItem("") || "")
    );
    const updateUserGuideIsOpen = (_userGuideIsOpen: boolean) => {
      localStorage.setItem("", _userGuideIsOpen ? "" : VERSION);
      // _updateUserGuideIsOpen(_userGuideIsOpen);
      if (initialzed) {
        // @ts-ignore
        window.location.reload(true);
      }
    };

    const getPath = (choice: string) =>
      `video/${isP1 ? "p1" : "p2"}/${
        isStanding ? "standing" : "grounded"
      }/${choice.replace("+", "")}.mp4`;

    prepVideo = () => {
      if (!initialzed) return;
      clearTimeout(timeout);
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
            fetch(p)
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

    useEffect(() => {
      nextStreak = 0;
      prepVideo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isP1, isStanding, possibles]);
    const handleInput = (button: string) => {
      const video = mainRef.current;
      if (!video) return;
      if (answer === null) return;
      const rawFrame = Math.ceil(video.currentTime * 60);
      const thisFrame = rawFrame - CONFIG.frameStart;
      if (thisFrame < 0) return;
      video.pause();
      const incorrect = thisFrame > CONFIG.breakWindow || button !== answer;
      nextStreak = incorrect ? 0 : streak + 1;
      if (!incorrect) updateStreak(nextStreak);
      updateLastAnswer(answer);
      updateLastInput(button);
      updateFrame(thisFrame);
      answer = null;
      timeout = setTimeout(
        () => prepVideo(),
        incorrect ? CONFIG.incorrectSleepMs : CONFIG.correctSleepMs
      );
    };
    onEnded = () => handleInput("-");
    return (
      <div
        tabIndex={1}
        ref={(c) => c?.focus()}
        onKeyDown={(e) => {
          if (userGuideIsOpen) {
            return;
          }
          if (shortcutToSet !== "") {
            shortcutToInput[e.key] = shortcutToSet;
            updateShortcutToSet(
              { "1": "2", "2": "1+2", "1+2": "" }[shortcutToSet]!
            );
            return;
          }
          const button = shortcutToInput[e.key];
          if (button === undefined) {
            if (e.metaKey || !e.code.startsWith("Key")) return;
            initialzed = false;
            updateShortcutToSet("1");
            return;
          }
          handleInput(button);
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
          <div
            style={{
              width: "100%",
              display: "flex",
            }}
          >
            <div style={{ alignSelf: "center", flexGrow: 1 }}>
              <div
                style={{
                  maxWidth: "40em",
                  margin: "auto",
                }}
              >
                <h1>ThrowBreak420 v{VERSION}</h1>
                <h3 onClick={() => updateUserGuideIsOpen(false)}>
                  click here to continue
                </h3>
                <p>
                  if you're like me, breaking a throw in a match is impossible,
                  and even in practice mode, it's too fast and subtle to
                  distinguish which arm it was!
                </p>
                <p>
                  this tool has several features to train us stoners on how to
                  recognize throws, and maybe someday, we will be able to
                  consitently break them in a match
                </p>
                <ul>
                  <li>control speed</li>
                  <li>
                    see which frame you pressed - were you close? throws have a
                    20 frame break window
                  </li>
                  <li>practice on any browser, even mobile</li>
                  <li>record your streak, brag to your wife's boyfriend</li>
                  <li>
                    ideally, there would be a random delay before the throw is
                    done, but it hasn't been implemented yet
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : shortcutToSet !== "" ? (
          <div>set button {shortcutToSet}</div>
        ) : (
          <div
            className={css.main}
            style={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div>
              <form
                style={{ display: "flex", justifyContent: "space-around" }}
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  {[true, false].map((t) => (
                    <div key={t ? "t" : "f"}>
                      <label>
                        <input
                          type="radio"
                          name="isP1"
                          checked={t === isP1}
                          onChange={() => updateIsP1(t)}
                        />
                        {t ? "p1" : "p2"}
                      </label>
                    </div>
                  ))}
                </div>
                <div>
                  {[true, false].map((t) => (
                    <div key={t ? "t" : "f"}>
                      <label>
                        <input
                          type="radio"
                          name="isStanding"
                          checked={t === isStanding}
                          onChange={() => updateIsStanding(t)}
                        />
                        {t ? "standing" : "grounded"}
                      </label>
                    </div>
                  ))}
                </div>
                <div>
                  {Object.entries(possibles).map(([k, v]) => (
                    <div key={k}>
                      <label>
                        <input
                          type={"checkbox"}
                          checked={v}
                          onChange={() =>
                            updatePossibles(
                              Object.assign({}, possibles, {
                                [k]: !v,
                              })
                            )
                          }
                        />
                        {k} break
                      </label>
                    </div>
                  ))}
                </div>
                <div>
                  <div>speed: {speed.toFixed(2)}</div>
                  <div>
                    <button
                      disabled={speed <= 0.2}
                      onClick={() => updateSpeed(speed - 0.05)}
                    >
                      ➖
                    </button>
                    <button
                      disabled={speed >= 2}
                      onClick={() => updateSpeed(speed + 0.05)}
                    >
                      ➕
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div
              style={{
                flexGrow: 1,
              }}
            >
              {isLoading ? (
                <h1 style={{ textAlign: "center" }}>LOADING...</h1>
              ) : null}
              <div
                className={css.dual_center}
                style={{
                  opacity: isLoading ? 0 : undefined,
                  height: "100%",
                  width: "100%",
                  display: "flex",
                }}
              >
                <div
                  style={{
                    paddingLeft: "2em",
                    width: "8em",
                  }}
                >
                  <div>answer: {lastAnswer}</div>
                  <div>input: {lastInput}</div>
                  <div>frame: {frame}</div>
                  <div>streak: {streak}</div>
                  <div>
                    <button
                      style={{ cursor: "pointer" }}
                      onClick={() => updateUserGuideIsOpen(true)}
                    >
                      User Guide
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    flexGrow: 1,
                    position: "relative",
                  }}
                >
                  {props.children}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              {Object.keys(possibles).map((k) => (
                <div key={k}>
                  <button
                    style={{ padding: "1em", fontSize: "xx-large" }}
                    onClick={() => handleInput(k)}
                  >
                    {k}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Helper>
      <Video />
    </Helper>
  );
}
