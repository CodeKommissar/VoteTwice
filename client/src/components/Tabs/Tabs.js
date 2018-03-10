import React from 'react';
import { NavLink } from "react-router-dom";

import './Tabs.css';

const Tabs = () => (
  <div className="Tabs">

    <NavLink exact to="/" className="link vote" activeClassName="selected">
      <div className="vote-border">
        <p className="tab">
          Vote
        </p>
      </div>
    </NavLink>
    <div className="dashed-border"></div>
    <NavLink exact to="/results" className="link results" activeClassName="selected">  
      <div className="results-border">
        <p className="tab">
          Results
        </p>
      </div>
    </NavLink>

  </div>
);

export default Tabs;