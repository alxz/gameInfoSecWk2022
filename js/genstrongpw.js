// generate strong password task
function stoyUI() {
    // describe what UI we need for this task

}

function checkPWPolicy() {
    // Get the user input and check it against the policy

}

function passPolicy() {
    // Password policy: 
    // 1. String length Greater than 8 symbols
    // 2. Has CapitalCase + lowcase letters
    // 3. Has number(s)
    // 4. Has at least one of special characters
    // 5. It is not the word from the dictionary?

}

function buildStoyUI(keyObj) {
    // build a story based on storyID
    var id = keyObj.storyId;
    var isResolved = keyObj.isResolved;
    var storyDispOut = {};
    switch(id) {
        case 0:
          // code block
          break;
        case 1:
          // code block
          break;
        case 2:
          // code block
          break;          
        case 3:
          // code block
          break;
        case 4:
          // code block
          var myQuestions = [keyObj.question]; 
          /*
            You must ensure the URL contains embed rather watch as the /embed endpoint 
            allows outside requests, whereas the /watch endpoint does not.
            For anyone that is wondering, the reason this works is because the /embed endpoint 
            allows outside requests, whereas the /watch endpoint does no
          */
          
          keyObj.question.questionURL = "https://www.youtube.com/embed/qcqqh8qyAH4";
          keyObj.question.questionurlFRA = "https://www.youtube.com/embed/7w2S9G9kt2g";
          keyObj.question.question = "How to create a strong password (recepie)?";
          keyObj.question.questionFRA = "Comment créer un mot de passe fort (recette)?"
          console.log('Story ID = ', id, '; keyObj.question: ', keyObj.question.question);
          storyDispOut.storyId = "This Story ID is = " + id;

          // using library: https://github.com/dropbox/zxcvbn
          /*
            result.score      # Integer from 0-4 (useful for implementing a strength bar)
            0 # too guessable: risky password. (guesses < 10^3)
            1 # very guessable: protection from throttled online attacks. (guesses < 10^6)
            2 # somewhat guessable: protection from unthrottled online attacks. (guesses < 10^8)
            3 # safely unguessable: moderate protection from offline slow-hash scenario. (guesses < 10^10)
            4 # very unguessable: strong protection from offline slow-hash scenario. (guesses >= 10^10)
          */
          /*
          var decorTopHTML = `<div id="images">` 
                            + `<img src="` + keyObj.imgScr.en + `" width="60%" height="60%"`
                            + `alt="Password Demonstration" align="middle">`
                            + `</div>`; 
          */

          decorTopHTML = pass_buildDrgDrpUI();
          
          var activeContentHTML = `<div id="decorContent" class="questionDecorContent">`;
          var decorBottomHTML = `<br><input id="psw-input" type="password" maxlength="40">`;
          decorBottomHTML +=    `<br><br><input type="submit" value="Submit"><br>`;

          activeContentHTML =  decorTopHTML + activeContentHTML + decorBottomHTML;
          activeContentHTML += `</div>`;
          storyDispOut.activeContentHTML = activeContentHTML;

          break;                    
        default:
          // code block by default: no story found
          storyDispOut = null;
      }
    return storyDispOut;
}

function pass_buildDrgDrpUI() {
  // <li class="droppable pass_strongPass" draggable="true">drop-here</li>
  // <li class="droppable pass_weakPass" draggable="true">drop-here</li>
  var itemsSetStructure = `
    <div class="pass_itemsfields"  class="draggable">
      <fieldset id="pass_left" class="pass_game draggable-element droppable">
        <legend><b>Strong Password</b></legend>
        <ul id="pass_strongPass">
          
        </ul>
      </fieldset>

      <fieldset id="pass_center" class="pass_game draggable-element">
        <legend><b>components</b></legend>
        <ol id="pass_componentsPass">
          <li id="pass_low_UPPER_case" class="draggable" draggable="true">low and UPPER case letters</li>
          <li id="pass_no_dict_dord" class="draggable" draggable="true">Not a dictionary word</li>
          <li id="pass_spec_chars" class="draggable" draggable="true">Special Characters</li>
          <li id="pass_nums_symb" class="draggable" draggable="true">Numbers and symbols</li>
          <li id="pass_len_8to12_chars" class="draggable" draggable="true">At least 8 or 12 characters</li>
          <li id="pass_last_first_name" class="draggable" draggable="true">Last and first names</li>
          <li id="pass_your_bday" class="draggable" draggable="true">Your birthday date</li>
          <li id="pass_dict_word" class="draggable" draggable="true">Nice word from the dictionary</li>
          <li id="pass_nums_syms" class="draggable" draggable="true">numbers and symbols</li>
          <li id="pass_less_8_chars" class="draggable" draggable="true">Less than 8 characters long</li>
        </ol>
      </fieldset>

      <fieldset id="pass_right" class="pass_game draggable-element droppable">
        <legend><b>Weak Password</b></legend>
        <ul id="pass_weakPass">
          
        </ul>
      </fieldset>
    </div>`;

    
    // ar decorBottomHTML = `<br><input id="psw-input" type="password" maxlength="40">`;
    var activeContentHTML = `<div id="decorContent" class="questionDecorContent">`;
    var decorBottomHTML = `<hr /><h3>Can you please sort the componnents between STRONG and WEEK baskets?</h3><hr />`;
    // decorBottomHTML +=    `<br><br><input type="submit" value="Validate"><br>`;
    decorBottomHTML +=    `<br><br><button id="submitMiniGame">Lets check it!</button><br>`;
    itemsSetStructure =  itemsSetStructure + activeContentHTML + decorBottomHTML;
    itemsSetStructure += `</div>`;

  return itemsSetStructure;
}

function pass_show_miniGameUI(_htmlSrc,keyObj) {
  // const submitAnswerButton = document.getElementById("submitAnswerButton");
  // submitAnswerButton.style.display = 'none';
  var id = keyObj.storyId;
  var isResolved = keyObj.isResolved;
  // binding the variable to on-screen divs:
  const pass_quizContainer = document.getElementById("quiz");
  const pass_submitButton = document.getElementById("submit");
  // buildQuiz();
  pass_quizContainer.innerHTML = _htmlSrc.join("");
  pass_sort_lists(); // adding logic to the mini-Game (js code)


}

function pass_sort_lists() {

  console.log("pass_sort_lists initiated! ");
  const draggableElements = document.querySelectorAll(".draggable");
  const droppableElements = document.querySelectorAll(".droppable");

  draggableElements.forEach(elem => {
    elem.addEventListener("dragstart",dragStart);
    // elem.addEventListener("drag",drag);
    // elem.addEventListener("dragend",dragEnd);
  });

  droppableElements.forEach(elem => {
    elem.addEventListener("dragenter",dragEnter);
    elem.addEventListener("dragover",dragOver);
    elem.addEventListener("dragleave",dragLeave);
    elem.addEventListener("drop",drop);
  });

  // Drag and Drop functions:
  function dragStart(event) {
    console.log('==>>> dragStart dragging... ');
    event.dataTransfer.setData("text", event.target.id);
  }

  function dragOver(event) {
    event.preventDefault();
  }

  function dragEnter(event) {
    event.target.classList.add("droppable-hover");
    // document.getElementById(event).classList.add("droppable-hover");
  }

  function dragLeave(event) {
    event.target.classList.remove("droppable-hover");
    // document.getElementById(event).classList.remove("droppable-hover");
  }

  function drop(event) {
    event.preventDefault();
    console.log("###==>> event: ",event);
    var draggableElementData = event.dataTransfer.getData("text");
    const droppableElementData = event.target.getAttribute("data-droppable-id");
    // event.target.style.backgroundColor = draggableElementData;
    const dropTarget = event.target;
    console.log("###==>> dropTarget(parentElement): ",dropTarget);

    var pass_strongPass = document.getElementById("pass_strongPass");
    var pass_weakPass = document.getElementById("pass_weakPass");

    console.log("---==>> droppableElementData used?", droppableElementData);
    console.log("---==>> pass_strongPass dropped?", pass_strongPass.id);
    console.log("---==>> pass_weakPass dropped?", pass_weakPass.id);

    if (dropTarget.id === "pass_left") {
      // console.log("-=>>- pass_strongPass dropped");
      event.target.classList.add("dropped","droppable","pass_strongPass");
      var node = document.createElement('li');
      node.appendChild(document.createTextNode(draggableElementData));  
      node.classList.add("dropped","droppable","pass_strongPass"); 
      pass_strongPass.appendChild(node);

      var pass_componentsPass = document.getElementById("pass_componentsPass");
      var candidate = document.getElementById(draggableElementData);
      pass_componentsPass.removeChild(candidate);
      
    }

    if (dropTarget.id === "pass_right") {
      // console.log("-=>>- pass_weakPass dropped");
      event.target.classList.add("dropped","droppable","pass_weakPass");
      var node = document.createElement('li');
      node.appendChild(document.createTextNode(draggableElementData));
      node.classList.add("dropped","droppable","pass_weakPass");
      pass_weakPass.appendChild(node);

      var pass_componentsPass = document.getElementById("pass_componentsPass");
      var candidate = document.getElementById(draggableElementData);
      pass_componentsPass.removeChild(candidate);
    }

    if (draggableElementData === droppableElementData) {
      event.target.classList.add("dropped");
      const draggableElement = document.getElementById(draggableElementData);
      event.target.style.backgroundColor = draggableElement.style.color;
      draggableElement.classList.add("dragged");
      draggableElement.setAttribute("draggable","false");
      event.target.insertAdjacentHTML("afterbegin", `i class=""`);
    }

  }


}



