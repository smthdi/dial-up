/**Script of website used for interactivity and behaviour
 * Shared across 2 html web-pages
 * all functions are encapsulated in if statement checking if the sections exist before aplying and executing
 * avoids unnexpected outcomes and errors
 */



/**Top Navigation menu toggle script
 * Controls the hamburger menu behaviour and accessibility.
 * Enables menu to toggle the website navigation menu out when user clicks the icon (3 bars to open) or cross to close
 * Updates ARIA attributes for screen readers
 * 
 * Autor: W3Schools
 */
const nav = document.getElementById("menu-navigation");
const hamburger = document.getElementById("hamburger-toggle");
const menu = document.getElementById("menu");

if (nav && hamburger && menu) {
  //ensures screen readers correctly interpet whether the menu is expended and content is visible
  const updateHamburgerARIA = () => {
    hamburger.setAttribute("aria-expanded", hamburger.checked ? "true" : "false");
    menu.setAttribute("aria-hidden", !hamburger.checked ? "true" : "false");
  };

  //updates state when menu is toggled
  hamburger.addEventListener("change", updateHamburgerARIA);

  //uses event listener to check if click occured in or out of navigation menu
  
  window.addEventListener("click", (event) => {
    const eventPath = event.composedPath();
    const isTargeted = eventPath.includes(nav);

    if (!isTargeted) {
      hamburger.checked = false;//close menu
      updateHamburgerARIA();//update accesibility state
    }
  });
}

/* * Connect Button Script
 * adds an event listener to the "Connect" button,  opens a new window displaying the dial-up simulation when clicked.
 */
//BUTTON TO TAKING YOU TO SIMULATION PAGE
const connectBtn = document.getElementById("connectBtn");
// Check if the connect button exists before adding the event listener to avoid errors in case the element is not present in the DOM.
if (connectBtn) {
  connectBtn.addEventListener("click", function () {//click event listener to detect
    window.open("dialupSimulation.html", "_blank");//opens new tab for simulation web-page
  });
}

/**
 * References button script
 * Check if the references button exists before adding the event listener to avoid errors in case the element is not present in the DOM.
 * uses event listener to detec click and opens new tab for references webpage as required
 */
const refBtn = document.getElementById("refBtn");

if (refBtn) {
  refBtn.addEventListener("click", function () {
    window.open("References.html", "_blank");
  });
}


/* * Tabbed Interface Script
 * This script manages the functionality of a tabbed interface, allowing users to switch between different content panels by clicking on the corresponding tab buttons. It also supports keyboard navigation for accessibility.
 * based on WAI-ARIA aacessibility guideines,WHATWG, W3Schools, Mozilla Developper Network
 */
function setupTabs(tabSelector, panelSelector, direction = "horizontal") {
/* const tabSelector: A CSS selector string to identify the tab buttons in the DOM.
   const panelSelector: A CSS selector string to identify the content panels associated with the tabs.
   direction: parameter that specifies the navigation direction for keyboard interactions. Can be either "horizontal" (default) or "vertical" (determines which arrow keys will be used for navigating between tabs) */
  const tabs = document.querySelectorAll(tabSelector);
  const panels = document.querySelectorAll(panelSelector);

  function activateTab(button){
    const target = button.dataset.tab;

    // Deactivate all tabs and panels
    tabs.forEach(tab => {
      tab.classList.remove("active");
      tab.setAttribute("aria-selected","false");
    });
// Deactivate all panels
    panels.forEach(panel => {
      panel.classList.remove("active");
    });
// Activate the selected tab and corresponding panel
    button.classList.add("active");
    button.setAttribute("aria-selected","true");

    document.getElementById(target).classList.add("active");
  }
// Add click and keyboard event listeners to each tab button
  tabs.forEach((tab,index)=>{

    tab.addEventListener("click",()=>{
      activateTab(tab);
    });

    tab.addEventListener("keydown",(e)=>{

      let nextTab;
      /**For horizontal tabs
       * Uses left and right button of keyboard to navigate between tabs
       */
      if(direction === "horizontal"){

        if(e.key === "ArrowRight"){
          nextTab = tabs[index+1] || tabs[0];
        }

        if(e.key === "ArrowLeft"){
          nextTab = tabs[index-1] || tabs[tabs.length-1];
        }

      }
      /**For vertical tabs
       * Uses up and down button of keyboard to navigate between tabs
       */
      if(direction === "vertical"){

        if(e.key === "ArrowDown"){
          nextTab = tabs[index+1] || tabs[0];
        }

        if(e.key === "ArrowUp"){
          nextTab = tabs[index-1] || tabs[tabs.length-1];
        }

      }

      if(nextTab){
        e.preventDefault();
        nextTab.focus();
        activateTab(nextTab);
      }

      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        activateTab(tab);
      }

    });

  });

}
/** Initialize the tabbed interfaces for both horizontal and vertical tabs 
 * first make sure they exist in the DOM to avoid errors.
 * */ 

if (document.querySelector(".how-tab-btn") && document.querySelector(".how-tab-panel")) {
  setupTabs(".how-tab-btn", ".how-tab-panel", "horizontal");
}

if (document.querySelector(".evolution-tab-btn") && document.querySelector(".evolution-tab-panel")) {
  setupTabs(".evolution-tab-btn", ".evolution-tab-panel", "horizontal");
}

if (document.querySelector(".file-tab-btn") && document.querySelector(".file-panel")) {
  setupTabs(".file-tab-btn", ".file-panel", "vertical");
}

/** Speed Evolution animation script
 * When user scrolls to that section, the speed meters animation is triggered
 * meter progresses to target value set on html code
 * applies delays for visual effects
 * developped using Mozilla Developer Network, W3C
 */
const speedSection = document.querySelector("#speedEvolution");
const meters = document.querySelectorAll("#speedEvolution meter");

let metersAnimation = false;//to not run multiple times

if (speedSection && meters.length > 0) {
  function animateMeter(meter, targetValue) {
    let current = 0;

    //increases value at fixed intervals to create animation effect
    const interval = setInterval(() => {
      current++;
      meter.value = current;
      //stops animation once target reached
      if (current >= targetValue) {
        clearInterval(interval);
      }
    }, 15);
  }
  //observes when user scrolls to speed evolution section
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !metersAnimation) {
        metersAnimation = true;

        meters.forEach((meter, index) => {
          const target = parseInt(meter.dataset.target);

          setTimeout(() => {
            animateMeter(meter, target);
          }, index * 250);
        });
      }
    });
  }, { threshold: 0.4 });//triggers animation when 40% of section is visible

  observer.observe(speedSection);//start observing the section
}


/**Interactve quiz Script
 * author: https://dev.to/sulaimonolaniran/building-a-simple-quiz-with-html-css-and-javascript-4elp 
 * container stores all possible questions and mcq options, game randomly chooses 10 questions
 * purpose of quiz: in educational website, user may want to test themselves; improves user experience due to added interactivity
 * changed styling, questions and number of questions available and layout of results tab button at end of quiz
 * */
const questions = [
    {
        question: "What technology did dial-up internet use to connect to the internet ?",
        optionA: "Fibre optic cables",
        optionB: "Satellite signals",
        optionC: "Ethernet cables",
        optionD: "Telephone lines",
        correctOption: "optionD"
    },

    {
        question: "What device was required for a dial-up internet connection?",
        optionA: "Modem",
        optionB: "Router",
        optionC: "Switch",
        optionD: "Hub",
        correctOption: "optionA"
    },

    {
        question: "What does the word “modem” stand for?",
        optionA: "Mode Emulator",
        optionB: "Modulator-Demodulator",
        optionC: "Modern Device",
        optionD: "Module Decoder",
        correctOption: "optionB"
    },

    {
        question: "What was the maximum theoretical speed of traditional dial-up internet?",
        optionA: "56 kbps",
        optionB: "128 kbps",
        optionC: "1 Mbps",
        optionD: "1 Gbps",
        correctOption: "optionA"
    },

    {
        question: "Why couldn’t people use the telephone and dial-up internet at the same time?",
        optionA: "The modem blocked phone signals",
        optionB: "The internet provider limited usage",
        optionC: "The computer could not run both",
        optionD: "The internet used the same telephone line",
        correctOption: "optionD"
    },

    {
        question: "What caused the distinctive screeching sound when connecting to dial-up?",
        optionA: "The modem negotiating connection with another modem",
        optionB: "Computer speakers playing a sound",
        optionC: "Internet provider testing the line",
        optionD: "The telephone ringing",
        correctOption: "optionA"
    },

    {
        question: "Which internet technology replaced dial-up for faster home connections in the early 2000s?",
        optionA: "Fibre optic",
        optionB: "Bluetooth",
        optionC: "DSL/Cable",
        optionD: "Wireless",
        correctOption: "optionA"
    },

    {
        question: "Which connection type offers the fastest internet speeds today?",
        optionA: "ISDN",
        optionB: "Satellite",
        optionC: "DSL",
        optionD: "Fibre optic",
        correctOption: "optionD"
    },

    {
        question: "How are modern internet speeds usually measured?",
        optionA: "KB/s",
        optionB: "MB/s",
        optionC: "Mbps or Gbps",
        optionD: "Hz",
        correctOption: "optionC"
    },

    {
        question: "What is one major advantage of fibre-optic internet?",
        optionA: "Uses radio waves",
        optionB: "Transmits data using light",
        optionC: "Uses analogue signals",
        optionD: "Requires a telephone",
        correctOption: "optionB"
    },

    {
        question: "What does ISP stand for?",
        optionA: "Internet Service Provider",
        optionB: "Internet Server Protocol",
        optionC: "Internet Signal Processor",
        optionD: "Integrated System Provider",
        correctOption: "optionA"
    },

    {
        question: "What does latency refer to in internet connections?",
        optionA: "Storage capacity",
        optionB: "Delay between sending and receiving data",
        optionC: "Internet cost",
        optionD: "Network cable length",
        correctOption: "optionB"
    },


    {
        question: "What major improvement did broadband provide over dial-up?",
        optionA: "Always-on connection",
        optionB: "Uses telephone calls",
        optionC: "Requires manual dialing",
        optionD: "Slower speeds",
        correctOption: "optionA"
    },

    {
        question: "Why did dial-up connections take time before the internet could be used?",
        optionA: "The modem needed to install drivers",
        optionB: "The computer had to warm up",
        optionC: "The modems had to establish and negotiate a connection",
        optionD: "The internet provider had to manually approve the user",
        correctOption: "optionC"
    },

    {
        question: "Which technology uses coaxial cables originally built for television networks?",
        optionA: "Fibre broadband",
        optionB: "Cable internet",
        optionC: "Dial-up",
        optionD: "Satellite",
        correctOption: "optionB"
    },

    {
        question: "Which activity was very difficult on dial-up connections?",
        optionA: "Sending emails",
        optionB: "Watching streaming videos",
        optionC: "Reading websites",
        optionD: "Downloading text files",
        correctOption: "optionB"
    },

]

//checking if the quiz container exists in the dom before trying to display the first question, if not then we won't try to display the question and avoid any potential errors
const quizExists = document.getElementById("display-question");
document.addEventListener("DOMContentLoaded", function () {
  if (quizExists) {
    NextQuestion(indexNumber);
  }
});

let shuffledQuestions = [] //empty array to hold shuffled selected questions out of all available questions

function handleQuestions() { 
    //function to shuffle and push 10 questions to shuffledQuestions array
//app would be dealing with 10 questions per session
    while (shuffledQuestions.length <= 9) {
        const random = questions[Math.floor(Math.random() * questions.length)]
        if (!shuffledQuestions.includes(random)) {
            shuffledQuestions.push(random)
        }
    }
}


let questionNumber = 1 //holds the current question number
let playerScore = 0  //holds the player score
let wrongAttempt = 0 //amount of wrong answers picked by player
let indexNumber = 0 //will be used in displaying next question

// function for displaying next question in the array to dom
//also handles displaying players and quiz information to dom
function NextQuestion(index) {
    handleQuestions()
    const currentQuestion = shuffledQuestions[index]
    document.getElementById("question-number").innerHTML = questionNumber
    document.getElementById("player-score").innerHTML = playerScore
    document.getElementById("display-question").innerHTML = currentQuestion.question;
    document.getElementById("option-one-label").innerHTML = currentQuestion.optionA;
    document.getElementById("option-two-label").innerHTML = currentQuestion.optionB;
    document.getElementById("option-three-label").innerHTML = currentQuestion.optionC;
    document.getElementById("option-four-label").innerHTML = currentQuestion.optionD;

}


function checkForAnswer() {
    const currentQuestion = shuffledQuestions[indexNumber] //gets current Question 
    const currentQuestionAnswer = currentQuestion.correctOption //gets current Question's answer
    const options = document.getElementsByName("option"); //gets all elements in dom with name of 'option' (in this the radio inputs)
    let correctOption = null

    options.forEach((option) => {
        if (option.value === currentQuestionAnswer) {
            //get's correct's radio input with correct answer
            correctOption = option.labels[0].id
        }
    })

    //checking to make sure a radio input has been checked or an option being chosen
    if (options[0].checked === false && options[1].checked === false && options[2].checked === false && options[3].checked == false) {
        document.getElementById('option-modal').style.display = "flex"
    }

    //checking if checked radio button is same as answer
    options.forEach((option) => {
        if (option.checked === true && option.value === currentQuestionAnswer) {
            document.getElementById(correctOption).style.backgroundColor = "green"
            playerScore++ //adding to player's score
            indexNumber++ //adding 1 to index so has to display next question..
            //set to delay question number till when next question loads
            setTimeout(() => {
                questionNumber++
            }, 1000)
        }

        else if (option.checked && option.value !== currentQuestionAnswer) {
            const wrongLabelId = option.labels[0].id
            document.getElementById(wrongLabelId).style.backgroundColor = "red"
            document.getElementById(correctOption).style.backgroundColor = "green"
            wrongAttempt++ //adds 1 to wrong attempts 
            indexNumber++
            //set to delay question number till when next question loads
            setTimeout(() => {
                questionNumber++
            }, 1000)
        }
    })
}

//called when the next button is called
function handleNextQuestion() {
    checkForAnswer() //check if player picked right or wrong option
    unCheckRadioButtons()
    //delays next question displaying for a second just for some effects so questions don't rush in on player
    setTimeout(() => {
        if (indexNumber <= 9) {
//displays next question as long as index number isn't greater than 9, remember index number starts from 0, so index 9 is question 10
            NextQuestion(indexNumber)
        }
        else {
            handleEndGame()//ends game if index number greater than 9 meaning we're already at the 10th question
        }
        resetOptionBackground()
    }, 1000);
}

//sets options background back to null after display the right/wrong colors
function resetOptionBackground() {
    const options = document.getElementsByName("option");
    options.forEach((option) => {
        document.getElementById(option.labels[0].id).style.backgroundColor = ""
    })
}

// unchecking all radio buttons for next question(can be done with map or foreach loop also)
function unCheckRadioButtons() {
    const options = document.getElementsByName("option");
    for (let i = 0; i < options.length; i++) {
        options[i].checked = false;
    }
}

// function for when all questions being answered
function handleEndGame() {
    let remark = null
    let remarkColor = null

    // condition check for player remark and remark color
    if (playerScore <= 3) {
        remark = "Bad Grades, Keep Practicing."
        remarkColor = "red"
    }
    else if (playerScore >= 4 && playerScore < 7) {
        remark = "Average Grades, You can do better."
        remarkColor = "orange"
    }
    else if (playerScore >= 7) {
        remark = "Excellent, Keep the good work going."
        remarkColor = "green"
    }
    const playerGrade = (playerScore / 10) * 100

    //data to display to score board
    document.getElementById('remarks').innerHTML = remark
    document.getElementById('remarks').style.color = remarkColor
    document.getElementById('grade-percentage').innerHTML = playerGrade
    document.getElementById('wrong-answers').innerHTML = wrongAttempt
    document.getElementById('right-answers').innerHTML = playerScore
    document.getElementById('score-modal').style.display = "flex"

}

//closes score modal, resets game and reshuffles questions
function closeScoreModal() {
    questionNumber = 1
    playerScore = 0
    wrongAttempt = 0
    indexNumber = 0
    shuffledQuestions = []
    NextQuestion(indexNumber)
    document.getElementById('score-modal').style.display = "none"
}

//function to close warning modal
function closeOptionModal() {
    document.getElementById('option-modal').style.display = "none"
}


/**
 * Script for pop up about the author of the website when the "About the Author" button is clicked
 * appears when button is clicked and closes when close button pressed 
 */

const authorBtn = document.getElementById("about-author");
const authorPopup = document.getElementById("author-info");
const closeAuthor = document.getElementById("close-author-info");

if (authorBtn && authorPopup && closeAuthor) {
  authorBtn.addEventListener("click", () => {
    authorPopup.style.display = "block";
  });

  closeAuthor.addEventListener("click", () => {
    authorPopup.style.display = "none";
  });
}

/**Dial-Up Connection Simulation Script
 * added interesting feature for better UX: realistic connection process
 * info from youtube and wikipedia
 * 
 * Features:
 * Terminal outputs in intervals
 * animated progress bar
 * modem indicators and animated lights
 * random facts generated as user 
 * 
 * derived from MDN and WHATWG
*/
let connectionState = {
  isConnecting: false,
  isConnected: false
};
//pre-written modem messages to output with delays; simulates handshake process
const terminalMessages = [
  { text: "ATZ (Attention, Reset modem to default)", delay: 300 },
  { text: "OK (Command received and executed)", delay: 200 },
  { text: "ATDT 1-800-INTERNET (Attention, Dial Tone)", delay: 500 },
  { text: "DIALING...", delay: 1000 },
  { text: "RINGING...", delay: 1500 },
  { text: "CONNECT 28800 (Connect. speed 28.8 kbps)", delay: 800 },
  { text: "Verifying username and password...", delay: 1200 },
  { text: "CARRIER DETECTED (digital signal)", delay: 600 },
  { text: "PROTOCOL: V.90", delay: 400 },
  { text: "COMPRESSION: V.42bis", delay: 400 },
  { text: "Negotiating connection speed...", delay: 1000 },
  { text: "CONNECT 56000 (upgraded)", delay: 500 },
  { text: "", delay: 300 },
  { text: "Welcome to the World Wide Web!", delay: 500 },
  { text: "CONNECTION ESTABLISHED", delay: 300 }
];

//new random fact output everytime dial button is pressed for contextual learning
const connectionFacts = [
  "The dial-up sound was modems exchanging data using audio tones.",
  "56K was the theoretical maximum, but real speeds were often lower.",
  "Dial-up often blocked the home phone line while online.",
  "Pages loaded slowly enough that users often watched them appear line by line.",
  "Free AOL trial CDs became iconic during the dial-up era."
];

//from StackOverflow: to pause execution for a given time, delay in millisecond
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//function t activate indicator lights
function turnLightOn(id, color) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.backgroundColor = color;
  el.classList.add("active");
}

//resets all indicator lights to off 
function resetLights() {
  ["light-pwr", "light-tx", "light-rx", "light-cd"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.backgroundColor = "#444";
    el.classList.remove("active");
  });
}
//initiates dial-up connection 
async function startConnection() {
  if (connectionState.isConnecting || connectionState.isConnected) return;

  connectionState.isConnecting = true;

  const dialBtn = document.getElementById("dialBtn");
  const hangUpBtn = document.getElementById("hangUpBtn");
  const terminal = document.getElementById("terminal-output");
  const progress = document.getElementById("connection-progress");
  const status = document.getElementById("connection-status");
  const speed = document.getElementById("connection-speed");
  const factBox = document.getElementById("connection-fact");
  const factText = document.getElementById("fact-text");
  const dialupTone = document.getElementById("dialupTone");

  dialBtn.disabled = true;
  hangUpBtn.disabled = false;

  terminal.innerHTML = "";
  progress.style.width = "0%";
  speed.textContent = "0 bps";

  //for the display of random facts
  factBox.classList.remove("hidden");
  factText.textContent = connectionFacts[Math.floor(Math.random() * connectionFacts.length)];

  resetLights();
  turnLightOn("light-pwr", "#00ff88");

  if (dialupTone) {
    dialupTone.currentTime = 0;
    dialupTone.play().catch(() => {});
  }

  //to output terminal message sequentially
  for (let i = 0; i < terminalMessages.length; i++) {
    if (!connectionState.isConnecting) return;//if user suddenly hangs up, exit

    const msg = terminalMessages[i];
    const progressPercent = ((i + 1) / terminalMessages.length) * 100;

    await delay(msg.delay);

    if (!connectionState.isConnecting) return;

    if (msg.text) {
      terminal.innerHTML += `<div>${msg.text}</div>`;
      terminal.scrollTop = terminal.scrollHeight;
    }
//updates progress bar
    progress.style.width = `${progressPercent}%`;
//updates the stages of connection on terminal and for lights
    if (i < 3) {
      status.textContent = "Initializing modem...";
    } else if (i < 6) {
      status.textContent = "Dialing ISP...";
      turnLightOn("light-tx", "#ffb703");
    } else if (i < 10) {
      status.textContent = "Negotiating connection...";
      turnLightOn("light-rx", "#00ff88");
      speed.textContent = "28800 bps";
    } else {
      status.textContent = "Establishing connection...";
      speed.textContent = "56000 bps";
      turnLightOn("light-cd", "#00ff88");
    }
  }

  //final connection state
  connectionState.isConnecting = false;
  connectionState.isConnected = true;
  status.textContent = "✅ Connected to the Internet!";
  speed.textContent = "56000 bps";
}

/**Terminates the connection simulation whenever user wants */
function hangUp() {
  connectionState.isConnecting = false;
  connectionState.isConnected = false;

  const dialBtn = document.getElementById("dialBtn");
  const hangUpBtn = document.getElementById("hangUpBtn");
  const terminal = document.getElementById("terminal-output");
  const progress = document.getElementById("connection-progress");
  const status = document.getElementById("connection-status");
  const speed = document.getElementById("connection-speed");
  const factBox = document.getElementById("connection-fact");

  //resets state of buttons
  dialBtn.disabled = false;
  hangUpBtn.disabled = true;

  terminal.innerHTML += "<div>NO CARRIER</div>";
  terminal.innerHTML += "<div>Connection terminated by user.</div>";
  terminal.scrollTop = terminal.scrollHeight;

  progress.style.width = "0%";
  status.textContent = "Disconnected";
  speed.textContent = "0 bps";
  factBox.classList.add("hidden");


  resetLights();
}

/**initialises event listeners once DOM is fully loaded
 * prevents errors if elements are not on the page
 */
document.addEventListener("DOMContentLoaded", () => {
  const dialBtn = document.getElementById("dialBtn");
  const hangUpBtn = document.getElementById("hangUpBtn");

  if (dialBtn) dialBtn.addEventListener("click", startConnection);
  if (hangUpBtn) hangUpBtn.addEventListener("click", hangUp);
});


/**
 * Back to top button Script
 * appears when user scrolls more than 20 pixels
 * purpose: quick and easy nagivation so they can go back to toggle menu
 */
const mybutton = document.getElementById("TopBtn");

if (mybutton) {

// When the user scrolls down 20px from the top of the document, show the button
  window.addEventListener("scroll", scrollFunction);

  function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = "block";
    } else {
      mybutton.style.display = "none";
    }
  }

}
// When the user clicks on the button, scroll to the top of the webpage
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}