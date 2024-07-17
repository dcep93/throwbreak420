import { useState } from "react";
import ControllerListener from "./throwbreak/ControllerListener";

type Data = { timestamp: number; keys: string[] }[];
var data: Data = [];
export default function InputHistory() {
  const [_data, _updateData] = useState(data);
  const updateData = (newData: Data) => {
    newData = newData.slice(-1000);
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
    if (pressed === keys.includes(key)) return;
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
        backgroundColor: "#282a3a",
        height: "100vH",
        width: "100vW",
        display: "flex",
      }}
    >
      <div
        style={{
          margin: "2em",
          flexGrow: 1,
          overflow: "scroll",
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
        <table>
          <tbody>
            {_data
              .slice(1)
              .reverse()
              .map((d, i) => (
                <tr key={i}>
                  <td style={{ paddingRight: "2em" }}>
                    {d.timestamp - _data[0].timestamp}
                  </td>
                  <td>{d.keys.join(" ")}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
