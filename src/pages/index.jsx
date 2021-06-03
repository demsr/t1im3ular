import { useTimeular } from "../context/TimeularContext";
import Emoji from "../components/emoji";

export default function Page() {
  const { state, connect } = useTimeular();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        backgroundColor: state.connected ? "#238636" : "#b62324",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 20,
          fontSize: 30,
          display: state.battery ? "block" : "none",
        }}
      >
        <Emoji symbol="🔋" label="battery" /> {state.battery ?? 0}%
      </div>
      <div
        style={{
          position: "absolute",
          right: 20,
          top: 20,
          fontSize: 30,
          display: state.battery ? "block" : "none",
        }}
      >
        <Emoji symbol={state.side === 0 ? "💤" : "⏱️"} label="stopwatch" />
      </div>

      {state.connected ? (
        state.side !== null ? (
          <div style={{ fontSize: 90 }}>{state.side}</div>
        ) : (
          <div style={{ fontSize: 90 }}>I'll be ready momentarily</div>
        )
      ) : state.connecting ? (
        <div>waiting for connection</div>
      ) : (
        <button onClick={connect}>
          Connect your Tracker
          <Emoji symbol="⏱️" label="stopwatch" />
        </button>
      )}
    </div>
  );
}
