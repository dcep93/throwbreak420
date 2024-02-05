import { ReactNode, createRef, useEffect, useState } from "react";

const ALL_MOVES = {
  1: "1 break",
  2: "2 break",
  12: "1+2 break",
};
const shortcutToInput: { [k: string]: string } = {};

var initialzed = false;

export default function Main() {
  console.log("main");
  var throwBreak = "";
  const mainRef = createRef<HTMLVideoElement>();
  const backupRef = createRef<HTMLVideoElement>();
  const [shortcutToSet, updateShortcutToSet] = useState("");
  const [isP1, updateIsP1] = useState(true);
  const [isStanding, updateIsStanding] = useState(true);
  const [possibleThrowBreaks, updatePossibleThrowBreaks] = useState(
    Object.fromEntries(Object.keys(ALL_MOVES).map((k) => [k, true]))
  );
  var timeout: NodeJS.Timeout;

  const prepRandom = () => {
    console.log("prepRandom", initialzed);
    if (!initialzed) return;
    clearTimeout(timeout);
    const choices = Object.entries(possibleThrowBreaks)
      .map(([k, v]) => ({ k, v }))
      .filter(({ v }) => v)
      .map(({ k }) => k);
    const nextThrowBreak = choices[Math.floor(Math.random() * choices.length)];
    if (nextThrowBreak === undefined) {
      return;
    }
    throwBreak = nextThrowBreak;
    backupRef.current!.src = `video/${
      isStanding ? "standing" : "grounded"
    }/${throwBreak}.mkv#${Date.now()}`;
  };

  var onEnded = () => {};

  function Helper(props: { children: ReactNode }) {
    console.log("helper");
    const [speed, _updateSpeed] = useState(1);
    const updateSpeed = (newSpeed: number) => {
      const video = mainRef.current;
      if (!video) return;
      newSpeed = parseFloat(newSpeed.toFixed(2));
      video.playbackRate = newSpeed;
      _updateSpeed(newSpeed);
    };
    const [streak, updateStreak] = useState(0);
    const [lastThrowBreak, updateLastThrowBreak] = useState("");
    const [lastInput, updateLastInput] = useState("");
    const [frame, updateFrame] = useState(0);
    useEffect(() => {
      prepRandom();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isP1, isStanding, possibleThrowBreaks]);
    const breakThrow = (button: string) => {
      const video = mainRef.current;
      if (!video) return;
      const rawFrame = Math.ceil(video.currentTime * 60);
      const thisFrame = rawFrame - 66;
      if (thisFrame < 0) return;
      video.pause();
      const fullThrowBreak = throwBreak.replace("12", "1+2");
      const incorrect = button !== fullThrowBreak;
      updateStreak(incorrect ? 0 : streak + 1);
      updateLastThrowBreak(throwBreak);
      updateLastInput(button);
      updateFrame(thisFrame);
      timeout = setTimeout(() => prepRandom(), incorrect ? 2000 : 500);
    };
    onEnded = () => breakThrow("-");
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
                          checked={possibleThrowBreaks[k]}
                          onChange={() =>
                            updatePossibleThrowBreaks(
                              Object.assign({}, possibleThrowBreaks, {
                                [k]: !possibleThrowBreaks[k],
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
              <div>throw: {lastThrowBreak}</div>
              <div>input: {lastInput}</div>
              <div>frame: {frame}</div>
              <div>streak: {streak}</div>
            </div>
            <div style={{ flexGrow: 1, position: "relative" }}>
              {props.children}
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

  function Video() {
    console.log("video");
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
          autoPlay
          muted
          onEnded={onEnded}
        ></video>
        <video
          src={`video/blank-0.2-sec.mkv`}
          ref={backupRef}
          style={{
            position: "absolute",
            height: "100%",
            maxWidth: "100%",
          }}
          onCanPlay={(e) => {
            console.log("canPlay", (e.target as HTMLVideoElement).src);
            if (!initialzed) {
              initialzed = true;
              prepRandom();
              return;
            }
            const video = mainRef.current!;
            video.src = (e.target as HTMLVideoElement).src;
            // video.playbackRate = speed; // TODO make not necessary cuz we dont rerender!
          }}
        ></video>
      </div>
    );
  }
  return (
    <Helper>
      <Video />
    </Helper>
  );
}
