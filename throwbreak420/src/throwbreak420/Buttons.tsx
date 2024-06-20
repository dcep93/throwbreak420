export default function Buttons(props: {
  get: () => {
    possibles: { [k: string]: boolean };
    handleInput: (k: string) => void;
  };
}) {
  return (
    <div style={{ display: "flex", backgroundColor: "black" }}>
      <div
        style={{
          margin: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            margin: "20px ",
          }}
        >
          {Object.keys(props.get().possibles).map((k) => (
            <div key={k}>
              <button
                style={{
                  padding: "1em",
                  borderRadius: "100%",
                  fontSize: "xx-large",
                  margin: "0 25px",
                }}
                onClick={() => props.get().handleInput(k)}
              >
                {k}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
