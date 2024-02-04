export default function Main() {
  return (
    <div style={{ height: "100vH", display: "flex", flexDirection: "column" }}>
      <div>config</div>
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
        >
          <source src={`video/grounded/1.mkv?${new Date()}`} />
        </video>
      </div>
      <div>buttons</div>
    </div>
  );
}
