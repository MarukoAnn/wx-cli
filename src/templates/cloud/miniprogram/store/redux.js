// import 
function CreateStore(reducer, store){
    this.state = store? JSON.parse(JSON.stringify(store)) : {};
    this.events = {};
    this.linsteres = [];
    this.reducer = reducer;
    this.page = ''
    this.proxy(this.state);
}
CreateStore.prototype.subscribe = function(event, callback){
    if(typeof event === 'function' && !callback) {
        this.linsteres.push(event);
        return;
    }
    this.events[event] = this.events[event] || {};
    // this.events[event][this.page] = [callback]
    if(!this.events[event][this.page]) {
        // this.events[this.page]
        this.events[event][this.page] = [callback];
        return;
    }
    this.events[event][this.page].push(callback);
}

CreateStore.prototype.getters = function(){
    return this.state;
}
// 
CreateStore.prototype.dispatch = function(action) {
    // 执行所有的监听
    this.state = this.reducer(this.state, action)
    // 执行所有数据只要更改就订阅
    if(this.linsteres.length > 0) {
        this.linsteres.forEach(fn => {
            fn.call(this)
        });
        return;
    }
   
}
CreateStore.prototype.proxy = function(target) {
    const handler = {
        get: (target, key) => {
            return Reflect.get(target, key)
        },
        set: (target, key, value) => {
            const result = Reflect.set(target, key, value)
            this.Publish(key);
            return result
        }
    }
    this.state = new Proxy(target, handler);
}
// 发布单个订阅的请求
CreateStore.prototype.Publish = function(type) {
    const storeEvents = this.events[type];
    if(storeEvents) {
        storeEvents[this.page].forEach(callback => {
            callback.call(this);
        })
    }
}

CreateStore.prototype.unsubscribe = function(type, callback) {
    if(!callback) {
       this.events[type][this.page] = [];
       return;
    }
    const storeEvents = this.events[type][this.page];
    // storeEvents.forEach(callback =>)
    this.events[type][this.page] = storeEvents.filter(fn => fn !== callback);

}

CreateStore.prototype.clearAllSub = function() {
    if(!Object.values(this.events) || Object.values(this.events).length == 0) {
        return;
    }
    let page = this.page;
    Object.values(this.events).forEach(val => {
        console.log('key', Object.keys(val));
        if(Object.keys(val) && Object.keys(val).length > 0) {
            console.log('123');
            if(Object.keys(val).includes(page)){
               val[page] = [];
            }
        }
    })
}

module.exports = CreateStore;