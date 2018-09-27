import '../img/icon-128.png'
import '../img/icon-34.png'

import {Address, ConfirmedTransactionListener, NEMLibrary, NetworkTypes} from "nem-library";
NEMLibrary.bootstrap(NetworkTypes.TEST_NET);

let confirmedTransactionListener;
let connection;
const address = localStorage.getItem("address");
if (address != null) {
    startNotification(address);
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.address == null) {
            connection.unsubscribe();
            sendResponse({
                msg: "通知を停止しました"
            });
        } else {
            startNotification(request.address);
            sendResponse({
                msg: "通知を開始しました!",
                address: request.address
            });
        }
    }
);

function startNotification(address) {
    confirmedTransactionListener = new ConfirmedTransactionListener([
    {
        domain: '23.228.67.85'
    },
    ]).given(new Address(address));

    if (connection != null) {
        connection.unsubscribe();
    }

    connection = confirmedTransactionListener.subscribe(res => {
        const signerAddress = res.signer.address.value;
        if (address == res.recipient.value) {
            let amount = 0;
            let mosaicName = '';
            if (res.mosaics == undefined) {
                // XEM
                amount = res._xem.quantity / 1000000;
                mosaicName = 'xem';
            } else {
                // Mosaic
                const mosaic = res._mosaics[0]
                amount = mosaic.quantity / 100;
                mosaicName = `${mosaic.mosaicId.namespaceId}:${mosaic.mosaicId.name}`;
            }
            const title = `${amount}${mosaicName} 受け取りました！`
            const options = {
                body: `送金元：${signerAddress}`
            }
            new Notification(title, options);
        } 
    }, err => {
        console.log(err);
    });
}
