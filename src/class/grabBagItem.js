import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';
import '../css/grabBagItem.css';

/**
 * propTypes
 *
 * @type {{removeItem: (*), data: (*)}}
 */
const propTypes = {
    removeItem: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,

    // boolean to control the state of the popover
    isOpen:  PropTypes.bool,
    autoFocus: PropTypes.bool,
    size: PropTypes.string,
    // callback for toggling isOpen in the controlling component
    toggle:  PropTypes.func,
    role: PropTypes.string, // defaults to "dialog"
    // used to reference the ID of the title element in the modal
    labelledBy: PropTypes.string,
    keyboard: PropTypes.bool,
    // control backdrop, see http://v4-alpha.getbootstrap.com/components/modal/#options
    backdrop: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf(['static'])
    ]),
    // called on componentDidMount
    onEnter: PropTypes.func,
    // called on componentWillUnmount
    onExit: PropTypes.func,
    // called when done transitioning in
    onOpened: PropTypes.func,
    // called when done transitioning out
    onClosed: PropTypes.func,
    className: PropTypes.string,
    wrapClassName: PropTypes.string,
    modalClassName: PropTypes.string,
    backdropClassName: PropTypes.string,
    contentClassName: PropTypes.string,
    // boolean to control whether the fade transition occurs (default: true)
    fade: PropTypes.bool,
    cssModule: PropTypes.object,
    // zIndex defaults to 1000.
    zIndex: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    // backdropTransition - controls backdrop transition
    // timeout is 150ms by default to match bootstrap
    // see Fade for more details
 //   backdropTransition: PropTypes.shape(Fade.propTypes),
    // modalTransition - controls modal transition
    // timeout is 300ms by default to match bootstrap
    // see Fade for more details
   // modalTransition: PropTypes.shape(Fade.propTypes),
};

const style = {
    marginTop: '15px',
    marginLeft: '15px',
    marginRight: '15px',
    marginBottom: '10px'
};

class grabBagItem extends Component {
    constructor(props) {
        super(props);

        this.state = {modal: false};

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    /**
     * render() generates the grab bag item item HTML.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        const {data} = this.props;
        const name   = data.details.topic_info.name;
        const src    = data.details.image.thumbnail;

        return (
            <div className='col-xs-12 sol-sm-6 col-md-4 col-lg-3 dozuki_grabbag_device_list_item_container'>
                <div className='dozuki_grabbag_device_list_section_item' name='currentCategory' value={name} onClick={this.onItemClick.bind(this)}>
                    <div className='dozuki_grabbag_device_list_section_item_title dozuki_grabbag_device_list_device_container' title={name}>
                        {name}
                    </div>
                    <div className='dozuki_grabbag_device_list_section_item_body'>
                        <img className='dozuki_grabbag_device_list_section_item_image dozuki_grabbag_device_list_section_item_device_imagex' src={src} alt='' />
                    </div>
                    <div style={{ ...style}}>
                        <Button onClick={this.onItemDelete.bind(this)} color="primary" size="sm" block>REMOVE</Button>
                    </div>
                </div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>{name} Guides</ModalHeader>
                    <ModalBody>
                        <div className="dozuki_grabbag_device_list_section_item_details" id={data.itemId}>
                            {data.details.guides.map((guide, index) =>
                                <div key={index}><a target="_blank" href={guide.url} title={guide.title}>{guide.title}</a>
                                </div>
                            )}
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Done</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }

    onItemDelete(event) {
        const {removeItem} = this.props;

        removeItem();

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

        this.toggle();

        if (event) {
            event.preventDefault();
        }
    }
}

grabBagItem.propTypes = propTypes;

export default grabBagItem;