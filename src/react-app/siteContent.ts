export type TrackerItem = {
  label: string;
  value: string;
  tone: "declared" | "stagnant" | "limited" | "unformed";
};

export type NavItem = {
  label: string;
  href: string;
};

export type PortalCard = {
  index: string;
  eyebrow: string;
  title: string;
  text: string;
  href: string;
};

export type ContentPage = {
  eyebrow: string;
  title: string;
  intro: string;
  body: string[];
  calloutTitle: string;
  calloutText: string;
};

export type RulesIntroCard = {
  title: string;
  body: string[];
  emphasis: string;
};

export type RuleEntry = {
  title: string;
  body: string[];
  emphasis?: string;
};

export type RuleSection = {
  number: string;
  title: string;
  intro?: string;
  entries: RuleEntry[];
};

export type RuleGroup = {
  heading: string;
  intro: string;
  sections: RuleSection[];
};

export type RulesLanding = {
  title: string;
  intro: string[];
  principle: string;
  closing: string;
  cards: RulesIntroCard[];
  groups: RuleGroup[];
};

export type SiteContent = {
  brand: {
    name: string;
    shortMark: string;
    portalLabel: string;
  };
  navigation: NavItem[];
  hero: {
    kicker: string;
    lineOne: string;
    accent: string;
    lineTwo: string;
    lede: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  state: {
    statusLabel: string;
    status: string;
    sealTop: string;
    sealBottom: string;
    noticeLabel: string;
    notice: string;
    tracker: TrackerItem[];
  };
  cards: PortalCard[];
  rulesLanding: RulesLanding;
  pages: {
    gettingStarted: ContentPage;
    rules: ContentPage;
    government: ContentPage;
    world: ContentPage;
    faq: ContentPage;
  };
  footer: {
    lineOne: string;
    lineTwo: string;
  };
};

export const defaultContent: SiteContent = {
  "brand": {
    "name": "STATE OF ROSEFIRE",
    "shortMark": "RF",
    "portalLabel": "OFFICIAL COMMUNITY PORTAL"
  },
  "navigation": [
    {
      "label": "Start Here",
      "href": "/getting-started"
    },
    {
      "label": "Rules",
      "href": "/rules"
    },
    {
      "label": "Government",
      "href": "/government"
    },
    {
      "label": "World",
      "href": "/world"
    },
    {
      "label": "FAQ",
      "href": "/faq"
    }
  ],
  "hero": {
    "kicker": "A STATE DECLARED. A FUTURE UNWRITTEN.",
    "lineOne": "Survive.",
    "accent": "Endure.",
    "lineTwo": "Decide what comes next.",
    "lede": "The State of Rosefire is a persistent FiveM survival roleplay world after the collapse. The state has been declared, Cayo Perico serves as its seat of power, and almost everything else remains to be built through play.",
    "primaryLabel": "Enter Rosefire",
    "primaryHref": "/getting-started",
    "secondaryLabel": "Read the rules",
    "secondaryHref": "/rules"
  },
  "state": {
    "statusLabel": "STATE STATUS",
    "status": "DECLARED",
    "sealTop": "ROSEFIRE",
    "sealBottom": "EST. AFTER THE FALL",
    "noticeLabel": "PUBLIC NOTICE // ROSEFIRE",
    "notice": "The State of Rosefire has been declared. Existing county and city names remain in use while the state's institutions remain largely unformed.",
    "tracker": [
      {
        "label": "Statehood",
        "value": "Declared",
        "tone": "declared"
      },
      {
        "label": "Seat of Power",
        "value": "Cayo Perico",
        "tone": "declared"
      },
      {
        "label": "Government",
        "value": "Stagnant",
        "tone": "stagnant"
      },
      {
        "label": "County Administration",
        "value": "Not established",
        "tone": "unformed"
      },
      {
        "label": "Security",
        "value": "Not established",
        "tone": "unformed"
      },
      {
        "label": "Housing",
        "value": "Not established",
        "tone": "unformed"
      },
      {
        "label": "Medical",
        "value": "Limited",
        "tone": "limited"
      },
      {
        "label": "Employment",
        "value": "Informal",
        "tone": "limited"
      },
      {
        "label": "Infrastructure",
        "value": "Stagnant",
        "tone": "stagnant"
      }
    ]
  },
  "cards": [
    {
      "index": "01",
      "eyebrow": "New to Rosefire?",
      "title": "Getting Started",
      "text": "Everything a new survivor needs before stepping into Rosefire.",
      "href": "/getting-started"
    },
    {
      "index": "02",
      "eyebrow": "Community Standard",
      "title": "Server Rules",
      "text": "The rules that keep roleplay fair, readable, and fun.",
      "href": "/rules"
    },
    {
      "index": "03",
      "eyebrow": "State Information",
      "title": "Government",
      "text": "Public information about the state and the institutions that exist today.",
      "href": "/government"
    },
    {
      "index": "04",
      "eyebrow": "Know the World",
      "title": "World & Lore",
      "text": "Learn what a resident could reasonably know without spoiling deeper lore.",
      "href": "/world"
    }
  ],
  "rulesLanding": {
    "title": "ROSEFIRE COMMUNITY & ROLEPLAY RULES",
    "intro": [
      "Rosefire is built around collaborative storytelling, mutual respect, and the understanding that roleplay works best when everyone involved is trying to create a good story—not simply trying to win.",
      "These rules are written from years of roleplay experience across different communities: good situations becoming great stories, and other situations falling apart because of unclear rules, poor communication, unnecessary hostility, or decisions made without understanding the full context.",
      "The goal is not to create a massive rulebook where players are afraid that every action might violate some obscure subsection. The goal is to clearly establish what this community expects, protect the people who play here, and give staff consistent standards to work from when something goes wrong.",
      "Context matters. Intent matters. Evidence matters. Staff should investigate situations rather than beginning with the assumption that an accusation is automatically true or false. When enforcement action is taken, staff should be able to identify what rule was violated and why.",
      "At the same time, \"there isn't a rule specifically saying I can't\" is not permission to deliberately exploit loopholes, harass another player, or undermine the spirit of the community."
    ],
    "principle": "\"There isn't a rule saying I can't\" is not permission to abuse a loophole.",
    "closing": "Rosefire is a roleplay server. We are here to create stories together.",
    "cards": [
      {
        "title": "THE WORLD OF ROSEFIRE",
        "body": [
          "Rosefire is a fictional post-collapse setting. The state has been declared, but much of the world and its institutions remain incomplete, unstable, or absent.",
          "A character's gender, race, sexuality, identity, or similar traits do not restrict what roles, professions, positions of authority, or stories they may pursue in Rosefire.",
          "The setting is not an excuse for harassment, discrimination, forced degrading roleplay, or declaring another player's character to be fail-RP because of real-world prejudice."
        ],
        "emphasis": "Rosefire's established lore takes precedence over real-world assumptions about who a character is allowed to be."
      },
      {
        "title": "HOW TO USE THIS RULEBOOK",
        "body": [
          "You are expected to understand the rules relevant to the roleplay you participate in, but you are not expected to memorize a giant legal document.",
          "When these rules do not specifically address a situation, use reasonable judgment, respect the other people involved, protect the roleplay, and do not deliberately use technicalities to do something you already know is harmful to the community.",
          "Staff may intervene in behavior that is clearly abusive, disruptive, exploitative, or harmful even when the exact situation was not anticipated when these rules were written. Staff are still expected to explain what conduct was inappropriate and why intervention was necessary."
        ],
        "emphasis": "Use reasonable judgment. Respect other players. Protect the roleplay. Do not exploit technicalities."
      },
      {
        "title": "WHEN SOMETHING GOES WRONG",
        "body": [
          "Do not interrupt an active scene to argue rules, accuse someone of fail-RP, or threaten another player with staff action.",
          "Finish the scene when reasonably possible, disengage safely if necessary, and use Rosefire's support or report system afterward.",
          "Immediate safety concerns may always be brought to staff."
        ],
        "emphasis": "Players roleplay. Staff handle rule enforcement."
      }
    ],
    "groups": [
      {
        "heading": "RULEBOOK SECTIONS",
        "intro": "These are the first migrated Rosefire rule sections. More will be added as the remaining Nightrose rules are brought over and updated for the new setting.",
        "sections": [
          {
            "number": "2",
            "title": "Community Conduct",
            "entries": [
              {
                "title": "Respect Other Players",
                "body": [
                  "Treat other members of Rosefire with basic respect.",
                  "Harassment, targeted bullying, discriminatory attacks, threats, stalking, deliberately making another player uncomfortable, or repeatedly antagonizing someone OOC are not acceptable."
                ],
                "emphasis": "IC conflict does not justify OOC hostility. Characters can hate one another while their players remain perfectly civil."
              },
              {
                "title": "Slurs & Discriminatory Content",
                "body": [
                  "Do not use discriminatory slurs or degrading language targeting real-world protected characteristics as an excuse for roleplay.",
                  "Rosefire's setting does not require players to recreate racism, sexism, homophobia, transphobia, or similar real-world discrimination."
                ]
              },
              {
                "title": "Keep IC and OOC Separate",
                "body": [
                  "Do not carry IC arguments into Discord or OOC relationships into character interactions.",
                  "Likewise, do not target someone's character because you dislike the player.",
                  "If an RP situation becomes an OOC problem, use the appropriate support or report system rather than continuing the fight through RP."
                ]
              },
              {
                "title": "Don't Police Other People's RP",
                "body": [
                  "If you believe someone has broken a rule, report it.",
                  "Do not interrupt scenes to argue rules, threaten reports, announce that someone is fail-RPing, or attempt to punish them yourself.",
                  "Finish or safely disengage from the scene when reasonably possible and let staff handle the issue afterward."
                ]
              }
            ]
          },
          {
            "number": "3",
            "title": "Roleplay Standards",
            "entries": [
              {
                "title": "Stay In Character",
                "body": [
                  "While actively participating in RP, remain in character unless there is a legitimate reason to communicate OOC.",
                  "Minor mistakes happen. Nobody is expected to perform perfectly.",
                  "Repeatedly breaking character to complain, joke about mechanics, argue rules, or disrupt scenes is different."
                ]
              },
              {
                "title": "Value Your Character's Life",
                "body": [
                  "Your character should generally behave as though injury and death matter.",
                  "Having a weapon pointed at you, being surrounded, or being seriously wounded should affect how your character behaves.",
                  "This does not mean you must automatically obey every demand whenever someone produces a gun. Context matters.",
                  "A hardened survivor may respond differently from a civilian. A desperate character may take risks. Someone may reasonably believe they have an opportunity to escape.",
                  "What isn't acceptable is treating serious danger like it has no consequences simply because you know mechanically that respawning exists."
                ]
              },
              {
                "title": "Powergaming",
                "body": [
                  "Do not force actions or outcomes onto another character without giving them a reasonable opportunity to respond.",
                  "You can attempt actions. You cannot unilaterally decide another player's response.",
                  "Game mechanics also should not be exploited to force outcomes that would not make sense within RP."
                ]
              },
              {
                "title": "Metagaming",
                "body": [
                  "Do not use information your character did not reasonably obtain in character.",
                  "That includes information from Discord, streams, another character, private organization channels, staff tools, or OOC conversations.",
                  "Your characters do not share a brain. Information learned on Character A does not automatically become known by Character B."
                ]
              },
              {
                "title": "Stream Sniping",
                "body": [
                  "Do not use someone's livestream, recording, Discord activity, or other OOC information to locate them, discover what they're doing, learn hidden information, or gain an RP advantage."
                ]
              }
            ]
          },
          {
            "number": "4",
            "title": "Conflict & Violence",
            "entries": [
              {
                "title": "Random Deathmatch (RDM)",
                "body": [
                  "Do not attack, shoot, or kill other characters without reasonable RP justification.",
                  "Conflict should have context.",
                  "Not every violent encounter requires twenty minutes of dialogue beforehand, especially when an existing conflict is already established, but violence should come from the story rather than boredom."
                ]
              },
              {
                "title": "Vehicle Deathmatch (VDM)",
                "body": [
                  "Do not intentionally use cars, trucks, motorcycles, aircraft, boats, or other vehicles to randomly injure or kill players without legitimate RP justification.",
                  "Accidents happen. Deliberately running people down for entertainment is different."
                ]
              },
              {
                "title": "Escalation",
                "body": [
                  "Give conflict reasonable room to escalate.",
                  "An insult does not ordinarily justify immediately shooting someone dead.",
                  "Repeated threats, established feuds, robberies, violent confrontations, active pursuit, and similar circumstances may justify considerably faster escalation."
                ],
                "emphasis": "Context matters more than an artificial escalation checklist."
              },
              {
                "title": "Revenge",
                "body": [
                  "Being injured, downed, arrested, robbed, or losing a confrontation does not give you permission to immediately hunt the other person down for revenge.",
                  "Any continuing retaliation should make sense based on what your character remembers and what actually happened through RP."
                ]
              }
            ]
          },
          {
            "number": "6",
            "title": "Text & Voice Roleplay",
            "entries": [
              {
                "title": "Text and Voice Are Both Valid",
                "body": [
                  "Rosefire supports text-based and voice-based roleplay.",
                  "Neither method is considered lesser RP.",
                  "Players may primarily communicate through text, primarily communicate through voice, or use a combination of both.",
                  "Do not refuse to RP with, mock, disadvantage, or deliberately exclude someone simply because they use text instead of voice."
                ]
              },
              {
                "title": "Give Text Players Time to Respond",
                "body": [
                  "If someone is actively typing a response, give them a reasonable opportunity to finish.",
                  "Do not exploit the additional time required to type by rapidly escalating a scene before the player can respond.",
                  "Likewise, text players should make reasonable efforts not to leave scenes waiting unnecessarily when a short response would suffice."
                ]
              }
            ]
          },
          {
            "number": "11",
            "title": "Staff & Enforcement",
            "entries": [
              {
                "title": "Staff Are Players Too",
                "body": [
                  "Staff members do not receive special IC authority simply because they're staff.",
                  "Staff powers and information may not be used to benefit a character."
                ]
              },
              {
                "title": "Reports",
                "body": [
                  "When reporting another player, provide as much useful context and evidence as reasonably possible.",
                  "A report is a request for staff to investigate—not proof that the accused player violated a rule."
                ]
              },
              {
                "title": "Staff Decisions",
                "body": [
                  "Staff should consider context, severity, intent, previous behavior, available evidence, and the effect on other players when determining an appropriate response.",
                  "Not every mistake requires a ban.",
                  "Likewise, repeatedly exploiting technicalities or accumulating minor violations may justify stronger action when a pattern becomes clear."
                ]
              },
              {
                "title": "Appeals",
                "body": [
                  "Players may appeal disciplinary action through the designated support system.",
                  "Appeals should be handled by someone capable of reviewing the original decision fairly.",
                  "Harassing staff, repeatedly opening tickets after an appeal has been resolved, or attempting to pressure individual staff members does not constitute an appeal."
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Banditry & Property Crime",
        "intro": "Banditry, robbery, theft, raiding, and territorial conflict are all valid parts of Rosefire RP.\n\nThe purpose of criminal roleplay is to create tension, consequences, rivalries, investigations, negotiations, retaliation, and stories.\n\nIt is not an excuse to treat other players as renewable loot sources or to erase someone’s progression because the mechanics allow it.\n\nCrime should create roleplay—not simply remove another player’s progress.",
        "sections": [
          {
            "number": "1",
            "title": "Robbery & Theft",
            "intro": "Players may rob or steal from other characters when there is reasonable RP context and the relevant game mechanics allow it.",
            "entries": [
              {
                "title": "Reasonable Robbery",
                "body": [
                  "Robberies should make sense for the situation.",
                  "Taking money, supplies, weapons, valuables, or other reasonable items during a robbery may be appropriate."
                ]
              },
              {
                "title": "Do Not Strip Players for Loot",
                "body": [
                  "Systematically stripping another player of everything they own, repeatedly targeting the same player purely for supplies, or treating every encounter as an opportunity to empty someone’s inventory is different."
                ]
              },
              {
                "title": "Leave Room for Consequences",
                "body": [
                  "A robbery should leave room for consequences and future RP.",
                  "That may include investigation, retaliation, negotiation, recognition, warrants, reputation, or an ongoing feud."
                ]
              }
            ]
          },
          {
            "number": "2",
            "title": "Persistent Property",
            "intro": "Player-owned or persistent property may become involved in criminal RP.",
            "entries": [
              {
                "title": "What Counts as Persistent Property",
                "body": [
                  "This can include homes, camps, businesses, vehicles, storage, hideouts, or similar systems as they are added to Rosefire."
                ]
              },
              {
                "title": "Discovery Is Not Permission to Wipe It",
                "body": [
                  "Discovering unattended property does not automatically give you permission to completely empty or destroy it.",
                  "Characters may investigate suspicious property, steal reasonable items where mechanics allow it, leave messages, report what they found, watch the location, or return later."
                ]
              },
              {
                "title": "Property Is Part of Someone’s Story",
                "body": [
                  "Persistent property represents part of another character’s progression and story."
                ],
                "emphasis": "It should not be treated like an unattended loot chest."
              }
            ]
          },
          {
            "number": "3",
            "title": "Property Destruction",
            "intro": "Do not destroy, dismantle, burn, sabotage, or deliberately wipe another player’s established property without significant RP justification.",
            "entries": [
              {
                "title": "Major Destruction Needs Major RP",
                "body": [
                  "Major destruction should generally represent the culmination of an existing story rather than the beginning of one.",
                  "A long-running feud, faction conflict, criminal retaliation, or similar storyline may reasonably escalate to serious property damage."
                ]
              },
              {
                "title": "Random Destruction Is Not Enough",
                "body": [
                  "Randomly discovering someone’s home, business, camp, or vehicle and destroying it because your character is a criminal is not sufficient justification."
                ]
              },
              {
                "title": "Permanent Consequences",
                "body": [
                  "The larger the permanent consequence you impose on someone else’s story, the more RP should exist before it happens."
                ]
              }
            ]
          },
          {
            "number": "4",
            "title": "Offline Targeting",
            "intro": "Do not deliberately target another player’s property, storage, business, or other persistent assets because you know the player is offline.",
            "entries": [
              {
                "title": "Do Not Bypass the RP",
                "body": [
                  "A player being absent from the server is not an invitation to bypass the roleplay that would normally accompany attacking their property."
                ]
              },
              {
                "title": "Unattended Does Not Mean Untouchable",
                "body": [
                  "This does not mean unattended property is magically protected from all interaction.",
                  "Characters may still discover, observe, investigate, or interact with things they encounter naturally through normal RP."
                ]
              },
              {
                "title": "What Makes It Offline Targeting",
                "body": [
                  "The problem is intentionally waiting for someone to disconnect or using OOC knowledge of their absence to make the attack easier."
                ]
              }
            ]
          },
          {
            "number": "5",
            "title": "Repeat Targeting & Progression Griefing",
            "intro": "Do not repeatedly target the same player, group, business, or property purely because they are an easy source of supplies or money.",
            "entries": [
              {
                "title": "Patterns Matter",
                "body": [
                  "Individual robberies may each appear reasonable on their own while the overall pattern becomes abusive."
                ]
              },
              {
                "title": "Progression Griefing",
                "body": [
                  "Repeated theft, destruction, or harassment that prevents another player from reasonably recovering or participating in the server may be treated as progression griefing."
                ]
              },
              {
                "title": "Ongoing Conflict Is Still Allowed",
                "body": [
                  "Ongoing conflict is allowed."
                ],
                "emphasis": "Using an ongoing conflict as an excuse to repeatedly farm another player is not."
              }
            ]
          },
          {
            "number": "6",
            "title": "Territory & Turf Claims",
            "intro": "Characters, gangs, factions, settlements, or other organizations may claim territory as part of their RP.",
            "entries": [
              {
                "title": "IC Territory Claims Are Valid",
                "body": [
                  "For example: “This neighborhood belongs to us. Outsiders aren’t welcome.”",
                  "That is valid IC roleplay."
                ]
              },
              {
                "title": "Territory Is Not OOC Ownership",
                "body": [
                  "It does not mean: “You cannot come here because our Discord says this area belongs to us.”",
                  "An IC territorial claim does not create OOC ownership of part of the map.",
                  "Other characters may enter claimed territory and accept the potential IC consequences of doing so."
                ]
              },
              {
                "title": "Public Systems Stay Public",
                "body": [
                  "Territorial claims may not be used to monopolize public resources, block access to major gameplay systems, or declare large portions of the map unavailable to everyone else."
                ],
                "emphasis": "Territory creates RP consequences—not private ownership of the game world."
              }
            ]
          },
          {
            "number": "7",
            "title": "Remote-Area Conflict",
            "intro": "Being far away from populated areas does not suspend Rosefire’s normal RP rules.",
            "entries": [
              {
                "title": "Remote Areas Still Require RP Context",
                "body": [
                  "Bandits, survivors, law enforcement, factions, travelers, and others may encounter violence in remote areas, but conflict still requires appropriate RP context.",
                  "The wilderness, countryside, abandoned industrial areas, Cayo, and other isolated locations are not automatic RDM zones."
                ]
              },
              {
                "title": "Isolation Does Not Grant Immunity",
                "body": [
                  "Likewise, living or traveling somewhere remote does not make a character immune from being discovered, questioned, tracked, robbed, arrested, or pulled into other people’s stories."
                ]
              }
            ]
          },
          {
            "number": "8",
            "title": "Crime Information & Metagaming",
            "intro": "Do not use OOC information to locate players, hidden stashes, criminal hideouts, faction locations, rare resources, property, or other discoveries your character has not reasonably learned about.",
            "entries": [
              {
                "title": "OOC Sources Stay OOC",
                "body": [
                  "That includes information from Discord, streams, another character, private channels, staff tools, or similar OOC sources."
                ]
              },
              {
                "title": "Public Gameplay Information",
                "body": [
                  "If Rosefire intentionally publishes information as general gameplay guidance—such as where a basic public system begins—using that information is not metagaming."
                ]
              },
              {
                "title": "Discovery-Based Information",
                "body": [
                  "Secret or discovery-based information should remain part of exploration and RP."
                ]
              }
            ]
          }
        ]
      },
      {
        "heading": "Characters & Alternate Characters",
        "sections": [
          {
            "number": "1",
            "title": "Your Characters Are Separate People",
            "intro": "Each character you create is their own person within Rosefire.",
            "entries": [
              {
                "title": "Knowledge and Relationships Are Separate",
                "body": [
                  "Your characters do not automatically share knowledge, relationships, enemies, organization information, criminal information, hidden locations, or information learned through another character’s RP."
                ]
              },
              {
                "title": "Property and Progression Are Separate",
                "body": [
                  "Your characters do not automatically share property, money, possessions, inventory, or bank accounts simply because you play all of them."
                ]
              },
              {
                "title": "Account Systems Are Not Automatically IC",
                "body": [
                  "Some game systems may associate information or unlocks with your player account for technical reasons. That does not automatically mean those things are shared in character."
                ]
              }
            ]
          },
          {
            "number": "2",
            "title": "Transferring Items Between Characters",
            "intro": "Your own characters may not be used to funnel progression or resources to one another.",
            "entries": [
              {
                "title": "No Self-Transfers",
                "body": [
                  "Do not transfer money, weapons, property, valuable items, business assets, vehicles, supplies, or other resources between your own characters simply to benefit another character.",
                  "This includes using another player as a middleman."
                ]
              },
              {
                "title": "Middleman Example",
                "body": [
                  "Character A gives $5,000 to a friend.",
                  "Character B logs in.",
                  "The friend gives the $5,000 to Character B.",
                  "That is still a transfer between your own characters."
                ]
              },
              {
                "title": "Do Not Stage Pickups",
                "body": [
                  "Likewise, do not leave items somewhere with one character specifically so another of your characters can retrieve them."
                ]
              }
            ]
          },
          {
            "number": "3",
            "title": "Legitimate Connections",
            "intro": "Two of your characters may reasonably be connected through the world.",
            "entries": [
              {
                "title": "Connections Can Exist",
                "body": [
                  "They may be relatives, former coworkers, members of the same community, or otherwise know one another through established RP.",
                  "That does not mean the connection can be used to funnel progression between them."
                ]
              },
              {
                "title": "Inheritance and Shared Ownership",
                "body": [
                  "Legitimate transfers involving inheritance, shared ownership, estates, businesses, or long-running storylines may be allowed when the RP genuinely supports them.",
                  "Significant inheritance should exist as part of the story before the death occurs."
                ]
              },
              {
                "title": "Reasonable Example",
                "body": [
                  "Character A dies and leaves their daughter a house through an established will.",
                  "That may be reasonable."
                ]
              },
              {
                "title": "What Is Not Automatic",
                "body": [
                  "“My new character inherited all my money, weapons, vehicles, and property.” is not automatically acceptable simply because the characters are related."
                ],
                "emphasis": "Inheritance should be roleplay—not a way to reset your character while keeping all of your progression."
              }
            ]
          },
          {
            "number": "4",
            "title": "Character Knowledge",
            "intro": "Do not switch characters to act on information learned by another character.",
            "entries": [
              {
                "title": "No Information Hopping",
                "body": [
                  "If one character learns the location of a hidden stash, criminal hideout, government operation, private meeting, or other secret information, your other characters do not automatically know it."
                ]
              },
              {
                "title": "Opposing-Side Example",
                "body": [
                  "If your criminal character learns that authorities are planning a raid, you cannot switch to another character and conveniently act on that information.",
                  "The reverse applies equally."
                ]
              },
              {
                "title": "Information Belongs to the Character",
                "body": [
                  "Information belongs to the character who learned it."
                ]
              }
            ]
          },
          {
            "number": "5",
            "title": "Conflicting Characters",
            "intro": "Players may have characters involved in different organizations, professions, factions, government positions, criminal groups, businesses, or opposing sides of a conflict when otherwise permitted.",
            "entries": [
              {
                "title": "Opposing Roles Are Allowed",
                "body": [
                  "Having a criminal character does not prevent you from also having a law-aligned character.",
                  "Working for one organization on one character does not automatically prevent another character from joining a rival organization."
                ]
              },
              {
                "title": "Keep Interests Separate",
                "body": [
                  "Players must maintain a strong separation of information and interests between those characters."
                ]
              },
              {
                "title": "Do Not Use Alts to Benefit Yourself",
                "body": [
                  "Do not use alternate characters to spy for yourself, protect your own interests, sabotage opponents, manipulate investigations, or influence a storyline for the benefit of another character you play."
                ]
              }
            ]
          },
          {
            "number": "6",
            "title": "Character Switching",
            "intro": "Do not switch characters to avoid an active RP situation or its immediate consequences.",
            "entries": [
              {
                "title": "Finish Active Situations",
                "body": [
                  "If your character is being pursued, arrested, kidnapped, treated for serious injuries, involved in a robbery, trapped in an ongoing conflict, or otherwise part of an active scene, finish or reasonably exit that situation before switching."
                ]
              },
              {
                "title": "Do Not Use Switching to Bypass Systems",
                "body": [
                  "Character switching may not be used to bypass cooldowns, generate additional rewards, avoid debts, avoid warrants or consequences, repeatedly access character-limited systems, or gain an economic advantage."
                ]
              },
              {
                "title": "Combat Logging Overlap",
                "body": [
                  "This intentionally overlaps with combat logging."
                ],
                "emphasis": "Changing characters should not erase a situation that is still actively happening."
              }
            ]
          },
          {
            "number": "7",
            "title": "Businesses",
            "intro": "Money, inventory, supplies, equipment, vehicles, and other assets belonging to a player-run business should be used for legitimate business purposes.",
            "entries": [
              {
                "title": "Business Assets Belong to the Business",
                "body": [
                  "Do not use a business account or storage as a personal bank for your other characters.",
                  "Likewise, employees should not empty business resources simply because the game mechanically permits them to access the storage."
                ]
              },
              {
                "title": "Mechanical Access Is Not Ownership",
                "body": [
                  "Business owners and managers may determine reasonable IC rules for access and use."
                ],
                "emphasis": "Mechanical permission is not automatic RP ownership."
              }
            ]
          },
          {
            "number": "8",
            "title": "Organizations",
            "intro": "Organization property belongs to the organization or appropriate IC owner—not automatically to every member.",
            "entries": [
              {
                "title": "Shared Access Is Not Personal Ownership",
                "body": [
                  "Access to shared storage, vehicles, equipment, funds, or facilities does not mean every member is personally entitled to them."
                ]
              },
              {
                "title": "Do Not Move Organization Assets to Yourself",
                "body": [
                  "Do not empty organization resources for yourself or transfer them to another character you play."
                ],
                "emphasis": "Mechanical access does not equal IC ownership."
              }
            ]
          },
          {
            "number": "9",
            "title": "Economy Exploits",
            "intro": "Do not intentionally exploit jobs, businesses, crafting, trading, NPCs, rewards, character slots, inventories, vehicles, property systems, or other mechanics to generate money or resources in ways clearly outside their intended use.",
            "entries": [
              {
                "title": "Report Abnormal Rewards",
                "body": [
                  "If you discover something that produces abnormal rewards or can be repeatedly exploited, report it rather than building your character’s wealth around it."
                ]
              },
              {
                "title": "Profit Is Not Automatically Exploitation",
                "body": [
                  "An unexpectedly profitable activity is not automatically exploitation.",
                  "For something to be treated as an exploit, staff should consider whether the player reasonably understood that the mechanic was unintended and deliberately continued abusing it."
                ],
                "emphasis": "Profit alone is not proof of exploitation. Knowledge and intent matter."
              }
            ]
          },
          {
            "number": "10",
            "title": "Gifts & Helping New Players",
            "intro": "Characters may give reasonable gifts, loans, wages, supplies, equipment, or other assistance to other characters through legitimate RP.",
            "entries": [
              {
                "title": "Reasonable Help Is Allowed",
                "body": [
                  "An established character helping a new arrival with food, basic supplies, transportation, or starter equipment is not automatically economy abuse."
                ]
              },
              {
                "title": "Do Not Use Gifts to Bypass Progression",
                "body": [
                  "Do not use gifts primarily to bypass progression, move wealth between your own characters, create OOC arrangements for transferring resources, or instantly fund a new character with established-character wealth."
                ]
              },
              {
                "title": "Use Context",
                "body": [
                  "We do not need to police every dollar or every act of generosity."
                ],
                "emphasis": "Context matters."
              }
            ]
          },
          {
            "number": "11",
            "title": "Characters Must Fit Rosefire",
            "intro": "Characters should reasonably exist within Rosefire’s setting and established public lore.",
            "entries": [
              {
                "title": "Creative Characters Are Welcome",
                "body": [
                  "Characters may have unusual backgrounds, occupations, identities, beliefs, histories, and personalities."
                ]
              },
              {
                "title": "Do Not Import Unapproved Status or Powers",
                "body": [
                  "Characters should not deliberately contradict established Rosefire lore, import status or powers from another fictional universe, or begin with extraordinary authority, wealth, influence, or abilities they have not actually earned or been approved to possess."
                ]
              },
              {
                "title": "Background Example",
                "body": [
                  "“My character was a doctor before the collapse.” — Fine.",
                  "“My character secretly controls the entire federal government and owns every hospital in the state.” — Not fine."
                ]
              },
              {
                "title": "Backstory Does Not Skip Progression",
                "body": [
                  "Claiming a background does not automatically grant mechanical skills, authority, property, or special access that the server has not actually given the character."
                ],
                "emphasis": "Backstory can explain who your character is. It does not let you skip progression."
              }
            ]
          },
          {
            "number": "12",
            "title": "Existing & Famous Characters",
            "intro": "Rosefire characters should be original creations.",
            "entries": [
              {
                "title": "Do Not Directly Portray Existing Characters",
                "body": [
                  "Do not directly portray real-world celebrities, public figures, or established copyrighted fictional characters as your Rosefire character."
                ]
              },
              {
                "title": "Inspiration Is Fine",
                "body": [
                  "Characters may take inspiration from games, films, literature, folklore, history, or other media, but they should become their own character within Rosefire."
                ],
                "emphasis": "A character inspired by something is fine. Playing an existing character as though they literally entered Rosefire is not."
              }
            ]
          },
          {
            "number": "13",
            "title": "Character Names",
            "intro": "Character names should be reasonable for the setting and community.",
            "entries": [
              {
                "title": "Unusual Names Are Fine",
                "body": [
                  "Names do not need to be perfectly realistic, culturally traditional, or common.",
                  "Unusual names are fine."
                ]
              },
              {
                "title": "Disruptive Names May Be Rejected",
                "body": [
                  "Names designed primarily as jokes, memes, impersonations, slurs, advertisements, or obvious attempts to disrupt RP may be rejected."
                ]
              },
              {
                "title": "Judge Fit, Not Personal Taste",
                "body": [
                  "Staff should judge whether a name reasonably fits RP—not whether they personally like it."
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "pages": {
    "gettingStarted": {
      "eyebrow": "START HERE",
      "title": "Getting Started",
      "intro": "Your first steps into Rosefire.",
      "body": [
        "Rosefire is a persistent FiveM survival roleplay world set after the collapse. New players should be able to arrive, understand the premise, and begin playing without studying a lore bible first.",
        "This page will hold connection details, character expectations, first-spawn guidance, starter information, and the opening player loop."
      ],
      "calloutTitle": "Page status",
      "calloutText": "This page is ready for the full onboarding guide."
    },
    "rules": {
      "eyebrow": "COMMUNITY STANDARD",
      "title": "Server Rules",
      "intro": "Clear rules, readable sections, one source of truth.",
      "body": [
        "The existing rules can be migrated here and lightly rewritten where the setting or terminology needs to change.",
        "Discord can link directly to this page while the website remains the canonical version."
      ],
      "calloutTitle": "Page status",
      "calloutText": "Rules migration is ready to begin."
    },
    "government": {
      "eyebrow": "STATE INFORMATION",
      "title": "Government",
      "intro": "The State of Rosefire exists, but most of its institutions do not yet.",
      "body": [
        "Rosefire has been declared and Cayo Perico serves as its seat of power. Beyond that, formal state institutions remain limited or unformed.",
        "Public projects, departments, laws, records, housing, medical services, employment systems, infrastructure, and security can be documented here as they actually come into existence."
      ],
      "calloutTitle": "Current posture",
      "calloutText": "Declared, but largely stagnant."
    },
    "world": {
      "eyebrow": "WORLD & LORE",
      "title": "World & Lore",
      "intro": "Deep enough to discover. Simple enough to join.",
      "body": [
        "The recognizable counties, cities, and locations of San Andreas remain. Rosefire is the new state identity declared after the collapse.",
        "This public page should contain only information an ordinary resident could reasonably know. Deeper setting secrets can stay in-game until you choose to reveal them."
      ],
      "calloutTitle": "Lore policy",
      "calloutText": "Public knowledge only. Spoilers stay out of the portal."
    },
    "faq": {
      "eyebrow": "HELP",
      "title": "Frequently Asked Questions",
      "intro": "Quick answers before you need to ask staff.",
      "body": [
        "This page will collect short, searchable answers to common questions about joining, roleplay, survival systems, applications, lore, and server expectations."
      ],
      "calloutTitle": "Page status",
      "calloutText": "FAQ entries can be expanded as real questions come in."
    }
  },
  "footer": {
    "lineOne": "STATE OF ROSEFIRE",
    "lineTwo": "A FiveM survival roleplay community."
  }
};
