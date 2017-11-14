import React from 'react';
import ReactDOM from 'react-dom';
import FolderItem from './folderItem.js';
import { shallow } from 'enzyme';
import expect from 'expect';

/**
 * This is really simple... all the object does is display a name, an image, and sends up a click event
 */
describe('Test FolderItem', () => {
    const name = 'test folder item';
    const img  = '%PUBLIC_URL%/images/DeviceNoImage_300x225.jpg';
    const title = <div className='dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_folder_container' title=''>{name}</div>;
    const itemClick = jest.fn();

    it("Renders 'fully' without crashing", () => {
        const wrapper = document.createElement('div');

        ReactDOM.render(<FolderItem name={name} onItemClick={itemClick} img={img} />, wrapper);

        // Confirm the generated HTML includes the name and the image
        expect(wrapper.innerHTML.toString().search('<div class="dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_folder_container" title="test folder item">test folder item</div>')).toEqual(193);

        // Confirm the inner content
        expect(title.props.children).toEqual(name);

    });

    it('Handles the click event', () => {
        const wrapper = document.createElement('div');

        const folderItem = shallow(<FolderItem name={name} onItemClick={itemClick} img={img}/>, wrapper);
        folderItem.find('.dozuki_grabbag_device_list_section_item').simulate('click');

        // onItemClick was called once (1)
        expect(itemClick.mock.calls.length).toEqual(1);

        // the value passed to onItemClick is 'test folder item'
        expect(itemClick.mock.calls[0][0]).toEqual(name);
    });
});
