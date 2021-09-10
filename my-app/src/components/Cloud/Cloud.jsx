import classes from './Cloud.module.css'

import React, { Component } from 'react';
import CloudCode from './CloudCode.js';

export default class Cloud extends Component {
componentDidMount() {
    CloudCode(this.scene);
  }
render() {
    return (
      <>
        <div className={classes.cloud} id="cloud" ref={element => this.scene = element} />
      </>
    );
  }
}