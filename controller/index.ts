import { discoverGateway } from "node-tradfri-client";
import { TradfriClient, Accessory, AccessoryTypes } from "node-tradfri-client";

function tradfri_deviceUpdated(device: Accessory) {
    const type = Object.values(AccessoryTypes)[device.type]
    const data = {
        name: device.name,
        id: device.instanceId,
        type,
    }
    console.log('found', data)
}
function tradfri_deviceRemoved() {

}

// later:
async function start() {
    const result = await discoverGateway();
    console.log(JSON.stringify(result));

// connect
    const tradfri = new TradfriClient(result?.host!);
    try {

        const {identity, psk} = await tradfri.authenticate(process.env.IKEA_GATEWAY_SECURITY_CODE!);

        await tradfri.connect(identity, psk);

         await tradfri
            .on("device updated", tradfri_deviceUpdated)
            .on("device removed", tradfri_deviceRemoved)
            .observeDevices()
             .then(it => console.log('observe devices done', it))

    } catch (e) {
        console.log('error', e)
        // handle error - see below for details
    }
    tradfri.destroy();
}



console.log("hellow")
start().then(() => console.log('main process `completed'))
