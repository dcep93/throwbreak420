export default function Buttons(props: {
  get: () => {
    possibles: { [k: string]: boolean };
    handleInput: (k: string) => void;
  };
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-around" }}>
      {Object.keys(props.get().possibles).map((k) => (
        <div key={k}>
          <button
            style={{ padding: "1em", fontSize: "xx-large" }}
            onClick={() => props.get().handleInput(k)}
          >
            {k}
          </button>
        </div>
      ))}
    </div>
  );
}
