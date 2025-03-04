
function sayHello() {
      console.log('Hello! The button was clicked!'); // in future sprints, these will do something
}

document.getElementById('newSessionButton').addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default link behavior
      sayHello(); // Call the sayHello function
});