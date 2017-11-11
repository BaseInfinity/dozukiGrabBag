import React, {Component} from 'react';
import {DragDropContextProvider} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import DeviceListContainer from './deviceListContainer.js';
import GrabBag from './grabBag.js';
import DataAPI from './dataAPI.js';
import historyItem from './historyItem.js';

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
            currentSubCategories: {},
            nextDeviceId: 1,
            dataAPI: new DataAPI()
        };
    }

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
                            <DeviceListContainer addDevice={this.addDevice.bind(this)} changeCategory={this.changeCategory.bind(this)} currentCategoryName={this.state.currentCategoryName} currentSubCategories={this.state.currentSubCategories}></DeviceListContainer>
                        </div>
                    </div>
                </div>
            </DragDropContextProvider>
        );
    }

    /**
     * componentDidMount() attempts to read the grab bag from local web storage, and attempts to get the initial tree data for the device list.
     */
    componentDidMount() {
        this.localStorageIn();
        this.pullInitialTreeDataFromAPI();
    }

    /**
     * addDevice() - Adds a device to the grab bag. (myDevices)
     *
     * @param deviceName is the name of the device to add
     */
    addDevice(deviceName) {
        const {nextDeviceId, currentSubCategories, myDevices} = this.state;
        let device         = currentSubCategories[deviceName];
        device.myDeviceId  = nextDeviceId;

        myDevices.push(device);
        this.setState({myDevices: this.state.myDevices, nextDeviceId: parseInt(nextDeviceId, 10) + 1});

        /* Store the grab bag with the new device in it */
        this.localStorageOut();
    }

    /**
     * pullInitialTreeDataFromAPI()
     */
    pullInitialTreeDataFromAPI () {
        /* attempt to get the initial tree data from the api... we call this the baseData */
        this.state.dataAPI.getBaseData((data) => {
            if (data !== null) {
                /* Store the initial baseData in the object state. */
                this.setState({'baseData': data});

                /* Loop trough the root's direct decedents within the baseData and get the image details. */
                for (let catName in data) {
                    this.state.dataAPI.getCategoryItem(catName, (dataSub) => {

                        /* update the baseData items to have a 'details' value as the image data for each comes back. */
                        let newBaseData = this.state.baseData;
                        newBaseData[catName]['details'] = dataSub;

                        /* Also, populate the currentSubCategories (what the device list displays) while we are here. */
                        let currentSubCategories = this.state.currentSubCategories;
                        currentSubCategories[catName] = new historyItem({
                            catName: catName,
                            imgId: dataSub['image']['id'],
                            imgGuid: dataSub['image']['guid'],
                            imgUrl: dataSub['image']['thumbnail'],
                            catChildren: dataSub.children.length
                        });
                        this.setState({'baseData': newBaseData, 'currentSubCategories': currentSubCategories});
                    });
                }
            } else {
                /* failed to get the base data */
                // TODO : Tell user to refresh the browser?
            }
        });
    }

    /**
     * localStorageOut() will store the grab bag in local web storage, if available.
     */
    localStorageOut() {
        if (typeof(Storage) !== 'undefined') {
            const {myDevices} = this.state;

            localStorage.setItem('dozuki_grabbag_mydevices', JSON.stringify(myDevices));
        }
    }

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
            if (myDevicesIn.length >= 1) {
                myNextDeviceIdIn = myDevicesIn[myDevicesIn.length - 1].myDeviceId + 1;
            }
        }
        this.setState({myDevices: myDevicesIn, nextDeviceId: myNextDeviceIdIn});
    }

    /**
     * changeCategory() will cause device list to populate with the new category.
     *
     * @param newCategory is the new category the device list is to display
     * @param historyStack is used to help figure out the location of the category in the tree (baseData).
     */
    changeCategory(newCategory, historyStack) {
        /* update the current category name, and wipe out the currentSubCategories before repopulating */
        this.setState({currentCategoryName: newCategory, currentSubCategories: {}});
        /* repopulate the currentSubCategories */
        this.updateCurrentSubCategories(newCategory, historyStack);
    }

    /**
     * getCategoryImageDataPointer() returns a pointer to the current data point in the tree (baseData)
     *
     * @param historyStack
     * @param newCategory
     *
     * @returns {*}
     */
    getCategoryImageDataPointer(historyStack, newCategory) {
        let dataPointer    = this.state.baseData;
        let myHistoryStack = historyStack.slice();
        let catName        = myHistoryStack.shift();
        while (catName) {
            if (catName !== 'All') {
                dataPointer = dataPointer[catName];
            }
            catName = myHistoryStack.shift();
        }
        return dataPointer[newCategory];
    }

    /**
     * cacheCategoryImageData() attempts to pull image data for the current category's children from the API, if needed.
     *
     * @param dataPointer
     */
    cacheCategoryImageData(dataPointer) {
        let currentSubCategories = {};

        // Get the level's data (if we don't already have it)
        for (let catName in dataPointer) {
            // if the details data is not there, try to get it.
            if (dataPointer[catName]['details'] === undefined && catName !== 'details') {
                this.state.dataAPI.getCategoryItem(catName, (dataSub) => {
                    // As the results come back, stash them in the 'details' offset of the associated item in the tree (baseData).
                    dataPointer[catName]['details'] = dataSub;
                    // Populate the currentSubCategories (what the device list displays).
                    this.addHistoryItemToCurrentSubCategories(catName, dataSub, currentSubCategories);
                });
            } else if (catName !== 'details') { // Don't get image data for the 'details' offset.
                // Populate the currentSubCategories (what the device list displays).
                this.addHistoryItemToCurrentSubCategories(catName, dataPointer[catName]['details'], currentSubCategories);
            }
        }
    }

    /**
     * addHistoryItemToCurrentSubCategories()
     *
     * @param catName
     * @param dataSub
     * @param currentSubCategories
     */
    addHistoryItemToCurrentSubCategories(catName, dataSub, currentSubCategories) {
        currentSubCategories[catName] = new historyItem({
            catName: catName,
            imgId: dataSub['image']['id'],
            imgGuid: dataSub['image']['guid'],
            imgUrl: dataSub['image']['thumbnail'],
            catChildren: dataSub.children.length
        });
        this.setState({currentSubCategories});
    }

    /**
     * updateCurrentSubCategories()
     *
     * @param newCategory
     * @param historyStack
     */
    updateCurrentSubCategories(newCategory, historyStack) {
        if (!newCategory || newCategory === 'All') {
            let currentSubCategories = {};
            for (let catName in this.state.baseData) {
                this.addSubCategory(this.state.baseData[catName]['details'], currentSubCategories, catName);
            }
        } else {
            // Reuse the data in the baseData if available
            let dataPointer = this.getCategoryImageDataPointer(historyStack, newCategory);
            this.cacheCategoryImageData(dataPointer);
        }
    }

    /**
     * addSubCategory()
     *
     * @param catData
     * @param currentSubCategories
     * @param catName
     */
    addSubCategory(catData, currentSubCategories, catName) {
        if (catData['image'] !== 'undefined' && catData['image'] !== null) {
            currentSubCategories[catName] = new historyItem({
                catName: catName,
                imgId: catData['image']['id'],
                imgGuid: catData['image']['guid'],
                imgUrl: catData['image']['thumbnail'],
                catChildren: catData.children.length
            });
        } else {
            currentSubCategories[catName] = new historyItem({
                catName: catName,
                imgId: '',
                imgGuid: '',
                imgUrl: '/images/DeviceNoImage_300x225.jpg',
                catChildren: 0
            });
        }
        this.setState({currentSubCategories});
    }
}

export default GrabBagContainer;