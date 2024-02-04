export default function Main() {
  return (
    <video autoPlay muted>
      <source src={`video/grounded/1.mkv?${new Date()}`} />
    </video>
  );
}
