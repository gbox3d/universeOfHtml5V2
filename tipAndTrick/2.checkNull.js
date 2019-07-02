var testCheck = {
  header : {
    major : 100,
    minor : 20
  }
}

/*
js 구조체의 무결성을 순차적으로 검사해주는 방법
하위 멤버가 undefined 이더라도 왼쪽부터 들어가다 undefined가 나오면 멈추기 때문에 예외상황이 발생하지않는다.

상위 멤버 부터 좌측부터 써내려가지않고 만약 거꾸로 쓴다면 예외가 발생한다.

예> testCheck.headers.minor && testCheck && testCheck.headers

 */

testCheck && console.log('testCheck ok')
testCheck && testCheck.header && console.log('testCheck.header ok')

testCheck && testCheck.headers && testCheck.headers.minor && console.log('testCheck.header ok')

if(testCheck && testCheck.headers && testCheck.headers.minor ) {

}
else {
  console.log('testCheck.headers undefined');
}