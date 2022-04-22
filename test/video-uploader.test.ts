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
            chunkSize: 1024*1024*1
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
            chunkSize: 5*1024*1024,
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
            chunkSize: 5*1024*1024
        });

        mock.post(`https://ws.api.video/videos/${videoId}/source`, (req, res) => res.status(201).body("{}"));

        uploader.onProgress((e: UploadProgressEvent) => lastUploadProgressEvent = e);

        uploader.upload().then(() => {
            expect(lastUploadProgressEvent).to.deep.equal({
                ...lastUploadProgressEvent,
                totalBytes: 6000000,
                chunksCount: 2,
                chunksBytes: 5*1024*1024,
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
            chunkSize: 5*1024*1024,
            retries: 3,
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
