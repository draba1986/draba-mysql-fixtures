var path = require('path');

var _ = require('underscore');
var Q = require('q');

var expect = require('chai').expect;
var MySQLFixture = require('../lib/MySQLFixture');
var someData = require('./fixtures/some_data');

describe('MySQLFixture', function () {
    this.timeout(10000);
    var fixture;
    before(function () {
        fixture = new MySQLFixture({
            host: '192.168.254.254',
            port: 3306,
            user: 'root',
            password: 'root',
            database: 'draba-mysql-fixtures',
            charset: 'utf8',
            dateStrings: true
        });
    });
    it('make sure that the data in file is correct', function () {
        expect(someData).deep.equals({
            user: {
                user1: {id: 1, username: 'admin'},
                user2: {id: 2, username: 'guest'}
            },
            article: {
                article1: {id: 100, user_id: 1, title: '标题1', content: '<br>正文内容1', created: '2016-03-12 12:12:12'},
                article2: {id: 101, user_id: 1, title: '标题2', content: '<br>正文内容2', created: '2016-03-12 12:12:13'},
                article3: {id: 102, user_id: 3, title: '标题3', content: '<br>正文内容3', created: '2016-03-12 12:12:14'}
            },
            comment: {
                comment1: {id: 10000, article_id: 100, content: '<div>评论内容1</div>', created: '2016-03-12 12:11:12'},
                comment2: {id: 10001, article_id: 100, content: '<div>评论内容2</div>', created: '2016-03-12 12:12:12'},
                comment3: {id: 10002, article_id: 101, content: '<div>评论内容3</div>', created: '2016-03-12 12:13:12'}
            }
        });
    });
    describe('#getAllTableNames', function () {
        it('There should be some tables in the database', function (done) {
            fixture.getAllTableNames()
                .then(function (tables) {
                    expect(tables).have.length(3).and.include.members(['article', 'comment', 'user']);
                }).nodeify(done);
        });
    });
    describe('#getTableData', function () {
        it('It should be blank after clear table', function (done) {
            fixture.clearTable('user')
                .then(function () {
                    return fixture.getTableData('user');
                }).then(function (users) {
                    expect(users).is.a('array').and.empty;
                }).nodeify(done);
        });
        it('It should have correct data in table', function (done) {
            fixture.clearTable('user')
                .then(function () {
                    return fixture.loadData(_.pick(someData, 'user'));
                }).then(function () {
                    return fixture.getTableData('user');
                }).then(function (users) {
                    users = _.sortBy(users, 'id');
                    expect(users).is.a('array').and.has.length(2);
                    expect(users[0]).deep.equal(someData.user.user1);
                    expect(users[1]).deep.equal(someData.user.user2);
                }).nodeify(done);
        });
    });
    describe('#loadData', function () {
        it('There should be correct data in the table', function (done) {
            fixture.clearTable('user')
                .then(function () {
                    return fixture.getTableData('user');
                }).then(function (users) {
                    expect(users).is.a('array').and.empty;
                    return fixture.loadData(_.pick(someData, 'user'));
                }).then(function (data) {
                    expect(data).deep.equal(_.pick(someData, 'user'));
                    return fixture.getTableData('user');
                }).then(function (users) {
                    users = _.sortBy(users, 'id');
                    expect(users).is.a('array').and.has.length(2);
                    expect(users[0]).deep.equal(someData.user.user1);
                    expect(users[1]).deep.equal(someData.user.user2);
                }).nodeify(done);
        });
    });
    describe('#clearAll', function () {
        it('It should be clear', function (done) {
            fixture.clearAll()
                .then(function () {
                    return Q.all(_.map(['article', 'comment', 'user'], function (tableName) {
                        return fixture.getTableData(tableName);
                    }));
                }).spread(function (articles, comments, users) {
                    expect(articles).is.a('array').and.empty;
                    expect(comments).is.a('array').and.empty;
                    expect(users).is.a('array').and.empty;
                }).then(function () {
                    return fixture.loadData(someData);
                }).then(function () {
                    return Q.all(_.map(['article', 'comment', 'user'], function (tableName) {
                        return fixture.getTableData(tableName);
                    }));
                }).spread(function (articles, comments, users) {
                    expect(articles).is.a('array').and.deep.equal(_.values(someData.article));
                    expect(comments).is.a('array').and.deep.equal(_.values(someData.comment));
                    expect(users).is.a('array').and.deep.equal(_.values(someData.user));
                }).then(function () {
                    return fixture.clearAll();
                }).then(function () {
                    return Q.all(_.map(['article', 'comment', 'user'], function (tableName) {
                        return fixture.getTableData(tableName);
                    }));
                }).spread(function (articles, comments, users) {
                    expect(articles).is.a('array').and.empty;
                    expect(comments).is.a('array').and.empty;
                    expect(users).is.a('array').and.empty;
                }).nodeify(done);
        });
    });
    describe('#loadDataFromFile', function () {
        it('There should be correct data in the database', function (done) {
            fixture.clearAll()
                .then(function () {
                    return fixture.loadDataFromFile(path.resolve(__dirname, './fixtures/some_data'));
                }).then(function (data) {
                    expect(data).deep.equal(someData);
                }).then(function () {
                    return Q.all(_.map(['article', 'comment', 'user'], function (tableName) {
                        return fixture.getTableData(tableName);
                    }));
                }).spread(function (articles, comments, users) {
                    expect(articles).is.a('array').and.deep.equal(_.values(someData.article));
                    expect(comments).is.a('array').and.deep.equal(_.values(someData.comment));
                    expect(users).is.a('array').and.deep.equal(_.values(someData.user));
                }).nodeify(done);
        });
    });
});