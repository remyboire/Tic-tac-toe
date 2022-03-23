// Choose player 1 mark
// Chose if VS CPU OR VS PLAYER

// Round start
// Player place a mark
// Display mark
// If WIN -> WIN
// change player -> Round start

// WIN
// Display win screen
// Add 1 point to the winner
// Play again ?
// If yes -> Round start
let menu = document.querySelector('.menu')
let logo = document.querySelector('.board__logo')

let board = document.querySelector('.board')

let cards = document.querySelector('.board__cards')
let card = document.querySelectorAll('.board__card')

let Xscore = document.querySelector('.board__score--X output')
let Oscore = document.querySelector('.board__score--O output')
let TieScore = document.querySelector('.board__score--tie output')

let banner = document.querySelectorAll('.banner')
let banner_winner = document.querySelector('.banner__winner')
let banner_restart = document.querySelector('.banner__restart')
let banner_tie = document.querySelector('.banner__tie')

let button_launch = document.querySelectorAll('.button__launch')
let button_quit = document.querySelectorAll('.button__quit')
let button_cancel = document.querySelectorAll('.button__cancel')
let button_restart = document.querySelectorAll('.button__restart')
let restart_game = document.querySelectorAll('.button__restart--game')
let button_x_picked = document.querySelector('.button__x-picked')
let button_o_picked = document.querySelector('.button__o-picked')

var Xwins = 0
var Owins = 0
var Ties = 0

var opponent = 'human'
var isPlayerX = true
var vsCPU = false
var isHumanTurn = true

var Xmoves = []
var Omoves = []

var winingCombinaisons = [
	[1, 2, 3],
	[4, 5, 6],
	[7, 8, 9],
	[1, 4, 7],
	[2, 5, 8],
	[3, 6, 9],
	[1, 5, 9],
	[3, 5, 7],
]

cards.addEventListener('click', (e) => {
	// Target elements that are not board container and that are not played
	if (e.target != cards && !e.target.classList.contains('played') && isHumanTurn) humanHandler(e.target)
})

logo.addEventListener('click', quit)

button_x_picked.addEventListener('click', (element) => {
	isHumanTurn = true
	element.target.classList.add('activated')
	button_o_picked.classList.remove('activated')
})
button_o_picked.addEventListener('click', (element) => {
	isHumanTurn = false
	element.target.classList.add('activated')
	button_x_picked.classList.remove('activated')
})
for (const button of button_launch) {
	button.addEventListener('click', (element) => {
		launch(element.target.getAttribute('data-opponent'))
	})
}
for (const button of button_quit) {
	button.addEventListener('click', quit)
}
for (const button of button_cancel) {
	button.addEventListener('click', hideBanners)
}
for (const button of button_restart) {
	button.addEventListener('click', () => {
		showBanner('restart')
	})
}
for (const button of restart_game) {
	button.addEventListener('click', () => {
		hideBanners()
		restart()
	})
}

function humanHandler(target) {
	// Place a played marker
	target.classList.add('played')

	// If player X is playing, add a X marker
	// else player O is playing, so add a O marker
	if (isPlayerX) target.classList.add('X')
	else target.classList.add('O')

	// Get target value
	// parseInt transform string into number,
	// Store move played in player's moves
	if (isPlayerX) Xmoves.push(parseInt(target.getAttribute('data-value')))
	else Omoves.push(parseInt(target.getAttribute('data-value')))

	// Compare each wining combinaisons with played
	endOfTurn()
}

function CPUHandler() {
	// Determine possible moves, which are moves that are not in Xmoves, neither in Omoves
	var possibleMoves = new Array()
	for (var i = 1; i < 10; i++) if (!Xmoves.concat(Omoves).includes(i)) possibleMoves.push(i)
	// First, find a move randomly
	var choosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

	if (isPlayerX) {
		// determine if opponent can win
		determineMove(Omoves, possibleMoves)
		// determine if CPU can win
		determineMove(Xmoves, possibleMoves)
		playMove(choosenMove)
	} else {
		// determine if opponent can win
		determineMove(Xmoves, possibleMoves)
		// determine if CPU can win
		determineMove(Omoves, possibleMoves)
		playMove(choosenMove)
	}

	function determineMove(moveSet, possibleMoves) {
		// Pour chaque combinaison gagnante
		for (const combinaison of winingCombinaisons) {
			var matches = 0
			// Pour chaque coup joué
			for (var i = 0; i < moveSet.length; i++) {
				// On compare la combinaison avec le coup joué
				if (combinaison.find((element) => element == moveSet[i])) {
					matches++
					// If we have two match, try to play the third move
					if (matches == 2) {
						// Extracting unplayed move
						var b = new Set(moveSet)
						var winingMove = [...combinaison].filter((x) => !b.has(x))
						var winingMove = parseInt(winingMove)
						// If unplayed move is possible, play it
						if (possibleMoves.includes(winingMove)) {
							console.log('wining move ' + winingMove)
							return (choosenMove = winingMove)
						}
					}
				}
			}
		}
	}
	// playMove(move)

	// Choose a random number in possible moves

	// Play the move
	function playMove(move) {
		console.log('playing move ' + move)
		document.querySelector("[data-value='" + move + "']").classList.add('played')
		if (isPlayerX) document.querySelector("[data-value='" + move + "']").classList.add('X')
		else document.querySelector("[data-value='" + move + "']").classList.add('O')

		// Store move played in player's moves
		if (isPlayerX) Xmoves.push(move)
		else Omoves.push(move)
		endOfTurn()
	}
}

function endOfTurn() {
	// If player X is playing, compare his moves
	// Else O is playing, so compare his moves instead
	if (isPlayerX) var playerMoves = Xmoves
	else playerMoves = Omoves

	// For each wining combinaisons possible,
	// Compare played moves
	for (const combinaison of winingCombinaisons) {
		if (combinaison.every((moves) => playerMoves.includes(moves))) {
			// Si player win
			// wins ++
			if (isPlayerX) Xwins++
			else Owins++
			changePlayer()
			updateScores()
			return showBanner('winner')
		}
	}
	// Check for tie, if all card have been played, this is a tie
	var count = 0
	for (var i = 0; i < card.length; i++) {
		if (card[i].classList.contains('played')) count++
	}
	if (count == card.length) {
		Ties++
		updateScores()
		showBanner('tie')
		return changePlayer()
	} else {
		changePlayer()
		// If CPU play and it's his turn, he plays
		if (vsCPU && !isHumanTurn) CPUHandler()
	}
}
function changePlayer() {
	isPlayerX = !isPlayerX
	board.classList.toggle('O-turn')
	board.classList.toggle('X-turn')
	if (vsCPU) isHumanTurn = !isHumanTurn
}

function updateScores() {
	Xscore.value = Xwins
	Oscore.value = Owins
	TieScore.value = Ties
}

function restart() {
	// Set values to 0
	Xmoves = []
	Omoves = []
	card.forEach((card) => {
		card.classList.remove('played')
		card.classList.remove('X')
		card.classList.remove('O')
	})
	if (opponent == 'CPU' && isHumanTurn == false) CPUHandler()
}
function launch(data_opponent) {
	opponent = data_opponent
	board.classList.add('visible')
	board.classList.remove('O-turn')
	board.classList.add('X-turn')
	isPlayerX = true
	Xmoves = []
	Omoves = []
	card.forEach((card) => {
		card.classList.remove('played')
		card.classList.remove('X')
		card.classList.remove('O')
	})
	Xwins = 0
	Owins = 0
	Ties = 0
	updateScores()
	menu.classList.remove('visible')
	if (opponent == 'CPU') vsCPU = true
	if (opponent == 'CPU' && isHumanTurn == false) CPUHandler()
}
function quit() {
	board.classList.remove('visible')
	hideBanners()
	menu.classList.add('visible')
}

function showBanner(option) {
	if (option == 'winner') {
		banner_winner.classList.add('visible')
	}
	if (option == 'restart') {
		banner_restart.classList.add('visible')
	}
	if (option == 'tie') {
		banner_tie.classList.add('visible')
	}
}

function hideBanners() {
	for (const banners of banner) {
		banners.classList.remove('visible')
	}
}
