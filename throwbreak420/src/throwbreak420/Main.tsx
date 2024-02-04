import { createRef, useEffect, useState } from "react";

const ALL_MOVES = {
  1: "1 break",
  2: "2 break",
  12: "1+2 break",
};
const keyboardToButton: { [k: string]: string } = {};

export default function Main() {
  const [buttonToSet, updateButtonToSet] = useState("");
  const ref = createRef<HTMLVideoElement>();
  const backupRef = createRef<HTMLVideoElement>();
  const [isP1, updateIsP1] = useState(true);
  const [isGrounded, updateIsGrounded] = useState(true);
  const [moves, updateMoves] = useState(
    Object.fromEntries(Object.keys(ALL_MOVES).map((k) => [k, true]))
  );
  const [speed, updateSpeed] = useState(1);
  const [move, updateMove] = useState("");
  const prepRandom = () => {
    const choices = Object.entries(moves)
      .map(([k, v]) => ({ k, v }))
      .filter(({ v }) => v)
      .map(({ k }) => k);
    const nextMove = choices[Math.floor(Math.random() * choices.length)];
    if (nextMove === undefined) {
      return;
    }
    updateMove(`${nextMove}.mkv#${Date.now()}`);
  };
  const breakThrow = (button: string) => {
    console.log(button);
  };
  return (
    <div
      tabIndex={1}
      onKeyDown={(e) => {
        if (buttonToSet !== "") {
          keyboardToButton[e.key] = buttonToSet;
          updateButtonToSet({ "1": "2", "2": "1+2", "1+2": "" }[buttonToSet]!);
          return;
        }
        var button =
          { "1": "1", "2": "2", "3": "1+2" }[e.key] || keyboardToButton[e.key];
        if (button === undefined) {
          if (!e.code.startsWith("Key")) return;
          updateButtonToSet("1");
          return;
        }
        breakThrow(button);
      }}
    >
      {buttonToSet !== "" ? (
        <div>set button {buttonToSet}</div>
      ) : (
        <div
          style={{
            height: "100vH",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Courier New",
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
                      checked={isGrounded}
                      onChange={() => updateIsGrounded(true)}
                    />
                    grounded
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="radio"
                      name="grounded"
                      checked={!isGrounded}
                      onChange={() => updateIsGrounded(false)}
                    />
                    standing
                  </label>
                </div>
              </div>
              <div>
                {Object.entries(ALL_MOVES).map(([k, v]) => (
                  <div key={k}>
                    <label>
                      <input
                        type={"checkbox"}
                        checked={moves[k]}
                        onChange={() =>
                          updateMoves(
                            Object.assign({}, moves, { [k]: !moves[k] })
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
          <div>state: {move}</div>
          <div style={{ flexGrow: 1, position: "relative" }}>
            <Video
              src={`video/${isGrounded ? "grounded" : "standing"}/${move}`}
              refObj={ref}
              backupRef={backupRef}
              prepRandom={prepRandom}
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
        onEnded={() => props.prepRandom()}
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
