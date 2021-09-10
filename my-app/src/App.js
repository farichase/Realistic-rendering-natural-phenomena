import './App.css';
import './App.css';
import Phenomena from './components/Phenomena/Phenomena';
import Rain from './components/Rain/Rain';
import Snow from './components/Snow/Snow';
import { Route, BrowserRouter } from 'react-router-dom';
import Cloud from './components/Cloud/Cloud';
import CloudPerlin from './components/CloudPerlin/CloudPerlin';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <div></div> 
        <div className='centreColumn'>
          <div className='header'>Natural phenomena</div>
          <div classNam='row'>
            <Phenomena/>
            <div className='content'>
              <Route path='/rain' render={() => <Rain/>}/>
              <Route path='/snow' render={() => <Snow/>}/>
              <Route path='/cloud' render={() => <Cloud/>}/>
              <Route path='/cloudPerlin' render={() => <CloudPerlin/>}/>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
