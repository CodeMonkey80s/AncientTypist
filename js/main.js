/*globals $:false */
/*globals URLSearchParams:false */
/*globals Chart:false */

const debug = false;

// Wait for everything to be loaded...
$(document).ready(function () {
    'use strict';

    /**
     * Application
     */
    class Application {

        /**
         * Assign defaults...
         */
        constructor() {

            // App 
            this.appName = $('#appName').text();
            this.appVersion = $('#appVersion').text();
            this.appState = 'ready'; // States: ready, paused, typing, finished
            this.booksNum = 6;
            // Storage
            this.localStorage = window.localStorage;
            this.maxElementsOnGraph = 32;
            // Book
            let searchParams = new URLSearchParams(window.location.search);
            this.bookId = searchParams.get('book') || this.localStorage.getItem("bookId");
            this.bookCurrentPage = searchParams.get('page') || this.localStorage.getItem("bookCurrentPage");
            if (!this.bookId) {
                this.bookId = $('#bookId').text();
            }
            if (!this.bookCurrentPage) {
                this.bookCurrentPage = $('#page').text();
            }
            this.localStorage.setItem("bookId", this.bookId);
            this.localStorage.setItem("bookCurrentPage", this.bookCurrentPage);
            if (!searchParams.has('book') && !searchParams.has('page')) {
                window.location.href = "/?book=" + this.bookId + "&page=" + this.bookCurrentPage;
            }
            this.bookTotalPages = parseInt($('#totalPages').text());
            // Player
            this.playerRewardGems = this.localStorage.getItem("playerRewardGems") || 0;
            this.playerProgress = this.localStorage.getItem("playerProgress") || "[]";
            this.playerTotalFinishedPages = this.localStorage.getItem("playerTotalFinishedPages") || 0;
            this.playerTotalTime = this.localStorage.getItem("playerTotalTime") || 0;
            this.playerRewardGems = 0;
            // Initialize player initial progress...
            if (this.playerProgress==="[]") {
                let playerProgressArray = Array();
                for (let j = 1; j <= this.booksNum; j++) {
                    let bookPages = parseInt($("#tableBooks td.book[data-book-id=" + j + "] span.pagesNum").text());
                    playerProgressArray[j] = Array(bookPages);
                }
                this.playerProgress = JSON.stringify(playerProgressArray);
                this.localStorage.setItem("playerProgress", JSON.stringify(playerProgressArray));
            } else {
                let playerProgressArray = JSON.parse(this.playerProgress);
                for (let j = 1; j <= this.booksNum; j++) {
                    if (!playerProgressArray[j]) {
                        let bookPages = parseInt($("#tableBooks td.book[data-book-id=" + j + "] span.pagesNum").text());
                        playerProgressArray[j] = Array(bookPages);
                    }
                }


                
                this.playerProgress = JSON.stringify(playerProgressArray);
                this.localStorage.setItem("playerProgress", JSON.stringify(playerProgressArray));
            }
            
            // Options
            this.optionProgressBar = this.localStorage.getItem("optionProgressBar") || "On";
            this.optionSounds = this.localStorage.getItem("optionSounds") || "Off";
            this.optionWordSpeed = this.localStorage.getItem("optionWordSpeed") || "Off";
            this.optionSpeedUnit = this.localStorage.getItem("optionSpeedUnit") || "wpm";
            // Lesson
            this.lessonTotalCharacters = $('#textArea span.char').length || 0;
            this.lessonCursorPosition = 0;
            this.lessonStartTime = 0;
            this.lessonEndTime = 0;
            this.lessonTotalTime = 0;
            this.lessonErrors = 0;
            this.lessonWPM = 0;
            this.lessonCPM = 0;
            this.lessonAccuracy = 0;
            this.lessonMaxGems = 3;
            this.bookMaxGems = (this.lessonMaxGems * this.bookTotalPages);
            this.wordStartTime = 0;
            this.wordEndTime = 0;
            this.wordTotalTime = 0;
            this.wordCharacters = 0;
            this.wordMinLength = 3;
            this.wordStartCursorPosition = this.lessonCursorPosition;
            // Calculate awarded Gems...
            this.playerRewardGems = 0;
            let playerProgressArray = JSON.parse(this.playerProgress);
            for (let i=0; i<playerProgressArray[this.bookId].length; i++) {
                if (playerProgressArray[this.bookId][i]) {
                    this.playerRewardGems += playerProgressArray[this.bookId][i].gems;
                }
            }
            $("#playerRewardGems").text(this.playerRewardGems + "/" + this.bookMaxGems);
            // Lesson Text
            this.lessonAllowedCharacters = [
                ' ', ',', '.', '!', '?', ';', ':', '-', '"', '\'', '(', ')',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
            ];
            // Sounds
            this.audioKeypressFile = "sounds/9744__horn__typewriter.wav";
            this.audioLessonFinished = "sounds/406243__stubb__typewriter-ding-near-mono.wav";
            // App Info
            console.log(this.appName + ' ' + this.appVersion);
            console.log('Book: ' + this.bookId + ', Page: ' + this.bookCurrentPage + '/' + this.bookTotalPages);
            // Display (debug):
            if (debug) {
                console.log("Player Reward Gems: " + this.playerRewardGems);
                console.log("Player Total Time: " + this.playerTotalTime);
                console.log("Player Finished Pages: " + this.playerProgress);
                console.log("Player Total Finished Pages: " + this.playerTotalFinishedPages);    
            }
        }

        clearCursor() {
            $("#textArea span.char").removeClass("cursor");
        }

        setCursorAt(position) {
            $("#textArea span.char:eq(" + position + ")").addClass("cursor");
        }

        setCharacterAsVisitedAt(position) {
            $("#textArea span.char:eq(" + position + ")").addClass("charVisited");
        }

        setCharacterAsErrorAt(position) {
            $("#textArea span.char:eq(" + position + ")").addClass("charError");
        }

        setCharacterAsUnvisitedAt(position) {
            $("#textArea span.char:eq(" + position + ")")
                .removeClass("cursor")
                .removeClass("charVisited")
                .removeClass("charError");
        }

        resetLesson() {
            app.lessonCursorPosition = 0;
            app.lessonStartTime = 0;
            app.lessonEndTime = 0;
            app.lessonErrors = 0;
            app.lessonState = "ready";
            $("#textArea span.char")
                .removeClass("charVisited")
                .removeClass("charVisitedSummary")
                .removeClass("charError")
                .removeClass("charErrorSummary")
                .removeClass("charMeta")
                .removeClass("charMetaSummary")
                .removeClass("cursor");
            $("#textArea span.charMeta").remove();
            $("#textArea span.charMetaSummary").remove();
            $("#textArea span.char:eq("+app.lessonCursorPosition+")").addClass("cursor");
        }

        calculateLessonStatistics() {
            // Calculate...
            this.lessonEndTime = performance.now();
            this.lessonTotalTime = (this.lessonEndTime - this.lessonStartTime) / 1000;
            this.lessonCPM = (60 / this.lessonTotalTime) * this.lessonTotalCharacters;
            this.lessonWPM = (this.lessonCPM / 5);
            this.lessonAccuracy = 100 - ((this.lessonErrors * this.lessonTotalCharacters) / 100);
            if (this.lessonAccuracy > 100) {
                this.lessonAccuracy = 100;
            }
            if (this.lessonAccuracy < 0) {
                this.lessonAccuracy = 0;
            }
            this.lessonGems = 0;
            if (this.lessonErrors < this.lessonMaxGems) {
                this.lessonGems = this.lessonMaxGems - this.lessonErrors;
            }
            if (this.lessonGems < 0) {
                this.lessonGems = this.lessonMaxGems;
            }
            // Prepare values for displaying...
            this.lessonCPM = this.lessonCPM.toFixed(0);
            this.lessonWPM = this.lessonWPM.toFixed(0);
            this.lessonAccuracy = this.lessonAccuracy.toFixed(0);
            this.lessonErrors = this.lessonErrors.toFixed(0);
            this.lessonTotalTime = this.lessonTotalTime.toFixed(0);
            let index = this.bookCurrentPage - 1;

            // Initiazlie player progess... If needed...
            let playerProgressArray = JSON.parse(this.playerProgress);
            playerProgressArray[this.bookId][index] = {
                "speed": this.lessonCPM,
                "errors": this.lessonErrors,
                "accuracy": this.lessonAccuracy,
                "gems": this.lessonGems,
            };
            // Calculate awarded Gems...
            this.playerRewardGems = 0;
            for (let i=0; i<playerProgressArray[this.bookId].length; i++) {
                if (playerProgressArray[this.bookId][i]) {
                    this.playerRewardGems += playerProgressArray[this.bookId][i].gems;
                }
            }
            // Adjust totals...
            this.playerTotalFinishedPages = parseInt(this.playerTotalFinishedPages) + 1;
            this.playerTotalTime = parseInt(this.playerTotalTime) + parseInt(this.lessonTotalTime);
            // Adjust Player Data
            this.localStorage.setItem("playerRewardGems", this.playerRewardGems);
            this.localStorage.setItem("playerProgress", JSON.stringify(playerProgressArray));
            this.localStorage.setItem("playerTotalFinishedPages", this.playerTotalFinishedPages);
            this.localStorage.setItem("playerTotalTime", this.playerTotalTime);
            // Display (debug):
            if (debug) {
                console.log("Finished Pages: " + this.playerTotalFinishedPages);
                console.log("Characters: " + this.lessonTotalCharacters);
                console.log("Errors: " + this.lessonErrors);
                console.log("Accuracy: " + this.lessonAccuracy);
                console.log("Time: " + this.lessonTotalTime);
                console.log("CPM: " + this.lessonCPM);
                console.log("WPM: " + this.lessonWPM);
                console.log("Gems: " + this.lessonGems);
            }
        }

        showLessonStatistics() {
            let i = 0;
            let html = "";
            if (this.optionSpeedUnit==="wpm") {
                $("#statisticSpeed").text(this.lessonWPM + " wpm");
            } else {
                $("#statisticSpeed").text(this.lessonCPM + " cpm");
            }
            $("#statisticAccuracy").text(this.lessonAccuracy + " %");
            $("#statisticErrors").text(this.lessonErrors);
            if (parseInt(this.lessonErrors)>=this.lessonMaxGems) {
                $("#statisticErrors").addClass("red");
            } else {
                $("#statisticErrors").removeClass("red");
            }
            $("#statisticTime").text(this.lessonTotalTime + " s");
            if (this.lessonGems > 0) {
                for (i = 0; i < this.lessonGems; i++) {
                    html += '<i class="far fa-gem"></i>';
                }
                $("#statisticGems").html(html);
            }
            $("#messageJustStartTyping").hide();
            $("#tableWithStatistics").show();
        }

        showPlayerData() {
            let id = 0;
            $("#playerTotalFinishedPages").text(app.playerTotalFinishedPages);
            const time = new Date(null);
            time.setHours(0);
            time.setMinutes(0);
            time.setSeconds(app.playerTotalTime);
            $("#playerTotalTime").text(time.getHours() + "h " + time.getMinutes() + "m " + time.getSeconds() + "s");
            $("#playerRewardGems").text(app.playerRewardGems + "/" + app.bookMaxGems);
            $("#optionProgressBar a").removeClass("selected");
            this.playerProgressArray = JSON.parse(this.playerProgress);
            this.playerProgressArray.forEach(function (item, key) {
                if (item) {
                    id = parseInt(key);
                    $("#progressBox" + id).addClass("completed");
                }
            });
            $("#optionSounds a[data-value=" + this.optionSounds + "]").addClass("selected");
            $("#optionWordSpeed a[data-value=" + this.optionWordSpeed + "]").addClass("selected");
            $("#optionSpeedUnit a[data-value=" + this.optionSpeedUnit + "]").addClass("selected");
            $("#optionProgressBar a[data-value=" + this.optionProgressBar + "]").addClass("selected");
            if (this.optionProgressBar==="Off") {
                $("#progressWrap").hide();
            }
            if (this.optionProgressBar==="On") {
                $("#progressWrap").show();
            }
            id = app.bookCurrentPage;
            $("#progressBox" + id).addClass("current");

            // Show books progress...
            let playerProgressGraphArray = JSON.parse(this.playerProgress);
            for (let j = 1; j <= app.booksNum; j++) {
                let pagesCompleted = 0;
                let bookPages = playerProgressGraphArray[j].length;
                let percent = 0;
                for (let i = 0; i < bookPages; i++) {
                    if (playerProgressGraphArray[j][i]) {
                        if (playerProgressGraphArray[j][i].speed>0) {
                            pagesCompleted++;
                        }    
                    }
                }
                percent = (pagesCompleted  * 100 / bookPages).toFixed(2);
                $("#tableBooks td.book[data-book-id=" + j + "] span.percent").text(percent + "%");
            }

            if (this.optionProgressBar==="On") {
                let i = 0;
                let elementsCounted = 0;

                let offset = parseInt(this.bookCurrentPage - this.maxElementsOnGraph / 2);
                if (offset < 0) {
                    offset = 0;
                }
                if (offset + this.maxElementsOnGraph >= this.bookTotalPages) {
                    offset = this.bookTotalPages - this.maxElementsOnGraph;
                }
                let labelsData = Array(this.maxElementsOnGraph);
                let seriesSpeed = Array(this.maxElementsOnGraph);
                let seriesErrors = Array(this.maxElementsOnGraph);
                let averageSpeed = 0;
                let averageErrors = 0;
                let averageAccuracy = 0;
                let totalSpeedSum = 0;
                let totalErrorsSum = 0;
                let totalAccuracySum = 0;
                let index = 0;
                
                // Calculate elements visible on the graph
                for(index = 0; index < this.maxElementsOnGraph; index++)  {
                    i = index  + offset;
                    labelsData[index] = i + 1;
                    if (playerProgressGraphArray[this.bookId][i]) {
                        let speed = parseInt(playerProgressGraphArray[this.bookId][i].speed);
                        let errors = parseInt(playerProgressGraphArray[this.bookId][i].errors);
                        let accuracy = parseInt(playerProgressGraphArray[this.bookId][i].accuracy);
                        if (this.optionSpeedUnit==="wpm") {
                            seriesSpeed[index] = parseInt(speed / 5);
                        } else {
                            seriesSpeed[index] = speed;
                        }
                        seriesErrors[index] = errors;
                        
                    } else {
                        seriesSpeed[index] = 0;
                        seriesErrors[index] = 0;
                    }
                }
               
                // Calculate averages across the graph
                for(index = 0; index < this.bookTotalPages; index++) {
                    i = index;
                    if (playerProgressGraphArray[this.bookId][i]) {
                        let speed = parseInt(playerProgressGraphArray[this.bookId][i].speed);
                        let errors = parseInt(playerProgressGraphArray[this.bookId][i].errors);
                        let accuracy = parseInt(playerProgressGraphArray[this.bookId][i].accuracy);
                        if (this.optionSpeedUnit==="wpm") {
                            speed = parseInt(speed / 5);
                        }
                        if (speed) {
                            elementsCounted += 1;
                            totalSpeedSum += speed;
                            totalErrorsSum += errors;
                            totalAccuracySum += accuracy;    
                        }
                        
                    }
                }
                if (elementsCounted>0) {
                    averageSpeed = parseInt(totalSpeedSum / elementsCounted);
                    averageErrors = totalErrorsSum / elementsCounted;
                    averageAccuracy = totalAccuracySum / elementsCounted;
                }
                $("#averageSpeed").text(averageSpeed + " " + (this.optionSpeedUnit));
                $("#averageErrors").text(averageErrors.toFixed(2));
                $("#averageAccuracy").text(averageAccuracy.toFixed(0) + "%");

                let max = 140;
                let step = 10;
                if (this.optionSpeedUnit==="cpm") {
                    max *= 5;
                    step *= 5;
                }
                
                let ctx = document.getElementById('progressChart');
                var progressChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        lineAtIndex : this.bookCurrentPage - offset - 1,
                        labels: labelsData,
                        datasets: [
                            {
                                label: 'Speed',
                                yAxisID: 'A',
                                borderColor: "Black",
                                fill: true,
                                lineTension: 0.1,
                                pointRadius: 4,
                                pointHitRadius: 7,
                                pointBorderColor: "black",
                                pointBackgroundColor: "white",
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                borderCapStyle: 'square',
                                data: seriesSpeed,
                            },
                            {
                                label: 'Errors',
                                yAxisID: 'B',
                                borderColor: "Red",
                                fill: false,
                                lineTension: 0.1,
                                pointRadius: 4,
                                pointHitRadius: 7,
                                pointBorderColor: "red",
                                pointBackgroundColor: "white",
                                pointBorderWidth: 1,
                                pointHoverRadius: 5,
                                borderCapStyle: 'square',
                                data: seriesErrors,
                            }
                        ]
                    },
                    options: {
                        events: ['mousemove', 'click'],
                        onHover: (event, chartElement) => {
                            event.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                        },
                        hover: {
                            animationDuration: 0,
                        },
                        animation: {
                            duration: 0,
                        },
                        responsiveAnimationDuration: 0,
                        legend: {
                            display: false
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                ticks: {
                                    userCallback: function(item, index) {
                                        if (index === app.bookCurrentPage - offset - 1) {
                                            return "("+item+")";
                                        } else {
                                            return item;
                                        }
                                    }
                                }
                            }],
                            yAxes: [{
                                id: "A",
                                type: "linear",
                                position: "left",
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    max: max,
                                    stepSize: step,
                                }
                            }, {
                                id: "B",
                                type: "linear",
                                position: "right",
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    max: 14,
                                    stepSize: 1,
                                }
                            }]
                        },
                        onClick: function (e) {
                            let activePoints = progressChart.getElementsAtEvent(e);
                            if (activePoints && activePoints[0]) {
                                let selectedIndex = parseInt(activePoints[0]._index) + offset + 1;
                                window.location.href = "/?book=" + app.bookId + "&page=" + selectedIndex;                                
                            }
                        }
                    }
                });
            }
            
        }

        /**
         * When enter state "ready"
         */
        enterStateReady() {
            $('#textArea').removeClass('paused');
            $('#messageClickTextToStart').hide();
            $('#messageJustStartTyping').show();
            $("#tableWithStatistics").hide();
            this.setCursorAt(this.lessonCursorPosition);
        }

        /**
         * When enter state "paused"
         */
        enterStatePaused() {
            $('#textArea').addClass('paused');
            $('#messageClickTextToStart').show();
            $('#messageJustStartTyping').hide();
            $("#tableWithStatistics").hide();
            this.resetLesson();
            this.clearCursor();
        }

        /**
         * When enter state "finished"
         */
        enterStateFinished() {
            if (app.optionSounds==="On") {
                let audio = new Audio(this.audioLessonFinished);
                audio.play();    
            }
            this.appState = "finished";
            this.calculateLessonStatistics();
            this.showLessonStatistics();
            this.showPlayerData();
            this.clearCursor();
            $("#textArea span.charMeta")
                .removeClass("charMeta")
                .addClass("charMetaSummary");
            $("#textArea span.charVisited")
                .removeClass("charVisited")
                .addClass("charVisitedSummary");
            $("#textArea span.charError")
                .removeClass("charError")
                .addClass("charErrorSummary");
        }

        /**
         * Handle typing...
         * 
         * @param event
         */
        handleStateTyping(event) {
            let previousCharacter = $("#textArea span.char:eq(" + (this.lessonCursorPosition - 1) + ")").text();
            let character = $("#textArea span.char:eq(" + this.lessonCursorPosition + ")").text();
            let stopLessonAtCharacter = this.lessonTotalCharacters;
            let keyCorrect = false;
            let totalTime = 0;
            // Handle finished lesson...
            if (this.appState === "finished") {
                if (event.code === "Enter") {
                    this.bookCurrentPage = parseInt(this.bookCurrentPage) + 1;
                    if (this.bookCurrentPage > this.bookTotalPages) {
                        this.bookCurrentPage = 1;
                    }
                    window.location.href = "/?book=" + this.bookId + "&page=" + this.bookCurrentPage;
                }
                if (event.code === "Space") {
                    this.appState = "ready";
                    this.resetLesson();
                    event.preventDefault();
                    return;
                }
                event.preventDefault();
                return;
            }
            // Handle reset...
            if (event.code === "Escape") {
                this.resetLesson();
            } else {
                // Handle "Backspace"
                if (event.code === "Backspace") {
                    if (previousCharacter !== "␣" || this.optionWordSpeed==="Off") {
                        this.clearCursor();
                        this.wordCharacters--;
                        this.lessonCursorPosition--;
                        if ($("#textArea span.char:eq(" + this.lessonCursorPosition + ")").hasClass('charError')) {
                            this.lessonErrors--;
                        }
                        this.setCharacterAsUnvisitedAt(this.lessonCursorPosition);
                        this.setCursorAt(this.lessonCursorPosition);
                        if (app.optionSounds==="On") {
                            let audio = new Audio(this.audioKeypressFile);
                            audio.play();
                        }
                    }
                } else 
                // Handle typing...
                if (this.lessonAllowedCharacters.includes(event.key)) {
                    this.appState = "typing";
                    if (this.lessonCursorPosition <= this.lessonTotalCharacters) {
                        if (app.optionSounds==="On") {
                            let audio = new Audio(this.audioKeypressFile);
                            audio.play();
                        }
                        if (this.appState !== "finished") {
                            if (!this.lessonStartTime) {
                                this.lessonStartTime = performance.now();
                                this.wordStartTime = performance.now();
                            }
                            this.clearCursor();
                            if (character === "␣") {
                                character = " ";
                                this.wordEndTime = performance.now();
                                this.wordTotalTime = (this.wordEndTime - this.wordStartTime) / 1000;
                                if (this.optionWordSpeed==="On") {
                                    this.wordStartCursorPosition = this.lessonCursorPosition + 1;
                                    let wordSpeedWPM = (this.wordCharacters * 60  / this.wordTotalTime);
                                    wordSpeedWPM /= 5;
                                    wordSpeedWPM = wordSpeedWPM.toFixed(0);
                                    let position = parseInt(this.wordStartCursorPosition) - parseInt(this.wordCharacters) - 1;
                                    if (position<=0) {
                                        position = 0;
                                    }
                                    if (this.wordCharacters >= this.wordMinLength) {
                                        $("#textArea span.char:eq(" + position + ")")
                                            .before('<span class="charMeta">'+wordSpeedWPM+'</span>');
                                    }
                                    // Display (debug):
                                    if (debug) {
                                        console.log(
                                            "position: " + position + ", " +
                                            "word characters " + this.wordCharacters + ", " +
                                            "word wpm " + wordSpeedWPM
                                        );
                                    }
                                }
                                this.wordCharacters = 0;
                            } else {
                                this.wordCharacters++;
                            }
                            if (this.wordCharacters===0) {
                                this.wordStartTime = performance.now();
                            }
                            if (event.key === character) {
                                this.setCharacterAsVisitedAt(this.lessonCursorPosition);
                                keyCorrect = true;
                            } else {
                                this.setCharacterAsErrorAt(this.lessonCursorPosition);
                                this.lessonErrors++;
                                keyCorrect = false;
                            }
                            
                            this.lessonCursorPosition++;
                            this.setCursorAt(this.lessonCursorPosition);
                            this.lessonEndTime = performance.now();

                            // Display (debug):
                            if (debug) {
                                totalTime = (this.lessonEndTime - this.lessonStartTime) / 1000;
                                totalTime = totalTime.toFixed(2);
                                console.log(
                                    "postion: " + this.lessonCursorPosition +
                                    "/" + this.lessonTotalCharacters +
                                    " (" + stopLessonAtCharacter + "), " +
                                    "" + totalTime + "s, " +
                                    "[" + (keyCorrect ? "OK" : "EE") + "]" +
                                    ", errors: " + this.lessonErrors
                                );
                            }
                            
                            if (this.lessonCursorPosition === stopLessonAtCharacter) {
                                if (this.optionWordSpeed==="On") {
                                    this.wordEndTime = performance.now();
                                    this.wordTotalTime = (this.wordEndTime - this.wordStartTime) / 1000;
                                    if (this.optionWordSpeed==="On") {
                                        this.wordStartCursorPosition = this.lessonCursorPosition + 1;
                                        let wordSpeedWPM = (this.wordCharacters * 60  / this.wordTotalTime);
                                        wordSpeedWPM /= 5;
                                        wordSpeedWPM = wordSpeedWPM.toFixed(0);
                                        let position = parseInt(this.wordStartCursorPosition) - parseInt(this.wordCharacters) - 1;
                                        if (position<=0) {
                                            position = 0;
                                        }
                                        if (this.wordCharacters >= this.wordMinLength) {
                                            $("#textArea span.char:eq(" + position + ")")
                                                .before('<span class="charMeta">'+wordSpeedWPM+'</span>');
                                        }
                                        // Display (debug):
                                        if (debug) {
                                            console.log(
                                                "position: " + position + ", " +
                                                "word characters " + this.wordCharacters + ", " +
                                                "word wpm " + wordSpeedWPM
                                            );
                                        }
                                    }
                                }
                                this.wordCharacters = 0;
                                this.enterStateFinished();
                            }
                        }
                    }
                }
            }
            event.preventDefault();
        }

        /**
         * Main application logic
         */
        mainloop() {

            // Show player statistics
            app.showPlayerData();

            // Start app in ready state
            app.enterStateReady();
            $('#bodyWrap').focus();

            // Handle input...
            $('#bodyWrap').bind({
                // Handle focusing in...
                focusin: function () {
                    app.appState = "ready";
                    app.enterStateReady();
                },
                // Handle focusing out...
                focusout: function () {
                    app.appState = "paused";
                    app.enterStatePaused();
                },
                // Handle 'Typing'...
                keydown: function (event) {
                    switch (app.appState) {
                        case 'ready':
                        case 'typing':
                        case 'finished':
                            app.handleStateTyping(event);
                            break;
                    }
                }
            });

            // Handle 'Options' toggle...
            $('#iconOptions').on('click', function () {
                $('#headOptionsWrap').slideToggle();
            });
            
            // Handle 'Book selection'...
            $('#tableBooks td.book').on('click', function (e) {
                let bookId = $(this).attr('data-book-id');
                window.location.href = "/?book=" + bookId + "&page=1";
            });

            // Handle 'Options' selection ...
            $('#headOptionsArea table td a').on('click', function (e) {
                let id = $(this).parent('td').attr("id");
                let value = $(this).data("value");
                $("#"+id+" a").removeClass("selected");
                $("#"+id+" a[data-value=" + value + "]").addClass("selected");
                if (id === "optionSounds") {
                    app.optionSounds = value;
                    app.localStorage.setItem("optionSounds", value);
                }
                if (id === "optionWordSpeed") {
                    app.optionWordSpeed = value;
                    app.localStorage.setItem("optionWordSpeed", value);
                }
                if (id === "optionSpeedUnit") {
                    app.optionSpeedUnit = value;
                    app.localStorage.setItem("optionSpeedUnit", value);
                }
                if (id === "optionProgressBar") {
                    app.optionProgressBar = value;
                    app.localStorage.setItem("optionProgressBar", value);
                }
                if (id === "optionResetStatistics") {
                    let bookId = app.bookId;
                    let bookCurrentPage = 1;
                    app.localStorage.clear();                     
                    window.location.href = "/?book=" + bookId + "&page=" + bookCurrentPage;
                }
                app.showPlayerData();
            });
        }

    }

    /**
     * Start the application
     */
    let app = new Application();
    app.mainloop();

});
