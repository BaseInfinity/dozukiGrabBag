import React, { Component } from 'react';

class backItem extends Component {
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
    
    handleOnClick(event) {
        this.props.onBack(event);
        event.preventDefault();
    }
}

export default backItem;