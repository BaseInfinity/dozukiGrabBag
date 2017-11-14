import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * These are strings use in the UI.  Candidates for being provided by a language system.
 *
 * @type {string}
 */
const STRING_BACK_TITLE  = 'BACK';

/**
 * propTypes - Setup required properties.
 *
 *  @type {{onBack: (*)}}
 */
const propTypes = {
    onItemClick: PropTypes.func.isRequired
};

/**
 * backItem is the 'back' item used in the device list.
 */
class backItem extends Component {
    /**
     * render() generates the the 'back' item HTML.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        return (
             <div className='col-xs-12 sol-sm-6 col-md-4 col-lg-3 dozuki_grabbag_device_list_item_container' key='back'>
                 <div className='dozuki_grabbag_device_list_section_item' name='back' value='back' onClick={this.onItemClick.bind(this)}>
                    <div className='dozuki_grabbag_device_list_section_item_title'>{STRING_BACK_TITLE}</div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        <img className='dozuki_grabbag_device_list_section_item_image' src='/images/back.png' alt='' />
                    </div>
                </div>
            </div>
        )
    }

    /**
     * handleOnClick() passes the event up to the parent.
     *
     * @param event {object} is the click event.
     */
    onItemClick(event) {
        const {onItemClick} = this.props;

        onItemClick('back');

        if (event) {
            event.preventDefault();
        }
    }
}

backItem.propTypes = propTypes;

export default backItem;