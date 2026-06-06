export const EXAM_PHASES = {
  week: {
    label: 'Week before',
    color: '#E6F1FB',
    textColor: '#0C447C',
    steps: [
      { title: 'Make a study plan — not a study marathon', body: "Break your material into daily chunks. Cramming everything the night before tanks your performance and spikes anxiety. Knowing you have a plan makes your brain relax — it stops treating the exam like a threat and starts treating it like a problem you can solve." },
      { title: 'Sleep is not optional', body: "Your brain consolidates memory during sleep. Cutting sleep to study more is almost always counterproductive. You remember less, think slower, and feel more anxious. Protect your sleep this week like it's part of your study plan — because it is." },
      { title: "Identify what you don't know", body: "Go through the material and honestly mark what you're shaky on. Most exam anxiety comes from vague, undefined dread. When you name the specific things you don't know, the anxiety becomes a task list instead of a looming cloud." },
      { title: "Avoid comparing your prep to others", body: "Someone saying \"I haven't studied at all\" is almost never true. Comparing your preparation to other people's reported preparation is a reliable way to either panic or get overconfident. Focus on your own process." },
      { title: 'Do one thing every day that has nothing to do with studying', body: "A walk, a workout, a show, a meal with friends. Your brain needs recovery time. Treating every waking hour as potential study time creates diminishing returns and builds resentment toward the material." },
    ],
  },
  night: {
    label: 'Night before',
    color: '#EEEDFE',
    textColor: '#3C3489',
    steps: [
      { title: 'Stop studying by 9 or 10pm', body: "Anything you learn in the last hour before bed barely sticks. What does stick is your anxiety level going into sleep. A calm night before is worth more than one more hour of cramming — and the research backs this up." },
      { title: 'Pack everything the night before', body: "Your ID, your pencils, your water bottle, anything you need. Decision fatigue and morning chaos spike anxiety before you even get to the exam. Remove every variable you can control." },
      { title: 'Do a brain dump', body: "Spend 10 minutes writing down everything you know about the material — just dump it out. This clears your working memory and actually helps consolidation. It also shows you how much you actually know, which is usually more than anxiety lets you believe." },
      { title: 'Try the 4-7-8 breathing before bed', body: "If your mind is racing, do 3-4 cycles of 4-7-8 breathing. It physically activates your parasympathetic nervous system and slows your heart rate. It's not a trick — it's physiology." },
      { title: 'Tell yourself one true thing', body: '"I have prepared. I will do my best. One exam does not define me." Pick one. Say it out loud. Write it down if you need to. Your internal narrative before sleep shapes how you wake up.' },
    ],
  },
  morning: {
    label: 'Morning of',
    color: '#E1F5EE',
    textColor: '#085041',
    steps: [
      { title: 'Eat something — even small', body: "Your brain runs on glucose. Skipping breakfast because you're anxious or rushed lowers your cognitive function during the exam. It doesn't have to be a full meal — even a banana and some water makes a real difference." },
      { title: 'Give yourself extra time', body: "Rushing to an exam — parking stress, running late, not finding the room — spikes cortisol and tanks performance. Leave earlier than you think you need to. Those 20 minutes of calm arrival are worth more than 20 minutes of extra review." },
      { title: 'Do NOT cram in the waiting area', body: "Reading new material right before an exam introduces confusion and panic. If you didn't learn it by now, those 10 minutes won't change that — but they will increase your anxiety. Put your notes away. Breathe instead." },
      { title: 'Use grounding if anxiety spikes', body: "If you feel panic rising — racing heart, shallow breath, mind going blank — do the 5-4-3-2-1 technique. Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. It stops the anxiety spiral in under 60 seconds." },
      { title: "Remember: your best is enough", body: "You cannot perform beyond what you've prepared. But anxiety can make you perform well below it. The goal walking in is not to be perfect — it's to be calm enough to access what you actually know." },
    ],
  },
  during: {
    label: 'During exam',
    color: '#FAECE7',
    textColor: '#712B13',
    steps: [
      { title: 'Read every question fully before answering', body: 'Anxious brains skim and miss key words. "Which of the following is NOT" or "choose the best answer" — missing those changes everything. Slow down on the reading even if you feel rushed.' },
      { title: 'Skip and come back', body: "If you're stuck, mark it and move on. Spending 5 minutes on one hard question while 20 easy ones wait is a losing strategy. Get the points you know first, then come back with a calmer mind." },
      { title: "If your mind goes blank — breathe first", body: "Three slow breaths before trying to recall. Your brain literally cannot access memory as well under panic. The breath isn't procrastination — it's actually the fastest path back to what you know." },
      { title: 'Trust your first instinct', body: "On multiple choice, your first answer is right more often than the one you talk yourself into. Only change an answer if you have a clear, specific reason — not just a vague feeling of doubt." },
      { title: 'Manage your time actively', body: "Glance at the clock at the halfway point. Know how many questions or points are left. Don't sprint the last 5 minutes in a panic — pace yourself from the start so you're never in that position." },
    ],
  },
  after: {
    label: 'After exam',
    color: '#F1EFE8',
    textColor: '#444441',
    steps: [
      { title: 'Do not do the post-exam autopsy', body: "Immediately going over every question you might have gotten wrong does nothing useful — you can't change it. It just extends the anxiety. Give yourself a buffer before you think about it at all." },
      { title: 'Do something that has nothing to do with school', body: "Even 30 minutes. A walk, food you enjoy, a show, a conversation. Your nervous system needs a real break to recover. You've done the work — let it go." },
      { title: 'Resist comparing answers with others', body: "Hearing \"I put C for number 12\" when you put B will send you into a spiral that changes nothing. The exam is over. What other people wrote doesn't affect what you wrote." },
      { title: "Acknowledge the effort, not just the outcome", body: "How you're feeling right now is largely about the result you're imagining — not even the real one. You don't know how you did. What you do know is that you showed up and tried. That matters." },
      { title: "If you're really struggling after — reach out", body: "Exam anxiety that takes days to recover from, or that's significantly affecting your life, is worth talking to someone about. Your campus counseling center exists for exactly this. It's not dramatic — it's smart." },
    ],
  },
};
