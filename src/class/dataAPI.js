import request from 'request';

const baseURL  = 'https://www.ifixit.com/api/2.0/categories';

/**
 * dataAPI
 */
class dataAPI {
    /**
     * getBaseData() attempts to pull the initial catalog tree data from the API.
     *
     * @param callback is called with the data when it becomes available.
     */
    getBaseData(callback) {
        this.getDataFromURL(baseURL, (data) => {
            callback(data);
        });
    }

    /**
     * getCategoryItem() attempts to pull category details (image info) from the API.
     *
     * @param catName is the name of the category to get details for.
     * @param callback is called with the data when it becomes available.
     */
    getCategoryItem(catName, callback) {
        const infoURL = baseURL + '/' + encodeURIComponent(catName);
        this.getDataFromURL(infoURL, (data) => {
            callback(data);
        });
    }

    /**
     * getDataFromURL() wraps up the API calls using the 'request' library.
     *
     * @param dataURL
     * @param callback is called with the data when it becomes available; or null on error or unexpected status code
     */
    getDataFromURL(dataURL, callback) {
        request
        .get(dataURL, function (error, response, body) {
            if (!error) {
                if (response.statusCode === 200) {
                    callback(JSON.parse(body));
                } else {
                    callback(null);
                    console.log(response);
                }
            } else {
                callback(null);
                console.log(error);
            }
        });
    }
}

export default dataAPI;