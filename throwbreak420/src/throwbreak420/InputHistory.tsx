import { useState } from "react";
import ControllerListener from "./throwbreak/ControllerListener";

type Data = { timestamp: number; keys: string[] }[];
var data: Data = [];
export default function InputHistory() {
  const [_data, _updateData] = useState(data);
  const updateData = (newData: Data) => {
    data = newData;
    _updateData(newData);
  };
  function reset() {
    updateData([{ timestamp: Date.now(), keys: [] }]);
  }
  function update(key: string, pressed: boolean) {
    if (key === "Escape") {
      if (pressed) {
        reset();
      }
      return;
    }
    const keys = data[data.length - 1].keys.slice();
    if (pressed) {
      keys.push(key);
    } else {
      keys.splice(keys.indexOf(key), 1);
    }
    updateData(data.concat({ timestamp: Date.now(), keys }));
  }
  return (
    <div
      style={{
        fontFamily: "Courier New",
        color: "#f3f3f8",
        height: "100vH",
        width: "100vW",
        display: "flex",
      }}
    >
      <div
        style={{
          margin: "2em",
          backgroundColor: "#282a3a",
          alignSelf: "stretch",
          flexGrow: 1,
        }}
        tabIndex={1}
        ref={(c) => {
          if (data.length === 0) reset();
          c?.focus();
          ControllerListener(update);
        }}
        onKeyDown={(e) => update(e.key, true)}
        onKeyUp={(e) => update(e.key, false)}
      >
        InputHistory
      </div>
    </div>
  );
}
