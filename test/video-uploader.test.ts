import { expect } from 'chai';
import mock from 'xhr-mock';
import { VideoUploader, UploadProgressEvent } from '../src/index';

describe('Instanciation', () => {
    it('throws if required param is missing', () => {
        // @ts-ignore
        expect(() => new VideoUploader({
            uploadToken: "aa",
        })).to.throw("'file' is missing");

        // @ts-ignore
        expect(() => new VideoUploader({
            accessToken: "aa",
            file: new File([""], "")
        })).to.throw("'videoId' is missing");
    });

    it('throws if chunk size is invalid', () => {
        expect(() => new VideoUploader({
            uploadToken: "aa",
            file: new File([""], ""),
            chunkSize: 1024 * 1024 * 1
        })).to.throw("Invalid chunk size. Minimal allowed value: 5MB, maximum allowed value: 128MB.");
    });
});

describe('Content-range', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('content-range headers are properly set', (done) => {
        const uploadToken = "the-upload-token";

        const uploader = new VideoUploader({
            file: new File([new ArrayBuffer(17000000)], "filename"),
            uploadToken,
            chunkSize: 5 * 1024 * 1024,
        });

        const expectedRanges = [
            'part 1/4',
            'part 2/4',
            'part 3/4',
            'part 4/4',
        ];

        mock.post(`https://ws.api.video/upload?token=${uploadToken}`, (req, res) => {
            expect(req.header("content-range")).to.be.eq(expectedRanges.shift());
            return res.status(201).body("{}");
        });

        uploader.upload().then(() => {
            expect(expectedRanges).has.lengthOf(0);
            done();
        });
    });
});

describe('Access token auth', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('token value is correct', (done) => {
        const accessToken = "1234";
        const videoId = "9876";

        const uploader = new VideoUploader({
            file: new File([new ArrayBuffer(200)], "filename"),
            accessToken,
            videoId,
        });


        mock.post(`https://ws.api.video/videos/${videoId}/source`, (req, res) => {
            expect(req.header("content-range")).to.be.eq("part 1/1");
            expect(req.header("authorization")).to.be.eq(`Bearer ${accessToken}`);
            return res.status(201).body("{}");
        });

        uploader.upload().then(() => {
            done();
        });

    });
});


describe('Origin headers', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('token value is correct', (done) => {
        const accessToken = "1234";
        const videoId = "9876";

        const uploader = new VideoUploader({
            file: new File([new ArrayBuffer(200)], "filename"),
            accessToken,
            videoId,
            origin: {
                application: {
                    name: "application-name",
                    version: "1.0.0"
                },
                sdk: {
                    name: "sdk-name",
                    version: "2.0.0"
                }
            }
        });

        mock.post(`https://ws.api.video/videos/${videoId}/source`, (req, res) => {
            expect(req.header("av-origin-app")).to.be.eq("application-name:1.0.0");
            expect(req.header("av-origin-sdk")).to.be.eq(`sdk-name:2.0.0`);
            return res.status(201).body("{}");
        });

        uploader.upload().then(() => {
            done();
        });

    });
});



describe('Refresh token', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('refresh token value is correct', (done) => {
        const accessToken1 = "1234";
        const accessToken2 = "5678";
        const refreshToken1 = "9876";
        const refreshToken2 = "5432";
        const videoId = "9876";

        const uploader = new VideoUploader({
            file: new File([new ArrayBuffer(200)], "filename"),
            accessToken: accessToken1,
            refreshToken: refreshToken1,
            videoId,
        });

        let sourceCalls = 0;

        mock.post(`https://ws.api.video/videos/${videoId}/source`, (req, res) => {
            sourceCalls++;
            expect(req.header("content-range")).to.be.eq("part 1/1");

            if (sourceCalls === 1) {
                expect(req.header("authorization")).to.be.eq(`Bearer ${accessToken1}`);
                return res.status(401).body("{}");
            }

            expect(req.header("authorization")).to.be.eq(`Bearer ${accessToken2}`);
            return res.status(201).body("{}");
        });

        mock.post(`https://ws.api.video/auth/refresh`, (req, res) => {

            expect(JSON.parse(req.body()).refreshToken).to.be.eq(refreshToken1);
            return res.status(201).body(JSON.stringify({
                access_token: accessToken2,
                refresh_token: refreshToken2,
            }));
        });


        uploader.upload().then(() => {
            done();
        });

    });
});


describe('Delegated upload', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('videoId is transmitted', (done) => {
        const videoId = "9876";
        const uploadToken = "1234";

        const uploader = new VideoUploader({
            file: new File([new ArrayBuffer(2000)], "filename"),
            uploadToken,
            videoId,
        });

        mock.post(`https://ws.api.video/upload?token=${uploadToken}`, (req, res) => {
            expect(req.body().getAll("videoId")).to.be.eql([videoId]);
            return res.status(201).body('{}');
        });

        uploader.upload().then(() => done());
    });

    it('video name is file name', (done) => {
        const uploadToken = "the-upload-token";
        const videoId = "9876";
        const fileName = "filename"

        const uploader = new VideoUploader({
            file: new File([new ArrayBuffer(10)], fileName),
            uploadToken,
            videoId
        });

        mock.post(`https://ws.api.video/upload?token=${uploadToken}`, (req, res) => {
            expect(req.body().get("file").name).to.be.eql(fileName);
            return res.status(201).body("{}");
        });

        uploader.upload().then(() => done());
    })

    it('video name is customized', (done) => {
        const uploadToken = "the-upload-token";
        const videoId = "9876";
        const fileName = "filename"
        const videoName = "video name"

        const uploader = new VideoUploader({
            file: new File([new ArrayBuffer(10)], fileName),
            uploadToken,
            videoId,
            videoName
        });

        mock.post(`https://ws.api.video/upload?token=${uploadToken}`, (req, res) => {
            expect(req.body().get("file").name).to.be.eql(videoName);
            return res.status(201).body("{}");
        });

        uploader.upload().then(() => done());
    })
});

describe('Progress listener', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('progress event values are correct', (done) => {
        const videoId = "9876";
        let lastUploadProgressEvent: UploadProgressEvent;

        const uploader = new VideoUploader({
            file: new File([new ArrayBuffer(6000000)], "filename"),
            accessToken: "1234",
            videoId,
            chunkSize: 5 * 1024 * 1024
        });

        mock.post(`https://ws.api.video/videos/${videoId}/source`, (req, res) => res.status(201).body("{}"));

        uploader.onProgress((e: UploadProgressEvent) => lastUploadProgressEvent = e);

        uploader.upload().then(() => {
            expect(lastUploadProgressEvent).to.deep.equal({
                ...lastUploadProgressEvent,
                totalBytes: 6000000,
                chunksCount: 2,
                chunksBytes: 5 * 1024 * 1024,
                currentChunk: 2,
            });
            done();
        });
    });
});

describe('Errors & retries', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('upload retries', (done) => {

        const uploadToken = "the-upload-token";

        const uploader = new VideoUploader({
            file: new File([new ArrayBuffer(200)], "filename"),
            uploadToken,
            retryStrategy: (retryCount, error) => retryCount > 3 ? null : 10,
        });

        let postCounts = 0;
        mock.post(`https://ws.api.video/upload?token=${uploadToken}`, (req, res) => {
            postCounts++;
            if (postCounts === 3) {
                return res.status(201).body("{}");
            }
            return res.status(500).body('{"error": "oups"}');
        });

        uploader.upload().then(() => {
            expect(postCounts).to.be.eq(3);
            done();
        });
    }).timeout(10000);

    it('failing upload returns the status from the api', (done) => {

        const uploadToken = "the-upload-token";

        const uploader = new VideoUploader({
            file: new File([new ArrayBuffer(6000000)], "filename"),
            uploadToken,
            chunkSize: 5 * 1024 * 1024,
            retryStrategy: (retryCount, error) => retryCount > 3 ? null : 10,
        });

        let postCounts = 0;
        mock.post(`https://ws.api.video/upload?token=${uploadToken}`, (req, res) => {
            postCounts++;
            if (postCounts > 1) {
                return res.status(500).body('{"error": "oups"}');
            }
            return res.status(201).body("{}");
        });

        uploader.upload().then(() => {
            throw new Error('should not succeed');
        }).catch((e) => {
            expect(e).to.be.eqls({ status: 500, raw: '{"error": "oups"}', error: 'oups' });
            done();
        });
    }).timeout(10000);
});
