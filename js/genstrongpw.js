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
    var storyDispOut = null;
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
          keyObj.question.question = "How to create a strong password (recepie)?";
          console.log('Story ID = ', id, '; keyObj.question: ', keyObj.question.question);
          storyDispOut = "This Story ID is = " + id;
          break;                    
        default:
          // code block
      }
    return storyDispOut;
}
