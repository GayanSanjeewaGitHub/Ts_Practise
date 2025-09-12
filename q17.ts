class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.thenCbs = [];
    this.catchCbs = [];

    const resolve = (value) => {
      if (this.state !== "pending") return;
      this.state = "fulfilled";
      this.value = value;
      this.thenCbs.forEach(cb => cb(value));
    }; 

    const reject = (reason) => {
      if (this.state !== "pending") return;
      this.state = "rejected";
      this.value = reason;
      this.catchCbs.forEach(cb => cb(reason));
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.state === "fulfilled") {
        resolve(onFulfilled ? onFulfilled(this.value) : this.value);
      } else if (this.state === "rejected") {
        if (onRejected) reject(onRejected(this.value));
        else reject(this.value);
      } else {
        this.thenCbs.push((val) => resolve(onFulfilled(val)));
        this.catchCbs.push((err) => reject(onRejected ? onRejected(err) : err));
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    return this.then(
      (val) => { onFinally(); return val; },
      (err) => { onFinally(); throw err; }
    );
  }
}
