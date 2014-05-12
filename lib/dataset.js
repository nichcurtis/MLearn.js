var _ = require('lodash');
var Q = require('q');

/**
 * Dataset
 */
module.exports = function (config) {
    var dataset = { features: [] };

    /**
     * 
     */
    dataset.transform = function () {
        return dataset;
    };

    /**
     * 
     */
    dataset.shuffle = function () {
        _.shuffle(dataset.features);
        return dataset;
    };

    /**
     * 
     */
    dataset.total = function () {
        return dataset.features.length;
    };

    /**
     * 
     */
    dataset.pop = function () {
        if (dataset.features.length<=0)
            return false;
        return dataset.features.pop();
    };

    /**
     * 
     */
    dataset.normalize = function () {
        dataset.features = _.map(dataset.features, function (f) {
            return {
                index: f.index,
                x: _.map(f.x, function (xi) {
                    return xi>0?1:0;
                }),
                y: f.y
            };
        });
        return dataset;
    }

    /**
     * 
     */
    dataset.split = function (splitPercent) {
        var totalRecords = splitPercent;
        if (splitPercent < 1) {
            var totalRecords = dataset.total()*splitPercent;
        }
        return dataset.features.slice(0, totalRecords);
    };

    /**
     * 
     */
    dataset.from = {
        /**
         * 
         */
        csv: function (path, targetkey) {
            var csv = require('csv');
            var deferred = Q.defer();
            csv().from.path(path, { delimiter: ',', escape: '"' })
                .on('record', function (row,index){
                    var target = row.splice(targetkey, 1);
                    dataset.features.push({y: target, x: row, index: index});
                })
                .on('end', function (count) {
                    deferred.resolve(dataset); 
                })
                .on('error', function (error) {
                    deferred.reject(error);
                });
            return deferred.promise;
        },
        /**
         * 
         */
        json: function (results, targetkey) {

        },
        /**
         * 
         */
        mongo: function (results, targetkey) {

        }
    };

    return dataset;
}