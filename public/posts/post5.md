---
title: "Proximity Chat in Godot"
date: "2024-09-05"
author: "Matt Neave"
tags: Godot
---

# Proximity Chat in Godot

There has been a recent trend in multiplayer games, where a proximity-based voice chat is a core feature within the main game loop. Two examples of this include [Lethal Company](https://en.wikipedia.org/wiki/Lethal_Company) and [Lockdown Protocol](https://en.wikipedia.org/wiki/Lockdown). I thought it would be an interesting exercise to look into how proximity chat can be implemented in Godot, and now I will share how to setup proximity chat in Godot.

## Introduction to the Nodes

Before we look at the code required to setup a functioning proximity chat, let's first look at the nodes we will be required to use. Namely, the `AudioStreamPlayer`. An `AudioStreamPlayer` plays *positional* sound in a 2D/3D space. Being *positional* means the node automatically controls how loud a sound should be played to a user, based on how far the user is from the sound.

We can easily attach an `AudioStreamMicrophone` to an `AudioStreamPlayer` to play back microphone input in real-time. In conjunction with an `AudioEffectCapture`, we can process the microphone input i.e. send the captured input over a network.

## Basic Setup

Now we understand the nodes we will use, let's look at a basic setup. In this example, we will use two `AudioStreamPlayers`; one for capturing our microphone, and one for playing the other microphones.

In a 2D space, we will use an `AudioStreamPlayer2D`, and similar steps can be followed for a 3D space. As we want our chat system to be localised by player positions, we attach both these to our player scene. Let's name one `MicrophoneInput` and the other `VoipOutput` for clarity. In this context, `VoIP` stands for Voice over Internet Protocol. We can reference both of these in a script attached to our player.

```gdscript
@onready var inp: AudioStreamPlayer2D = $MicrophoneInput
@export var out: AudioStreamPlayer2D
```

## Introducing New Audio Buses

Before we continue, we need to add two new audio buses to route our system through. To add a new audio bus, click `Audio` -> `Add Bus` in the bottom panel. We need two audio buses, we will call one "Mute" and the other "Record". On the "Mute" audio bus, we mute the playback by clicking the "M". On the "Record" bus, we must take two actions:
-  Click the "add effect" drop down and add a `capture effect`.
- Click the output bus dropdown (at the bottom) and select the "Mute" bus as the output bus.

For the capture to work, we must change one final setting. In `Project` -> `General` -> `Audio` -> `Driver`, with `Advanced Settings` turned on, we can enable `Enable Input`.

## Programming Voice over Internet Protocol (VoIP)

We now have everything setup. We can finally take on the main programming of VoIP. We have to capture microphone input using the capture effect we added, and send it to all the peers in the network.

First, we add a `AudioStreamMicrophone` to our input `AudioStreamPlayer`.

```gdscript
var playback: AudioStreamGeneratorPlayback
var effect: AudioCaptureEffect

func setup_audio(id):
	set_multiplayer_authority(id)
	if (is_multiplayer_authority()):
		inp.stream = AudioStreamMicrophone.new()	
		inp.play()
		idx = AudioServer.get_bus_index("Record")
		effect = AudioServer.get_bus_effect(idx, 0)
	
	playback = out.get_stream_playback()
```

We can call this function when we create our player, in the player's `_ready/0`. The `id` we pass, is a unique identifier for the player's authority, for example, the name of the player. `AudioServer.get_bus_effect(idx, 0)` fetches the capture effect we added to the audio bus called "Record". If there are any other filters on the bus, the second argument passed to this function may not be at index 0; in our case it is.

We also grab `playback`, which is a generator used for playing the audio receive from other players.

Now we have a microphone attached to our input audio player, we can process both audio players each frame. We need to write a function to capture input, and a function to process received data.

```gdscript
func _process(_delta):
	if is_multiplayer_authority():
		_process_mic()
	_process_voice()
```

We ensure we only capture input if we are the client's authority.

```gdscript
func _process_mic():
	var inp_data : PackedVector2Array = effect.get_buffer(effect.get_frames_available())
	
	if inp_data.size() > 0:
		var data = PackedFloat32Array()
		data.resize(inp_data.size())
		var max_amplitude = 0.0
		
		for i in range(inp_data.size()):
			var value = (inp_data[i].x + inp_data[i].y) / 2
			max_amplitude = max(value, max_amplitude)
			data[i] = value

		send_data.rpc(data)
```

We capture the microphone input using the `AudioCaptureEffect` we setup. This returns us a `PackedVector2Array`, which we can process and send to all the other peers using an rpc.

```gdscript
@rpc("any_peer", "call_remote", "unreliable_ordered")
func send_data(data: PackedFloat32Array):
	receive_buffer.append_array(data)
```

We ensure our remote-procedure call uses UDP using "unreliable_ordered", to reduce the overhead of sending packets to clients.

Finally, we can process the data we receive from other peers.

```gdscript
var receive_buffer := PackedFloat32Array()

func _process_voice():
	if receive_buffer.size() <= 0:
		return
	
	for i in range(min(playback.get_frames_available(), receive_buffer.size())):
		playback.push_frame(Vector2(receive_buffer[0], receive_buffer[0]))  # Left and right ears
		receive_buffer.remove_at(0)
```

We push the data we received from RPC calls to our output generator `playback`.

We can control the proximity our player hears other players by adjusting the `max_distance` property on "VoipOutput".

```gdscript
func _ready():
	out.max_distance = 250  # 250 pixels
```

Make sure to attach the output `AudioStreamPlayer` to the node with the script attached, and then we're good to go!

## Conclusion

We have now seen how to setup proximity chat in godot! The process involved us capturing microphone input, sending it to our peers with an RPC and processing the data we receive. 

Credit to FinePointCGI for an incredible video on the topic on [VoIP in Godot](https://www.youtube.com/watch?v=AomgXrpiRmM) and passthecodine for a [basic introduction](https://www.reddit.com/r/godot/comments/186yn4o/voip_in_godot_basic_overview_not_full_tutorial/)!