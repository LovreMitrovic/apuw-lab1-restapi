const request = require('supertest');
const assert = require('assert');
const app = require('../index');

const user = {name:'test', surname:'test', password:'pass'};
const username = 'newusername';
const credentials = Buffer.from(username + ':' + user.password).toString('base64');
//admin needs to exist in database
const admin = {name:'admin', surname:'admin', password:'admin'};
const adminUsername = 'admin';
const adminCredentials = Buffer.from(adminUsername + ':' + admin.password).toString('base64');
const barkWithRecipient = {text:'bark', recipient: adminUsername};
//bark with this id needs to exist in database before tests
const barkId = 'r5p43';

describe('POST /users', function () {
    it('responds with 201 created', function (done) {
        request(app)
            .post('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .send(user)
            .expect('Content-Type', /json/)
            .expect('Location', /\/api\/users\/[a-z0-9]{5}/)
            .expect(201, done);
    });
    it('responds with 401 unauthorised', function (done) {
        request(app)
            .post('/api/users')
            .set('Accept', 'application/json')
            .send(user)
            .expect('Content-Type', /json/)
            .expect(401, done);
    });
})

describe('GET /users', function () {
    it('responds with 200 ok', function (done) {
        request(app)
            .get('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .expect('Content-Type', /json/)
            .expect(/{*}/)
            .expect(200, done);
    });
});

describe('DELETE /users', function () {
    it('responds with 405 Not Allowed', function (done) {
        request(app)
            .delete('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .expect('Content-Type', /json/)
            .expect(405, done);
    });
});

describe('PUT /users', function () {
    it('responds with 405 Not Allowed', function (done) {
        request(app)
            .put('/api/users')
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .expect('Content-Type', /json/)
            .expect(405, done);
    });
});

describe('PUT /users/'+username, function () {
    it('responds with 201 created', function (done) {
        request(app)
            .put('/api/users/'+username)
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .send(user)
            .expect('Content-Type', /json/)
            .expect('Location', '/api/users/'+username)
            .expect(201, done);
    });
    it('updates user and responds with 403', function (done) {
        request(app)
            .put('/api/users/'+username)
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .send(user)
            .expect('Content-Type', /json/)
            .expect(403, done);
    });
    it('updates user and responds with 200 ok', function (done) {
        request(app)
            .put('/api/users/'+username)
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + credentials)
            .send({name: 'test0', surname: 'test0', password: 'pass'})
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
})

describe('GET /users/'+username, function () {
    it('responds with 200 ok', function (done) {
        request(app)
            .get('/api/users/'+username)
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + credentials)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('responds with 404 not found', function (done) {
        request(app)
            .get('/api/users/'+username+'NOTINDB')
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + credentials)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
})

describe('DELETE /users/'+username, function () {
    it('responds with 200 ok', function (done) {
        request(app)
            .delete('/api/users/'+username)
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + credentials)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('check existance with GET', function (done) {
        request(app)
            .get('/api/users/'+admin)
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
});

describe('POST /barks', function () {
    it('responds with 201 created', function (done) {
        request(app)
            .post('/api/barks')
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .send(barkWithRecipient)
            .expect('Content-Type', /json/)
            .expect('Location', /\/api\/barks\/[a-z0-9]{5}/)
            .expect(201, done);
    });
});

describe('GET /barks', function () {
    it('responds with 200 ok', function (done) {
        request(app)
            .get('/api/barks')
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .expect('Content-Type', /json/)
            .expect(/{*}/)
            .expect(200, done);
    });
});

describe('GET /barks/'+barkId, function () {
    it('responds with 200 ok', function (done) {
        request(app)
            .get('/api/barks/'+barkId)
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('responds with 404 not found', function (done) {
        request(app)
            .get('/api/barks/'+barkId+'NOTINDB')
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
});

describe('PUT /barks/'+barkId, function () {
    it('responds with 200 ok', function (done) {
        request(app)
            .put('/api/barks/'+barkId)
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .send({...barkWithRecipient, text: 'bark ali sada neki novi tekst'})
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('DELETE /barks/'+barkId, function () {
    it('responds with 200 ok', function (done) {
        request(app)
            .delete('/api/barks/'+barkId)
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('check existance with GET', function (done) {
        request(app)
            .get('/api/barks/'+barkId)
            .set('Accept', 'application/json')
            .set('Authorization', 'Basic ' + adminCredentials)
            .expect('Content-Type', /json/)
            .expect(404, done);
    });
});
