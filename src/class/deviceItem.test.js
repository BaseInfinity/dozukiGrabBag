import React from 'react';
import ReactDOM from 'react-dom';
//import ReactDOMServer from 'react-dom/server';
import DeviceItem from './deviceItem.js';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
//import { shallow } from 'enzyme';
import expect from 'expect';
import TestUtils from 'react-dom/test-utils';

describe('Test DeviceItem', () => {
    const name = 'test device item';
    const img  = '/images/DeviceNoImage_300x225.jpg';
    const wrapper   = document.createElement('div');
    const itemClick = jest.fn();
    const itemAdd = jest.fn();
    const identity  = el => el;
    // Can't have multiple backends with the DnD stuff.  Render one here and reuse it.
    let root        = ReactDOM.render(<DragDropContextProvider backend={HTML5Backend}><DeviceItem name={name} childCount={1} guideCount={1} onItemAdd={itemAdd} onItemClick={itemClick} img={img} connectDragSource={identity} /></DragDropContextProvider>, wrapper);

    it("Renders 'fully' without crashing", () => {
        // Confirm the full rendering
//        expect(wrapper.innerHTML === '<div class="col-xs-12 sol-sm-6 col-md-4 col-lg-3 dozuki_grabbag_device_list_item_container" draggable="true"><div class="dozuki_grabbag_device_list_section_item" name="currentCategory" value="test device item"><div class="dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_device_container" title="test device item">test device item</div><div class="dozuki_grabbag_device_list_section_item_body"><img class="dozuki_grabbag_device_list_section_item_image dozuki_grabbag_device_list_section_item_device_image" src="/images/DeviceNoImage_300x225.jpg" alt=""></div></div></div>').toEqual(true);

        // Confirm the img src... it will have local host prefixed.
        let imgElement = TestUtils.findRenderedDOMComponentWithTag(root, 'img');
        expect(imgElement.src).toEqual('http://localhost' + img);
    });

    it('Handles the click event', () => {
        // simulate clicking on the image
        let imgElement = TestUtils.findRenderedDOMComponentWithTag(root, 'img');
        TestUtils.Simulate.click(imgElement);

        // Confirm call was made
        expect(itemClick.mock.calls.length).toEqual(1);
        // Confirm call was made with 'name'
        expect(itemClick.mock.calls[0][0]).toEqual(name);
    });
});
