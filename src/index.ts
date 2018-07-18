class SuminTree<T> {

    protected _value: T;
    protected _children: SuminTree<T>[];

    set value(value: T) { this._value = value; }
    get value() { return this._value; }
    set children(children: SuminTree<T>[]) { this._children = children; }
    get children() { return this._children; }

    constructor(value: T | SuminTree<T>) {
        if (value instanceof SuminTree) {
            this._value = value._value;
            this._children = [];
            value._children.forEach(child => {
                this.add(child, false, SuminTree.CHILD_INSERT_POSITION.TAIL);
            });
        } else {
            this.value = value;
            this._children = [];
        }
    }

    public add(value: T | SuminTree<T>, shadow = true, index: number | SuminTree.CHILD_INSERT_POSITION = SuminTree.CHILD_INSERT_POSITION.TAIL) {
        if (typeof index !== 'number') {
            if (index === SuminTree.CHILD_INSERT_POSITION.HEAD) index = 0;
            else if (index === SuminTree.CHILD_INSERT_POSITION.TAIL) index = this.children.length;
            else index = this.children.length;
        }
        if (!(shadow && value instanceof SuminTree)) {
            value = new SuminTree<T>(value);
        }
        this.children.splice(index, 0, value);
        return this;
    }

    public some(callback: SuminTree.CALLBACK.SOME<T>, traversal = SuminTree.TRAVERSAL_TYPE.PRE_ORDER): boolean {
        let tree = this.find((value, depth, index, children, parent, root) => {
            return callback(value, depth, index, children, parent, root);
        }, traversal);
        if (tree) return true;
        else return false;
    }

    public every(callback: SuminTree.CALLBACK.EVERY<T>, traversal = SuminTree.TRAVERSAL_TYPE.PRE_ORDER) {
        let tree = this.find((value, depth, index, children, parent, root) => {
            return !callback(value, depth, index, children, parent, root);
        }, traversal);
        if (tree) return false;
        else return true;
    }

    public traversal(callback: SuminTree.CALLBACK.TRAVERSAL<T>, traversal: SuminTree.TRAVERSAL_TYPE) {

        let depth = 0;
        let root = this;

        const _traversal = function __traversal(tree: SuminTree<T>, index: number, parent: SuminTree<T> | null): number | void {

            let ret: number | void;
            if (traversal !== SuminTree.TRAVERSAL_TYPE.POST_ORDER) {
                ret = callback(tree, depth, index, parent, root);
                if (ret) return ret;
            }
            ++depth;
            for (let i = 0; i < tree.children.length; i++) {
                const child = tree.children[i];
                ret = __traversal(child, i, tree);
                if (ret === -1) return ret;
            }
            --depth;
            if (traversal === SuminTree.TRAVERSAL_TYPE.POST_ORDER) {
                ret = callback(tree, depth, index, parent, root);
                if (ret) return ret;
            }

        };
        _traversal(this, 0, null);
    }

    public filter(callback: SuminTree.CALLBACK.FILTER<T>) {
        let parents: SuminTree<T>[] = [];
        this.traversal((tree, depth, index, parent, root) => {
            let ret = callback(tree.value, depth, index, tree.children, parent, root);
            if (!ret) return 1;
            let new_tree = new SuminTree(tree.value);
            parents.length = depth;
            parents.push(new_tree);
            if (!depth) return;
            parents[depth - 1].add(new_tree, true, SuminTree.CHILD_INSERT_POSITION.TAIL);
        }, SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
        return parents[0];
    }

    public find(callback: SuminTree.CALLBACK.FIND<T> | T, traversal = SuminTree.TRAVERSAL_TYPE.PRE_ORDER) {
        let ret: SuminTree<T> | undefined;
        this.traversal((tree, depth, index, parent, root) => {
            if (typeof callback === 'function') {
                if (callback(tree.value, depth, index, tree.children, parent, root)) {
                    ret = tree;
                    return -1;
                }
            } else {
                if (callback === tree.value) {
                    ret = tree;
                    return -1;
                }
            }
        }, traversal);
        return ret;
    }

    public map(callback: SuminTree.CALLBACK.MAP<T>, traversal = SuminTree.TRAVERSAL_TYPE.PRE_ORDER) {
        let parents: SuminTree<T>[] = [];
        this.traversal((tree, depth, index, parent, root) => {
            let ret = callback(tree.value, depth, index, tree.children, parent, root);
            let new_tree = new SuminTree(ret);
            parents.length = depth;
            parents.push(new_tree);
            if (!depth) return;
            parents[depth - 1].add(new_tree, true, SuminTree.CHILD_INSERT_POSITION.TAIL);
        }, traversal);
        return parents[0];
    }

    public forEach(callback: SuminTree.CALLBACK.FOREACH<T>, traversal = SuminTree.TRAVERSAL_TYPE.PRE_ORDER) {
        this.traversal((tree, depth, index, parent, root) => {
            if (!callback(tree.value, index, depth, tree.children, parent, root)) return -1;
        }, traversal);
        return this;
    }

    public toArray(traversal = SuminTree.TRAVERSAL_TYPE.PRE_ORDER) {
        let array: SuminTree.ARRAY_ITEM<T>[] = [];
        this.traversal((tree, depth, index, parent, root) => {
            array.push({
                value: tree.value,
                depth: depth,
                index: index,
                children: tree.children,
                parent: parent
            });
        }, traversal);
        return array;
    }

    static obj2tree<T>(obj: SuminTree.TREE_OBJ<T>) {
        let tree = new SuminTree<T>(obj.value);
        for (let i = 0; i < obj.children.length; i++) {
            let child = obj.children[i];
            tree.add(SuminTree.obj2tree(child), true, SuminTree.CHILD_INSERT_POSITION.TAIL);
        }
        return tree;
    }
}

namespace SuminTree {
    export interface TREE_OBJ<T> {
        value: T;
        children: TREE_OBJ<T>[];
    }
    export interface ARRAY_ITEM<T> {
        value: T;
        depth: number;
        index: number;
        children: SuminTree<T>[];
        parent: SuminTree<T> | null;
    }
    export enum TRAVERSAL_TYPE {
        PRE_ORDER,
        POST_ORDER
    }
    export enum CHILD_INSERT_POSITION {
        HEAD = 'head',
        TAIL = 'tail'
    }
    export namespace CALLBACK {
        export type TRAVERSAL<T> = (tree: SuminTree<T>, depth: number, index: number, parent: SuminTree<T> | null, root: SuminTree<T>) => number | void;
        export type SOME<T> = (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => any;
        export type EVERY<T> = (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => any;
        export type FILTER<T> = (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => any;
        export type FIND<T> = (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => any;
        export type MAP<T> = (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => T;
        export type FOREACH<T> = (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => T;
    }
    // 互換性のために残してるメジャーバージョンアップの時に消すべし at TYPE
    export namespace TYPE {
        export interface TREE_OBJ<T> {
            value: T;
            children: TREE_OBJ<T>[];
        }
        export interface ARRAY_ITEM<T> {
            value: T;
            depth: number;
            index: number;
            children: SuminTree<T>[];
            parent: SuminTree<T> | null;
        }
    }
}
export default SuminTree;
