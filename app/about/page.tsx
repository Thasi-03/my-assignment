export default function AboutPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">About</h1>
      <p><strong>Name:</strong> Thasigaran Sagadevan</p>
      <p><strong>Student Number:</strong> 21969946</p>

      <h2 className="text-xl font-semibold">How to use this website (video)</h2>
      <div className="aspect-video max-w-3xl">
        {/* Replace with your own unlisted YouTube link */}
        <iframe
          title="How to use this website"
          width="100%" height="100%"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}
