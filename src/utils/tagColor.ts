const tagColorMap: Record<
  string,
  { background: string; text: string; border: string }
> = {
  blue: {
    background: "rgb(219, 234, 254)",
    text: "rgb(59, 130, 246)",
    border: "rgb(191, 219, 254)"
  },
  green: {
    background: "rgb(220, 252, 231)",
    text: "rgb(34, 197, 94)",
    border: "rgb(187, 247, 208)"
  },
  purple: {
    background: "rgb(243, 232, 255)",
    text: "rgb(147, 51, 234)",
    border: "rgb(233, 213, 255)"
  },
  yellow: {
    background: "rgb(254, 249, 195)",
    text: "rgb(234, 179, 8)",
    border: "rgb(254, 240, 138)"
  },
  red: {
    background: "rgb(254, 226, 226)",
    text: "rgb(239, 68, 68)",
    border: "rgb(254, 202, 202)"
  },
  indigo: {
    background: "rgb(224, 231, 255)",
    text: "rgb(99, 102, 241)",
    border: "rgb(199, 210, 254)"
  },
  pink: {
    background: "rgb(252, 231, 243)",
    text: "rgb(236, 72, 153)",
    border: "rgb(251, 207, 232)"
  },
  cyan: {
    background: "rgb(207, 250, 254)",
    text: "rgb(6, 182, 212)",
    border: "rgb(165, 243, 252)"
  },
  orange: {
    background: "rgb(255, 237, 213)",
    text: "rgb(249, 115, 22)",
    border: "rgb(254, 215, 170)"
  },
  gray: {
    background: "rgb(243, 244, 246)",
    text: "rgb(75, 85, 99)",
    border: "rgb(229, 231, 235)"
  }
};

export function getTagStyle(color: string | undefined) {
  const key = color && tagColorMap[color] ? color : "blue";
  return tagColorMap[key];
}
