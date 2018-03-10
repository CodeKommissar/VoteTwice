import React, { Component } from "react";
import Countdown from 'react-countdown-now';
import { connect } from "react-redux";
import * as actions from "../../../actions";

import "./VoteButton.css";

class VoteButton extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }

  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <span><a href="/auth/reddit">Login With Reddit to Vote!</a></span>
        );
      default:
        if(Date.now() - Date.parse(this.props.auth.lastTimeVoted) < (1000 * 60 * 60 * 10)) {
          return (
            <span className="vote-button-wait">
              You must wait
              <br />
              <Countdown 
                date={Date.now() + ((1000 * 60 * 60 * 10) - (Date.now() - Date.parse(this.props.auth.lastTimeVoted)))} 
                renderer={({ hours, minutes, seconds }) => <span>{hours}:{minutes}:{seconds}</span>}
              />
              <br />
              to vote again :(
            </span>
          )
        } else {
          return (
            <span 
              onClick={this.props.onSubmitVotes} 
              className="vote-button-text"
            >
              Submit Vote!
            </span>
          )
        }
    }
  }

  render() {
    return (
      <div className="VoteButton">
        {this.renderContent()}
      </div>
    )
  }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps, actions)(VoteButton);