import { expect } from 'chai';
import { VideoUploader } from '../src/index';


describe('Instanciation', () => {

    it('throws if required param is missing', () => {
        // @ts-ignore
        expect(() => new VideoUploader({
            uploadToken: "aa",
        })).to.throw('"file" is missing');
    });
});