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
        const {myDevices, baseData} = this.state;

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
     * componentDidMount() attempts to read the grab bag from local storage and attempts to get the data for the device list.
     */
    componentDidMount() {
        /* check to see if they have a grab bag data in their local web storage */
        this.localStorageIn();

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
            if (myDevicesIn.length) {
                myNextDeviceIdIn = myDevicesIn[myDevicesIn.length - 1].myDeviceId + 1;
            }
        }
        this.setState({myDevices: myDevicesIn, nextDeviceId: myNextDeviceIdIn});
    }

    /**
     * changeCategory()
     *
     * @param newCategory
     */
    changeCategory(newCategory, historyStack, isBack = false) {
        this.setState({currentCategoryName: newCategory, currentSubCategories: {}});
        this.updateCurrentSubCategories(newCategory, historyStack, isBack);
    };

    /**
     *
     * @param historyStack
     * @param newCategory
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
     *
     * @param dataPointer
     */
    cacheCategoryImageData(dataPointer) {

        let basePointer = this.state.baseData;
        let OTHERcurrentSubCategories = [];

        // GET THAT LEVELS DATA IF WE DON"T ALREADY HAVE IT
        for (let catName in dataPointer) {
            // if the details data is no there, get it.
            if (dataPointer[catName]['details'] === undefined && catName !== 'details') {
                this.state.dataAPI.getCategoryItem(catName, (dataSub) => {
                    console.log("updateCurrentSubCategories5", dataSub);
                    dataPointer[catName]['details'] = dataSub;

                    /* Also, populate the currentSubCategories (what the device list displays) while we are here. */
                    let currentSubCategories = this.state.currentSubCategories;
                    currentSubCategories[catName] = new historyItem({
                        catName: catName,
                        imgId: dataSub['image']['id'],
                        imgGuid: dataSub['image']['guid'],
                        imgUrl: dataSub['image']['thumbnail'],
                        catChildren: dataSub.children.length
                    });
                    this.setState({'baseData': basePointer, 'currentSubCategories': currentSubCategories});

                });
            } else if (catName !== 'details') {
                this.setState({'currentSubCategories': {}});
                /* Also, populate the currentSubCategories (what the device list displays) while we are here. */
                console.log("updateCurrentSubCategories6", catName);
                OTHERcurrentSubCategories[catName] = new historyItem({
                    catName: catName,
                    imgId: dataPointer[catName]['details']['image']['id'],
                    imgGuid: dataPointer[catName]['details']['image']['guid'],
                    imgUrl: dataPointer[catName]['details']['image']['thumbnail'],
                    catChildren: dataPointer[catName]['details'].children.length
                });
                console.log("updateCurrentSubCategories7", this.state.currentSubCategories);
                this.setState({'currentSubCategories': OTHERcurrentSubCategories});
                console.log("updateCurrentSubCategories8", this.state.currentSubCategories);
            }

        }
    }

    /**
     * updateCurrentSubCategories()... TBD... knows too much about the historyItem TODO!
     *
     * @param newCategory
     */
    updateCurrentSubCategories(newCategory, historyStack, isBack) {
        if (!newCategory || newCategory === 'All') {
            let currentSubCategories = [];
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