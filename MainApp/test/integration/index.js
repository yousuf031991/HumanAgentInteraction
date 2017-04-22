import http from 'http';
import assert from 'assert';
import childProcess from 'child_process';

describe('Integration Testing Node Server', () => {

    before(done => {
        console.log("For integration tests, please make sure that MongoDB and the App instance are running");
        done();
    });
    
    it('Local instance should be running successfully', done => {
        // TODO get root url and port from configs/constants
        http.get('http://127.0.0.1:8080', res => {
            assert.equal(200, res.statusCode);
            done();
        });
    });

    it('Stress test Root URL', function(done) {
        this.timeout(50000);
        let command = "nab http://localhost:8080";

        childProcess.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            done();
        });
    });

    it('Stress test API (with a database request)', function(done) {
        this.timeout(50000);
        let command = "nab http://localhost:8080/api/viewConf";

        childProcess.exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            done();
        });
    });

});