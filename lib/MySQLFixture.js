var mysql = require('mysql');
var _ = require('underscore');
var Q = require('q');
var debug = require('debug')('draba-mysql-fixtures');

function MySQLFixture(mysqlConfig) {
    this._pool = mysql.createPool(mysqlConfig);
}
MySQLFixture.prototype.getAllTableNames = function () {
    var defer = Q.defer();
    this._pool.query('SHOW TABLES', function (err, rows) {
        if (err) {
            defer.reject(err);
        } else {
            var tableNames = _.chain(rows)
                .map(function (row) {
                    return _.values(row);
                }).flatten()
                .sort()
                .value();
            defer.resolve(tableNames);
        }
    });
    return defer.promise;
};
MySQLFixture.prototype.getTableData = function (tableName) {
    var defer = Q.defer();
    var sql = mysql.format('SELECT * FROM ??', [tableName]);
    debug('SQL:', sql);
    this._pool.query(sql, function (err, rows) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(rows);
        }
    });
    return defer.promise;
};
MySQLFixture.prototype.clearTable = function (tableName) {
    var defer = Q.defer();
    var sql = mysql.format('TRUNCATE TABLE ??', [tableName]);
    debug('SQL:', sql);
    this._pool.query(sql, function (err) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve();
        }
    });
    return defer.promise;
};
MySQLFixture.prototype.clearAll = function () {
    var that = this;
    return this.getAllTableNames()
        .then(function (tableNames) {
            return Q.all(_.map(tableNames, function (tableName) {
                return that.clearTable(tableName);
            }));
        });
};
MySQLFixture.prototype.loadData = function (data) {
    var that = this;
    return Q.all(_.map(data, function (tableData, tableName) {
        return Q.all(_.map(tableData, function (row) {
            var sql = mysql.format('INSERT INTO ?? SET ?', [tableName, row]);
            debug('SQL:', sql);
            return Q.ninvoke(that._pool, 'query', sql);
        }));
    })).then(function () {
        return data;
    });
};
MySQLFixture.prototype.loadDataFromFile = function (filename) {
    var data = require(filename);
    return this.loadData(data);
};
module.exports = MySQLFixture;