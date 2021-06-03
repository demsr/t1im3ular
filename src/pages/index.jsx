import { useState, useRef } from "react";
import { useTimeular } from "../context/TimeularContext";
import { useTracking } from "../context/TrackingContext";
import Emoji from "../components/emoji";
import { useEffect } from "react";
import { DateTime } from "luxon";

export default function Page() {
  const { state: TimeState } = useTimeular();
  const { state: TrackingState } = useTracking();

  const [timer, setTimer] = useState(0);

  const increment = useRef(null);

  useEffect(() => {
    if (TrackingState.isTracking) {
      handleReset();
      handleStart();
    } else {
      handlePause();
    }
  }, [TrackingState]);

  const handleStart = () => {
    increment.current = setInterval(() => {
      var start = DateTime.fromMillis(TrackingState.startTime);
      var end = DateTime.now();
      var diff = end.diff(start, ["hours", "minutes", "seconds"]);
      setTimer(diff);
    }, 1);
  };

  const handlePause = () => {
    clearInterval(increment.current);

    if (TrackingState.startTime) {
      var start = DateTime.fromMillis(TrackingState.startTime);
      var end = DateTime.now();
      var diff = end.diff(start, ["hours", "minutes", "seconds"]);
      console.log("Timespan: ", diff.toObject());
    }
  };

  const handleReset = () => {
    clearInterval(increment.current);
    setTimer(0);
  };

  const formatTime = () => {
    const seconds = `${Math.floor(timer / 1000)}`;
    const getSeconds = `0${Math.floor(seconds % 60)}`.slice(-2);
    const minutes = `${Math.floor(timer / 60000)}`;
    const getMinutes = `0${minutes % 60000}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600000)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds} `;
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <div style={{ display: "flex" }}>
        <div style={{ fontSize: 70, textAlign: "center" }}>
          {TrackingState.isTracking
            ? TimeState.tracker?.sides.find((x) => x.side === TimeState.side)
                ?.name ?? `Side ${TimeState.side}`
            : "Not Tracking"}
        </div>
      </div>
      <div style={{ fontSize: 90 }}>{formatTime()}</div>
    </div>
  );
}
