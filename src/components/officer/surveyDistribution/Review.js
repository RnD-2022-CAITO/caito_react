import React from "react";

export const Review = ({ assignTeachers, clearSchedule }) => {
  return (
    <div>
      <div className="schedule-btns">
        <br></br>
        <button onClick={() => assignTeachers()}>
          Start sending out survey invitation
        </button>
        <button className="warning-btn" onClick={clearSchedule}>
          Discard changes
        </button>
        <br></br>
      </div>
    </div>
  );
};
