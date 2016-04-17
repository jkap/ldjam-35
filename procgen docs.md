# procgen docs

## grid notes

- 3 wide, 8 high
- hard enemies move every 2 beats
- easy enemies move on downbeat

## enemy types
- walls (can pass through by being the right shape)
  - consistent shape through whole height of grid
  - can be composed of different shapes
    - 50/50 chance of same or different shapes
    - dice roll for selecting shapes on different shape walls

## picking grid
- completely random? lol
  - just a dice roll for each grid spot to make the grid

## rows since last enemy:

| Rows since last enemy | Probability of enemy |
|-----------------------|----------------------|
| 0-1                   | 0%                   |
| 2                     | 5%                   |
| 3                     | 10%                  |
| 4                     | 25%                  |
| 5                     | 50%                  |
| 6                     | 75%                  |
| 7+                    | 100%                 |
