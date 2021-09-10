import classes from './Phenomena.module.css'
import { NavLink } from 'react-router-dom';

function Phenomena() {
  return (
    <nav className={classes.content}>
      <div className={classes.item}>
        <NavLink activeClassName={classes.activeL} to='/rain'>Rain</NavLink>
      </div>
      <div className={classes.item}>
        <NavLink activeClassName={classes.activeL} to='/snow'>Snow</NavLink>
      </div>
      <div className={classes.item}>
        <NavLink activeClassName={classes.activeL} to='/cloud'>Cumulus cloud</NavLink>
      </div>
      <div className={classes.item}>
        <NavLink activeClassName={classes.activeL} to='/cloudPerlin'>Cloudy sky</NavLink>
      </div>
    </nav>
  );
}

export default Phenomena;