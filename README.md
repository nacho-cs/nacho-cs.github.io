# MCSR ranked stats viewer
## A simple way to view statistics for MCSR ranked

## Features

- Leaderboard viewing
- Ability to view a player's stats
- Ability to view a player's match history

## Usage

- Type either a player's name into the search bar or 'leaderboard'/'lb'
- A player's name gets their stats/match history
- 'Leaderboard'/'lb' gets the current leaderboard

## Basic API usage for MSCR ranked

- How to get the leaderboard: [https://mcsrranked.com/api/leaderboard](https://mcsrranked.com/api/leaderboard)
- How to get a players stats: [https://mcsrranked.com/api/users/<player's uuid>/](https://mcsrranked.com/api/users/9a8e24df4c8549d696a6951da84fa5c4)
- How to get a players match history: [https://mcsrranked.com/api/users/<player's uuid>/matches?page=NUMBER](https://mcsrranked.com/api/users/9a8e24df4c8549d696a6951da84fa5c4/matches?page=0)
- The API request for a player's matches is paginated. Page 1 returns matches 0-19, Page 2 returns matches 20-39, etc.
- All the API requests are GET requests. This means that you can only **get** information from the API. Also, the API is completely anonymous.
- The API is also rate limited, so don't send a bunch of requests, or you will get timed out. 

## Useful API endpoints to be used in combination with the MCSR ranked API

- [https://api.mojang.com/users/profiles/minecraft/<player's name>](https://mcsrranked.com/api/users/9a8e24df4c8549d696a6951da84fa5c4): Retrieves the uuid of a player from their username. Useful because sometimes the UUID is needed for extra requests
- [https://mc-heads.net/avatar/<player's uuid>](https://mc-heads.net/avatar/9a8e24df4c8549d696a6951da84fa5c40): Gets a players face. This can be used to display a player's skin alongside their username. You need to use the UUID of the player, not just their name.

## Changelog

- 2/24/23: U.I. Enhancements
- 2/26/23: Minor tweaks (added favicon, ranks, etc.)
- 2/26/23: Added dark/light theme. **Uses local storage to remember the user's prefered theme, but no other data is stored.**
- 3/3/23: Changed background color/added match type
- 3/4/23: Added proper dark/light theme support, changed favicon, added elo graph to show elo over time.
