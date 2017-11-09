import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import GrabBagContainer from './class/grabBagContainer.js';

/**
 * A very simple application framework.
 */
class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Dozuki Grab Bag</h1>
                </header>
                <GrabBagContainer/>
            </div>
        );
    }
}

export default App;
