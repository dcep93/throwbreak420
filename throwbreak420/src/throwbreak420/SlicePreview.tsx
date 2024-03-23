export default function SlicePreview() {
  return (
    <div>
      <video src={`video/preview.mp4?${Date.now()}`} muted></video>
      <video src={`video/preview.mp4?${Date.now()}`} muted autoPlay></video>
    </div>
  );
}
