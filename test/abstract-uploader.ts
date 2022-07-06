import { expect } from 'chai';
import { AbstractUploader, DEFAULT_RETRY_STRATEGY } from '../src/abstract-uploader';

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

describe('Origin header validation', () => {
    const validateOrigin = (AbstractUploader as any).validateOrigin as (name: string, origin: { name?: string, version?: string }) => void;
    it('should properly validate name', () => {
        expect(() => validateOrigin("test", { version: "aa" })).to.throw("test name is required");
        expect(() => validateOrigin("test", { name:"frf ds", version: "aa" })).to.throw("Invalid test name value. Allowed characters: A-Z, a-z, 0-9, '-', '_'. Max length: 50.");
    });
    it('should properly validate version', () => {
        expect(() => validateOrigin("test", { name: "aa" })).to.throw("test version is required");
        expect(() => validateOrigin("test", { name:"name", version: "a b" })).to.throw("Invalid test version value. The version should match the xxx[.yyy][.zzz] pattern.");
    });
});