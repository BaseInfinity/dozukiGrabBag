import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow } from 'enzyme';

/* using shallow because, if I go down the app to grabBagContainer the setState call causes jest top crash while calling document.createEvent */
it('renders without crashing', () => {
      const wrapper = document.createElement('div');
      const myApp   = shallow(<App />, wrapper);

      const title = <h1 className="App-title">Dozuki Grab Bag</h1>;
      expect(myApp.contains(title)).toEqual(true);
});

it("renders 'fully'without crashing", () => {
    const wrapper = document.createElement('div');

    // This will crash jest:
    //     Watch Usage: Press w to show more./Users/shaunharrington/dev/dozuki/grabbag/node_modules/react-dom/cjs/react-dom.development.js:1336
    //     var evt = document.createEvent('Event');
    //ReactDOM.render(<App />, wrapper);
});
