import classes from './Snow.module.css'

import React, { Component } from 'react';
import SnowCode from './SnowCode.js';

export default class Snow extends Component {
componentDidMount() {
    SnowCode(this.scene);
  }
render() {
    return (
      <>
        <div className={classes.snow} id="snow" ref={element => this.scene = element} />
      </>
    );
  }
}
