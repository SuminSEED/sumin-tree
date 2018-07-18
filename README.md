# SuminTree
Tree with filter, map, forEach, toArray, some, every, find, etc.
Written in typescript.

## Install

```bash
npm install sumin-tree
```

## Usage

### Initialize
```js
let treeB = new SuminTree('B').add('D').add('F').add('G');
let treeC = new SuminTree('C').add('H').add('I');
let tree = new SuminTree('A').add(treeB).add(treeC);
let _tree = SuminTree.obj2tree({
    value: 'A', children: [
        { value: 'B', children: [
            { value: 'D', children: [] },
            { value: 'F', children: [] },
            { value: 'G', children: [] }
        ] },
        { value: 'C', children: [
            { value: 'H', children: [] },
            { value: 'I', children: [] }
        ] }
    ]
});

// Identical content
assert.deepEqual(tree, _tree);

_tree = new SuminTree(tree);
// A different instance
assert.notEqual(tree, _tree);
// Identical content
assert.deepEqual(tree, _tree);
```

## Definition
```ts
add(value: T | SuminTree<T>, shadow?: boolean, index?: number | SuminTree.INSERT_POSITION): this;
some(callback: (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => any, traversal?: SuminTree.TRAVERSAL_TYPE): boolean;
every(callback: (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => any, traversal?: SuminTree.TRAVERSAL_TYPE): boolean;
traversal(callback: (tree: SuminTree<T>, depth: number, index: number, parent: SuminTree<T> | null, root: SuminTree<T>) => number | void, traversal: SuminTree.TRAVERSAL_TYPE): void;
filter(callback: (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => any): SuminTree<T>;
find(callback: (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => any | T, traversal?: SuminTree.TRAVERSAL_TYPE): SuminTree<T> | undefined;
map(callback: (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => T, traversal?: SuminTree.TRAVERSAL_TYPE): SuminTree<T>;
forEach(callback: (value: T, depth: number, index: number, children: SuminTree<T>[], parent: SuminTree<T> | null, root: SuminTree<T>) => any, traversal?: SuminTree.TRAVERSAL_TYPE): this;
toArray(traversal?: SuminTree.TRAVERSAL_TYPE): SuminTree.TYPE.ARRAY_ITEM<T>[];
static obj2tree<T>(obj: SuminTree.TYPE.TREE_OBJ<T>): SuminTree<T>;
```
