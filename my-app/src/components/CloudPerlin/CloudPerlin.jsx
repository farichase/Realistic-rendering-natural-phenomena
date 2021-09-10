import classes from './CloudPerlin.module.css'

import React, { Component } from 'react';
import CloudPerlinCode from './CloudPerlinCode.js';

export default class CloudPerlin extends Component {
componentDidMount() {
    CloudPerlinCode(this.scene);
  }
render() {
    return (
      <>
        <div className={classes.cloudP} id="cloudP" ref={element => this.scene = element}>
        </div>  
      </>
    );
  }
}