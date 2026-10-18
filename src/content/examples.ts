export const examples = {
  food: {
    label: "Food nearby",
    title: "A little help, close to home.",
    question: "I need food nearby. I don’t have a car.",
    reply:
      "What town or ZIP code should I look near? You can also tell me if getting there is difficult.",
    prompt: "“Where can I find food?”",
    description: "Ask about food banks and meal sites near your town.",
  },
  meals: {
    label: "Meal ideas",
    title: "Start with what you have.",
    question: "I have rice, beans, and carrots. What can I make?",
    reply:
      "A rice-and-bean bowl could work. What seasonings do you have, and are there foods you avoid?",
    prompt: "“What can I cook with this?”",
    description: "Start with the ingredients and preferences you have.",
  },
  programs: {
    label: "Food programs",
    title: "Understand where to start.",
    question: "I need help understanding food programs.",
    reply:
      "I can help you find where to start. What state do you live in, and are you asking about SNAP, WIC, or school meals?",
    prompt: "“Where do I start?”",
    description:
      "Get help understanding next steps for SNAP, WIC, and school meals.",
  },
} as const;
export type Topic = keyof typeof examples;
