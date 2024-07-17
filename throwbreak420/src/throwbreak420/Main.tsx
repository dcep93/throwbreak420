import { BrowserRouter, Route, Routes } from "react-router-dom";
import InputHistory from "./InputHistory";
import SlicePreview from "./SlicePreview";
import ThrowBreak from "./throwbreak/ThrowBreak";

export default function Main() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<ThrowBreak />} />
        <Route path="SlicePreview" element={<SlicePreview />} />
        <Route path="InputHistory" element={<InputHistory />} />
      </Routes>
    </BrowserRouter>
  );
}
