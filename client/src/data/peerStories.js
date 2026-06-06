export const PEER_SITUATIONS = [
  { id: 'exam', label: 'Failing or struggling with exams', emoji: '📚', tags: ['student', 'athlete'] },
  { id: 'burnout', label: 'Completely burned out', emoji: '🔥', tags: ['student', 'athlete'] },
  { id: 'injury', label: 'Injured and struggling mentally', emoji: '🏥', tags: ['athlete'] },
  { id: 'slump', label: 'In a performance slump', emoji: '📉', tags: ['athlete'] },
  { id: 'lonely', label: 'Lonely or disconnected', emoji: '🌧️', tags: ['student', 'athlete'] },
  { id: 'identity', label: 'Not sure who I am outside of my sport or grades', emoji: '🧭', tags: ['student', 'athlete'] },
  { id: 'pressure', label: 'Social pressure — not fitting in', emoji: '👥', tags: ['student', 'athlete'] },
  { id: 'anxiety', label: 'General anxiety & overwhelming thoughts', emoji: '🌀', tags: ['student', 'athlete'] },
];

export const PEER_STORIES = {
  exam: [
    {
      handle: 'NightOwl_Nia', role: 'Junior, Biology major', detail: 'Failed her first organic chemistry exam',
      story: "I failed orgo 1 my sophomore year. Not a bad grade — an actual F. I cried in my car for an hour after getting the email. I had always been the student who got A's without trying too hard, and this completely shattered my identity.\n\nWhat I didn't realize was that I didn't know how to study. I had coasted through high school on memory alone and college actually required me to learn material, not just memorize it.\n\nThe thing that turned it around was going to office hours for the first time in my life. I was embarrassed to go but my TA was so kind about it. She didn't make me feel stupid — she showed me I was approaching the problems the wrong way entirely.\n\nI also started using the Pomodoro method — 45 minutes on, 10 minutes off — instead of grinding for 4 hour blocks that left me foggy. I retook the class and got a B+. Not perfect, but I actually understood the material.\n\nThe exam doesn't define you. It's information about how you're studying, not who you are.",
      helped: ['Office hours changed everything — go even once', 'Studying smarter not longer — timed sessions work', 'Separating your grade from your worth as a person'],
    },
    {
      handle: 'Marcus_runs', role: 'Senior, Accounting major', detail: 'Almost failed out junior year from anxiety',
      story: "Junior year I got so anxious before exams that I would blank completely. I knew the material cold — I had studied for weeks — but the moment I sat down my mind would go white and I couldn't access anything I'd learned.\n\nI finally talked to someone at the campus counseling center about it. They taught me about what's actually happening physiologically during anxiety — your prefrontal cortex basically goes offline. That's why you can't think. It's not weakness, it's biology.\n\nThey taught me a grounding technique — 4-7-8 breathing, which sounds simple but genuinely works — and told me to arrive to exams early and sit quietly instead of cramming in the hallway.\n\nI also started writing a one page 'brain dump' the night before every exam — just everything I knew about the material. It cleared my head and actually showed me how much I knew.\n\nIf your anxiety is affecting your grades, please talk to someone. It's not about being weak. It's about getting the right tools.",
      helped: ['4-7-8 breathing before and during exams', 'Arriving early and sitting quietly instead of cramming', 'Campus counseling — they actually helped'],
    },
  ],
  burnout: [
    {
      handle: 'Tired_but_trying', role: 'Sophomore, Nursing major', detail: 'Burned out completely second semester freshman year',
      story: "By February of my freshman year I was sleeping 4 hours a night, eating mostly vending machine food, and crying in the library bathroom between classes. I didn't recognize it as burnout — I just thought I wasn't working hard enough.\n\nThe thing about burnout is that working harder makes it worse. Your brain is literally depleted. But nobody tells you that. They just tell you to push through.\n\nWhat finally helped was being honest with myself that I couldn't keep going at that pace. I dropped one class — which felt like total failure at the time — and gave myself permission to sleep 8 hours for two weeks.\n\nMy grades actually went up. My ability to focus came back. I was kinder to people around me. It turns out that rest is not a reward for finishing your work. It's the thing that makes you able to do the work.\n\nIf you're reading this and you're where I was — please rest. Not forever. Just enough.",
      helped: ['Actually sleeping — not as a reward but as a tool', 'Dropping one thing to save everything else', 'Admitting it out loud to one person who cared'],
    },
    {
      handle: 'Coach_T_Jr', role: 'Student athlete, Track & Field', detail: 'Burned out midway through junior season',
      story: "I hit a wall junior year where I didn't want to go to practice. I love track — I've run since I was 8 years old. So when I started dreading practice, I knew something was really wrong.\n\nMy coach noticed before I said anything. He pulled me aside and asked how I was doing, not how my times were. That one question kind of broke something open for me.\n\nI had been training through every illness, every bad day, every emotional hard patch, never taking a true mental rest day. I thought that was what commitment looked like. Turns out it's what depletion looks like.\n\nI took two weeks of reduced training — still showed up but did minimal work. I slept more. I spent time with my family. I did things that had nothing to do with running.\n\nI came back faster. Not because rest made me physically better — though it did — but because I actually wanted to be there again.",
      helped: ['Telling my coach the truth about how I was feeling', 'Deliberate mental rest — not just physical rest', 'Doing things that had nothing to do with my sport'],
    },
  ],
  injury: [
    {
      handle: 'ACL_and_back', role: 'Division II Soccer, Midfielder', detail: 'Tore her ACL junior year, 8 months out',
      story: "I tore my ACL two weeks before conference championships junior year. I heard the pop, sat up, and knew immediately.\n\nThe first month was the hardest mentally. I went to every practice and sat on the sideline in a boot watching my team. I felt completely invisible. Like I had ceased to exist as a person on this team.\n\nSomebody told me early on that this was an opportunity to figure out who I was outside of soccer. I hated hearing that. I wanted to play soccer, not find myself.\n\nBut eventually I started taking it seriously. I got really into cooking. I started helping my younger cousin with her homework on weekends. I went to therapy for the first time.\n\nAnd when I came back, I was honestly a better teammate. More patient. Less caught up in stats. I understood what it meant to want something you couldn't have, and it made me grateful in a way I hadn't been before.",
      helped: ['Therapy — actually going, not just thinking about it', 'Finding one thing outside of sport to invest in', 'Being honest with teammates instead of pretending to be fine'],
    },
    {
      handle: 'Bench_to_back', role: 'Division III Basketball, Guard', detail: 'Stress fracture sophomore year, 4 months out',
      story: "I got a stress fracture in my foot sophomore year and the doctor said four months of no running. Four months. My whole identity was playing basketball.\n\nThe thing that helped most was finding a sport psych at my school. She helped me understand that what I was grieving was real — it wasn't just missing games, it was missing the version of myself I felt most like when I played.\n\nShe also gave me something practical: visualization. I spent 10 minutes every day seeing myself playing — making passes, going to my spots, the feel of the ball. Research shows this actually maintains neural pathways. I came back and my timing felt shockingly preserved.\n\nIf you're injured right now: your grief is legitimate. You don't have to rush past it. And visualization actually works — don't skip it.",
      helped: ['Sport psychology — best decision I made during recovery', 'Daily visualization to stay mentally in the game', 'Letting myself grieve without rushing past it'],
    },
  ],
  slump: [
    {
      handle: 'Quiet_Striker', role: 'Division I Soccer, Forward', detail: 'Went 11 games without a goal',
      story: "Last season I scored in the first 9 games of the year. This season I went 11 games without one. Same player, same training, same team. Just couldn't find the back of the net.\n\nI started avoiding eye contact with my coach. I started apologizing to teammates after games. I stopped shooting from spots I normally take without thinking. The slump was changing who I was on the field.\n\nMy coach finally sat me down and said something I needed to hear: 'You're trying to not miss instead of trying to score. Those are two completely different mental states.'\n\nHe was right. I had stopped playing freely. Every touch was loaded with the weight of the slump.\n\nI went back to a pre-game routine I had abandoned — 5 minutes of visualization before every game, replaying goals I've scored in the past. Not hoping to score — remembering that I already know how.\n\nGoal 12 came in training. Then two in the next game. The slump broke not because my skill came back — it never left — but because I stopped fighting myself.",
      helped: ['Pre-game visualization — remembering not hoping', 'Separating identity from recent results', 'One honest conversation with my coach'],
    },
  ],
  lonely: [
    {
      handle: 'Far_from_home', role: 'Freshman, First generation college student', detail: 'Moved 1,200 miles from home, knew nobody',
      story: "I moved 1,200 miles from home for school. I didn't know a single person on campus. My roommate was perfectly nice but we had nothing in common. By October I was eating every meal alone and calling my mom twice a day.\n\nI told myself I was fine. That this was normal. That everyone was meeting people and making friends and I just needed more time. But I wasn't taking any steps to actually meet people.\n\nThe thing that broke the cycle was joining one thing. Just one. I joined the campus running club, even though I'm a mediocre runner. I showed up for the first time feeling nervous and left that night with two people who texted me the next week.\n\nThat's it. That's the whole story. One thing, shown up for consistently, created the thread that led to actual connection.\n\nLoneliness in college is so common and so rarely talked about. If you're in it right now, it's not a you problem. It's a not-yet problem.",
      helped: ['Joining one thing and showing up consistently', 'Letting myself call home as much as I needed to', 'Being honest with myself that I was lonely instead of just saying I was fine'],
    },
  ],
  identity: [
    {
      handle: 'More_than_my_GPA', role: 'Junior, Pre-med', detail: 'Had a breakdown when she got a B in biochemistry',
      story: "I got a B in biochemistry and had a full breakdown. Not an upset afternoon — a genuine hours-long crisis where I questioned everything: my worth, my future, whether I was actually smart, whether I should be pre-med at all.\n\nThat was the moment I realized I had completely fused my identity with my academic performance. My grades weren't a measure of how I was doing in class. They were a measure of whether I was a good person who deserved good things.\n\nTherapy helped me understand how that happened and how to start separating the two. But the practical shift was this: I started writing down things I was good at that had nothing to do with school. Cooking. Being a good listener. Making people laugh. Being reliable.\n\nThose things don't go on a med school application. But they're also more fundamentally me than any grade.\n\nYour GPA is data about how you performed in some classes at one point in your life. It is not data about your worth.",
      helped: ['Therapy for the underlying belief, not just the symptom', 'Listing things I valued about myself outside of achievement', 'Talking to a pre-med advisor who had a realistic perspective'],
    },
  ],
  pressure: [
    {
      handle: 'Dry_campus_life', role: 'Sophomore, Education major', detail: "Doesn't drink for personal reasons, navigating a heavy party campus",
      story: "I don't drink. It's a personal choice that has nothing to do with religion or health — I just don't want to. On my campus that makes you weird.\n\nFreshman year I went to parties and held a solo cup of water the whole time. It worked fine — nobody really checked — but I still felt like I was performing normalcy instead of actually belonging.\n\nI eventually found my people by being more upfront about it. Not making a big announcement, but when someone offered me a drink I'd just say 'I'm good, I don't drink' with zero apology. And then I'd immediately change the subject to something interesting.\n\nSome people drifted. The ones who stayed are genuinely my people.\n\nThe social pressure doesn't fully go away. But you get more comfortable in your own skin about it. And you start to realize that most of the pressure is internal — other people are way less focused on your cup than you think.",
      helped: ['Solo cup trick — genuinely works for low-pressure situations', 'Owning it plainly without over-explaining', "Finding the people who didn't care — they exist everywhere"],
    },
  ],
  anxiety: [
    {
      handle: 'Racing_thoughts', role: 'Senior, Psychology major (ironic, she knows)', detail: 'Dealt with anxiety since high school, it got worse in college',
      story: "I've had anxiety since I was 14. I chose psychology as a major partly because I wanted to understand my own brain. Joke's on me — knowing the clinical terms for what you're experiencing doesn't make it easier to experience.\n\nCollege made it worse. The stakes felt higher. The schedule was less structured. There was no bell telling me when to transition from one thing to the next. My anxiety loves structure.\n\nThe things that helped most weren't the things I expected. Journaling helped more than I thought — not processing deep emotions, just dumping the racing thoughts out of my head before bed so they weren't circling all night.\n\nExercise helped enormously. Not for fitness — I don't care about fitness. But 30 minutes of movement lowered my baseline anxiety in a way that nothing else did.\n\nAnd talking to a therapist — actually talking, not just reading about therapy — helped me identify the patterns under my anxiety that I couldn't see from inside them.\n\nAnxiety doesn't fully go away for me. But it became something I manage instead of something that manages me.",
      helped: ['Nightly brain dump journaling — 10 minutes, clears your head', 'Daily movement — not for fitness, for nervous system regulation', 'Actual therapy, not just reading about therapy'],
    },
  ],
};
