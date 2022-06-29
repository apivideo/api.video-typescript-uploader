import { expect } from 'chai';
import { ProgressiveUploader, ProgressiveUploadProgressEvent } from '../src/index';
import mock from 'xhr-mock';

describe('Instanciation', () => {
    it('throws if required param is missing', () => {
        // @ts-ignore
        expect(() => new ProgressiveUploader({
        })).to.throw("You must provide either an accessToken, an uploadToken or an API key");

        // @ts-ignore
        expect(() => new ProgressiveUploader({
            accessToken: "aa",
        })).to.throw("'videoId' is missing");
    });
});


describe('Requests synchronization', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('requests are made sequentially', (done) => {
        const uploadToken = "the-upload-token";
        const uploader = new ProgressiveUploader({ uploadToken });

        let isRequesting = false;

        mock.post(`https://ws.api.video/upload?token=${uploadToken}`, (req, res) => {
            expect(isRequesting).to.be.equal(false, "concurrent request")
            isRequesting = true;
            return new Promise((resolve, _) => setTimeout(() => {
                isRequesting = false;
                resolve(res.status(201).body(`{"videoId": "123"}`));
            }, 500));
        });

        uploader.uploadPart(new File([new ArrayBuffer(5 * 1024 * 1024)], "filename"));
        uploader.uploadPart(new File([new ArrayBuffer(5 * 1024 * 1024)], "filename"));
        uploader.uploadLastPart(new File([new ArrayBuffer(3 * 1024 * 1024)], "filename")).then((r) => done());
    });
});

describe('Content-range', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('content-range headers are properly set', async () => {
        const uploadToken = "the-upload-token";

        const uploader = new ProgressiveUploader({ uploadToken });

        const expectedRanges = [
            'part 1/*',
            'part 2/*',
            'part 3/3',
        ];

        mock.post(`https://ws.api.video/upload?token=${uploadToken}`, (req, res) => {
            expect(req.header("content-range")).to.be.eq(expectedRanges.shift());
            return res.status(201).body("{}");
        });

        await uploader.uploadPart(new File([new ArrayBuffer(5 * 1024 * 1024)], "filename"));
        await uploader.uploadPart(new File([new ArrayBuffer(5 * 1024 * 1024)], "filename"));
        await uploader.uploadLastPart(new File([new ArrayBuffer(3 * 1024 * 1024)], "filename"));

        expect(expectedRanges).has.lengthOf(0);
    });
});

describe('Prevent empty part', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('content-range headers are properly set', async () => {
        const uploadToken = "the-upload-token";

        const uploader = new ProgressiveUploader({ uploadToken, preventEmptyParts: true });

        const expectedRanges = [
            'part 1/*',
            'part 2/*',
            'part 3/3',
        ];

        mock.post(`https://ws.api.video/upload?token=${uploadToken}`, (req, res) => {
            expect(req.header("content-range")).to.be.eq(expectedRanges.shift());
            return res.status(201).body("{}");
        });

        await uploader.uploadPart(new File([new ArrayBuffer(5 * 1024 * 1024)], "filename"));
        await uploader.uploadPart(new File([new ArrayBuffer(5 * 1024 * 1024)], "filename"));
        await uploader.uploadPart(new File([new ArrayBuffer(3 * 1024 * 1024)], "filename"));
        await uploader.uploadLastPart(new Blob());

        expect(expectedRanges).has.lengthOf(0);
    });
});


describe('Access token auth', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('token value is correct', (done) => {
        const accessToken = "1234";
        const videoId = "9876";

        const uploader = new ProgressiveUploader({
            accessToken,
            videoId,
        });


        mock.post(`https://ws.api.video/videos/${videoId}/source`, (req, res) => {
            expect(req.header("content-range")).to.be.eq("part 1/1");
            expect(req.header("authorization")).to.be.eq(`Bearer ${accessToken}`);
            return res.status(201).body("{}");
        });

        uploader.uploadLastPart(new File([new ArrayBuffer(200)], "filename")).then(() => {
            done();
        });

    });
});


describe('Progress listener', () => {
    beforeEach(() => mock.setup());
    afterEach(() => mock.teardown());

    it('progress event values are correct', (done) => {
        const videoId = "9876";
        let lastUploadProgressEvent: ProgressiveUploadProgressEvent;

        const uploader = new ProgressiveUploader({
            accessToken: "1234",
            videoId
        });

        mock.post(`https://ws.api.video/videos/${videoId}/source`, (req, res) => res.status(201).body("{}"));

        uploader.onProgress((e: ProgressiveUploadProgressEvent) => lastUploadProgressEvent = e);

        uploader.uploadPart(new File([new ArrayBuffer(5 * 1024 * 1024)], "filename")).then(() => {
            expect(lastUploadProgressEvent).to.deep.equal({
                ...lastUploadProgressEvent,
                totalBytes: 5242880
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

        const uploader = new ProgressiveUploader({
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

        uploader.uploadPart(new File([new ArrayBuffer(5 * 1024 * 1024)], "filename")).then(() => {
            expect(postCounts).to.be.eq(3);
            done();
        });
    }).timeout(10000);

    it('failing upload returns the status from the api', (done) => {

        const uploadToken = "the-upload-token";

        const uploader = new ProgressiveUploader({
            uploadToken,
            retryStrategy: (retryCount, error) => retryCount > 3 ? null : 10,
        });

        mock.post(`https://ws.api.video/upload?token=${uploadToken}`, (req, res) => {
            return res.status(500).body('{"error": "oups"}');
        });

        uploader.uploadPart(new File([new ArrayBuffer(5 * 1024 * 1024)], "filename")).then(() => {
            throw new Error('should not succeed');
        }).catch((e) => {
            expect(e).to.be.eqls({ status: 500, raw: '{"error": "oups"}', error: 'oups' });
            done();
        });
    }).timeout(20000);
});
