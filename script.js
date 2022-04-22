/*jshint esversion: 6 */

var app = new function(){

    //Add functionality so that a word can't be the answer 
    //twice in a row - currently not working (make state array 
    //2 items long and spam new game to test) 

    this.category = '';
    this.guessCount = 0;
    this.guessesAllowed = 9;
    this.answer = '';
    this.answerArray = [];
    this.prevAnswer = '';

    this.fillBoard = function(){
        const alphabet = [
            "A", "B", "C", "D",
            "E", "F", "G", "H",
            "I", "J", "K", "L", 
            "M", "N", "O", "P", 
            "Q", "R", "S", "T", 
            "U", "V", "W", "X", 
            "Y", "Z", "Space"
        ];
        let board = document.getElementById("board");
        let answerBlanks = document.getElementById('blanks');
        let guessHtml = document.getElementById('guesses-left');

        //Delete old board/answer from last game, then create new board
        guessHtml.innerHTML = "Guesses Left: " + this.guessesAllowed ;
        board.innerHTML = '';
        answerBlanks.innerHTML="";
        for(let i=0; i<alphabet.length; i++){
            board.innerHTML += `<p id="char-`+alphabet[i]+`" onClick="app.guess('`+alphabet[i]+`')">`+alphabet[i]+`<p>`;
        }
    };

    this.setDifficulty = function(diff){
        let guessHtml = document.getElementById('guesses-left');
        let easyBtn = document.getElementById('easy-btn');
        let hardBtn = document.getElementById('hard-btn');
        switch(diff){
            case "easy":
                if(this.guessCount > 0){
                    this.guessCount = 0;
                    this.fillBoard();
                    this.setAnswer();
                }
                this.guessesAllowed = 9;
                guessHtml.innerHTML = "Guesses Left: "+this.guessesAllowed;
                easyBtn.classList.add('selected-btn');
                hardBtn.classList.remove('selected-btn');
                break;
            case "hard":
                if(this.guessCount > 0){
                    this.guessCount = 0;
                    this.fillBoard();
                    this.setAnswer();
                }
                this.guessesAllowed = 6;
                guessHtml.innerHTML = "Guesses Left: "+this.guessesAllowed;
                hardBtn.classList.add('selected-btn');
                easyBtn.classList.remove('selected-btn');
                break;
            default:
                this.setDifficulty("easy");  
        }
    };

    this.setCategory = function(cat){
        let answerBlanks = document.getElementById('blanks');
        answerBlanks.innerHTML="";
        let catHeader = document.getElementById('category-header');
        switch (cat){
        case 'Fruits':
            this.category= 'Fruits';
            if(this.guessCount > 0){
                this.guessCount = 0;
                this.fillBoard();
            }
            break;
        case 'States':
            this.category='States';
            if(this.guessCount > 0){
                this.guessCount = 0;
                this.fillBoard();
            }
            break;
        default: 
            this.category="States";
        }
        catHeader.innerHTML = `Current Category: `+ this.category +``;
        this.setAnswer();
    };

    this.setAnswer = function(){
        const states = [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California",
            "Colorado", "Connecticut", "Delaware", "Florida", "Georgia",
            "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
            "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
            "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", 
            "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
            "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
            "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
            "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", 
            "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
        ];
        const fruits = [
            "Apple", "Banana", "Orange", "Blueberry", "Strawberry",
            "Lime", "Lemon", "Mango", "Grape", "Watermelon", "Kiwi",
            "Cherry", "Pomegranate", "Pineapple", "Apricot", "Peach",
            "Pear", "Plum"
        ];
        
        let index;
        const stateBtn = document.getElementById('state-btn');
        const fruitBtn = document.getElementById('fruit-btn');
        switch(this.category){
            case 'States':
                stateBtn.classList.add('selected-btn');
                fruitBtn.classList.remove('selected-btn');
                index = Math.floor(Math.random()* states.length);
                this.answer = states[index].toUpperCase();

                //This should work but it doesn't?? Find a better way to do it
                if(this.answer === this.prevAnswer){
                    console.log('Two similar answers in a row. Setting new answer');
                    this.setAnswer();
                } else this.setAnswerBlanks();
            break;
          
            case 'Fruits':
                fruitBtn.classList.add('selected-btn');
                stateBtn.classList.remove('selected-btn');
                index = Math.floor(Math.random()* fruits.length);
                this.answer = fruits[index].toUpperCase();

                //This should work but it doesn't??
                if(this.answer === this.prevAnswer){
                    console.log('Two similar answers in a row. Setting new answer');
                    this.setAnswer();
                } else this.setAnswerBlanks();
            break;
        }
        console.log(this.answer);
        this.answerArray = this.answer.split('');
    };

    this.guess = function(guess){
        if(this.category){
            
            //Prevent multiple clicks on same guess from subtracting from guesses left
            let guessClick = document.getElementById('char-'+guess+'');
            if(guessClick.hasAttribute('onclick')){
                guessClick.removeAttribute('onclick')
            }
            this.animateGuess(guess); 
            if(guess == "Space"){
                guess = " ";
            }
           
            //If the guess is in the answerArray, iterate through answerArray
            //For each match between answerArray and guess, send the array index
            //and the guess to guessCorrect.
            if(this.answerArray.includes(guess)){
                for(let i=0; i<this.answerArray.length; i++){
                    if(this.answerArray[i] == guess){
                        this.guessCorrect(i, guess);
                    }
                }
            } else {
                this.guessCount++;
                let guessHtml = document.getElementById('guesses-left');
                guessHtml.innerHTML = "Guesses Left: " + (this.guessesAllowed - this.guessCount);
                if(this.guessCount == this.guessesAllowed){
                    setTimeout(() => {alert("You lose! The answer was: " + this.answer);}, 750);
                    setTimeout(() => {this.newGame();}, 1000);
                }
            }
        } else alert("Choose a Category!");
    };

    //Pos is the index position, which corresponds to the id given to each blank
    this.guessCorrect = function(pos, guess){
        let position = pos +1;
        let answerCharacter = document.getElementById("blank-"+position+"");
        answerCharacter.innerHTML = guess;
        
        let answerHtml = [];
        //Add letters to answerHtml array - for checking if player won
        //Hard to tell if space is correct since it just deletes a blank
        //Try to find a fix for that
        for(let i=1; i <= this.answerArray.length; i++){
            answerHtml += document.getElementById("blank-"+i+"").innerHTML;
        }
        if(answerHtml == this.answer){
            this.celebrate();
            setTimeout(() => {alert("You win! New game is starting");}, 750);
            setTimeout(() => {this.newGame();}, 1000);
            //If player hasn't won yet, clear array for next guess
        } else {
            answerHtml = [];
        }
    };

    this.animateGuess = function(guess){
        let boardCharacter = document.getElementById("char-"+guess+"");
        boardCharacter.style.color = "red";
        boardCharacter.style.animation = "drop-fade 3s 1";
        boardCharacter.style.animationFillMode = "forwards";
    };
    this.celebrate = function(){
        //Add a simple, cool animation here for when someone wins
        
    };
    
    this.setAnswerBlanks = function(){
        let answerBlanks = document.getElementById('blanks');
        
        //Start at 1 because string lengths start at 1, not 0
        for(let i=1; i<=this.answer.length; i++){
            answerBlanks.innerHTML += `<span id="blank-`+i+`"> __ <span>`;
        }
        
    };

    this.newGame = function(){
        //Setup for a new game
        //this.category = '';
        this.guessCount = 0;
        //prevAnswer not working I think
        this.prevAnswer = this.answer;
        app.fillBoard();
        app.setCategory();
    };
}

//Start new game
app.newGame();
