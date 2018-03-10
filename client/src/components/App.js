import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";

import Tabs from "./Tabs/Tabs";
import Vote from "./Vote/Vote";
import Results from "./Results/Results";

import "./App.css";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <h1 className="title">Vote Twice</h1>
            <Tabs />
            <Route exact path="/" component={Vote} />
            <Route exact path="/results" component={Results} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
};

export default connect(null, actions)(App);