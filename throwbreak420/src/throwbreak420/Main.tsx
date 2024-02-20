import { ReactNode, createRef, useEffect, useState } from "react";

const shortcutToInput: { [k: string]: string } = {
  1: "1",
  2: "2",
  3: "1+2",
  u: "1",
  i: "2",
  o: "1+2",
};

var initialzed = false;

export default function Main() {
  var prepVideo = () => {};
  var onEnded = () => {};
  var speed = 1;
  var answer: string | null = null;
  var timeout: NodeJS.Timeout;
  const mainRef = createRef<HTMLVideoElement>();
  const backupRef = createRef<HTMLVideoElement>();
  var streak = 0;

  function Video() {
    return (
      <div
        style={{ height: "100%", display: "flex", justifyContent: "center" }}
      >
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
            video.playbackRate = speed;
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

    prepVideo = () => {
      if (!initialzed) return;
      clearTimeout(timeout);
      const choices = Object.entries(possibles)
        .map(([k, v]) => ({ k, v }))
        .filter(({ v }) => v)
        .map(({ k }) => k);
      const nextChoice = choices[Math.floor(Math.random() * choices.length)];
      if (nextChoice === undefined) {
        return;
      }
      updateStreak(streak);
      answer = nextChoice;
      fetch(
        `video/${isP1 ? "p1" : "p2"}/${
          isStanding ? "standing" : "grounded"
        }/${answer}.mkv`
      )
        .then((response) => response.blob())
        .then((blob) => {
          backupRef.current!.src = window.URL.createObjectURL(blob);
        });
    };

    const [_speed, _updateSpeed] = useState(1);
    const updateSpeed = (newSpeed: number) => {
      const video = mainRef.current;
      if (!video) return;
      speed = parseFloat(newSpeed.toFixed(2));
      video.playbackRate = speed;
      _updateSpeed(speed);
    };
    const [_streak, updateStreak] = useState(streak);
    const [lastAnswer, updateLastAnswer] = useState("");
    const [lastInput, updateLastInput] = useState("");
    const [frame, updateFrame] = useState(0);
    useEffect(() => {
      streak = 0;
      prepVideo();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isP1, isStanding, possibles]);
    const handleInput = (button: string) => {
      const video = mainRef.current;
      if (!video) return;
      if (answer === null) return;
      const rawFrame = Math.ceil(video.currentTime * 60);
      const thisFrame = rawFrame - 66;
      if (thisFrame < 0) return;
      video.pause();
      const incorrect = thisFrame > 20 || button !== answer;
      streak = incorrect ? 0 : streak + 1;
      if (!incorrect) updateStreak(streak);
      updateLastAnswer(answer);
      updateLastInput(button);
      updateFrame(thisFrame);
      answer = null;
      timeout = setTimeout(() => prepVideo(), incorrect ? 2000 : 250);
    };
    onEnded = () => handleInput("-");
    return (
      <div
        tabIndex={1}
        ref={(c) => c?.focus()}
        onKeyDown={(e) => {
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
      >
        {shortcutToSet !== "" ? (
          <div>set button {shortcutToSet}</div>
        ) : (
          <div
            style={{
              fontFamily: "Courier New",
              color: "#f3f3f8",
              backgroundColor: "#282a3a",
            }}
          >
            <div
              style={{
                height: "100vH",
                width: "100vW",
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
                          {k.replace("_", "+")} break
                        </label>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div>speed: {_speed.toFixed(2)}</div>
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
              <div style={{ paddingLeft: "2em" }}>
                <div>answer: {lastAnswer}</div>
                <div>input: {lastInput}</div>
                <div>frame: {frame}</div>
                <div>streak: {_streak}</div>
              </div>
              <div style={{ flexGrow: 1, position: "relative" }}>
                {props.children}
              </div>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                {["1", "2", "1+2"].map((k) => (
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
            <div style={{ overflow: "hidden", padding: "2em" }}>
              <h2
                onClick={() => {
                  // @ts-ignore
                  window.location.reload(true);
                }}
              >
                ThrowBreak420
              </h2>
              <ul>
                <li>
                  welcome! check out{" "}
                  <a
                    style={{ color: "#f3f3f8" }}
                    href="https://www.youtube.com/watch?v=BDUUbuzuelA"
                  >
                    this
                  </a>{" "}
                  video from PhiDX for pro tips
                </li>
                <li>practice throw breaks on any browser, even mobile</li>
                <li>control speed</li>
                <li>see which frame you pressed - were you close?</li>
                <li>record your streak</li>
                <li>this app is still pre-release</li>
                <li>
                  TODO{" "}
                  <ul>
                    <li>better user guide</li>
                    <li>cache clips before playing</li>
                    <li>random intervals</li>
                  </ul>
                </li>
              </ul>
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
