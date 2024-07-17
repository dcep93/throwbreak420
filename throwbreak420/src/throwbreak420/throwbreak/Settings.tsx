export default function Settings(props: {
  get: () => {
    isP1: boolean;
    updateIsP1: (isP1: boolean) => void;
    isStanding: boolean;
    updateIsStanding: (isStanding: boolean) => void;
    possibles: { [k: string]: boolean };
    updatePossibles: (possibles: { [k: string]: boolean }) => void;
    speed: number;
    updateSpeed: (speed: number) => void;
  };
}) {
  return (
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
                  checked={t === props.get().isP1}
                  onChange={() => props.get().updateIsP1(t)}
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
                  checked={t === props.get().isStanding}
                  onChange={() => props.get().updateIsStanding(t)}
                />
                {t ? "standing" : "grounded"}
              </label>
            </div>
          ))}
        </div>
        <div>
          {Object.entries(props.get().possibles).map(([k, v]) => (
            <div key={k}>
              <label>
                <input
                  type={"checkbox"}
                  checked={v}
                  onChange={() =>
                    props.get().updatePossibles(
                      Object.assign({}, props.get().possibles, {
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
          <div>speed: {props.get().speed.toFixed(2)}</div>
          <div>
            <button
              disabled={props.get().speed <= 0.2}
              onClick={() => props.get().updateSpeed(props.get().speed - 0.05)}
            >
              ➖
            </button>
            <button
              disabled={props.get().speed >= 2}
              onClick={() => props.get().updateSpeed(props.get().speed + 0.05)}
            >
              ➕
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
