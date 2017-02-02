import http from 'http';
import assert from 'assert';
import '../../lib/index.js';

describe('Testing Node Server', () => {

    it('Local instance should be running successfully', done => {
        // TODO get root url and port from configs/constants
        http.get('http://127.0.0.1:8080', res => {
            assert.equal(200, res.statusCode);
            done();
        });
    });

});