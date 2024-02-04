import { createRef, useEffect, useState } from "react";

const ALL_MOVES = {
  1: "1 break",
  2: "2 break",
  12: "1+2 break",
};

var initialized = false;

export default function Main() {
  const ref = createRef<HTMLVideoElement>();
  const [isP1, updateIsP1] = useState(true);
  const [isGrounded, updateIsGrounded] = useState(true);
  const [moves, updateMoves] = useState(
    Object.fromEntries(Object.keys(ALL_MOVES).map((k) => [k, true]))
  );
  const [speed, _updateSpeed] = useState(1);
  const updateSpeed = (s: number) => {
    _updateSpeed(s);
    ref.current!.playbackRate = s;
  };
  const [move, updateMove] = useState("");
  const playRandom = () => {
    const choices = Object.entries(moves)
      .map(([k, v]) => ({ k, v }))
      .filter(({ v }) => v)
      .map(({ k }) => k);
    const _move = choices[Math.floor(Math.random() * choices.length)];
    if (_move === undefined) {
      initialized = false;
      return;
    }
    updateMove(_move);
    ref.current!.src = `video/${
      isGrounded ? "grounded" : "standing"
    }/${_move}.mkv`;
  };
  return (
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
                      updateMoves(Object.assign({}, moves, { [k]: !moves[k] }))
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
        <Video refObj={ref} playRandom={playRandom} />
      </div>
      <div>buttons</div>
    </div>
  );
}

function Video(props: {
  refObj: React.RefObject<HTMLVideoElement>;
  playRandom: () => void;
}) {
  useEffect(() => {
    if (initialized || !props.refObj?.current) return;
    initialized = true;
    props.playRandom();
  }, [props]);
  return (
    <video
      ref={props.refObj}
      style={{
        position: "absolute",
        height: "100%",
        maxWidth: "100%",
      }}
      autoPlay
      muted
      onEnded={() => props.playRandom()}
    ></video>
  );
}
