import '../img/icon-34.png'
import '../img/icon-128.png'
import '../img/icon-notification.png'

import {Address, ConfirmedTransactionListener, NEMLibrary, NetworkTypes} from "nem-library";
// Mainnet
NEMLibrary.bootstrap(NetworkTypes.MAIN_NET); 
const domain = 'jusan.nem.ninja'

// Testnet
//NEMLibrary.bootstrap(NetworkTypes.TEST_NET); 
//const domain = '192.3.61.243' 

let confirmedTransactionListener;
let connection;
chrome.storage.local.get("address", function(value) {
    const localAddress = value.address;
    if (localAddress != null) {
        startNotification(localAddress);
    }
});

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
        domain: domain
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
            if (res._mosaics == undefined) {
                // XEM
                amount = res._xem.quantity / 1000000;
                mosaicName = 'xem';
            } else {
                // Mosaic
                const mosaic = res._mosaics[0]
                amount = mosaic.quantity / 100;
                mosaicName = `${mosaic.mosaicId.namespaceId}:${mosaic.mosaicId.name}`;
            }

            chrome.notifications.create(`NOTIFICATION_NAME_${res.transactionInfo.hash.data}`, {
                type: 'basic',
                iconUrl: '../icon-notification.png',
                title: `${amount} ${mosaicName}`,
                contextMessage: '受け取りました！',
                message: `送金元：${signerAddress}`,
                priority: 1
            });
        } 
    }, err => {
        console.log(err);
    });
}
