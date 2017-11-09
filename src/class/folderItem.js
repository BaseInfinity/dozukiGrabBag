import React, { Component } from 'react';

class folderItem extends Component {
    render() {
        return (
            <div className='col-xs-12 col-sm-6 col-lg-4' key='back'>
                <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={this.props.name} onClick={this.handleOnClick.bind(this)}>
                    <div className='dozuki_grabbag_device_list_section_item_title' title={this.props.name}><i className='fa fa-folder-o pull-left' />{this.props.name}</div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        <img className='dozuki_grabbag_device_list_section_item_image' src={this.props.img} alt='' />
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