---
title: "Proximity Chat in Godot"
date: "2024-09-05"
author: "Matt Neave"
tags: Godot
---

# Proximity Chat in Godot

There has been a recent trend in multiplayer games, where a proximity-based voice chat is a core feature within the main game loop. Two examples of this include [Lethal Company](link) and [](link). I thought it would be an interesting exercise to look into how proximity chat can be implemented in Godot, and now I will share how to setup proximity chat in Godot.

## Introduction to the Nodes

Before we look at the code required to setup a functioning proximity chat, let's first look at the nodes we will be required to use. Namely, the `AudioStreamPlayer`. An `AudioStreamPlayer` plays *positional* sound in a 2D/3D space. Being *positional* means the node automatically controls how loud a sound should be played to a user, based on how far the user is from the sound.

We can easily attach an `AudioStreamMicrophone` to an `AudioStreamPlayer` to play back microphone input in real-time. In conjunction with an `AudioEffectCapture`, we can process the microphone input i.e. send the captured input over a network.

## Basic Setup

Now we understand the nodes we will use, let's look at a basic setup. In this example, we will use two `AudioStreamPlayers`; one for capturing our microphone, and one for playing the other microphones.

In a 2D space, we will use an `AudioStreamPlayer2D`, and similar steps can be followed for a 3D space. As we want our chat system to be localised by player positions, we attach both these to our player scene. Let's name one `MicrophoneInput` and the other `VoipOutput` for clarity. In this context, `voip` stands for voice-over-internet-protocol. We can reference both of these in a script attached to our player.

```godot
@onready var inp: AudioStreamPlayer2D = $MicrophoneInput
@export var out: AudioStreamPlayer2D
```

## Introducing New Audio Buses