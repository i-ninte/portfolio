const researchExperience = [
  {
    institution: 'African Institute for Development Research and Evaluation',
    role: 'Research Assistant',
    type: 'Remote',
    duration: 'Jan 2024 - Sep 2024',
    project: 'Will Cameras Change Behaviours in Africa? The Case of CCTV Cameras on Streets in Ghana',
    items: [
      'Leveraged Python for extensive data analysis, utilizing criminal and conviction data from the Ghana Police Service',
      'Conducted survey design and employed advanced data analysis techniques to extract valuable insights from responses',
    ],
    techStack: ['Python', 'Data Analysis', 'Statistical Modeling', 'Survey Design', 'Policy Research'],
  },
]

const publications = [
  {
    title: 'AQUAMIND: A Predictive Model for Water Quality Using Machine Learning and IoT Sensors',
    type: 'Undergraduate Research Thesis',
    year: '2024',
    abstract: 'Developed an integrated IoT-ML system for real-time water quality prediction and monitoring. The system combines Long Short-Term Memory Neural Networks (LSTM), Gradient Boosting, and Random Forest algorithms to predict water quality based on critical parameters including pH, temperature, dissolved oxygen, turbidity, and biochemical oxygen demand (BOD). Integrates ESP32 microcontrollers with IoT sensors for real-time data collection, transmitted via HTTP requests to a Next.js web application. Achieved exceptional accuracy of 96.99% with LSTM and Random Forest, and 96.72% with Gradient Boosting.',
    supervisor: {
      name: 'Bright Yeboah-Akowuah, PhD',
      department: 'Department of Computer Engineering, Kwame Nkrumah University of Science and Technology',
    },
    link: 'https://drive.google.com/file/d/1ZhnOluL-aoxELa48IRA94-uAvRBYhY0-/view',
    techStack: ['LSTM', 'Random Forest', 'Gradient Boosting', 'IoT', 'ESP32', 'Next.js', 'Water Quality Prediction'],
  },
]

const achievements = [
  {
    title: 'SUA Outsmarting Outbreaks Challenge',
    medal: 'Silver',
    platform: 'Zindi Africa',
    challenge: 'Can you turn the tide on waterborne diseases by predicting the next outbreak in Tanzania?',
    description: 'Developed machine learning models to predict outbreaks of climate-sensitive waterborne diseases (typhoid, amoebiasis, diarrhoea, schistosomiasis, intestinal worms) in Tanzania using comprehensive datasets spanning water sources, sanitation quality, waste management, health facilities, and climate data from 2019-2023.',
    impact: 'Enabling governments and health organizations to implement timely, targeted interventions and optimize resource allocation for vulnerable populations.',
    techStack: ['Python', 'Machine Learning', 'Time Series Analysis', 'Public Health Analytics', 'Climate Data Analysis'],
  },
  {
    title: 'Ghana Crop Disease Detection Challenge',
    medal: 'Bronze',
    platform: 'Zindi Africa',
    challenge: 'Can you build a model for mobile phones to identify diseases on tomatoes, corn, and peppers?',
    description: 'Built robust machine learning models for accurate prediction of multiple diseases in corn, pepper, and tomato crops, with focus on generalization to unseen diseases and efficient operation on entry-level smartphones used by subsistence farmers in Africa.',
    impact: 'Supporting food security for millions by enabling timely disease detection in crops that form the backbone of Sub-Saharan African agriculture.',
    techStack: ['Computer Vision', 'Mobile ML', 'Edge Computing', 'Agricultural AI', 'Disease Classification'],
  },
  {
    title: 'Kenya Clinical Reasoning Challenge',
    medal: 'Silver',
    platform: 'Zindi Africa',
    challenge: 'Can your model match real clinicians in rural Kenyan healthcare?',
    description: 'Developed AI models to replicate clinical reasoning of trained healthcare professionals using 400 authentic clinical prompts from diverse Kenyan healthcare settings. Models predict clinician responses across maternal health, child health, and critical care scenarios.',
    impact: 'Supporting frontline healthcare workers in resource-limited settings with AI-assisted clinical decision making.',
    techStack: ['NLP', 'Clinical AI', 'Healthcare Analytics', 'Small Data ML', 'Medical Reasoning'],
  },
]

export default function Research() {
  return (
    <section className="animate-fade-in space-y-12">
      {/* Research Experience */}
      <div>
        <h2 className="section-heading mb-6">Research Experience</h2>
        {researchExperience.map((exp, idx) => (
          <div key={idx} className="glass-card p-6 card-hover">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h3 className="text-xl font-bold text-white">{exp.institution}</h3>
              <span className="px-3 py-1 text-xs font-medium bg-dark-tertiary text-gray-400 rounded-full">
                {exp.type}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-accent/20 text-accent rounded-full">
                {exp.duration}
              </span>
            </div>
            <h4 className="text-lg font-semibold text-gray-200 mb-2">{exp.role}</h4>
            <p className="text-accent/80 text-sm mb-4">
              <strong>Project:</strong> {exp.project}
            </p>
            <ul className="space-y-2 mb-4">
              {exp.items.map((item, i) => (
                <li key={i} className="text-gray-400 text-sm flex gap-2">
                  <span className="text-accent">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2">
              {exp.techStack.map((tech) => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Publications */}
      <div>
        <h2 className="section-heading mb-6">Research Publications</h2>
        {publications.map((pub, idx) => (
          <div
            key={idx}
            className="glass-card p-8 border-l-4 border-accent card-hover"
          >
            <h3 className="text-xl font-bold text-white mb-2">{pub.title}</h3>
            <p className="text-sm text-accent uppercase tracking-wider mb-4">
              {pub.type} • {pub.year}
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">{pub.abstract}</p>
            <div className="bg-dark-tertiary p-4 rounded-lg mb-4 border-l-2 border-gray-600">
              <p className="text-sm text-gray-400">
                <strong className="text-gray-200">Supervisor:</strong> {pub.supervisor.name}
                <br />
                <span className="text-gray-500">{pub.supervisor.department}</span>
              </p>
            </div>
            <a
              href={pub.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/80 transition-colors mb-4"
            >
              <i className="fas fa-file-pdf" />
              View Thesis
            </a>
            <div className="flex flex-wrap gap-2 mt-4">
              {pub.techStack.map((tech) => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Research note */}
      <div className="glass-card p-6 border-l-4 border-gray-600">
        <p className="text-gray-300">
          <strong className="text-white">Research Interests:</strong> Machine Learning, AI in Healthcare, Computer Vision & Robotics, Deep Learning, LLMs & NLP, Scalable AI, AI Ethics, and Responsible AI Development for Social Good.
        </p>
      </div>

      {/* Competition Achievements */}
      <div>
        <h2 className="section-heading mb-6">Research & Competition Achievements</h2>
        <div className="space-y-6">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className="glass-card p-6 border-l-4 border-accent card-hover"
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <h3 className="text-xl font-bold text-white">{ach.title}</h3>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full flex items-center gap-1 ${
                  ach.medal === 'Silver'
                    ? 'bg-gradient-to-r from-gray-400 to-gray-300 text-gray-800'
                    : 'bg-gradient-to-r from-amber-600 to-amber-400 text-white'
                }`}>
                  {ach.medal === 'Silver' ? '🥈' : '🥉'} {ach.medal} Medal
                </span>
                <span className="px-3 py-1 text-xs font-medium bg-white text-black rounded-full">
                  {ach.platform}
                </span>
              </div>
              <p className="text-accent/80 text-sm mb-3">
                <strong>Challenge:</strong> "{ach.challenge}"
              </p>
              <p className="text-gray-300 mb-3">{ach.description}</p>
              <p className="text-gray-400 text-sm mb-4">
                <strong className="text-green-400">Impact:</strong> {ach.impact}
              </p>
              <div className="flex flex-wrap gap-2">
                {ach.techStack.map((tech) => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
