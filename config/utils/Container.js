const $ = require("jquery");
/**
 * @description: App assets manager, which manage `key: primitive type`, `value: object`, corresponding `props: object`
 * usage: extends `Container`
 * class AppContainer extends Container{
 *    constructor(){ super(); }
 * }
 * export default new AppContainer();
 */
class Container {
  constructor() {
    this._map = new Map();
    this._weakMap = new WeakMap();
  }
  setKV = (k, v) => this._map.set(k, v);
  setKProps = (k, props) => {
    if (this._map.has(k)) this._weakMap.set(this._map.get(k), props);
  };
  setVProps = (v, props) => {
    if (this._weakMap.has(v)) this._weakMap.set(v, props);
  };
  getVByK = k => this._map.get(k);
  getPropsByK = k => this._weakMap.get(this._map.get(k));
  getPropsByV = v => this._weakMap.get(v);
  /** @returns: all the V in array that match the given props */
  getVsByProps = props =>
    Array.from(this._map.values()).filter(v =>
      this._matchProps(this.getPropsByV(v), props)
    );
  getKsByProps = props => {
    const vSet = new Set(this.getVsByProps(props));
    return Array.from(this._map.keys()).filter(k => vSet.has(this._map[k]));
  };
  _matchProps = (foundProps, props) =>
    foundProps &&
    Object.entries(props).every(([k1, v1]) => foundProps[k1] === v1);
  hasK = k => this._map.has(k);
  hasV = v => new Set(this._map.values()).has(v);
  hasPropsByK = k => this._weakMap.has(this._map.get(k));
  doms = async (selector, searchInDom = document, event) => {
    const doms = await [...searchInDom.querySelectorAll(selector)];
    if (typeof event === "object")
      doms.forEach(dom =>
        $(dom)
          .off(Object.keys(event).join(" "))
          .on(event)
      );
    return doms;
  };
  add = (k, v, props) => {
    this.setKV(k, v);
    this.setVProps(v, props);
  };
  remove = k => this._map.delete(k);
  updatePropsByK = (k, props) => {
    if (this.hasK(k) && this.hasPropsByK(k) && typeof props === "object") {
      const updated = { ...this.getPropsByK(k), ...props };
      Object.keys(updated).forEach(key => {
        if (updated[key] === undefined || updated[key] === null)
          delete updated[key];
      });
      this.setKProps(k, updated);
    }
  };
}

module.exports = Container;
