
function sayHello() {
      console.log('Hello! The button was clicked!');
}

document.getElementById('clickMeButton').addEventListener('click', function (event) {
      event.preventDefault(); // Prevent the default link behavior
      sayHello(); // Call the sayHello function
});