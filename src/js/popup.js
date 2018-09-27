import "../css/popup.css";
import hello from "./popup/example";

let addressForm = document.getElementById("addressForm");
let localAddress;
chrome.storage.local.get("address", function(value) {
    localAddress = value.address;
});
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

if (localAddress != null) {
    addressForm.value = localAddress;
    stopButton.classList.remove("hidden");
}

startButton.addEventListener('click', function() {
    const address = addressForm.value;
    chrome.runtime.sendMessage({
        address: address
    },
    function(response) {
        alert(response.msg);
        chrome.storage.local.set({ "address": response.address}, function() {});
        stopButton.classList.remove("hidden");
    });
});

stopButton.addEventListener('click', function() {
    chrome.runtime.sendMessage({
        address: null
    },
    function(response) {
        alert(response.msg);
        chrome.storage.local.remove("address", function() {});
        stopButton.classList.add("hidden");
    });
});
