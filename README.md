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

- The root url [https://mcsrranked.com/api](https://mcsrranked.com/api)
- How to get the leaderboard: [root-url/leaderboard](https://mcsrranked.com/api/leaderboard)
- How to get a players stats: [root-url/users/<player's uuid>/](https://mcsrranked.com/api/users/9a8e24df4c8549d696a6951da84fa5c4)
- How to get a players match history: [root-url/users/<player's uuid>/matches?page=NUMBER](https://mcsrranked.com/api/users/9a8e24df4c8549d696a6951da84fa5c4/matches?page=0)
- The API request for a player's matches is paginated. Page 1 returns matches 0-19, Page 2 returns matches 20-39, etc.
- All the API requests are GET requests. This means that the API requires no credentials and is completely read-only
- The API is also rate limited, so don't send a bunch of requests, or you will get timed out

## Useful API endpoints to be used in combination with the MCSR ranked API

- [https://api.mojang.com/users/profiles/minecraft/<player's uuid>](https://mcsrranked.com/api/users/9a8e24df4c8549d696a6951da84fa5c4): Retrieves the uuid a player from their username. Useful because the MCSR ranked API requires UUIDs.
- [https://mc-heads.net/avatar/<player's uuid>](https://mc-heads.net/avatar/9a8e24df4c8549d696a6951da84fa5c40): Gets a players face. This can be used to display a player's skin alongside their username.
