var something = document.getElementById('something');

something.style.cursor = 'pointer';
something.onclick = function() {
    document.getElementById("demo").innerHTML = "Hello World";
};