import { expect } from 'chai';
import { ProgressiveUploader, ProgressiveUploadProgressEvent } from '../src/index';
import mock from 'xhr-mock';
import { DEFAULT_RETRY_STRATEGY } from '../src/abstract-uploader';

describe('Default retrier', () => {
    const retrier = DEFAULT_RETRY_STRATEGY(10);

    it('don\'t retry if it should not', () => {
        expect(retrier(11, { status: 500, raw: "" })).to.be.equal(null)
        expect(retrier(1, { status: 401, raw: "" })).to.be.equal(null)
    });

    it('retry if it should', () => {
        expect(retrier(1, { status: 500, raw: "" })).to.be.equal(4200);
        expect(retrier(8, { status: 502, raw: "" })).to.be.equal(144200);
        expect(retrier(8, { raw: "" })).to.be.equal(144200);
    });
});