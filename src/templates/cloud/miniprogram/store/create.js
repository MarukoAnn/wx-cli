import store from './store'
import state from './state'
const create = (options) => {
    console.log
    // console.log(store.getters())
    options.data = options.data || {};
    options.data.store = state;
    // 页面加载的时候 绑定store订阅
    const _onLoad = options.onLoad;
    options.onLoad = function(e){
        store.page = getPageFlag()
        Object.keys(options.data.store).forEach(val => {
            setProxy.call(this, val);
            store.subscribe(val, () => {
                setProxy.call(this, val);
            })
        })
        _onLoad && _onLoad.call(this, e)
    }
    // 判断如果是已经加载过的页面返回需要更新状态值
    const _onShow = options.onShow;
    options.onShow = function(e) {
        store.page = getPageFlag();
        Object.keys(options.data.store).forEach(val => {
            store.Publish(val);
        })
        _onShow && _onShow.call(this, e)
    }
    // 页面卸载的时候 取消当前页面的store订阅
    const _onUnload = options.onUnload;
    options.onUnload = function(e) {
        // 移除当前页面的订阅事件
        store.clearAllSub();
        _onUnload && _onUnload.call(this, e)
    }
    Page(options);
}
// 设置值更改
function setProxy(val){
    this.setData({
        [`store.${val}`]: store.getters()[val],
    })
    // options.data.store
}
// 获取当前页面的标识
function getPageFlag(){
    let info = getCurrentPages()[getCurrentPages().length -1].route;
    let index = info.split('/').length -1;
    let flag = info.split('/')[index]
    return flag;
}

module.exports = create