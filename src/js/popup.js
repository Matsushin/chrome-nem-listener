import "../css/popup.css";
import hello from "./popup/example";

let addressForm = document.getElementById("addressForm");
addressForm.value = localStorage.getItem("address");

let button = document.getElementById("startButton");
button.addEventListener('click', function() {
    const address = addressForm.value;
    chrome.runtime.sendMessage({
        address: address
    },
    function(response) {
        alert(response.msg);
        localStorage.setItem("address", response.address);
    });
});

//hello();
