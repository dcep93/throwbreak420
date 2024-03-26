export default function ControllerListener(
  onKeyDownHelper: (key: string) => void
) {
  window.addEventListener("gamepadconnected", (e) => {
    const allPressed: { [key: string]: boolean } = {};
    setInterval(() => {
      Array.from(e.gamepad.buttons).forEach((button, i) => {
        const key = `controller_${i}`;
        const pressed =
          typeof button === "object" ? button.pressed : button === 1.0;
        if (pressed && !allPressed[key]) {
          alert(JSON.stringify({ key, pressed, button, allPressed }));
          onKeyDownHelper(key);
        }
        allPressed[key] = pressed;
      });
    });
  });
}
