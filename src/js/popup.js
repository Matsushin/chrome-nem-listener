import "../css/popup.css";

let addressForm = document.getElementById("addressForm");
let localAddress;
chrome.storage.local.get("address", function(value) {
    localAddress = value.address;
    if (localAddress != null) {
        addressForm.value = localAddress;
        stopButton.classList.remove("hidden");
    }
});

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");

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
