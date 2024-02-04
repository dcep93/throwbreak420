import { useState } from "react";

const ALL_MOVES = {
  1: "1 break",
  2: "2 break",
  12: "1+2 break",
};

export default function Main() {
  const [isP1, updateIsP1] = useState(true);
  const [isGrounded, updateIsGrounded] = useState(true);
  const [moves, updateMoves] = useState(
    Object.fromEntries(Object.keys(ALL_MOVES).map((k) => [k, true]))
  );
  const [speed, _updateSpeed] = useState(1);
  const updateSpeed = (s: number) => {
    _updateSpeed(s);
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
      <div>state</div>
      <div style={{ flexGrow: 1, position: "relative" }}>
        <video
          style={{
            position: "absolute",
            height: "100%",
            maxWidth: "100%",
          }}
          autoPlay
          muted
          loop
          //   onEnded={() => alert("gotem")}
        >
          <source src={`video/grounded/1.mkv?${new Date()}`} />
        </video>
      </div>
      <div>buttons</div>
    </div>
  );
}
