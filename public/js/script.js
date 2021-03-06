let menu = document.querySelector('.menu')
let logo = document.querySelector('.board__logo')

let board = document.querySelector('.board')
let board_turn = document.querySelector('.board__turn')

let cards = document.querySelector('.board__cards')
let card = document.querySelectorAll('.board__card')

let Xscore = document.querySelector('.board__score--X .output')
let XscoreLabel = document.querySelector('.board__score--X .label')
let OscoreLabel = document.querySelector('.board__score--O .label')

let Oscore = document.querySelector('.board__score--O .output')
let TieScore = document.querySelector('.board__score--tie .output')

let banner = document.querySelectorAll('.banner')
let banner_winner = document.querySelector('.banner__winner')
let banner_restart = document.querySelector('.banner__restart')
let banner_tie = document.querySelector('.banner__tie')

let banner_whowins = document.querySelectorAll('.whoWins div')
let human_wins = document.querySelector('.humanWins')
let cpu_wins = document.querySelector('.cpuWins')
let player1_wins = document.querySelector('.playerOneWins')
let player2_wins = document.querySelector('.playerTwoWins')

let banner_whotakes = document.querySelectorAll('.whoTakes div')
let x_takes = document.querySelector('.x-takes')
let o_takes = document.querySelector('.o-takes')

let button_launch = document.querySelectorAll('.button__launch')
let button_quit = document.querySelectorAll('.button__quit')
let button_cancel = document.querySelectorAll('.button__cancel')
let button_restart = document.querySelectorAll('.button__restart')
let restart_game = document.querySelectorAll('.button__restart--game')

let selectMark = document.querySelector('.selectMark__wrapper')
let selectMark_x = document.querySelector('.selectMark--x')
let selectMark_o = document.querySelector('.selectMark--o')

var Xwins = 0
var Owins = 0
var Ties = 0

var opponent = 'human'
var isPlayerX = true
var playerOneisX = true
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
	[7, 5, 3],
]

cards.addEventListener('click', (e) => {
	if (e.target != cards && !e.target.classList.contains('played') && isHumanTurn) humanHandler(e.target)
})

logo.addEventListener('click', quit)

selectMark_x.addEventListener('click', () => {
	playerOneisX = true
	selectMark.classList.add('x-picked')
	selectMark.classList.remove('o-picked')
})
selectMark_o.addEventListener('click', () => {
	playerOneisX = false
	selectMark.classList.add('o-picked')
	selectMark.classList.remove('x-picked')
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
	target.classList.add('played')

	if (isPlayerX) target.classList.add('X')
	else target.classList.add('O')

	if (isPlayerX) Xmoves.push(parseInt(target.getAttribute('data-value')))
	else Omoves.push(parseInt(target.getAttribute('data-value')))

	endOfTurn()
}

function CPUHandler() {
	var possibleMoves = new Array()
	for (var i = 1; i < 10; i++) if (!Xmoves.concat(Omoves).includes(i)) possibleMoves.push(i)

	var choosenMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]

	if (isPlayerX) {
		var CPUmoves = [...Xmoves]
		var HumanMoves = [...Omoves]
	} else {
		var CPUmoves = [...Omoves]
		var HumanMoves = [...Xmoves]
	}

	determineMove(HumanMoves, possibleMoves)
	determineMove(CPUmoves, possibleMoves)
	playMove(choosenMove)

	function determineMove(moveSet, possibleMoves) {
		for (const combinaison of winingCombinaisons) {
			var matches = 0
			for (var i = 0; i < moveSet.length; i++) {
				if (combinaison.find((element) => element == moveSet[i])) {
					matches++
					if (matches == 2) {
						var twoMoves = new Set(moveSet)
						var winingMove = parseInt([...combinaison].filter((missingMove) => !twoMoves.has(missingMove)))
						if (possibleMoves.includes(winingMove)) {
							return (choosenMove = winingMove)
						}
					}
				}
			}
		}
	}

	function playMove(move) {
		document.querySelector("[data-value='" + move + "']").classList.add('played')
		if (isPlayerX) document.querySelector("[data-value='" + move + "']").classList.add('X')
		else document.querySelector("[data-value='" + move + "']").classList.add('O')

		if (isPlayerX) Xmoves.push(move)
		else Omoves.push(move)

		board_turn.classList.remove('thinking')
		endOfTurn()
	}
}

function endOfTurn() {
	if (isPlayerX) var playerMoves = Xmoves
	else playerMoves = Omoves

	if (vsCPU) board.classList.toggle('playable')

	for (const combinaison of winingCombinaisons) {
		if (combinaison.every((moves) => playerMoves.includes(moves))) {
			return weHaveAWinner(combinaison)
		}
	}

	var count = 0
	for (var i = 0; i < card.length; i++) {
		if (card[i].classList.contains('played')) count++
	}
	if (count == card.length) {
		Ties++
		changePlayer()
		updateScores()
		return showBanner('tie')
	} else {
		changePlayer()
		if (vsCPU && !isHumanTurn) {
			board_turn.classList.add('thinking')
			window.setTimeout(CPUHandler, Math.floor(Math.random() * 750) + 750)
		}
	}
}

function weHaveAWinner(combinaison) {
	var i = 1
	for (const winingCards of combinaison) {
		setTimeout(function () {
			document.querySelector("[data-value='" + winingCards + "']").classList.add('wins')
		}, 250 * i)
		++i
	}
	setTimeout(function () {
		if (isPlayerX) Xwins++
		else Owins++
		showBanner('winner')
		changePlayer()
		return updateScores()
	}, 1000)
}

function changePlayer() {
	isPlayerX = !isPlayerX
	board.classList.toggle('O-turn')
	board.classList.toggle('X-turn')
	if (vsCPU) isHumanTurn = !isHumanTurn
}

function updateScores() {
	Xscore.innerHTML = Xwins
	Oscore.innerHTML = Owins
	TieScore.innerHTML = Ties
}

function updateScoresLabels() {
	if (vsCPU)
		if (playerOneisX) {
			XscoreLabel.innerHTML = 'X (YOU)'
			OscoreLabel.innerHTML = 'O (CPU)'
		} else {
			XscoreLabel.innerHTML = 'X (CPU)'
			OscoreLabel.innerHTML = 'O (YOU)'
		}

	if (!vsCPU)
		if (playerOneisX) {
			XscoreLabel.innerHTML = 'X (P1)'
			OscoreLabel.innerHTML = 'O (P2)'
		} else {
			XscoreLabel.innerHTML = 'X (P2)'
			OscoreLabel.innerHTML = 'O (P1)'
		}
}

function restart() {
	// Set values to 0
	Xmoves = []
	Omoves = []
	card.forEach((card) => {
		card.classList.remove('played')
		card.classList.remove('wins')
		card.classList.remove('X')
		card.classList.remove('O')
	})
	if (opponent == 'CPU' && isHumanTurn == false) {
		window.setTimeout(CPUHandler, 1000)
	}
}
function launch(data_opponent) {
	board.classList.add('visible', 'playable', 'X-turn')
	board.classList.remove('O-turn')
	isPlayerX = true
	Xmoves = []
	Omoves = []
	card.forEach((card) => {
		card.classList.remove('played', 'wins', 'X', 'O')
	})
	Xwins = 0
	Owins = 0
	Ties = 0

	opponent = data_opponent
	if (opponent == 'CPU') vsCPU = true
	else vsCPU = false
	if (vsCPU && !playerOneisX) {
		isHumanTurn = false
		board.classList.remove('playable')
		window.setTimeout(CPUHandler, 1000)
	}
	updateScores()
	updateScoresLabels()
	menu.classList.remove('visible')
}
function quit() {
	board.classList.remove('visible')
	hideBanners()
	menu.classList.add('visible')
}

function showBanner(option) {
	if (option == 'winner') {
		banner_winner.classList.add('visible')
		if (vsCPU)
			if (isHumanTurn) human_wins.classList.add('visible')
			else cpu_wins.classList.add('visible')

		if (!vsCPU)
			if ((playerOneisX && isPlayerX) || (!playerOneisX && !isPlayerX)) player1_wins.classList.add('visible')
			else player2_wins.classList.add('visible')

		if (isPlayerX) x_takes.classList.add('visible')
		else o_takes.classList.add('visible')
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
	for (const banners of banner_whowins) {
		banners.classList.remove('visible')
	}
	for (const banners of banner_whotakes) {
		banners.classList.remove('visible')
	}
}
