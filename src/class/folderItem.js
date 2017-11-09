import React, { Component } from 'react';

class folderItem extends Component {
    render() {
        return (
            <div className='col-xs-6 col-sm-4 col-lg-3 dozuki_grabbag_device_list_item_container' key='back'>
                <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={this.props.name} onClick={this.handleOnClick.bind(this)}>
                    <div className='dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_folder_container' title={this.props.name}>{this.props.name}</div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        <img className='dozuki_grabbag_device_list_section_item_image dozuki_grabbag_device_list_section_item_folder_image' src={this.props.img} alt='' />
                    </div>
                </div>
            </div>
        )
    }

    handleOnClick(event) {
        this.props.handleOnClick(this.props.name, event);
        event.preventDefault();
    }
}

export default folderItem;