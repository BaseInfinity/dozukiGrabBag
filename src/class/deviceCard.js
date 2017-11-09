import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from './itemTypes';

/**
 * Implements the drag source contract.
 */
const cardSource = {
    beginDrag(props) {
        return {
            text: props.text
        };
    },
    endDrag(props, monitor) {
        const item = monitor.getItem();
        const dropResult = monitor.getDropResult();

        if (dropResult) {
            props.addDevice(item.text);
            //alert(`You dropped ${item.text} into ${dropResult.name}!`) // eslint-disable-line no-alert
        }
    },
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

const propTypes = {
    text: PropTypes.string.isRequired,

    // Injected by React DnD:
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired
};

class deviceCard extends Component {
    render() {
        const { isDragging, connectDragSource, text } = this.props;
        return connectDragSource(
            <div style={{ opacity: isDragging ? 0.5 : 1 }}>
                {text}
            </div>
        );
    }
}

deviceCard.propTypes = propTypes;

// Export the wrapped component:
export default DragSource(ItemTypes.CARD, cardSource, collect)(deviceCard);