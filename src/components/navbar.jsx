import { useTimeular } from "../context/TimeularContext";
import { useTracking } from "../context/TrackingContext";
import Emoji from "../components/emoji";
import { useHistory } from "react-router-dom";

export default function Navbar() {
  const { state: timeState } = useTimeular();
  const { state: trackingState } = useTracking();

  let history = useHistory();
  return (
    <div
      style={{
        display: "flex",
        boxShadow: "0 4px 4px rgb(0 0 0 / 40%)",
        padding: "10px 5px",
      }}
    >
      <div
        style={{ display: "flex", flex: "1 0 0", justifyContent: "flex-start" }}
      ></div>
      <div style={{ display: "flex", flex: "1 1 0", justifyContent: "center" }}>
        <div
          style={{
            fontSize: 30,
            display: timeState.battery ? "block" : "none",
            cursor: "pointer",
          }}
          onClick={() => history.push("/")}
        >
          <Emoji
            symbol={trackingState.isTracking ? "⏱️" : "💤"}
            label="stopwatch"
          />
        </div>
      </div>
      <div
        style={{ display: "flex", flex: "1 0 0", justifyContent: "flex-end" }}
      >
        <div
          onClick={() => history.push("/config")}
          style={{
            fontSize: 30,
            cursor: "pointer",
          }}
        >
          <Emoji symbol="⚙️" label="settings" />
        </div>
        <div
          style={{
            fontSize: 30,
            display: timeState.battery ? "block" : "none",
          }}
        >
          <Emoji symbol="🔋" label="battery" /> {timeState.battery ?? 0}%
        </div>
      </div>
    </div>
  );
}
