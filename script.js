"use strict";

let buttons = document.querySelectorAll('.button'); //get buttons from game area
let figureSelection = document.querySelector('.selection'); //get menu of figure selection
let selectionContent = document.querySelector('.select'); //get content in menu of figure selection
let line = document.querySelector('.line'); //get content in menu of figure selection

let gameStatus = document.querySelector('#status'); //get status of game
let figure = document.querySelector('#figure'); //get changing-figure button
let startButton = document.querySelector('#start'); //get start-game button

let hoverColorsClasses = ['blue', 'red']; //list of CSS classes
let activeColors = ['#79DFFF', '#FF71C6']; //list of HEX colors on clicking
let figures = ['Circle.gif', 'Cross.gif']; //list of figures
let colorIndex = 0; //color index for Color lists
let figureIndex = 0; //figure index for figure list
let buttonActivated = 0; //how many buttons was activated

let gameEnd = false; //bool if game is ended

let field = []; //game field
let stringField = ''; //game field converted in string for checking results
let row = ['0', '0', '0']; //default game row
let lettersToNumbers = { //convert letters to numbers for field indexes
    'a': 0,
    'b': 1,
    'c': 2
}

function MakeTable(table, row) { //function that makes table with lists
    for (let i = 0; i < 3; i++) {
        table.push([row[0], row[1], row[2]]);
    };
    return table;
}

field = MakeTable(field, row); //set field by table

function CheckWin(table) { //checks who is Winner
    let diagonalR = '';
    let diagonalL = '';

    let columns = '';

    let result = 'draw';
    for (let row of table.split('|')) { //check rows
        if (row == 'xxx') {
            result = `x R${table.split('|').indexOf('xxx')}`;
        } else if (row == 'ooo') {
            result = `o R${table.split('|').indexOf('ooo')}`;
        }
    }
    for (let i = 0; i < 3; i++) { //check diagonals
        diagonalR += stringField.split('|')[i][2 - i];
        diagonalL += stringField.split('|')[i][i];

        if (diagonalR == 'xxx') {
            result = 'x RT';
        } else if (diagonalL == 'xxx') {
            result = 'x LT';
        } else if (diagonalR == 'ooo') {
            result = 'o RT';
        } else if (diagonalL == 'ooo') {
            result = 'o LT';
        }
    }
    for (let j = 0; j < 3; j++) { //make columns from table
        for (let q = 0; q < 3; q++) {
            columns += stringField.split('|')[q][j];
        }
        columns += '|';
    }
    for (let c of columns.split('|')) { //check columns
        if (c == 'xxx') {
            result = `x C${columns.split('|').indexOf('xxx')}`;
        } else if (c == 'ooo') {
            result = `o C${columns.split('|').indexOf('ooo')}`;
        }
    }
    return result;
}

function DrawLine(result) {
    let height = '620px';
    let rotation = {
        'RT': 45,
        'LT': -45,
        'C0': 0,
        'C1': 0,
        'C2': 0,
        'R0': 90,
        'R1': 90,
        'R2': 90
    }
    let positionSide = {
        'C0': -325,
        'C1': 0,
        'C2': 325,
        'RT': 0,
        'LT': 0
    }
    let positionTop = {
        'R0': -325,
        'R1': 0,
        'R2': 325,
        'RT': 0,
        'LT': 0,
        'C0': 0,
        'C1': 0,
        'C2': 0
    }
    if (rotation[result] == 0 || rotation[result] == 90) {
        height = '440px';
    }
    return [rotation[result], positionSide[result], positionTop[result], height];
}

figure.addEventListener('click', function() { //toggle figures by click
    figureIndex += 1;
    figureIndex %= 2;
    figure.src = `imgs/${figures[figureIndex]}`;
});

startButton.addEventListener('click', function() { //start game
    figureSelection.style.width = '0';
    figureSelection.style.height = '0';
    selectionContent.remove();
    gameStatus.innerHTML = 'Role: <span id="role_color">blue</span>';
});

for (let button of buttons) {
    button.addEventListener('mouseover', function(e) {
        if (e.target.id == '' && !gameEnd) {
            e.target.classList.add(hoverColorsClasses[colorIndex]);
        }
    }); //add color if hovered
    button.addEventListener('mouseout', function(e) {
        if (e.target.id == '' && !gameEnd) {
            e.target.classList.remove(hoverColorsClasses[colorIndex]);
        }
    }); //remove color if not hovered
    button.addEventListener('click', function(e) {
        if (e.target.id == '' && !gameEnd) { //if wasn`t activated
            e.target.id = (e.target.className).slice(7, 9); //change id to get position in field later

            e.target.style.backgroundColor = activeColors[colorIndex]; // change color
            e.target.style.backgroundImage = `url('imgs/${figures[figureIndex]}')`; //set figure that we`ve chosen

            role_color.style.color = activeColors[1 - colorIndex]; //change game status
            role_color.innerHTML = hoverColorsClasses[1 - colorIndex]; //change color in game status

            let lettersArr = Array.from(e.target.id); //split id by letter
            let first = lettersToNumbers[lettersArr[0]]; //get Y position
            let second = lettersToNumbers[lettersArr[1]]; //get X position

            if (figureIndex == 0) //if figure is circle
                field[first][second] = "o";
            else
                field[first][second] = "x";

            colorIndex += 1;
            colorIndex %= 2;
            figureIndex += 1;
            figureIndex %= 2;
            stringField = '';
            for (let row of field) {
                for (let f of row) {
                    stringField += f;
                }
                stringField += "|";
            }
            buttonActivated += 1;
            if (CheckWin(stringField) != 'draw') {
                gameStatus.innerHTML = `Winner is ${CheckWin(stringField).slice(0,1)}`;
                gameEnd = true;
            } else if (buttonActivated == 9) {
                gameStatus.innerHTML = 'Draw';
                gameEnd = true;
            }
            console.log()
            if (DrawLine(CheckWin(stringField).slice(2, 4))[0] != undefined) {
                line.style.transform = `rotate(${parseInt(DrawLine(CheckWin(stringField).slice(2, 4))[0])}deg)`;
                line.style.marginLeft = `${parseInt(DrawLine(CheckWin(stringField).slice(2, 4))[1])}px`;
                line.style.marginTop = `${parseInt(DrawLine(CheckWin(stringField).slice(2, 4))[2])}px`;
                line.style.height = `${parseInt(DrawLine(CheckWin(stringField).slice(2, 4))[3])}px`;
                line.style.boxShadow = '0px 0px 4px rgba(0, 0, 0, 0.25)';
                line.style.backgroundColor = '#FFF';
            }
        }
    });
}