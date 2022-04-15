const tic = [
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 9],
]
const tac = [
	[1, 2, 3, 4, 5],
	[6, 7, 8, 9, 10],
	[1, 2, 3, 4, 5],
	[1, 2, 3, 4, 5],
	[1, 2, 3, 4, 5],
]
const toc = [[], [], []]
// console.log(tic)
function rotate(array) {
	let newArray = new Array() // create an empty array of length n

	for (var i = 0; i < array.length; i++) {
		newArray[i] = new Array() // make each element an array
	}

	for (let row = 0; row < array.length; row++) {
		for (let column = 0; column < array[row].length; column++) {
			// Runs 5 times, with values of step 0 through 4.
			newRow = Math.abs(row - array[row].length + 1)
			newArray[column].push(array[newRow][column])
		}
	}
	return newArray
}
console.log(rotate(tac))
function rotate(array) {
	const column = 5
	const row = 5
	let newArray = new Array(column) // create an empty array of length n
	for (var i = 0; i < column; i++) {
		newArray[i] = new Array(row) // make each element an array
	}
	console.log(newArray) //  Output: [ [ <5 empty items> ], [ <5 empty items> ], [ <5 empty items> ], [ <5 empty items> ] ]

	for (let row = 0; row < array.length; row++) {
		for (let column = 0; column < array[row].length; column++) {
			// Runs 5 times, with values of step 0 through 4.
			newRow = Math.abs(row - array[row].length + 1)
			newArray[column].push(array[newRow][column])
		}
	}
	return newArray
}
console.log(rotate(tac))
