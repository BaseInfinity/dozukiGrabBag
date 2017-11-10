import request from 'request';
import historyItem from './historyItem.js';

const baseURL = 'https://www.ifixit.com/api/2.0/categories';

// TODO: need to sort the results

/**
 * dataAPI
 */
class dataAPI {

    /**
     * getDataFromURL()
     *
     * @param dataURL
     * @param callback
     */
    getDataFromURL(dataURL, callback) {
        request.get(dataURL, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                callback(JSON.parse(body));
            } else {
                // TODO: Deal with errors better... try catch?
                // TODO: deal with the 429 errors (to many calls; need to throttle)
                console.log(error);
            }
        });
    }

    /**
     * getCategoryData()
     *
     * @param client
     */
    getCategoryData(client) {
        this.getDataFromURL(baseURL, (data) => {
            this.getCategoryChildren(client, data);
        });
    }

    storeChildData(client, catName, currentSubCategories) {
        const infoURL = baseURL + '/' + encodeURIComponent(catName);
        currentSubCategories[catName] = []; // Response will come back not in order... keep the order by pre-allocating the slot.

        this.getDataFromURL(infoURL, (catData) => {
            // TODO: Call a method (callback) instead of manipulating the parent!
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
                    imgUrl: '/images/DeviceNoImage_300x225.jpg'
                });
            }
            client.setState({currentSubCategories});
        });
    }

    getCategoryChildren(client, data) {
        let currentSubCategories = [];

        for (let catName in data) {
            this.storeChildData(client, catName, currentSubCategories);
        }
    }

    /**
     *
     * @param newCategory
     * @param client
     */
    getSubCategoryData(newCategory, client) {
        if (!newCategory || newCategory === 'All') {
            this.getCategoryData(client);
        } else {
            let dataURL = baseURL + "/" + encodeURIComponent(newCategory);
            this.getDataFromURL(dataURL, (data) => {
                let currentSubCategories = [];

                if (data.children !== undefined) {
                    data.children.forEach((catName) => {
                        this.storeChildData(client, catName, currentSubCategories);
                    });
                }
            });
        }
    }
}

export default dataAPI;