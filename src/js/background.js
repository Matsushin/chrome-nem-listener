import '../img/icon-128.png'
import '../img/icon-34.png'

import {Address, ConfirmedTransactionListener, NEMLibrary, NetworkTypes} from "nem-library";
NEMLibrary.bootstrap(NetworkTypes.TEST_NET);
const address = "TBIMTT24HUZ7BWUO2ZUQTUYV24MYGRIZTMYSRBDJ";
const confirmedTransactionListener = new ConfirmedTransactionListener([
{
    domain: '23.228.67.85'
},
]).given(new Address(address));
confirmedTransactionListener.subscribe(res => {
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