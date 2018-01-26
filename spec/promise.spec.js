
const Promise = require('../promise.js');

describe('A Promise', () => {
    it('is defined', () => {
        expect(Promise).toBeDefined();
    });
    describe('When instantiated', () => {
        let promise;
        let resolve;
        let reject;
        beforeEach(() => {
            promise = new Promise((_resolve, _reject) => {
                resolve = _resolve;
                reject = _reject;
            });
        });
        it('can be instantiated', () => {
            expect(promise).toBeDefined();
        });
        it('should be an instance', () => {
            expect(promise).toEqual(jasmine.any(Promise));
        });
        it('has a `then` method', () => {
            expect(promise.then).toBeDefined();
            expect(promise.then).toEqual(jasmine.any(Function));
        });
        describe('When `then` is called', () => {
            let promise2;
            let onSuccess;
            let onFailure;
            beforeEach(() => {
                onSuccess = jasmine.createSpy();
                onFailure = jasmine.createSpy();
                promise2 = promise.then(onSuccess, onFailure);
            });
            it('should create another instance of promise', () => {
                expect(promise2).toBeDefined();
                expect(promise2).toEqual(jasmine.any(Promise));
            });
            it('should not callback `then` when its not resolved or rejected', () => {
                expect(onSuccess).not.toHaveBeenCalled();
                expect(onFailure).not.toHaveBeenCalled();
            });
            describe('When resolved', () => {
                const result = 'result';
                beforeEach((done) => {
                    resolve(result);
                    setTimeout(done);
                });
                it('should callback `then` on happy path', () => {
                    expect(onSuccess).toHaveBeenCalled();
                    expect(onFailure).not.toHaveBeenCalled();
                });
                it('should pass the result', () => {
                    expect(onSuccess).toHaveBeenCalledWith(result);
                });
                describe('And resolved again', () => {
                    beforeEach((done) => {
                        resolve();
                        setTimeout(done);
                    });
                    it('should only callback once', () => {
                        expect(onSuccess).toHaveBeenCalledTimes(1);
                    });
                });
                describe('And then rejected', () => {
                    beforeEach((done) => {
                        reject();
                        setTimeout(done);
                    });
                    it('should not reject a resolved promise', () => {
                        expect(onFailure).not.toHaveBeenCalled();
                    });
                });
            });
            describe('When rejected', () => {
                const error = new Error('Gremlins!');
                beforeEach((done) => {
                    reject(error);
                    setTimeout(done);
                });
                it('should callback `then` on unhappy path', () => {
                    expect(onFailure).toHaveBeenCalled();
                    expect(onSuccess).not.toHaveBeenCalled();
                });
                it('should pass the error', () => {
                    expect(onFailure).toHaveBeenCalledWith(error);
                });
                describe('And rejected again', () => {
                    beforeEach((done) => {
                        reject();
                        setTimeout(done);
                    });
                    it('should only callback once', () => {
                        expect(onFailure).toHaveBeenCalledTimes(1);
                    });
                });
                describe('And then resolved', () => {
                    beforeEach((done) => {
                        resolve();
                        setTimeout(done);
                    });
                    it('should not resolve a rejected promise', () => {
                        expect(onSuccess).not.toHaveBeenCalled();
                    });
                });
            });
            describe('When `then` is called on chained promises', () => {
                let promise3;
                let chainedOnSuccess;
                let chainedOnFailure;
                beforeEach(() => {
                    chainedOnSuccess = jasmine.createSpy();
                    chainedOnFailure = jasmine.createSpy();
                    promise3 = promise2.then(chainedOnSuccess, chainedOnFailure);
                });
                it('should create another instance of promise', () => {
                    expect(promise3).toBeDefined();
                    expect(promise3).toEqual(jasmine.any(Promise));
                });
                it('should not callback `then` when its not resolved or rejected', () => {
                    expect(chainedOnSuccess).not.toHaveBeenCalled();
                    expect(chainedOnFailure).not.toHaveBeenCalled();
                });
                describe('When resolved', () => {
                    beforeEach((done) => {
                        resolve();
                        setTimeout(done);
                    });
                    it('should callback `then` on happy path', () => {
                        expect(chainedOnSuccess).toHaveBeenCalled();
                        expect(chainedOnFailure).not.toHaveBeenCalled();
                    });
                });
                describe('When rejected', () => {
                    beforeEach((done) => {
                        reject();
                        setTimeout(done, 100);
                    });
                    it('should callback `then` on happy path', () => {
                        expect(chainedOnSuccess).toHaveBeenCalled();
                        expect(chainedOnFailure).not.toHaveBeenCalled();
                    });
                });
            });
             describe('When `then` is called on chained promises and the passed function returns a value', () => {
                const result = 'result';
                const value = 'value';
                let promise3;
                let chainedOnSuccess;
                let chainedOnFailure;
                beforeEach(() => {
                    promise3 = promise2.then((e) => {
                        return value;
                    });
                    chainedOnSuccess = jasmine.createSpy();
                    chainedOnFailure = jasmine.createSpy();
                    promise3.then(chainedOnSuccess, chainedOnFailure);
                });
                describe('When resolved', () => {
                    beforeEach((done) => {
                        resolve(result);
                        setTimeout(done);
                    });
                    it('should callback `then` on happy path', () => {
                        expect(chainedOnSuccess).toHaveBeenCalled();
                        expect(chainedOnFailure).not.toHaveBeenCalled();
                    });
                    it('should pass the value', () => {
                        expect(chainedOnSuccess).toHaveBeenCalledWith(value);
                    });
                });
            });
            describe('When `then` is called on chained promises and the passed function throws an error', () => {
                let promise3;
                let chainedOnSuccess;
                let chainedOnFailure;
                const error = new Error('Gremlins 2!');
                beforeEach(() => {
                    promise3 = promise2.then((e) => {
                        throw error;
                    });
                    chainedOnSuccess = jasmine.createSpy();
                    chainedOnFailure = jasmine.createSpy();
                    promise3.then(chainedOnSuccess, chainedOnFailure);
                });
                describe('When resolved', () => {
                    beforeEach((done) => {
                        resolve();
                        setTimeout(done);
                    });
                    it('should callback `then` on unhappy path', () => {
                        expect(chainedOnFailure).toHaveBeenCalled();
                        expect(chainedOnSuccess).not.toHaveBeenCalled();
                    });
                    it('should pass the error', () => {
                        expect(chainedOnFailure).toHaveBeenCalledWith(error);
                    });
                });
            });
            describe('When `then` is called on chained promises and the passed function returns a promise', () => {
                let promise3;
                let chainedOnSuccess;
                let chainedOnFailure;
                let chainedResolve;
                let chainedReject;
                beforeEach(() => {
                    promise3 = promise2.then((e) => {
                        return new Promise((_resolve, _reject) => {
                            chainedResolve = _resolve;
                            chainedReject = _reject;
                        });
                    });
                    chainedOnSuccess = jasmine.createSpy();
                    chainedOnFailure = jasmine.createSpy();
                    promise3.then(chainedOnSuccess, chainedOnFailure);
                });
                describe('When resolved', () => {
                    beforeEach((done) => {
                        resolve();
                        setTimeout(done);
                    });
                    it('should await chained promise resolving', () => {
                        expect(chainedOnSuccess).not.toHaveBeenCalled();
                        expect(chainedOnFailure).not.toHaveBeenCalled();
                    });
                    describe('When chain resolves', () => {
                        const chainedResult = 'chainedResult';
                        beforeEach((done) => {
                            chainedResolve(chainedResult);
                            setTimeout(done);
                        });
                        it('should callback `then` on happy path', () => {
                            expect(chainedOnSuccess).toHaveBeenCalled();
                            expect(chainedOnFailure).not.toHaveBeenCalled();
                        });
                        it('should pass the result', () => {
                            expect(chainedOnSuccess).toHaveBeenCalledWith(chainedResult);
                        });
                    });
                    describe('When chain rejects', () => {
                        const error = new Error('Martians!');
                        beforeEach((done) => {
                            chainedReject(error);
                            setTimeout(done);
                        });
                        it('should callback `then` on unhappy path', () => {
                            expect(chainedOnFailure).toHaveBeenCalled();
                            expect(chainedOnSuccess).not.toHaveBeenCalled();
                        });
                        it('should pass the error', () => {
                            expect(chainedOnFailure).toHaveBeenCalledWith(error);
                        });
                    });
                });
            });
        });
    });
});