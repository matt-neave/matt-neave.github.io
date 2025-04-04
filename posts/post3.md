---
title: "GMTK 2024 Game Jam"
date: "2025-08-29"
author: "Matt Neave"
tags: Godot
---

# GMTK 2024 Game Jam

GMTK 2024 Game Jam DevLog.

![Shape Escape](images/shape_escape_0.png)

# Introduction
The GMTK Game Jam is (by participation) the biggest game jam of the year. The theme for 2024 was "[Built to Scale](https://itch.io/jam/gmtk-2024)". There were some abstract interpretations and some literal interpretations of the theme, we decided to go for the latter. The competition ran for four days, and resulted in a plethora of unique and captivating games, stories and experiences.

# The Idea
We took the theme and created Shape Escape! Shape Escape is a puzzle-platformer game where you must place and *scale* blocks to allow a character to platform through the level.
We settled on the idea early into the four day process. It was the first game any of us had made, so in order to give us the chance to learn the end-to-end development process, we had to think small. The core gameloop consists of two phases:
- Using the available *directed blocks* and *scalars* (integer values which can be used to extend blocks), design a route through the level.
- Control a character as you platform through your design.

![Shape Escape Level Two](images/shape_escape_1.png)
The image above shows an example of a level, let's break down the core elements.
- The *start* and *end* labels indicate where the player must platform from and to.
- The blocks are on the bottom-left of the display. In this case, we have a single block. The right-pointing directional arrow indicates a scalar will transform this block to the right.
- Towards the centre of the bottom, we see the scalars; in this instance a single `x4` scalar. This will replicate the block four times over in the direction of the arrow (i.e. create a 1x4 platform).

# The Experience

# Takeaways

I have found the most valuable aspect of a gamejam to be the feedback you can gather. 

# Conclusion


You can find the game on [itch](https://matt-neave.itch.io/shape-escape]).