// Test utils

const testBlock = (name) => {
    console.groupEnd();
    console.group(`# ${name}\n`);
};

const areEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) {
            return false;
        }

        const firstArr = a.flat();
        const secondArr = b.flat();

        for (let i = 0; i < a.length; i++) {
            if (firstArr[i] !== secondArr[i]) {
                return false;
            }
        }
        return true;
    }

    return a === b;
};

const test = (whatWeTest, actualResult, expectedResult) => {
    if (areEqual(actualResult, expectedResult)) {
        console.log(`[OK] ${whatWeTest}\n`);
    } else {
        console.error(`[FAIL] ${whatWeTest}`);
        console.debug('Expected:');
        console.debug(expectedResult);
        console.debug('Actual:');
        console.debug(actualResult);
        console.log('');
    }
};

// Functions

const getType = (value) => {
    return typeof value;
};

const getTypesOfItems = (arr) => {
    return arr.map(getType);
};

const allItemsHaveTheSameType = (arr) => {
    const types = getTypesOfItems(arr);
    const firstType = types[0];
    return types.every((type) => type === firstType);
};

const getRealType = (value) => {
    const type = typeof value;

    switch (type) {
        case 'number':
            if (isNaN(value)) {
                return 'NaN';
            }
            if (!Number.isFinite(value)) {
                return 'Infinity';
            }
            return type;
        case 'object':
            if (Array.isArray(value)) {
                return 'array';
            }
            if (value === null) {
                return 'null';
            }
            if (value instanceof Date) {
                return 'date';
            }
            if (value instanceof RegExp) {
                return 'regexp';
            }
            if (value instanceof Set) {
                return 'set';
            }
            if (value instanceof Map) {
                return 'map';
            }
            return type;
        default:
            break;
    }
    return type;
};

const getRealTypesOfItems = (arr) => {
    return arr.map(getRealType);
};

const everyItemHasAUniqueRealType = (arr) => {
    const set = new Set(getRealTypesOfItems(arr));
    return set.size === arr.length;
};

const countRealTypes = (arr) => {
    const dict = {};
    const types = getRealTypesOfItems(arr);
    for (const type of types) {
        dict[type] ??= 0;
        dict[type] += 1;
    }
    return Object.entries(dict).sort((a, b) => (a[0] > b[0] ? 1 : -1));
};

// Tests

testBlock('getType');

test('Boolean', getType(true), 'boolean');
test('Number', getType(123), 'number');
test('Number', getType(NaN), 'number');
test('String', getType('whoo'), 'string');
test('Array', getType([]), 'object');
test('Object', getType({}), 'object');
test(
    'Function',
    getType(() => {}),
    'function'
);
test('Undefined', getType(undefined), 'undefined');
test('Null', getType(null), 'object');

testBlock('allItemsHaveTheSameType');

test('All values are numbers', allItemsHaveTheSameType([11, 12, 13]), true);

test('All values are strings', allItemsHaveTheSameType(['11', '12', '13']), true);

test('All values are strings but wait', allItemsHaveTheSameType(['11', new String('12'), '13']), false);

test('Values like a number', allItemsHaveTheSameType([123, 123 / 'a', 1 / 0]), true);

test('Values like an object', allItemsHaveTheSameType([{}]), true);

testBlock('getTypesOfItems VS getRealTypesOfItems');

const knownTypes = [
    true,
    8,
    'home',
    [1, 2, 3],
    { age: 20 },
    () => {},
    undefined,
    null,
    'hello' / 0,
    +Infinity,
    new Date(),
    /../,
    new Set(),
    new Map(),
    Symbol('id'),
    11n,
];

test('Check basic types', getTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'object',
    'object',
    'function',
    'undefined',
    'object',
    'number',
    'number',
    'object',
    'object',
    'object',
    'object',
    'symbol',
    'bigint',
]);

test('Check real types', getRealTypesOfItems(knownTypes), [
    'boolean',
    'number',
    'string',
    'array',
    'object',
    'function',
    'undefined',
    'null',
    'NaN',
    'Infinity',
    'date',
    'regexp',
    'set',
    'map',
    'symbol',
    'bigint',
]);

testBlock('everyItemHasAUniqueRealType');

test('All value types in the array are unique', everyItemHasAUniqueRealType([true, 123, '123']), true);

test('Two values have the same type', everyItemHasAUniqueRealType([true, 123, '123' === 123]), false);

test('There are no repeated types in knownTypes', everyItemHasAUniqueRealType(knownTypes), true);

test('Some values have the same type', everyItemHasAUniqueRealType([Boolean(0), 123, false, !String(null)]), false);

test('All value types in the array are unique', everyItemHasAUniqueRealType([+!!true, '1']), true);

testBlock('countRealTypes');

test('Count unique types of array items', countRealTypes([true, null, !null, !!null, {}]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('Counted unique types are sorted', countRealTypes([{}, null, true, !null, !!null]), [
    ['boolean', 3],
    ['null', 1],
    ['object', 1],
]);

test('All unique types are sorted', countRealTypes([[], '123', null, { type: 'number' }, '10' / '2']), [
    ['array', 1],
    ['null', 1],
    ['number', 1],
    ['object', 1],
    ['string', 1],
]);

// Add several positive and negative tests - в тестах
