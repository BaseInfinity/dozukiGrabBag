import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from './itemTypes';

const cardSource = {
    beginDrag(props) {
        return {
            text: props.text
        };
    },
    endDrag(props, monitor) {
        //const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if (dropResult) {
            props.handleOnClick(props.name, null);
        }
    },
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

const propTypes = {
    name: PropTypes.string.isRequired,

    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
};

class deviceItem extends Component {
    render() {

        const { connectDragSource, name, img} = this.props;

        return connectDragSource(
            <div className='col-xs-6 col-sm-4 col-lg-3 dozuki_grabbag_device_list_item_container'>
                <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={name} onClick={this.handleOnClick.bind(this)}>
                    <div className='dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_device_container' title={name}>{name}</div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        <img className='dozuki_grabbag_device_list_section_item_image dozuki_grabbag_device_list_section_item_device_image' src={img} alt='' />
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

deviceItem.propTypes = propTypes;

export default DragSource(ItemTypes.CARD, cardSource, collect)(deviceItem);
