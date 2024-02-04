import { createRef, useEffect, useState } from "react";

const ALL_MOVES = {
  1: "1 break",
  2: "2 break",
  12: "1+2 break",
};
const shortcutToInput: { [k: string]: string } = {};

export default function Main() {
  const mainRef = createRef<HTMLVideoElement>();
  const backupRef = createRef<HTMLVideoElement>();
  const [shortcutToSet, updateShortcutToSet] = useState("");
  const [isP1, updateIsP1] = useState(true);
  const [isStanding, updateIsStanding] = useState(true);
  const [speed, updateSpeed] = useState(1);
  const [throwBreaks, updateThrowBreaks] = useState(
    Object.fromEntries(Object.keys(ALL_MOVES).map((k) => [k, true]))
  );
  const [throwBreak, updateThrowBreak] = useState("");
  const [date, updateDate] = useState(0);
  const [streak, updateStreak] = useState(0);
  const [lastThrowBreak, updateLastThrowBreak] = useState("");
  const [lastInput, updateLastInput] = useState("");
  const [frame, updateFrame] = useState(0);
  var timeout: NodeJS.Timeout;
  const prepRandom = () => {
    console.log("prep");
    clearTimeout(timeout);
    const choices = Object.entries(throwBreaks)
      .map(([k, v]) => ({ k, v }))
      .filter(({ v }) => v)
      .map(({ k }) => k);
    const nextThrowBreak = choices[Math.floor(Math.random() * choices.length)];
    if (nextThrowBreak === undefined) {
      return;
    }
    if (nextThrowBreak === throwBreak) {
      updateDate(Date.now());
      return;
    }
    updateThrowBreak(nextThrowBreak);
  };
  const breakThrow = (button: string) => {
    const video = mainRef.current;
    if (!video) return;
    const rawFrame = Math.floor(video.currentTime * 60);
    const thisFrame = rawFrame - 66;
    if (thisFrame < 0) return;
    video.pause();
    const fixedThrowBreak = throwBreak.replace("12", "1+2");
    const incorrect = button !== fixedThrowBreak;
    updateStreak(incorrect ? 0 : streak + 1);
    updateLastThrowBreak(throwBreak);
    updateLastInput(button);
    updateFrame(thisFrame);
    timeout = setTimeout(() => prepRandom(), incorrect ? 2000 : 500);
  };
  return (
    <div
      tabIndex={1}
      onKeyDown={(e) => {
        if (shortcutToSet !== "") {
          shortcutToInput[e.key] = shortcutToSet;
          updateShortcutToSet(
            { "1": "2", "2": "1+2", "1+2": "" }[shortcutToSet]!
          );
          return;
        }
        var button =
          { "1": "1", "2": "2", "3": "1+2" }[e.key] || shortcutToInput[e.key];
        if (button === undefined) {
          if (e.metaKey || !e.code.startsWith("Key")) return;
          updateShortcutToSet("1");
          return;
        }
        breakThrow(button);
      }}
    >
      {shortcutToSet !== "" ? (
        <div>set button {shortcutToSet}</div>
      ) : (
        <div
          style={{
            height: "100vH",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Courier New",
            // TODO styling
          }}
        >
          <div>
            <form
              style={{ display: "flex", justifyContent: "space-around" }}
              onSubmit={(e) => e.preventDefault()}
            >
              <div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="p1"
                      checked={isP1}
                      onChange={() => updateIsP1(true)}
                    />
                    p1
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      disabled // TODO
                      type="radio"
                      name="p1"
                      checked={!isP1}
                      onChange={() => updateIsP1(false)}
                    />
                    p2
                  </label>
                </div>
              </div>
              <div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="grounded"
                      checked={isStanding}
                      onChange={() => updateIsStanding(true)}
                    />
                    standing
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="grounded"
                      checked={!isStanding}
                      onChange={() => updateIsStanding(false)}
                    />
                    grounded
                  </label>
                </div>
              </div>
              <div>
                {Object.entries(ALL_MOVES).map(([k, v]) => (
                  <div key={k}>
                    <label>
                      <input
                        type={"checkbox"}
                        checked={throwBreaks[k]}
                        onChange={() =>
                          updateThrowBreaks(
                            Object.assign({}, throwBreaks, {
                              [k]: !throwBreaks[k],
                            })
                          )
                        }
                      />
                      {v}
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
          <div>
            <div>streak: {streak}</div>
            <div>throw: {lastThrowBreak}</div>
            <div>input: {lastInput}</div>
            <div>frame: {frame}</div>
          </div>
          <div style={{ flexGrow: 1, position: "relative" }}>
            <Video
              src={`video/${
                isStanding ? "standing" : "grounded"
              }/${throwBreak}.mkv#${date}`}
              refObj={mainRef}
              backupRef={backupRef}
              prepRandom={prepRandom}
              onEnded={() => breakThrow("-")}
              speed={speed}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {["1", "2", "1+2"].map((k) => (
              <div key={k}>
                <button
                  style={{ padding: "1em", fontSize: "xx-large" }}
                  onClick={() => breakThrow(k)}
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

function Video(props: {
  src: string;
  refObj: React.RefObject<HTMLVideoElement>;
  backupRef: React.RefObject<HTMLVideoElement>;
  onEnded: () => void;
  prepRandom: () => void;
  speed: number;
}) {
  useEffect(() => {
    if (!props.backupRef.current || !props.refObj.current) return;
    props.prepRandom();
  }, [props]);
  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center" }}>
      <video
        ref={props.refObj}
        style={{
          position: "absolute",
          height: "100%",
          maxWidth: "100%",
          zIndex: 1,
        }}
        autoPlay
        muted
        onEnded={() => props.onEnded()}
      ></video>
      <video
        src={props.src}
        ref={props.backupRef}
        style={{
          position: "absolute",
          height: "100%",
          maxWidth: "100%",
        }}
        onCanPlay={(e) => {
          props.refObj.current!.src = (e.target as HTMLVideoElement).src;
          props.refObj.current!.playbackRate = props.speed;
        }}
      ></video>
    </div>
  );
}
