# smarthome

Trying to make magic with Ikea Trådfri + RaspberryPI + ChatGPT

## The big picture

We want to control our smart home lights with speech.

The big picture
- Keyword detector: Responsible for recording audio and detecting keywords. Will send audio between <start> and <end> keywords to be processed.
- AWS Transcribe: Speech to text (later: instructions) and sending for processing.
- AWS lambda (logic): Sends current state of devices and the instructions for LLM
- ChatGPT API: LLM to produce new device state from current state and instructions
- DynamoDB: store the current and the new state to be set
- Light Control: Runs scheduled tasks to send current state of devices to DynamoDB and read the commands to execute and to send to Tradfri
- AWS lambda (commands): Reading old and new state and determine the required alterations to device states.

Raspberry PI will communicate with Lambdas and control the lightning through Ikea Trådfri gateway. We'll first try building the system so that there are no incoming calls to the PI to avoid all hazzle with static IP addresses. As a downside PI needs to keep polling the new instructions quite often (e.g. once per second).

<img width="937" alt="image" src="https://github.com/Arch-vile/smarthome/assets/2006859/52eb6ff7-1520-44ab-99f0-070f01f81bf9">


## How can we use ChatGPT for Smart Home

ChatGPT will be used to translate spoken user commands for lightning to machine readable instructions. See the below quick test to get the gist.
<img width="1277" alt="image" src="https://github.com/Arch-vile/smarthome/assets/2006859/6ccfb3ac-d90f-4085-9a95-3b1e1493d643">

## Decision log

### 5.1.23 Screw Alexa
Turns out Alexa is really shoddy (kind of knew this already) in speech recognition. But the main problems were:

- Requiring a two-word custom trigger for the custom skill to start. You'd need to say Alexa, control lights to start the custom skill. This would then prompt the skill, and only after that can you send the command for the skill. Phew, too many steps.
- The custom skill is too eager to interpret what was said. If you take even a short break in speech, the skill will start processing what was said. This just doesn't work; we need to be able to have longer pauses when we talk to avoid it firing prematurely.

**Decision**
Let's build our own wake word device:

- Listens all the time, and when the wake word is detected, gives an indication.
- After that, it will keep recording audio until the end-wake word is detected.

