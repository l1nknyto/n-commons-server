const object1 = {
  a: 1,
  b: 2,
  c: 3
};

const object2 = {
  c: 4,
  d: 5
};

Object.assign(object2, object1);

console.log(object2.c, object2.d, object2.a);