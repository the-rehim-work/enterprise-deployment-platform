import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";
import { hashSync } from "bcryptjs";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; seeded: boolean };

const GAMES = [
    { title: "Counter-Strike 2", description: "For over two decades, Counter-Strike has offered an elite competitive experience. CS2 is the largest technical leap forward in Counter-Strike's history.", genre: "FPS", price: 0, developer: "Valve", publisher: "Valve", releaseDate: "2023-09-27", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/730/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/730/header.jpg" },
    { title: "Europa Universalis IV", description: "Rule your nation through the centuries with unparalleled freedom, depth and historical accuracy. True exploration, trade, warfare and diplomacy will be brought to life.", genre: "Strategy", price: 39.99, developer: "Paradox Development Studio", publisher: "Paradox Interactive", releaseDate: "2013-08-13", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/236850/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/236850/header.jpg" },
    { title: "Grand Theft Auto V", description: "Grand Theft Auto V for PC offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond.", genre: "Action", price: 29.99, developer: "Rockstar North", publisher: "Rockstar Games", releaseDate: "2015-04-14", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/271590/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/271590/header.jpg" },
    { title: "EA SPORTS FC 25", description: "Play the biggest club football game with more ways to win for the club. Team up with friends in your favorite modes with the new 5v5 Rush.", genre: "Sports", price: 49.99, developer: "EA Canada", publisher: "Electronic Arts", releaseDate: "2024-09-27", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/2669320/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/2669320/header.jpg" },
    { title: "Euro Truck Simulator 2", description: "Travel across Europe as king of the road, a trucker who delivers cargo across impressive distances.", genre: "Simulation", price: 19.99, developer: "SCS Software", publisher: "SCS Software", releaseDate: "2012-10-18", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/227300/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/227300/header.jpg" },
    { title: "Golf With Your Friends", description: "Why play golf with anyone else? Play golf with up to 12 friends in this easy to pick up multiplayer mini golf game.", genre: "Sports", price: 14.99, developer: "Blacklight Interactive", publisher: "Team17", releaseDate: "2020-05-19", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/431240/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/431240/header.jpg" },
    { title: "Tower Unite", description: "Tower Unite is a community-based virtual world party game. Play online mini-games with friends, customize your character and condo, explore community worlds, and more.", genre: "Casual", price: 14.99, developer: "PixelTail Games", publisher: "PixelTail Games", releaseDate: "2016-04-08", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/394690/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/394690/header.jpg" },
    { title: "MudRunner", description: "MudRunner is the ultimate off-road experience putting players in the driver seat and daring them to take charge of incredible all-terrain vehicles.", genre: "Simulation", price: 29.99, developer: "Saber Interactive", publisher: "Focus Entertainment", releaseDate: "2017-10-31", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/675010/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/675010/header.jpg" },
    { title: "Forza Horizon 5", description: "Your Ultimate Horizon Adventure awaits. Explore the vibrant and ever-evolving open world landscapes of Mexico.", genre: "Racing", price: 59.99, developer: "Playground Games", publisher: "Xbox Game Studios", releaseDate: "2021-11-09", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1551360/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1551360/header.jpg" },
    { title: "Battlefield 1", description: "Discover classic Battlefield gameplay with epic multiplayer and an adventure-filled campaign. Experience the dawn of all-out war in Battlefield 1.", genre: "FPS", price: 19.99, developer: "DICE", publisher: "Electronic Arts", releaseDate: "2016-10-21", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1238840/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1238840/header.jpg" },
    { title: "Dota 2", description: "Every day, millions of players worldwide enter battle as one of over a hundred Dota heroes. No matter if it's their 10th hour of play or 1,000th.", genre: "MOBA", price: 0, developer: "Valve", publisher: "Valve", releaseDate: "2013-07-09", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/570/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/570/header.jpg" },
    { title: "Stardew Valley", description: "You've inherited your grandfather's old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life.", genre: "RPG", price: 14.99, developer: "ConcernedApe", publisher: "ConcernedApe", releaseDate: "2016-02-26", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/413150/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/413150/header.jpg" },
    { title: "Terraria", description: "Dig, fight, explore, build! Nothing is impossible in this action-packed adventure game.", genre: "Action", price: 9.99, developer: "Re-Logic", publisher: "Re-Logic", releaseDate: "2011-05-16", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/105600/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/105600/header.jpg" },
    { title: "The Witcher 3: Wild Hunt", description: "You are Geralt of Rivia, a professional monster hunter. You must track down the child of prophecy in a vast open world rich with merchant cities and dangerous passes.", genre: "RPG", price: 39.99, developer: "CD PROJEKT RED", publisher: "CD PROJEKT RED", releaseDate: "2015-05-18", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/292030/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/292030/header.jpg" },
    { title: "Cyberpunk 2077", description: "An open-world, action-adventure RPG set in the megalopolis of Night City, where you play as a cyberpunk mercenary wrapped up in a do-or-die fight for survival.", genre: "RPG", price: 59.99, developer: "CD PROJEKT RED", publisher: "CD PROJEKT RED", releaseDate: "2020-12-10", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1091500/header.jpg" },
    { title: "Rust", description: "The only aim in Rust is to survive. Everything wants you to die — the environment, animals, other players.", genre: "Survival", price: 39.99, developer: "Facepunch Studios", publisher: "Facepunch Studios", releaseDate: "2018-02-08", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/252490/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/252490/header.jpg" },
    { title: "PUBG: BATTLEGROUNDS", description: "Play PUBG: BATTLEGROUNDS for free. Land on strategic locations, loot weapons and supplies, and survive to become the last team standing.", genre: "Battle Royale", price: 0, developer: "KRAFTON", publisher: "KRAFTON", releaseDate: "2017-12-21", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/578080/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/578080/header.jpg" },
    { title: "Rocket League", description: "Rocket League is a high-powered hybrid of arcade-style soccer and vehicular mayhem.", genre: "Sports", price: 0, developer: "Psyonix", publisher: "Psyonix", releaseDate: "2015-07-07", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/252950/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/252950/header.jpg" },
    { title: "Among Us", description: "An online and local party game of teamwork and betrayal for 4-15 players.", genre: "Casual", price: 4.99, developer: "Innersloth", publisher: "Innersloth", releaseDate: "2018-11-16", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/945360/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/945360/header.jpg" },
    { title: "Apex Legends", description: "Conquer with character in Apex Legends, a free-to-play Hero Shooter where legendary characters with powerful abilities team up to battle for fame and fortune.", genre: "FPS", price: 0, developer: "Respawn Entertainment", publisher: "Electronic Arts", releaseDate: "2020-11-04", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1172470/header.jpg" },
    { title: "Left 4 Dead 2", description: "Set in the zombie apocalypse, Left 4 Dead 2 is the sequel to the award-winning Left 4 Dead.", genre: "FPS", price: 9.99, developer: "Valve", publisher: "Valve", releaseDate: "2009-11-17", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/550/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/550/header.jpg" },
    { title: "Garry's Mod", description: "The ultimate physics sandbox. Build contraptions, create art, roleplay, or do whatever you want.", genre: "Sandbox", price: 9.99, developer: "Facepunch Studios", publisher: "Valve", releaseDate: "2006-11-29", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/4000/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/4000/header.jpg" },
    { title: "Portal 2", description: "The sequel to the acclaimed Portal, featuring new gameplay mechanics, characters, and a larger campaign.", genre: "Puzzle", price: 9.99, developer: "Valve", publisher: "Valve", releaseDate: "2011-04-19", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/620/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/620/header.jpg" },
    { title: "Half-Life 2", description: "Redefining the FPS genre, Half-Life 2 combines intense action with storytelling like no other game before it.", genre: "FPS", price: 9.99, developer: "Valve", publisher: "Valve", releaseDate: "2004-11-16", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/220/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/220/header.jpg" },
    { title: "Civilization VI", description: "Create a civilization to stand the test of time. Build, research, wage war and conduct diplomacy on your path to victory.", genre: "Strategy", price: 59.99, developer: "Firaxis Games", publisher: "2K", releaseDate: "2016-10-21", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/289070/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/289070/header.jpg" },
    { title: "Cities: Skylines", description: "A modern take on the classic city simulation. Introducing new gameplay elements to realize the thrill and hardships of creating and maintaining a real city.", genre: "Simulation", price: 29.99, developer: "Colossal Order", publisher: "Paradox Interactive", releaseDate: "2015-03-10", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/255710/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/255710/header.jpg" },
    { title: "Elden Ring", description: "The Golden Order has been broken. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord.", genre: "RPG", price: 59.99, developer: "FromSoftware", publisher: "Bandai Namco", releaseDate: "2022-02-25", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1245620/header.jpg" },
    { title: "Red Dead Redemption 2", description: "Winner of over 175 Game of the Year Awards, Red Dead Redemption 2 is an epic tale of life in America's heartland.", genre: "Action", price: 59.99, developer: "Rockstar Games", publisher: "Rockstar Games", releaseDate: "2019-12-05", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1174180/header.jpg" },
    { title: "Valheim", description: "A brutal exploration and survival game for 1-10 players set in a procedurally-generated purgatory inspired by viking culture.", genre: "Survival", price: 19.99, developer: "Iron Gate AB", publisher: "Coffee Stain Publishing", releaseDate: "2021-02-02", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/892970/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/892970/header.jpg" },
    { title: "Hades", description: "Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler.", genre: "Action", price: 24.99, developer: "Supergiant Games", publisher: "Supergiant Games", releaseDate: "2020-09-17", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1145360/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1145360/header.jpg" },
    { title: "Hollow Knight", description: "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes.", genre: "Action", price: 14.99, developer: "Team Cherry", publisher: "Team Cherry", releaseDate: "2017-02-24", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/367520/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/367520/header.jpg" },
    { title: "Dead by Daylight", description: "A multiplayer horror game where one player takes on the role of the savage Killer, and the other four play as Survivors.", genre: "Horror", price: 19.99, developer: "Behaviour Interactive", publisher: "Behaviour Interactive", releaseDate: "2016-06-14", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/381210/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/381210/header.jpg" },
    { title: "Sea of Thieves", description: "Embark upon a shared-world adventure game filled with pirates and sailing, fighting, exploring and looting.", genre: "Action", price: 39.99, developer: "Rare", publisher: "Xbox Game Studios", releaseDate: "2020-06-03", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1172620/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1172620/header.jpg" },
    { title: "Palworld", description: "Fight, farm, build and work alongside mysterious creatures called Pals in this completely new multiplayer open world survival crafting game.", genre: "Survival", price: 29.99, developer: "Pocketpair", publisher: "Pocketpair", releaseDate: "2024-01-19", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1623730/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1623730/header.jpg" },
    { title: "Lethal Company", description: "A co-op horror about scavenging at abandoned moons to sell scrap to the Company.", genre: "Horror", price: 9.99, developer: "Zeekerss", publisher: "Zeekerss", releaseDate: "2023-10-23", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1966720/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1966720/header.jpg" },
    { title: "Factorio", description: "Build and maintain factories. Mine resources, research technologies, build infrastructure, automate production and fight enemies.", genre: "Strategy", price: 35.00, developer: "Wube Software", publisher: "Wube Software", releaseDate: "2020-08-14", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/427520/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/427520/header.jpg" },
    { title: "Satisfactory", description: "Construct sprawling factories, explore alien landscapes, and automate processes to create the most efficient production lines.", genre: "Simulation", price: 29.99, developer: "Coffee Stain Studios", publisher: "Coffee Stain Publishing", releaseDate: "2024-09-10", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/526870/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/526870/header.jpg" },
    { title: "Deep Rock Galactic", description: "A 1-4 player co-op FPS featuring badass space dwarves, 100% destructible environments, procedurally-generated caves, and endless hordes of alien monsters.", genre: "FPS", price: 29.99, developer: "Ghost Ship Games", publisher: "Coffee Stain Publishing", releaseDate: "2020-05-13", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/548430/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/548430/header.jpg" },
    { title: "Risk of Rain 2", description: "Escape a chaotic alien planet by fighting through hordes of monsters in this third-person roguelike shooter.", genre: "Action", price: 24.99, developer: "Hopoo Games", publisher: "Gearbox Publishing", releaseDate: "2020-08-11", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/632360/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/632360/header.jpg" },
    { title: "It Takes Two", description: "Embark on the craziest journey of your life in It Takes Two, a genre-bending platform adventure created purely for co-op.", genre: "Action", price: 39.99, developer: "Hazelight Studios", publisher: "Electronic Arts", releaseDate: "2021-03-26", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1426210/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1426210/header.jpg" },
    { title: "Stray", description: "Lost, alone and separated from family, a stray cat must untangle an ancient mystery to escape a long-forgotten cybercity.", genre: "Adventure", price: 29.99, developer: "BlueTwelve Studio", publisher: "Annapurna Interactive", releaseDate: "2022-07-19", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1332010/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1332010/header.jpg" },
    { title: "Sekiro: Shadows Die Twice", description: "Carve your own path to vengeance in an all-new adventure from FromSoftware, creators of the Dark Souls series.", genre: "Action", price: 49.99, developer: "FromSoftware", publisher: "Activision", releaseDate: "2019-03-22", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/814380/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/814380/header.jpg" },
    { title: "Disco Elysium", description: "A groundbreaking open world role playing game. You're a detective with a unique skill system and a whole city block to carve your path across.", genre: "RPG", price: 39.99, developer: "ZA/UM", publisher: "ZA/UM", releaseDate: "2019-10-15", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/632470/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/632470/header.jpg" },
    { title: "Monster Hunter: World", description: "Battle gigantic monsters in epic locales. Utilize the environment and wildlife to gain advantage against fearsome monsters.", genre: "Action", price: 29.99, developer: "CAPCOM", publisher: "CAPCOM", releaseDate: "2018-08-09", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/582010/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/582010/header.jpg" },
    { title: "Baldur's Gate 3", description: "Gather your party, and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival.", genre: "RPG", price: 59.99, developer: "Larian Studios", publisher: "Larian Studios", releaseDate: "2023-08-03", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/1086940/header.jpg" },
    { title: "Subnautica", description: "Descend into the depths of an alien underwater world. Craft equipment and pilot submarines to explore lush coral reefs and volcanoes.", genre: "Survival", price: 29.99, developer: "Unknown Worlds", publisher: "Unknown Worlds", releaseDate: "2018-01-23", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/264710/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/264710/header.jpg" },
    { title: "Celeste", description: "Help Madeline survive her inner demons on her journey to the top of Celeste Mountain in this super-tight platformer.", genre: "Platformer", price: 19.99, developer: "Extremely OK Games", publisher: "Extremely OK Games", releaseDate: "2018-01-25", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/504230/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/504230/header.jpg" },
    { title: "Slay the Spire", description: "Craft a unique deck, encounter bizarre creatures, discover relics of immense power, and Slay the Spire!", genre: "Strategy", price: 24.99, developer: "Mega Crit Games", publisher: "Mega Crit Games", releaseDate: "2019-01-23", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/646570/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/646570/header.jpg" },
    { title: "Cuphead", description: "A classic run and gun action game heavily focused on boss battles with visuals inspired by 1930s cartoons.", genre: "Action", price: 19.99, developer: "Studio MDHR", publisher: "Studio MDHR", releaseDate: "2017-09-29", coverImage: "https://cdn.akamai.steamstatic.com/steam/apps/268910/library_600x900.jpg", headerImage: "https://cdn.akamai.steamstatic.com/steam/apps/268910/header.jpg" },
];

const ACHIEVEMENTS_BY_GAME: Record<string, { title: string; description: string; icon: string; points: number }[]> = {
    "Counter-Strike 2": [
        { title: "First Kill", description: "Get your first competitive kill", icon: "🎯", points: 10 },
        { title: "Ace", description: "Kill all 5 enemies in a single round", icon: "⭐", points: 50 },
        { title: "Clutch King", description: "Win a 1v3 situation", icon: "👑", points: 40 },
        { title: "Headhunter", description: "Get 500 headshot kills", icon: "💀", points: 30 },
        { title: "Spray Control", description: "Get 10 kills without missing a shot in a round", icon: "🔫", points: 60 },
    ],
    "Europa Universalis IV": [
        { title: "World Conqueror", description: "Own or have a subject own the entire world", icon: "🌍", points: 100 },
        { title: "Mare Nostrum", description: "Restore the Roman Empire borders as Byzantium", icon: "🏛️", points: 80 },
        { title: "True Heir of Timur", description: "Start as a Timurid nation and form the Mughals by 1550", icon: "⚔️", points: 70 },
        { title: "Three Mountains", description: "Own the world as Ryukyu", icon: "⛰️", points: 100 },
        { title: "First Come First Serve", description: "Own a colony in the New World", icon: "🚢", points: 15 },
    ],
    "Grand Theft Auto V": [
        { title: "Welcome to Los Santos", description: "Complete the prologue", icon: "🏙️", points: 10 },
        { title: "Career Criminal", description: "Attain 100% completion", icon: "💯", points: 100 },
        { title: "Solid Gold Baby!", description: "Earn 70 Gold Medals on Missions", icon: "🥇", points: 50 },
        { title: "San Andreas Sightseer", description: "Explore all of Los Santos and Blaine County", icon: "🗺️", points: 30 },
    ],
    "EA SPORTS FC 25": [
        { title: "First Win", description: "Win your first online match", icon: "⚽", points: 10 },
        { title: "Hat Trick Hero", description: "Score a hat trick in any mode", icon: "🎩", points: 25 },
        { title: "Division Champion", description: "Win Division 1 in Rivals", icon: "🏆", points: 60 },
        { title: "Squad Builder", description: "Build a team with 100 chemistry", icon: "🧩", points: 15 },
    ],
    "Euro Truck Simulator 2": [
        { title: "Long Hauler", description: "Drive 10,000 km total", icon: "🚛", points: 30 },
        { title: "Perfect Delivery", description: "Complete 50 deliveries with no damage", icon: "📦", points: 40 },
        { title: "Fleet Owner", description: "Own 10 trucks and hire 10 drivers", icon: "🏢", points: 50 },
        { title: "Explorer", description: "Visit every city on the map", icon: "🗺️", points: 60 },
    ],
    "Forza Horizon 5": [
        { title: "Hall of Fame", description: "Enter the Horizon Hall of Fame", icon: "🏎️", points: 30 },
        { title: "Collector", description: "Own 200 cars", icon: "🚗", points: 40 },
        { title: "Speed Demon", description: "Reach 400 km/h", icon: "⚡", points: 50 },
        { title: "Photo Finish", description: "Win a race by less than 0.1 seconds", icon: "📸", points: 35 },
    ],
    "Battlefield 1": [
        { title: "War Hero", description: "Complete all War Stories", icon: "🎖️", points: 40 },
        { title: "Master of Arms", description: "Get 500 kills with each weapon class", icon: "🔫", points: 60 },
        { title: "Ace Pilot", description: "Destroy 10 planes in a single match", icon: "✈️", points: 45 },
    ],
    "The Witcher 3: Wild Hunt": [
        { title: "Geralt: The Professional", description: "Complete all witcher contracts", icon: "⚔️", points: 50 },
        { title: "Card Collector", description: "Collect all gwent cards", icon: "🃏", points: 40 },
        { title: "Passed the Trial", description: "Finish the game on Death March difficulty", icon: "💀", points: 80 },
    ],
    "Elden Ring": [
        { title: "Elden Lord", description: "Achieve the Elden Lord ending", icon: "👑", points: 50 },
        { title: "Shardbearer", description: "Defeat any shardbearer demigod", icon: "⚔️", points: 20 },
        { title: "Legendary Armaments", description: "Acquire all legendary armaments", icon: "🗡️", points: 60 },
    ],
    "Baldur's Gate 3": [
        { title: "Hero of the Forgotten Realms", description: "Complete the game", icon: "🐉", points: 50 },
        { title: "Tactician", description: "Complete the game on Tactician difficulty", icon: "🧠", points: 80 },
        { title: "Chosen of Shar", description: "Become Shar's chosen", icon: "🌑", points: 30 },
    ],
};

const USERNAMES = [
    "TheRehim", "ShadowBlade", "PixelNinja", "CyberWolf", "NightHawk",
    "IronFist", "StormRider", "PhantomX", "BlazeMaster", "FrostByte",
    "VenomStrike", "ThunderBolt", "GhostRaven", "SteelTitan", "DarkMatter",
    "NovaFlare", "CrimsonKing", "SilverFox", "OmegaForce", "AlphaWolf",
    "ZeroGravity", "NeonSpark", "VoidWalker", "RogueAgent", "TurboCharged",
    "EchoStorm", "QuantumLeap", "BinaryBoss", "HexMaster", "CryptoKnight",
    "DataMiner", "CodeBreaker", "ByteForce",
];

async function seedDatabase(client: PrismaClient) {
    const userCount = await client.user.count();
    if (userCount > 0) return;

    for (const [i, username] of USERNAMES.entries()) {
        const isRehim = username === "TheRehim";
        const isAdmin = i === 0;
        await client.user.create({
            data: {
                username,
                email: `${username.toLowerCase()}@enterprise.gg`,
                passwordHash: hashSync(isRehim ? "rehim123" : `${username.toLowerCase()}123`, 10),
                role: isAdmin ? "admin" : "user",
                displayName: isRehim ? "Rehim" : username.replace(/([A-Z])/g, " $1").trim(),
                bio: isRehim ? "Full-stack dev, EU4 enjoyer, competitive gamer." : null,
            },
        });
    }

    for (const game of GAMES) {
        await client.game.create({ data: game });
    }

    const allGames = await client.game.findMany();
    const allUsers = await client.user.findMany();
    const rehim = allUsers.find((u) => u.username === "TheRehim")!;
    const rehimGames = ["Counter-Strike 2", "Europa Universalis IV", "Grand Theft Auto V", "EA SPORTS FC 25", "Euro Truck Simulator 2", "Golf With Your Friends", "Tower Unite", "MudRunner", "Forza Horizon 5", "Battlefield 1", "Dota 2", "Left 4 Dead 2", "Garry's Mod", "Portal 2"];

    for (const game of allGames) {
        const isRehimGame = rehimGames.includes(game.title);
        if (isRehimGame) {
            const play_time = game.title === "Europa Universalis IV" ? 180000 : Math.floor(Math.random() * 50000) + 600;
            await client.userGame.create({
                data: { userId: rehim.id, gameId: game.id, playtime: play_time },
            });
        }

        const otherUsers = allUsers.filter((u) => u.id !== rehim.id);
        const ownerCount = Math.floor(Math.random() * 15) + 5;
        const shuffled = otherUsers.sort(() => Math.random() - 0.5).slice(0, ownerCount);
        for (const user of shuffled) {
            await client.userGame.create({
                data: { userId: user.id, gameId: game.id, playtime: Math.floor(Math.random() * 30000) + 100 },
            });
        }
    }

    for (const game of allGames) {
        const achDefs = ACHIEVEMENTS_BY_GAME[game.title];
        if (!achDefs) continue;
        for (const ach of achDefs) {
            await client.achievement.create({
                data: { gameId: game.id, ...ach },
            });
        }
    }

    const allAchievements = await client.achievement.findMany({ include: { game: true } });
    for (const user of allUsers) {
        const userOwnedGames = await client.userGame.findMany({ where: { userId: user.id } });
        const ownedGameIds = userOwnedGames.map((ug) => ug.gameId);
        const relevantAchievements = allAchievements.filter((a) => ownedGameIds.includes(a.gameId));
        const unlockCount = Math.floor(relevantAchievements.length * (user.username === "TheRehim" ? 0.6 : Math.random() * 0.5));
        const toUnlock = relevantAchievements.sort(() => Math.random() - 0.5).slice(0, unlockCount);
        for (const ach of toUnlock) {
            await client.userAchievement.create({
                data: { userId: user.id, achievementId: ach.id },
            });
        }
    }

    for (const game of allGames) {
        const owners = await client.userGame.findMany({ where: { gameId: game.id }, include: { user: true } });
        for (const owner of owners) {
            await client.leaderboardEntry.create({
                data: {
                    userId: owner.userId,
                    gameId: game.id,
                    score: Math.floor(Math.random() * 10000) + 100,
                },
            });
        }
    }

    console.log("Database seeded with real game data.");
}

let seedPromise: Promise<void> | null = null;

if (!globalForPrisma.prisma) {
    if (process.env.NODE_ENV !== "production") {
        const dbPath = path.resolve(process.cwd(), "prisma/dev.db");
        if (!existsSync(dbPath)) {
            execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
        }
    }
    globalForPrisma.prisma = new PrismaClient();
    seedPromise = seedDatabase(globalForPrisma.prisma);
}

export const prisma = globalForPrisma.prisma;
export const dbReady = seedPromise || Promise.resolve();
