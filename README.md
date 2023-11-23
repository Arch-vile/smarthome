# smarthome
Trying to make magic with Ikea Trådfri + Alexa + ChatGPT

## The big picture

We want to control our smart home lights with speech.

We'll use Alaxa as our text to speech provider. User commands will be sent to custom Alexa skill that will forward those to a Lambda function. Lambda will use ChatGPT APIs to produce new state of lightning from user commands and current state.

Raspberry PI will communicate with Lambdas and control the lightning through Ikea Trådfri gateway. We'll first try building the system so that there are no incoming calls to the PI to avoid all hazzle with static IP addresses. As a downside PI needs to keep polling the new instructions quite often (e.g. once per second).

<img width="1020" alt="image" src="https://github.com/Arch-vile/smarthome/assets/2006859/6c04c228-a0bf-4495-81cf-2171408c3eb2">


## How can we use ChatGPT for Smart Home

ChatGPT will be used to translate spoken user commands for lightning to machine readable instructions. See the below quick test to get the gist.
<img width="1277" alt="image" src="https://github.com/Arch-vile/smarthome/assets/2006859/6ccfb3ac-d90f-4085-9a95-3b1e1493d643">
