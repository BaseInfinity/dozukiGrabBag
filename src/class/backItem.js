import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * propTypes - Setup required properties.
 *
 *  @type {{onBack: (*)}}
 */
const propTypes = {
    onBack: PropTypes.func.isRequired
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
             <div className='col-xs-6 col-sm-4 col-lg-3 dozuki_grabbag_device_list_item_container' key='back'>
                 <div className='dozuki_grabbag_device_list_section_item' name='back' value='back' onClick={this.handleOnClick.bind(this)}>
                    <div className='dozuki_grabbag_device_list_section_item_title'>BACK</div>
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
    handleOnClick(event) {
        const {onBack} = this.props;
        onBack(event);
        event.preventDefault();
    }
}

backItem.propTypes = propTypes;

export default backItem;