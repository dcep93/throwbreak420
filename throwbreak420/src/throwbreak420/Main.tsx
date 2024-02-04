export default function Main() {
  return (
    <div>
      <div>config</div>
      <div>state</div>
      <div>
        <video autoPlay muted>
          <source src={`video/grounded/1.mkv?${new Date()}`} />
        </video>
      </div>
      <div>buttons</div>
    </div>
  );
}
