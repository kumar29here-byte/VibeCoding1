export default function FloatingEmojis() {
  const emojis = [
    { emoji: "😊", top: "15%", left: "8%", delay: "0s", size: "text-4xl", rotate: "animate-wiggle" },
    { emoji: "🎉", top: "25%", right: "12%", delay: "1s", size: "text-3xl", rotate: "" },
    { emoji: "💫", top: "65%", left: "3%", delay: "2s", size: "text-5xl", rotate: "animate-wiggle" },
    { emoji: "✨", bottom: "25%", right: "8%", delay: "0.5s", size: "text-4xl", rotate: "" },
    { emoji: "🌟", top: "85%", left: "85%", delay: "1.5s", size: "text-3xl", rotate: "animate-wiggle" },
    { emoji: "🚀", top: "45%", right: "5%", delay: "2.5s", size: "text-3xl", rotate: "" },
    { emoji: "🎭", top: "5%", left: "50%", delay: "3s", size: "text-4xl", rotate: "animate-wiggle" },
    { emoji: "💝", bottom: "60%", left: "75%", delay: "1.8s", size: "text-3xl", rotate: "" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {emojis.map((item, index) => (
        <div
          key={index}
          className={`floating-emoji ${item.size} ${item.rotate}`}
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            animationDelay: item.delay,
          }}
          data-testid={`floating-emoji-${index}`}
        >
          {item.emoji}
        </div>
      ))}
    </div>
  );
}
