import { VERSION } from "./Main";

export default function UserGuide(props: {
  updateUserGuideIsOpen: (userGuideIsOpen: boolean) => void;
}) {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        overflow: "scroll",
      }}
    >
      <div style={{ alignSelf: "center", flexGrow: 1, maxHeight: "100%" }}>
        <div
          style={{
            maxWidth: "40em",
            margin: "auto",
          }}
        >
          <h1>ThrowBreak420 v{VERSION}</h1>
          <h3
            onClick={() => props.updateUserGuideIsOpen(false)}
            style={{ cursor: "pointer" }}
          >
            click here to continue
          </h3>
          <div>
            <a
              style={{ color: "white" }}
              href={
                "https://www.reddit.com/r/Tekken/comments/1avreg9/announcing_throwbreak420_an_online_tool/?"
              }
            >
              reddit post
            </a>
          </div>
          <div>
            <a
              style={{ color: "white" }}
              href={"https://github.com/dcep93/throwbreak420/"}
            >
              source code
            </a>
          </div>
          <p>
            if you're like me, breaking a throw in a match is impossible, and
            even in practice mode, it's too fast and subtle to distinguish which
            arm it was!
          </p>
          <p>
            this tool has several features to train us stoners on how to
            recognize throws, and maybe someday, we will be able to consitently
            break them in a match
          </p>
          <ul>
            <li>control speed</li>
            <li>
              see which frame you pressed - were you close? throws have a 20
              frame break window
            </li>
            <li>practice on any browser, even mobile</li>
            <li>record your streak, brag to your wife's boyfriend</li>
            <li>
              ideally, there would be a random delay before the throw is done,
              but it hasn't been implemented yet
            </li>
            <li>
              short delay if you got the break correct, long delay if you missed
              the break
            </li>
          </ul>
          <div>
            <div>UPDATE LOG:</div>
            <ul>
              <li>press 1 and 2 at the same time to trigger 1+2</li>
              <li>remote debug capabilities</li>
              <li>KING</li>
              <li>shows history</li>
              <li>better video caching</li>
              <li>displays correctness background color</li>
              <li>records highest streak</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
