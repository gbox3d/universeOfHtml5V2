const oneTwoThree = [1, 2, 3];
let result = oneTwoThree.map((v) => {
  console.log(v);
  return v;
});

console.log(result) //[1, 2, 3]
console.log(result === oneTwoThree) //false


result = oneTwoThree.map((v)=> {
  return v+1
})

console.log(result)

result = oneTwoThree.map((v)=> {
  if(v%2) return '짝수'
  else {
    return '홀수'
  }

})

console.log(result)