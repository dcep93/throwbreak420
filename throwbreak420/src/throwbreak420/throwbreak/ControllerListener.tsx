export default function ControllerListener(
  onKeyDownHelper: (key: string) => void
) {
  window.addEventListener("gamepadconnected", () => {
    const allPressed: { [key: string]: boolean } = {};
    setInterval(() =>
      navigator.getGamepads().forEach((gamepad, i) =>
        Array.from(gamepad?.buttons || []).forEach((button, j) => {
          const key = `controller_${i}_${j}`;
          const pressed =
            typeof button === "object" ? button.pressed : button === 1.0;
          if (pressed && !allPressed[key]) {
            onKeyDownHelper(key);
          }
          allPressed[key] = pressed;
        })
      )
    );
  });
}
