export default function SlicePreview() {
  return (
    <div>
      <video src={`video/4_2_2024/preview.mp4?${Date.now()}`} muted></video>
      <video
        src={`video/4_2_2024/preview.mp4?${Date.now()}`}
        muted
        autoPlay
      ></video>
    </div>
  );
}
