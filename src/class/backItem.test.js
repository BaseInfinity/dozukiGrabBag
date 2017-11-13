import React from 'react';
import ReactDOM from 'react-dom';
import BackItem from './backItem.js';
import { shallow } from 'enzyme';
import expect from 'expect';

/**
 * This is really simple... all the object does is display a name, an image, and sends up a click event
 */
describe('Test BackItem', () => {
    const name = 'back';
    const img  = '%PUBLIC_URL%/images/DeviceNoImage_300x225.jpg';
    const title = <div className='dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_folder_container' title=''>{name}</div>;
    const itemClick = jest.fn();

    it("Renders 'fully' without crashing", () => {
        const wrapper = document.createElement('div');

        ReactDOM.render(<BackItem onItemClick={itemClick}  />, wrapper);

        // Confirm the generated HTML includes the name and the image
        expect(wrapper.innerHTML === '<div class="col-xs-6 col-sm-4 col-lg-3 dozuki_grabbag_device_list_item_container"><div class="dozuki_grabbag_device_list_section_item" name="back" value="back"><div class="dozuki_grabbag_device_list_section_item_title">BACK</div><div class="dozuki_grabbag_device_list_section_item_body"><img class="dozuki_grabbag_device_list_section_item_image" src="/images/back.png" alt=""></div></div></div>').toEqual(true);

        // Confirm the inner content
        expect(title.props.children).toEqual(name);
    });

    it('Handles the click event', () => {
        const wrapper = document.createElement('div');

        const folderItem = shallow(<BackItem onItemClick={itemClick} />, wrapper);
        folderItem.find('.dozuki_grabbag_device_list_section_item').simulate('click');

        // onItemClick was called once (1)
        expect(itemClick.mock.calls.length).toEqual(1);

        // the value passed to onItemClick is 'test folder item'
        expect(itemClick.mock.calls[0][0]).toEqual(name);
    });
});
