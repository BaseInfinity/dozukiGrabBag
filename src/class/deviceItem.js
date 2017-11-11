import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from './itemTypes';

/**
 * cardSource is used to create a DragSource (react-dnd)
 *
 * @type {{beginDrag: ((props)), endDrag: ((props, monitor))}}
 */
const cardSource = {
    beginDrag(props) {
        return {
            text: props.name
        };
    },
    endDrag(props, monitor) {
        //const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if (dropResult) {
            props.onItemClick(props.name, null);
        }
    },
};

/**
 * collect() is used to create a DragSource (react-dnd)
 *
 * @param connect
 * @param monitor
 * @returns {{connectDragSource: *, isDragging: *}}
 */
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    };
}

/**
 * propTypes - Setup required properties.
 *
 * @type {{name: (*), isDragging: (*), connectDragSource: (*)}}
 */
const propTypes = {
    name: PropTypes.string.isRequired,
    onItemClick: PropTypes.func.isRequired,
    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired
};

/**
 * deviceItem  is used to display a device item in the device list.
 */
class deviceItem extends Component {
    /**
     * render() generates the device item HTML.
     *
     * @returns {connectDragSource} is the content to render, wrapped in a connectDragSource object; Using React JSX.
     */
    render() {
        const {connectDragSource, connectDragPreview, name, img} = this.props;

        return connectDragSource(
            <div className='col-xs-6 col-sm-4 col-lg-3 dozuki_grabbag_device_list_item_container'>
                <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={name} onClick={this.onItemClick.bind(this)}>
                    <div className='dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_device_container' title={name}>{name}</div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        {connectDragPreview(<img className='dozuki_grabbag_device_list_section_item_image dozuki_grabbag_device_list_section_item_device_image' src={img} alt='' />)}
                    </div>
                </div>
            </div>,
            { dropEffect: 'copy' }
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
        event.preventDefault();
    }
}

deviceItem.propTypes = propTypes;

/**
 * default export is wrapped in a DragSource (react-dnd)
 */
export default DragSource(ItemTypes.CARD, cardSource, collect)(deviceItem);
