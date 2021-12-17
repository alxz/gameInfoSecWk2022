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

          var decorTopHTML = `<div id="images">` 
                            + `<img src="` + keyObj.imgScr.en + `" width="60%" height="60%"`
                            + `alt="Password Demonstration" align="middle">`
                            + `</div>`;
          var decorBottomHTML = `<br><input id="psw-input" type="password" maxlength="40"><br><br><input type="submit" value="Submit"><br>`;
          var activeContentHTML = `<div id="decorContent" class="questionDecorContent">`;
          activeContentHTML = activeContentHTML + decorTopHTML + decorBottomHTML;
          activeContentHTML = activeContentHTML + `</div>`;
          storyDispOut.activeContentHTML = activeContentHTML;

          break;                    
        default:
          // code block
      }
    return storyDispOut;
}
