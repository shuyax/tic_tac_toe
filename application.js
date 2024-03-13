const Gameboard = function(){
    let gameboard = [];
    const createBoard = (grid_num) => {
        // Create one row with grid_num cells
        let row = []
        // Create grid_num rows
        for (let i = 0; i < grid_num; i++) {
            let row = [];
            // Create one row with grid_num cells
            for (let j = 0; j < grid_num; j++) {
                row.push('');
            }
            gameboard.push(row);
        }
    };
    const updateBoard = (row,col,simple) => {
        if (gameboard[row][col] == '') {
            gameboard[row][col] = simple
            console.log(gameboard)
            return true
        } else {
            updateBoard();
        }
        
    };
    const resetBoard = () => {
        gameboard = []
        console.log(gameboard)
    };

    const checkBoard = () => {
        for (i = 0; i < 3; i++){
            if (
                gameboard[i].every(item => item == gameboard[i][0] && item != '') || 
                gameboard.every(row => row[i] == gameboard[0][i] && row[i] != '') || 
                ((gameboard[0][0] == gameboard[1][1] && gameboard[1][1] == gameboard[2][2]) && gameboard[0][0] != '') || 
                ((gameboard[0][2] == gameboard[1][1] && gameboard[1][1] == gameboard[2][0]) && gameboard[0][2] != '')
            ){
                console.log(i)
                return true
            } 
        } 
        return false
    }

    const fullBoard = () => {
        for (i = 0; i < 3; i++){
            for (j = 0; j < 3; j++){
                if (gameboard[i][j] == ''){
                    return false
                }
            }
        }
        return true
    }
    return {createBoard, updateBoard, resetBoard, checkBoard, fullBoard}
}();


const Player = function() {
    let playerList = [];
    const createPlayer = function createPlayer(name, simple) {
        name = prompt('What is your name?')
        if (playerList.length == 0){
            simple = 'X'
        }else if(playerList.length == 1){
            simple = 'O'
        }
        playerList.push({name: name, simple: simple})
        return {name: name, simple: simple}
    };
    
    const resetPlayers = () => {
        playerList = []
    };
    return {createPlayer, resetPlayers}
}();



const Game = (function(){
    let currentPlayer
    let player1
    let player2
    const startGame = () => {
        Gameboard.resetBoard();
        Player.resetPlayers();
        Gameboard.createBoard(3);
        player1 = Player.createPlayer();
        player2 = Player.createPlayer();
        currentPlayer = player1
    };
    const switchTurn = () => {
        if (currentPlayer == player1){
            currentPlayer = player2
        } else if (currentPlayer == player2){
            currentPlayer = player1
        }
    };
    const checkResult = () => {
        if (Gameboard.checkBoard() == true){
            return true
        }
    };

    const getCurrentPlayer = () => {
        return currentPlayer;
    }
    const getPlayer1 = () => {
        return player1;
    }
    const getPlayer2 = () => {
        return player2;
    }
    return {startGame, switchTurn, checkResult, getCurrentPlayer, getPlayer1, getPlayer2}
})();


const Display = (function(){
    const __init__ = () => {
        addStartButtonEvent();
        addButtonsEvent();
    }

    const addStartButtonEvent = () => {
        const button = document.querySelector('.start')
        button.addEventListener('click', () => {
            Game.startGame();
            displayPlayers();
            resetButtons();
            resetResult();
        })
        
    }

    // Create grid
    const createButtons = (button_num) => {
        const gameboard = document.querySelector('.gameboard')
        const row_num = Math.sqrt(button_num)
        const col_num = Math.sqrt(button_num)
        for (i = 0; i < row_num; i++){
            for (j = 0; j < col_num; j++) {
                const button = document.createElement('button');
                button.classList.add('grid')
                button.setAttribute('id', i+','+j);
                gameboard.appendChild(button)
            }
            
        }
    }
    // Add eventlistner to each button
    const addButtonsEvent = () => {
        createButtons(9);
        const buttons = document.querySelectorAll('.grid')
        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('id').split(',')
                const change = Gameboard.updateBoard(id[0],id[1],Game.getCurrentPlayer().simple)
                const result = Game.checkResult();
                if (result == true){
                    displayResult(Game.getCurrentPlayer().name)
                } else if (Gameboard.fullBoard() == true) {
                    alert('No player wins.')
                    location.reload();
                } else if (change == true) {
                    button.textContent = Game.getCurrentPlayer().simple
                    Game.switchTurn();
                    displayPlayers();
                }
            })
            
        });
    }

    const resetButtons = () => {
        const buttons = document.querySelectorAll('.grid')
        buttons.forEach((button) => {
            button.textContent = ''
        })
    }

    const resetResult = () => {
        const result = document.querySelector('.result')
        result.textContent = ''
    }


    const displayResult = (result) => {
        const display_content = document.querySelector('.result');
        console.log(typeof(display_content.textContent))
        if (display_content.textContent == ''){
            display_content.textContent = result + ' wins!'
        }
    }


    const displayPlayers = () => {
        const player1 = document.querySelector('.player1');
        const player2 = document.querySelector('.player2');
        const current_player = document.querySelector('.current-player');

        player1.textContent = 'Player 1: ' +  Game.getPlayer1().name  
        player2.textContent = 'Player 2: ' +  Game.getPlayer2().name 
        current_player.textContent = 'Current Player: ' + Game.getCurrentPlayer().name

    }


    return {__init__ }
})();

Display.__init__();