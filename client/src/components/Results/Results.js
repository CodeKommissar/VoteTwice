import React, { Component } from 'react';
import axios from "axios";
import { BounceLoader } from 'react-spinners';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import "./Results.css";

const API = "/api/members";
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

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      members: []
    };
  }

  componentDidMount() {
    axios.get(API)
      .then(res => {
        const orderedMembersByVote = res.data.sort((a, b) => b.votes - a.votes);
        this.setState({ members: orderedMembersByVote });
      });
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    return (
        <div className="Results">
          {
            this.state.members.length === 0 ?
              <div className='center-content'>
                <BounceLoader
                  color={'pink'}
                  loading={true}
                  size={500}
                />
              </div>
            :
              <DragDropContext>
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
                                  <span className="member-votes">Total votes: {member.votes}</span>
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
          }
        </div>
    );
  }
}

export default Results;
