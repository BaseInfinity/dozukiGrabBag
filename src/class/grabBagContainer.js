import React, {Component} from 'react';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DeviceListContainer from './deviceListContainer.js';
import GrabBag from './grabBag.js';
import DataAPI from './dataAPI.js';

/**
 * GrabBagContainer is the outer most container... is the conduit between the 'grab bag' and the 'device list'.
 * Also, it attempts to store the grab bag in local web storage.
 */
class GrabBagContainer extends Component {
    /**
     * constructor()
     *
     * @param props
     */
    constructor(props) {
        super(props);

        this.state = {
            myDevices: [],
            currentCategoryName: 'All',
            currentSubCategories: [],
            nextDeviceId: 1,
            dataAPI: new DataAPI()
        };
    }

    /**
     * componentDidMount() attempts to read the grab bag from local storage and attempts to get the data for the device list.
     */
    componentDidMount() {
        /* check to see if they have a grab bag data in their local web storage */
        this.localStorageIn();

        /* grab the data for the device list */
        this.state.dataAPI.getData(this);
    }

    /**
     * updateCurrentSubCategories()... TBD... knows too much about the historyItem TODO!
     *
     * @param newCategory
     */
    updateCurrentSubCategories(newCategory) {
        this.state.dataAPI.updateCurrentSubCategories(newCategory, this)
    };

    /**
     * render() generates the grab bag container HTML.
     *
     * @returns {XML} is the content to render; Using React JSX.
     */
    render() {
        const {myDevices} = this.state;

        return (
            <DragDropContextProvider backend={HTML5Backend}>
                <div className="container-fluid">
                    <div className="row" role="row">
                        <div className="col-xs-12 col-sm-6">
                            <GrabBag myDevices={myDevices}></GrabBag>
                        </div>
                        <div className="col-xs-12 col-sm-6">
                            <DeviceListContainer addDevice={this.addDevice} changeCategory={this.changeCategory} updateCurrentSubCategories={this.updateCurrentSubCategories} grabBagData={this.state}></DeviceListContainer>
                        </div>
                    </div>
                </div>
            </DragDropContextProvider>
        );
    }

    /**
     * addDevice() - Adds a device to the grab bag.
     *
     * @param deviceName
     */
    addDevice(deviceName) {
        const {nextDeviceId, currentSubCategories, myDevices} = this.state;
        let device         = currentSubCategories[deviceName];
        device.myDeviceId  = nextDeviceId;

        myDevices.push(device);
        this.setState({myDevices: this.state.myDevices, nextDeviceId: parseInt(nextDeviceId, 10) + 1});

        this.localStorageOut();
    };

    /**
     * localStorageOut() will store the grab bag in local web storage, if available.
     */
    localStorageOut() {
        if (typeof(Storage) !== 'undefined') {
            const {myDevices} = this.state;

            localStorage.setItem('dozuki_grabbag_mydevices', JSON.stringify(myDevices));
        }
    };

    /**
     * localStorageIn() will store the grab bag in local web storage, if available.
     */
    localStorageIn() {
        let myDevicesIn      = [];
        let myNextDeviceIdIn = 1;

        if (typeof(Storage) !== 'undefined') {

            let devicesIn = localStorage.getItem('dozuki_grabbag_mydevices');
            if (devicesIn !== null && devicesIn !== undefined) {
                myDevicesIn = JSON.parse(devicesIn);
            }
            if (myDevicesIn.length) {
                myNextDeviceIdIn = myDevicesIn[myDevicesIn.length - 1].myDeviceId + 1;
            }
        }
        this.setState({myDevices: myDevicesIn, nextDeviceId: myNextDeviceIdIn});
    };

    /**
     * changeCategory()
     *
     * @param newCategory
     */
    changeCategory(newCategory) {
        this.setState({currentCategoryName: newCategory, currentSubCategories: []});
    };
}

export default GrabBagContainer;