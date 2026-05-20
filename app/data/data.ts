export type MenuType = {
    label: string;
    items: string[];
};

export const Languages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C",
    "C++",
    "C#",
    "Go",
    "Rust",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
] as const;

export const Topics = [
    "Algorithms",
    "Data Structures",
    "Arrays",
    "Strings",
    "Linked Lists",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Recursion",
    "Sorting",
    "Searching",
    "Hash Tables",
] as const;

export const Difficulties = ["Junior", "Mid-Level", "Senior"] as const;

export const Menu: MenuType[] = [
    { label: "LANGUAGE", items: [...Languages] },
    { label: "TOPIC", items: [...Topics] },
    { label: "DIFFICULTY", items: [...Difficulties] },
];