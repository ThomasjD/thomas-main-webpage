import React from "react";

import { Link } from "react-router-dom";

const ProfileActions = () => {
  return (
    <div className="btn-group mb-4" role="group">
      <Link to=" " className="btn btn-light">
        <i classname="fas fa-user-circle text-info mr-1" /> Edit Profile
      </Link>

      <Link to="/add-places-visited" className="btn btn-light">
        <i className=" fab fa-black-tie text-info mr-1" /> Add Places Visited
      </Link>
    </div>
  );
};

export default ProfileActions;
