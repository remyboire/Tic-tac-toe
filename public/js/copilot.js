function calculateDaysBetweenDates(begin, end) {
    var oneDay = 24*60*60*1000;
    var firstDate = new Date(begin);
    var secondDate = new Date(end);
    return Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
}
// I want to inverse the order of an array
// Language: javascript
// Path: src/js/copilot.js
function reverseArray(array) {
    var newArray = [];
    for (var i = array.length - 1; i >= 0; i--) {
        newArray.push(array[i]);
    }
    return newArray;
}
// I want to inverse the order of arrays inside an array
// Language: javascript
// Path: src/js/copilot.js
function reverseArrayInPlace(array) {
    var newArray = [];
    for (var i = array.length - 1; i >= 0; i--) {
        newArray.push(array[i]);
    }
    return newArray;
}
const tac = [
	[1, 2, 3, 4, 5],
	[6, 7, 8, 9, 10],
	[1, 2, 3, 4, 5],
	[1, 2, 3, 4, 5],
	[1, 2, 3, 4, 5],
]

console.log(reverseArray(tac))