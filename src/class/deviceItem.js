import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from './itemTypes';
import {Button} from 'reactstrap';

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
            props.onItemAdd(props.name, null);
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
    img: PropTypes.string.isRequired,
    onItemAdd: PropTypes.func.isRequired,
    onItemClick: PropTypes.func.isRequired,
    childCount: PropTypes.number.isRequired,
    guideCount: PropTypes.number.isRequired,
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
        const {connectDragSource, connectDragPreview, name, img, childCount, guideCount} = this.props;

        let itemTypeMark = ''; // Could find a good one for leaves.  Tried briefcase... nothing is better.
        if (childCount) {
            itemTypeMark = "\uD83D\uDCC1"; // FOLDER
        }
        return connectDragSource(
            <div className='dozuki_grabbag_device_list_item_container'>
                <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={name} onClick={this.onItemClick.bind(this)}>
                    <div className='dozuki_grabbag_device_list_section_item_title' title={name}>{itemTypeMark} {name}</div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        <div className='dozuki_grabbag_device_list_section_item_bubble'>
                            {connectDragPreview(<img className='dozuki_grabbag_device_list_section_item_image dozuki_grabbag_device_list_section_item_device_image' src={img} alt='' />)}
                        </div>
                        <div className="dozuki_grabbag_device_button_container">
                            <Button onClick={this.onItemAdd.bind(this)}  color="primary" size="sm" className="dozuki_grabbag_remove_button" block>ADD</Button>
                        </div>
                        <div className="dozuki_grabbag_device_guide_count">
                            ({guideCount} guides)
                        </div>
                    </div>
                </div>
            </div>,
            { dropEffect: 'copy' }
        )
    }

    onItemAdd(event) {
        const {name, onItemAdd} = this.props;

        onItemAdd(name, event);

        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
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

deviceItem.propTypes = propTypes;

/**
 * default export is wrapped in a DragSource (react-dnd)
 */
export default DragSource(ItemTypes.CARD, cardSource, collect)(deviceItem);
