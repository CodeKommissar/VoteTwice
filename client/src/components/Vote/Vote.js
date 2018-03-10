import React, { Component } from 'react';
import axios from "axios";
import { BounceLoader } from 'react-spinners';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import VoteButton from "./VoteButton/VoteButton";
import SubmittedButton from "./SubmittedButton/SubmittedButton";
import "./Vote.css";

const API = "/api/members";

// function to add the numbers of votes that should be added to each member
const addNumberOfVotes = (arr) => {
  return arr.map((member, index) => {
    return { ...member, extraVotes: Math.abs(index - arr.length) }
  })
}

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getMemberStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? 'lightgreen' : '#fc5d9d',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'pink',
  padding: grid,
  width: 250,
});

class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: [],
      hasAlreadyVoted: false
    };
    this.onDragEnd = this.onDragEnd.bind(this);
    this.submitVotes = this.submitVotes.bind(this);
  }

  componentDidMount() {
    try {
      const json = localStorage.getItem("existingMembers");
      const members = JSON.parse(json);

      if (members) {
        const membersWithVotes = addNumberOfVotes(members);
        this.setState(() => ({ members: membersWithVotes }));
      } else {
        axios.get(API)
          .then(res => {
            const json = JSON.stringify(res.data);
            localStorage.setItem("existingMembers", json);
            const membersWithVotes = addNumberOfVotes(res.data);
            this.setState({ members: membersWithVotes });
          });
      }
    } catch (e) {
      // Do nothing at all
    }
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const members = reorder(
      this.state.members,
      result.source.index,
      result.destination.index
    );

    const membersWithVotes = addNumberOfVotes(members);

    this.setState({
      members: membersWithVotes
    });
  }

  submitVotes(members) {
    this.setState({
      hasAlreadyVoted: true
    });
    axios.put(API, members)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
      <div className="Vote">
        {
          this.state.members.length === 0 
            ?
            <div className='center-content'>
              <BounceLoader
                color={'pink'}
                loading={true}
                size={500}
              />
            </div>
            :
            <div>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {this.state.members.map((member, index) => (
                        <Draggable key={member.id} draggableId={member.id} index={index}>
                          {(provided, snapshot) => (
                            <div>
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getMemberStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                                className="member"
                              >
                                <img src={member.picturePath} alt={member.name}
                                  style={{ height: "80px", borderRadius: "8px", marginRight: "8px" }}
                                />
                                <div className="member-text">
                                  <span className="member-name">{member.name}</span>
                                  <span className="member-votes">Your votes: {member.extraVotes}</span>
                                </div>
                              </div>
                              {provided.placeholder}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
              {this.state.hasAlreadyVoted
                ? <SubmittedButton />
                : <VoteButton onSubmitVotes={() => this.submitVotes(this.state.members)} />
              }
            </div>
        }
      </div>
    );
  }
}

export default Vote;
