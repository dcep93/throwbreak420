import { ReactNode } from "react";
import { historyLog } from "./ThrowBreak";
import css from "./index.module.css";

export default function Center(props: {
  children: ReactNode;
  get: () => {
    isLoading: boolean;
    lastAnswer: string;
    lastInput: string;
    lastFrame: number;
    streak: number;
    highestStreak: number;
    updateUserGuideIsOpen: (userGuideIsOpen: boolean) => void;
  };
}) {
  return (
    <div
      className={css.dual_center}
      style={{
        opacity: props.get().isLoading ? 0 : undefined,
        height: "100%",
        width: "100%",
        display: "flex",
      }}
    >
      <div
        style={{
          paddingLeft: "2em",
          width: "14em",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>
          <div>answer: {props.get().lastAnswer}</div>
          <div>input: {props.get().lastInput}</div>
          <div>frame: {props.get().lastFrame}</div>
          <div>streak: {props.get().streak}</div>
          <div style={{ paddingTop: "1em" }}>
            highest streak: {props.get().highestStreak}
          </div>
          <div>
            <button
              style={{ cursor: "pointer" }}
              onClick={() => props.get().updateUserGuideIsOpen(true)}
            >
              User Guide
            </button>
          </div>
        </div>
        <div
          className={css.hidden_on_tall}
          style={{
            flexGrow: 1,
            position: "relative",
            overflow: "scroll",
            paddingTop: "5em",
          }}
        >
          <div>HISTORY</div>
          <table
            style={{
              fontSize: "small",
              position: "absolute",
            }}
          >
            <thead>
              <tr>
                <td>answer</td>
                <td>input</td>
                <td>frame</td>
                <td>streak</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {historyLog
                .slice()
                .reverse()
                .map((o, i) => (
                  <tr key={i}>
                    <td>{o.answer}</td>
                    <td>{o.button}</td>
                    <td>{o.frame}</td>
                    <td>{o.streak}</td>
                    <td>{o.correctness}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        style={{
          flexGrow: 1,
          position: "relative",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
