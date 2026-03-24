const skills = [
  'Python', 'Machine Learning', 'Computer Vision', 'NLP', 'Deep Learning',
  'LangChain', 'FastAPI', 'Laravel', 'TensorFlow', 'PyTorch', 'OpenCV',
  'ERPNext', 'Tableau', 'Metabase', 'Jasper Reports', 'SQL', 'Docker', 'Git', 'AWS', 'MLOps'
]

export default function Education() {
  return (
    <section className="animate-fade-in space-y-12">
      {/* Education */}
      <div>
        <h2 className="section-heading mb-6">Education</h2>
        <div className="glass-card p-8 border-gradient">
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent to-accent-purple flex items-center justify-center text-2xl shadow-lg shadow-accent/30">
              <i className="fas fa-graduation-cap text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">
                  Kwame Nkrumah University of Science & Technology
                </h3>
                <span className="px-3 py-1 text-xs font-medium bg-accent/20 text-accent rounded-full">
                  2020 - 2024
                </span>
              </div>
              <p className="text-lg text-gray-300 mb-4">
                BSc. Computer Engineering | <span className="text-accent font-semibold">GPA: 3.84</span>
              </p>
              <div className="space-y-2 text-gray-400">
                <p>
                  <strong className="text-gray-200">Research Interests:</strong>{' '}
                  Machine Learning, AI in Healthcare, Computer Vision & Robotics, Deep Learning, LLMs & NLP, Scalable AI, AI Ethics
                </p>
                <p>
                  <strong className="text-gray-200">Honors:</strong>{' '}
                  <span className="text-accent">Provost's List (2020-2023)</span>, Multiple Excellent Student Awards
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h2 className="section-heading mb-6">Skills</h2>
        <div className="glass-card p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {skills.map((skill, idx) => (
              <div
                key={skill}
                className="group relative px-4 py-3 bg-dark-tertiary rounded-lg text-center font-medium text-gray-300 border border-dark-border transition-all duration-300 hover:border-accent/50 hover:text-accent hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] cursor-default"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {skill}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certifications could go here */}
      <div className="glass-card p-6 border-l-4 border-accent">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <i className="fas fa-rocket text-accent text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Continuous Learning</h3>
            <p className="text-gray-400 text-sm">
              Always exploring new technologies and methodologies in AI/ML to stay at the cutting edge.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
