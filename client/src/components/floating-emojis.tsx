export default function FloatingEmojis() {
  const emojis = [
    { emoji: "😊", top: "10%", left: "10%", delay: "0s", size: "text-4xl" },
    { emoji: "🎉", top: "20%", right: "15%", delay: "1s", size: "text-3xl" },
    { emoji: "💫", top: "60%", left: "5%", delay: "2s", size: "text-5xl" },
    { emoji: "✨", bottom: "20%", right: "10%", delay: "0.5s", size: "text-4xl" },
    { emoji: "🌟", top: "80%", left: "80%", delay: "1.5s", size: "text-3xl" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {emojis.map((item, index) => (
        <div
          key={index}
          className={`floating-emoji ${item.size}`}
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
