import "../css/popup.css";
import hello from "./popup/example";

let addressForm = document.getElementById("addressForm");
const localAddress  = localStorage.getItem("address");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

addressForm.value = localAddress;
if (localAddress != null) {
    stopButton.classList.remove("hidden");
}

startButton.addEventListener('click', function() {
    const address = addressForm.value;
    chrome.runtime.sendMessage({
        address: address
    },
    function(response) {
        alert(response.msg);
        localStorage.setItem("address", response.address);
        stopButton.classList.remove("hidden");
    });
});

stopButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({
        address: null
    },
    function(response) {
        alert(response.msg);
        localStorage.removeItem('address');
        stopButton.classList.add("hidden");
    });
});
