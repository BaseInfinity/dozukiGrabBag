import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * propTypes - Setup required properties.
 *
 * @type {{name: (*), img: (*), handleOnClick: (*)}}
 */
const propTypes = {
    name: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    onItemClick: PropTypes.func.isRequired
};

/**
 * folderItem is used to display a folder item in the device list.
 *
 * A 'folder' is defined as any catalog item that does not have children
 */
class folderItem extends Component {
    /**
     * render() generates the folder item HTML.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        const {name, img} = this.props;

        return (
            <div className='col-xs-6 col-sm-4 col-lg-3 dozuki_grabbag_device_list_item_container'>
                <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={name} onClick={this.onItemClick.bind(this)}>
                    <div className='dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_folder_container' title={name}>{name}</div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        <img className='dozuki_grabbag_device_list_section_item_image dozuki_grabbag_device_list_section_item_folder_image' src={img} alt='' />
                    </div>
                </div>
            </div>
        )
    }

    /**
     * onItemClick() passes the event up to the parent.
     *
     * @param event {object} is the click event.
     */
    onItemClick(event) {
        const {name, onItemClick} = this.props;

        onItemClick(name, event);
        if (event) {
            event.preventDefault();
        }
    }
}

folderItem.propTypes = propTypes;

export default folderItem;