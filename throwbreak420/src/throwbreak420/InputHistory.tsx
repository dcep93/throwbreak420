import { useState } from "react";
import ControllerListener from "./throwbreak/ControllerListener";

const msPerFrame = 1000 / 60;

type Data = { time: number; keys: string[] }[];
var data: Data = [];
export default function InputHistory() {
  const [_data, _updateData] = useState(data);
  const updateData = (newData: Data) => {
    newData = newData.slice(-1000);
    data = newData;
    _updateData(newData);
  };
  function reset() {
    updateData([{ time: Date.now(), keys: [] }]);
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
    updateData(data.concat({ time: Date.now(), keys }));
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
          outline: "none",
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
              .reduce(
                (obj, curr, index) => {
                  if (index === 0) {
                    obj.time = curr.time;
                  } else if (index === _data.length - 1) {
                    obj.data.push({ keys: curr.keys, time: 0 });
                  } else {
                    const ageFrames =
                      (_data[index + 1].time - obj.time) / msPerFrame;
                    if (ageFrames >= 1) {
                      obj.data.push({ keys: curr.keys, time: ageFrames });
                      obj.time = curr.time;
                    }
                  }
                  return obj;
                },
                {
                  time: 0,
                  data: [] as Data,
                }
              )
              .data.reverse()
              .map((d, i) => (
                <tr key={i}>
                  <td style={{ paddingRight: "2em" }}>{Math.floor(d.time)}</td>
                  <td>{d.keys.join(" ")}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function quantizeData(data: Data): Data {
  var previous = data[0].time;
  const quantized = data.filter((d, i) => {
    if (i === data.length - 1 || data[i + 1].time - previous > msPerFrame) {
      previous = d.time;
      return true;
    } else {
      return false;
    }
  });
  return quantized;
}
