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
          keyObj.question.questionFRA = "Comment créer un mot de passe fort (recette) ?<br />" + 
            "Il est important d’avoir un mot de passe sécurisé," + 
             " car les criminels peuvent déchiffrer des mots de passe" + 
             " simpls en quelques secondes et accéder ensuite à vos informations pour commettre des fraudes.";
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
          // code block
      }
    return storyDispOut;
}

function pass_buildDrgDrpUI() {
  var itemsSetStructure = `
    <div class="pass_itemsfields">
      <fieldset id="pass_left" class="pass_game">
        <legend><b>Strong Password</b></legend>
        <ol id="pass_strongPass">
          <li id="pass_low_UPPER_case">low and UPPER case letters</li>
          <li id="pass_no_dict_dord">Not a dictionary word</li>
          <li id="pass_spec_chars">Special Characters</li>
          <li id="pass_nums_symb">Numbers and symbols</li>
          <li id="pass_len_8to12_chars">At least 8 or 12 characters</li>
        </ol>
      </fieldset>

      <fieldset id="pass_right" class="pass_game">
        <legend><b>Weak Password</b></legend>
        <ol id="pass_weakPass">
          <li id="pass_last_first_name">Last and first names</li>
          <li id="pass_your_bday">Your birthday date</li>
          <li id="pass_dict_word">Nice word from the dictionary</li>
          <li id="pass_nums_syms">numbers and symbols</li>
          <li id="pass_less_8_chars">Less than 8 characters long</li>
        </ol>
      </fieldset>
    </div>`;

  return itemsSetStructure;
}

function pass_sort_lists() {
  $(document).ready(function() {
    $("#pass_strongPass").sortable({connectWith:"#pass_weakPass"}).draggable();
    $("#pass_weakPass").sortable({connectWith:"#pass_strongPass"}).draggable();
  } );
}
