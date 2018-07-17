import * as chai from 'chai';
const assert = chai.assert;

import SuminTree from './index';

interface TYPE_TREE<T> {
    _value: T;
    _children: TYPE_TREE<T>[];
}

describe('SuminTree', () => {
    let mock: SuminTree<string>;
    describe('constructor', () => {
        it('from value', () => {
            let treeA = new SuminTree('A');
            assert.deepEqual({ _value: 'A', _children: new Array<SuminTree<string>>() }, treeA as any);
            mock = new SuminTree(treeA);
        });
        it('from sumin instance', () => {
            let treeA = new SuminTree(mock);
            let treeB = new SuminTree('B')
                .add('E').add('F').add('G');
            let treeC = new SuminTree('C')
                .add(new SuminTree('H')
                    .add('M').add('N')
                )
                .add('I');
            let treeD = new SuminTree('D')
                .add('J').add(new SuminTree('K')
                    .add('O').add('P')
                );
            treeA.add(treeB).add(treeC).add(treeD);
            mock = new SuminTree(treeA);
            let tree: TYPE_TREE<string> = {
                _value: 'A', _children: [
                    { _value: 'B', _children: [
                        { _value: 'E', _children: [] },
                        { _value: 'F', _children: [] },
                        { _value: 'G', _children: [] }
                    ] },
                    { _value: 'C', _children: [
                        { _value: 'H', _children: [
                            { _value: 'M', _children: [] },
                            { _value: 'N', _children: [] }
                        ] },
                        { _value: 'I', _children: [] }
                    ] },
                    { _value: 'D', _children: [
                        { _value: 'J', _children: [] },
                        { _value: 'K', _children: [
                            { _value: 'O', _children: [] },
                            { _value: 'P', _children: [] }
                        ] }
                    ] }
                ]
            };
            assert.notEqual(mock, treeA);
            assert.deepEqual(mock, treeA);
            let treeDD = treeA.find('D');
            assert.exists(treeDD);
            if (treeDD) treeDD.add('Q');
            assert.notDeepEqual(mock, treeA);
            assert.deepEqual(tree, mock as any);
        });
    });
    describe('add', () => {
        it('value', () => {
            let treeA = new SuminTree(mock);
            assert.isUndefined(treeA.find('Q'));
            let treeJ = treeA.find('J');
            assert.exists(treeJ);
            if (treeJ) treeJ.add('Q');
            let tree: TYPE_TREE<string> = {
                _value: 'A', _children: [
                    { _value: 'B', _children: [
                        { _value: 'E', _children: [] },
                        { _value: 'F', _children: [] },
                        { _value: 'G', _children: [] }
                    ] },
                    { _value: 'C', _children: [
                        { _value: 'H', _children: [
                            { _value: 'M', _children: [] },
                            { _value: 'N', _children: [] }
                        ] },
                        { _value: 'I', _children: [] }
                    ] },
                    { _value: 'D', _children: [
                        { _value: 'J', _children: [
                            { _value: 'Q', _children: [] }
                        ] },
                        { _value: 'K', _children: [
                            { _value: 'O', _children: [] },
                            { _value: 'P', _children: [] }
                        ] }
                    ] }
                ]
            };
            assert.deepEqual(tree, treeA as any);
        });
        it('to sumin instance with shadow', () => {
            let treeA = new SuminTree(mock);
            assert.isUndefined(treeA.find(value => value === 'Q'));
            let treeQ = new SuminTree('Q').add('R').add('target');
            let treeF = treeA.find('F');
            assert.exists(treeF);
            if (treeF) treeF.add(treeQ, true);
            let tree: TYPE_TREE<string> = {
                _value: 'A', _children: [
                    { _value: 'B', _children: [
                        { _value: 'E', _children: [] },
                        { _value: 'F', _children: [
                            { _value: 'Q', _children: [
                                { _value: 'R', _children: [] },
                                { _value: 'S', _children: [] }
                            ] }
                        ] },
                        { _value: 'G', _children: [] }
                    ] },
                    { _value: 'C', _children: [
                        { _value: 'H', _children: [
                            { _value: 'M', _children: [] },
                            { _value: 'N', _children: [] }
                        ] },
                        { _value: 'I', _children: [] }
                    ] },
                    { _value: 'D', _children: [
                        { _value: 'J', _children: [] },
                        { _value: 'K', _children: [
                            { _value: 'O', _children: [] },
                            { _value: 'P', _children: [] }
                        ] }
                    ] }
                ]
            };
            assert.notDeepEqual(tree, treeA as any);
            let target = treeQ.find('target');
            assert.exists(target);
            if (target) target.value = 'S';
            assert.deepEqual(tree, treeA as any);
        });
        it('to sumin instance with not shadow', () => {
            let treeA = new SuminTree(mock);
            assert.isUndefined(treeA.find(value => value === 'Q'));
            let treeQ = new SuminTree('Q').add('R').add('target');
            let treeN = treeA.find('N');
            assert.exists(treeN);
            if (treeN) treeN.add(treeQ, false);
            let tree: TYPE_TREE<string> = {
                _value: 'A', _children: [
                    { _value: 'B', _children: [
                        { _value: 'E', _children: [] },
                        { _value: 'F', _children: [] },
                        { _value: 'G', _children: [] }
                    ] },
                    { _value: 'C', _children: [
                        { _value: 'H', _children: [
                            { _value: 'M', _children: [] },
                            { _value: 'N', _children: [
                                { _value: 'Q', _children: [
                                    { _value: 'R', _children: [] },
                                    { _value: 'S', _children: [] }
                                ] }
                            ] }
                        ] },
                        { _value: 'I', _children: [] }
                    ] },
                    { _value: 'D', _children: [
                        { _value: 'J', _children: [] },
                        { _value: 'K', _children: [
                            { _value: 'O', _children: [] },
                            { _value: 'P', _children: [] }
                        ] }
                    ] }
                ]
            };
            assert.notDeepEqual(tree, treeA as any);
            let target = treeQ.find('target');
            assert.exists(target);
            if (target) target.value = 'S';
            assert.notDeepEqual(tree, treeA as any);
            target = treeA.find('target');
            assert.exists(target);
            if (target) target.value = 'S';
            assert.deepEqual(tree, treeA as any);
        });
        it('with index', () => {
            let treeA = new SuminTree(mock);
            let treeH = treeA.find('H');
            assert.exists(treeH);
            if (treeH) treeH.add('Q', true, 1);
            if (treeH) treeH.add('R', true, SuminTree.CHILD_INSERT_POSITION.HEAD);
            if (treeH) treeH.add('S', true, SuminTree.CHILD_INSERT_POSITION.TAIL);
            let tree: TYPE_TREE<string> = {
                _value: 'A', _children: [
                    { _value: 'B', _children: [
                        { _value: 'E', _children: [] },
                        { _value: 'F', _children: [] },
                        { _value: 'G', _children: [] }
                    ] },
                    { _value: 'C', _children: [
                        { _value: 'H', _children: [
                            { _value: 'R', _children: [] },
                            { _value: 'M', _children: [] },
                            { _value: 'Q', _children: [] },
                            { _value: 'N', _children: [] },
                            { _value: 'S', _children: [] }
                        ] },
                        { _value: 'I', _children: [] }
                    ] },
                    { _value: 'D', _children: [
                        { _value: 'J', _children: [] },
                        { _value: 'K', _children: [
                            { _value: 'O', _children: [] },
                            { _value: 'P', _children: [] }
                        ] }
                    ] }
                ]
            };
            assert.deepEqual(treeA as any, tree);
        });
    });
    describe('traversal', () => {
        it('pre-order', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            treeA.traversal((tree, depth, index, parent, root) => {
                ABC += tree.value;
            }, SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
            assert.equal(ABC, 'ABEFGCHMNIDJKOP');
        });
        it('post-order', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            treeA.traversal((tree, depth, index, parent, root) => {
                ABC += tree.value;
            }, SuminTree.TRAVERSAL_TYPE.POST_ORDER);
            assert.equal(ABC, 'EFGBMNHICJOPKDA');
        });
        it('exit child', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            treeA.traversal((tree, depth, index, parent, root) => {
                ABC += tree.value;
                if (tree.value === 'H') return 1;
            }, SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
            assert.equal(ABC, 'ABEFGCHIDJKOP');
        });
        it('exit', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            treeA.traversal((tree, depth, index, parent, root) => {
                ABC += tree.value;
                if (tree.value === 'N') return -1;
            }, SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
            assert.equal(ABC, 'ABEFGCHMN');
            ABC = '';
            treeA.traversal((tree, depth, index, parent, root) => {
                ABC += tree.value;
                if (tree.value === 'N') return -1;
            }, SuminTree.TRAVERSAL_TYPE.POST_ORDER);
            assert.equal(ABC, 'EFGBMN');
        });
    });
    describe('filter', () => {
        it('filter', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            let treeF = treeA.filter((value, depth, index, parent, root) => {
                ABC += value;
                return !(value === 'K' || value === 'H');
            });
            let tree: TYPE_TREE<string> = {
                _value: 'A', _children: [
                    { _value: 'B', _children: [
                        { _value: 'E', _children: [] },
                        { _value: 'F', _children: [] },
                        { _value: 'G', _children: [] }
                    ] },
                    { _value: 'C', _children: [
                        { _value: 'I', _children: [] }
                    ] },
                    { _value: 'D', _children: [
                        { _value: 'J', _children: [] }
                    ] }
                ]
            };
            assert.notDeepEqual(treeF, treeA);
            assert.deepEqual(tree, treeF as any);
            assert.equal(ABC, 'ABEFGCHIDJK');
        });
    });
    describe('find', () => {
        it('pre-order', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            let treeD = treeA.find((value, depth, index, parent, root) => {
                ABC += value;
                return value === 'D';
            }, SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
            assert.exists(treeD);
            if (treeD) {
                assert.equal('D', treeD.value);
                assert.equal(treeD.children[0].value, 'J');
                assert.equal(treeD.children[1].value, 'K');
            }
            assert.equal(ABC, 'ABEFGCHMNID');
            let treeH = treeA.find('H', SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
            assert.exists(treeH);
            if (treeH) {
                assert.equal('H', treeH.value);
                assert.equal(treeH.children[0].value, 'M');
                assert.equal(treeH.children[1].value, 'N');
            }
        });
        it('post-order', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            let treeD = treeA.find((value, depth, index, parent, root) => {
                ABC += value;
                return value === 'D';
            }, SuminTree.TRAVERSAL_TYPE.POST_ORDER);
            assert.exists(treeD);
            if (treeD) {
                assert.equal('D', treeD.value);
                assert.equal(treeD.children[0].value, 'J');
                assert.equal(treeD.children[1].value, 'K');
            }
            assert.equal(ABC, 'EFGBMNHICJOPKD');
            let treeH = treeA.find('H', SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
            assert.exists(treeH);
            if (treeH) {
                assert.equal('H', treeH.value);
                assert.equal(treeH.children[0].value, 'M');
                assert.equal(treeH.children[1].value, 'N');
            }
        });
    });
    describe('map', () => {
        it('map', () => {
            let treeA = new SuminTree(mock);
            let treeM = treeA.map(value => value + 'map');
            let tree: TYPE_TREE<string> = {
                _value: 'Amap', _children: [
                    { _value: 'Bmap', _children: [
                        { _value: 'Emap', _children: [] },
                        { _value: 'Fmap', _children: [] },
                        { _value: 'Gmap', _children: [] }
                    ] },
                    { _value: 'Cmap', _children: [
                        { _value: 'Hmap', _children: [
                            { _value: 'Mmap', _children: [] },
                            { _value: 'Nmap', _children: [] },
                        ] },
                        { _value: 'Imap', _children: [] }
                    ] },
                    { _value: 'Dmap', _children: [
                        { _value: 'Jmap', _children: [] },
                        { _value: 'Kmap', _children: [
                            { _value: 'Omap', _children: [] },
                            { _value: 'Pmap', _children: [] }
                        ] }
                    ] }
                ]
            };
            assert.notDeepEqual(treeA, treeM);
            assert.deepEqual(tree, treeM as any);
        });
    });
    describe('some', () => {
        it('pre-order', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            let ret = treeA.some((value, depth, index, children, parent, root) => {
                ABC += value;
                return value === 'H' || value === 'O';
            }, SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
            assert.isTrue(ret);
            assert.equal(ABC, 'ABEFGCH');
            ABC = '';
            ret = treeA.some((value, depth, index, children, parent, root) => {
                ABC += value;
                return value === 'Q';
            }, SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
            assert.isFalse(ret);
            assert.equal(ABC, 'ABEFGCHMNIDJKOP');
        });
        it('post-order', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            let ret = treeA.some((value, depth, index, children, parent, root) => {
                ABC += value;
                return value === 'H' || value === 'O';
            }, SuminTree.TRAVERSAL_TYPE.POST_ORDER);
            assert.isTrue(ret);
            assert.equal(ABC, 'EFGBMNH');
            ABC = '';
            ret = treeA.some((value, depth, index, children, parent, root) => {
                ABC += value;
                return value === 'Q';
            }, SuminTree.TRAVERSAL_TYPE.POST_ORDER);
            assert.isFalse(ret);
            assert.equal(ABC, 'EFGBMNHICJOPKDA');
        });
    });
    describe('every', () => {
        it('pre-order', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            let ret = treeA.every((value, depth, index, children, parent, root) => {
                ABC += value;
                return value.length === 1; 
            }, SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
            assert.isTrue(ret);
            assert.equal(ABC, 'ABEFGCHMNIDJKOP');
            ABC = '';
            ret = treeA.every((value, depth, index, children, parent, root) => {
                ABC += value;
                return value !== 'H';
            }, SuminTree.TRAVERSAL_TYPE.PRE_ORDER);
            assert.isFalse(ret);
            assert.equal(ABC, 'ABEFGCH');
        });
        it('post-order', () => {
            let treeA = new SuminTree(mock);
            let ABC = '';
            let ret = treeA.every((value, depth, index, children, parent, root) => {
                ABC += value;
                return value.length === 1; 
            }, SuminTree.TRAVERSAL_TYPE.POST_ORDER);
            assert.isTrue(ret);
            assert.equal(ABC, 'EFGBMNHICJOPKDA');
            ABC = '';
            ret = treeA.every((value, depth, index, children, parent, root) => {
                ABC += value;
                return value !== 'H';
            }, SuminTree.TRAVERSAL_TYPE.POST_ORDER);
            assert.isFalse(ret);
            assert.equal(ABC, 'EFGBMNH');
        });
    });
    describe('obj2tree', () => {
        it('obj2tree', () => {
            let treeA = new SuminTree(mock);
            let obj2tree = SuminTree.obj2tree<string>({
                value: 'A', children: [
                    { value: 'B', children: [
                        { value: 'E', children: [] },
                        { value: 'F', children: [] },
                        { value: 'G', children: [] }
                    ] },
                    { value: 'C', children: [
                        { value: 'H', children: [
                            { value: 'M', children: [] },
                            { value: 'N', children: [] },
                        ] },
                        { value: 'I', children: [] }
                    ] },
                    { value: 'D', children: [
                        { value: 'J', children: [] },
                        { value: 'K', children: [
                            { value: 'O', children: [] },
                            { value: 'P', children: [] }
                        ] }
                    ] }
                ]
            });
            assert.notEqual(treeA, obj2tree);
            assert.deepEqual(treeA, obj2tree);
        });
    });
});
