import React from "react";
import { Link } from "react-router-dom";

//show teacher's information
const AccountInfo = (props) => {
  const { user, data } = props;

  return (
    <div className="profile-section">
      <h3>
        {data.firstName} {data.lastName}
      </h3>
      <h5 style={{ textTransform: "capitalize" }}>{data.role}</h5>
      <p>Email: {user.email}</p>
      <Link to="/edit-password">
        <button className="edit-btn">Change password</button>
        <br></br>
      </Link>
    </div>
  );
};
export default AccountInfo;
