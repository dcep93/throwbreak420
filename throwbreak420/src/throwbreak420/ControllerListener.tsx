export default function ControllerListener(
  onKeyDownHelper: (key: string) => void
) {
  window.addEventListener("gamepadconnected", (e) => {
    const allPressed: { [key: string]: boolean } = {};
    setInterval(() => {
      Array.from(e.gamepad.buttons).forEach((button, i) => {
        const index = i.toString();
        const pressed =
          typeof button === "object" ? button.pressed : button === 1.0;
        if (pressed && !allPressed[index]) {
          onKeyDownHelper(index);
        }
        allPressed[index] = pressed;
      });
    });
  });
}
