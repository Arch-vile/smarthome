import {Accessory, discoverGateway, TradfriClient} from "node-tradfri-client";


const accessories: Record<number, Accessory> = {}

function getAccessory(id: number): Promise<Accessory> {
    function tryAgain(resolve: (value: (PromiseLike<Accessory> | Accessory)) => void) {
        const acc = accessories[id]
        if (acc) {
            console.log('found accesssory')
            resolve(acc)
        } else {
            console.log('did not found accesssory')
            setTimeout(() => tryAgain(resolve), 200);
        }
    }

    const promise = new Promise<Accessory>(resolve => {
        setTimeout(() => tryAgain(resolve), 0);
    })

    return promise;
}


function tradfri_deviceUpdated(device: Accessory) {
    accessories[device.instanceId] = device;
}

function tradfri_deviceRemoved() {

}

// later:
async function start(): Promise<TradfriClient> {
    const result = await discoverGateway();
    console.log(JSON.stringify(result));

    const tradfri = new TradfriClient(result?.host!);
    try {

        const {identity, psk} = await tradfri.authenticate(process.env.IKEA_GATEWAY_SECURITY_CODE!);

        await tradfri.connect(identity, psk);

        await tradfri
            .on("device updated", tradfri_deviceUpdated)
            .on("device removed", tradfri_deviceRemoved)
            .observeDevices()
            .then(it => console.log('observe devices done', it))

        return tradfri;

    } catch (e) {
        console.log('error', e)
        throw e;
    }
}


start().then((client) => {
    getAccessory(65565)
        .then(it => it.lightList[0].toggle())
        .then(l => {
            console.log('toggle done');
            client.destroy();
        })
});
