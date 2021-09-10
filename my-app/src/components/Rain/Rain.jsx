import classes from './Rain.module.css'

import React, { Component } from 'react';
import RainCode from './RainCode.js';

export default class Rain extends Component {
componentDidMount() {
    RainCode(this.scene);
  }
render() {
    return (
      <>
        <div className={classes.rain} id="rain" ref={element => this.scene = element} />
      </>
    );
  }
}
