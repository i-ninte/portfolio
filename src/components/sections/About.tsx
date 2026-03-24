export default function About() {
  return (
    <section className="animate-fade-in">
      <h2 className="section-heading mb-6">About</h2>

      <div className="glass-card p-8 space-y-4">
        <p className="text-gray-300 leading-relaxed">
          As an AI/ML Engineer and researcher, I specialize in developing scalable machine learning solutions that address critical challenges in healthcare, agriculture, and social impact domains. My work spans computer vision, natural language processing, and IoT integration, with a strong emphasis on deploying production-ready models that drive measurable outcomes.
        </p>
        <p className="text-gray-300 leading-relaxed">
          My research contributions include award-winning solutions in healthcare AI (clinical reasoning, disease outbreak prediction) and agricultural technology (crop disease detection for mobile deployment). I am particularly interested in responsible AI development, with focus on building systems that are accessible, ethical, and beneficial for underserved communities in developing regions.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Currently pursuing advanced research opportunities to further explore the intersection of AI and social good.
        </p>
      </div>

      {/* Floating tech particles animation */}
      <div className="mt-8 flex flex-wrap gap-3">
        {['Machine Learning', 'Computer Vision', 'NLP', 'Deep Learning', 'LLMs', 'Healthcare AI', 'IoT'].map((tech, i) => (
          <span
            key={tech}
            className="tech-badge animate-float"
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            {tech}
          </span>
        ))}
      </div>
    </section>
  )
}
