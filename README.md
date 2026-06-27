# clicker-game

Clicker Game
A slightly excessive incremental/idle game made with vanilla JS.

I wanted to practice some CSS animations and vanilla JavaScript logic, so I started making a simple Cookie Clicker clone. It kind of got out of hand.

There's no frameworks, no Node.js, no build steps. Just raw HTML, CSS, and JS.

(If you're wondering why the JS file is called scrpit.js, yes, that was a typo on my end. I never bothered renaming it and now it's a feature).

Game Preview https://demo.nanos.ro/clicker-game/ 


Features
15 Buildings: Ranging from basic Cursors to the "Omnipotence" simulator.
Synergy System: Every 10 of the same building you buy gives that specific building a x2 production boost.
Upgrades: Standard upgrades that you buy with points to double specific things.
Prestige System (Diamonds): Once you hit 1,000,000 points, you can reset your progress to earn Diamonds.
Diamond Shop: Spend your Diamonds on permanent upgrades (like flat click power or % global production boosts) that survive through prestiges.
Golden Cookies: They spawn randomly on screen. Click them fast for either a x777 Click Frenzy or a massive point boost.
Achievements: Unlocks for clicking, reaching score milestones, and buying buildings.
News Ticker: Stupid flavor text at the bottom of the screen.
Auto-Save: Automatically saves to localStorage so you don't lose your progress.
How to run it
Honestly, it's as easy as it gets:

Download or clone the repo.
Open index.html in any modern browser.
That's it. No local server required (unless you want to use one).
If you want to use Live Server in VS Code, that works too.

Adding your own stuff
Since I wanted this to be easy to modify, all the game data is stored in arrays at the top of scrpit.js.

If you want to add a new building, just copy one of the objects in the bdata array, change the names, stats, and costs, and it will automatically generate in the shop UI. Same goes for udata (point upgrades), pudata (prestige upgrades), and adata (achievements).

Known "Issues"
The numbers get stupid big. I added formatting (K, M, B, T, Qa, Qi) but if you play long enough it might break. Let me know if it does.
The Golden Cookie hitbox is a little weird sometimes if it spawns too close to the edge of the screen.


License
Just don't claim you made it from scratch. Feel free to fork it, mod it, or tear the code apart to see how it works.
