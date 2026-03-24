const projects = [
  {
    title: 'QueryAmie',
    link: 'https://www.queryamie.com/',
    description: 'Advanced multilingual document analysis platform supporting 160+ languages with comprehensive agentic capabilities. Features include natural language document interaction, voice chat, web search agents, custom data visualization and regression analysis, research assistant agents, and CV analysis tools.',
    features: 'Document upload and analysis, voice-enabled queries, intelligent web search, automated data visualization, custom regression modeling, research assistance with citation management.',
    type: 'Production App',
    techStack: ['Python', 'LangChain', 'NLP', 'FastAPI', 'Voice Recognition', 'Agentic AI', 'Data Visualization'],
    featured: true,
  },
  {
    title: 'Jobfit AI',
    link: 'https://jobfit-ai.vercel.app/',
    description: 'Intelligent recruitment platform providing personalized job-fit assessments and candidate matching using advanced ML algorithms.',
    type: 'Production App',
    techStack: ['Machine Learning', 'NLP', 'React', 'Python'],
    featured: true,
  },
  {
    title: 'Aquamind',
    link: 'https://github.com/i-ninte/aquamind1',
    description: 'IoT-enabled water quality prediction system using LSTM and Gradient Boosting Models, achieving 96% accuracy for real-time monitoring.',
    type: 'Research Project',
    techStack: ['IoT', 'LSTM', 'FastAPI', 'Arduino', 'ESP32'],
  },
  {
    title: 'British Airways Analytics',
    link: 'https://github.com/i-ninte/machine_learning/tree/main/projects/FORAGE',
    description: 'Comprehensive customer sentiment analysis and booking prediction system. Analyzed customer sentiments, booking patterns, and developed predictive models.',
    type: 'Simulation Project',
    techStack: ['Python', 'Machine Learning', 'Sentiment Analysis', 'Predictive Modeling'],
  },
  {
    title: 'Image Classification',
    link: 'https://github.com/i-ninte/machine_learning/tree/main/projects/IMAGE%20CLASSIFICATION',
    description: 'Convolutional Neural Network built with TensorFlow for multi-class image recognition with data augmentation and transfer learning.',
    type: 'ML Project',
    techStack: ['TensorFlow', 'CNN', 'Computer Vision', 'Python'],
  },
  {
    title: 'Sales Analytics',
    link: 'https://github.com/i-ninte/data-analytics-R-python/blob/main/SALES_DATA_ANALYSIS.ipynb',
    description: 'Comprehensive business intelligence analysis uncovering sales patterns and customer insights using statistical modeling.',
    type: 'Analytics',
    techStack: ['Python', 'R', 'Pandas', 'Statistical Analysis'],
  },
  {
    title: 'Weather Forecasting',
    link: 'https://github.com/i-ninte/Alfido-Tech/tree/main/WEATHER%20ANALYSIS',
    description: 'Climate data exploration and predictive modeling for weather pattern analysis and forecasting.',
    type: 'Data Science',
    techStack: ['Time Series', 'Python', 'Machine Learning'],
  },
  {
    title: 'Mobility Analytics',
    link: 'https://github.com/i-ninte/Alfido-Tech/tree/main/UBER%20DATA%20ANALYSIS',
    description: 'Uber data analysis revealing mobility patterns and optimizing transportation efficiency through geospatial analytics.',
    type: 'Analytics',
    techStack: ['Python', 'Geospatial Analysis', 'Visualization'],
  },
  {
    title: 'Credit Risk Model',
    link: 'https://github.com/i-ninte/machine_learning/tree/main/projects/LOAN%20PREDICTION',
    description: 'End-to-end machine learning pipeline for loan default prediction using ensemble methods and feature engineering.',
    type: 'ML Pipeline',
    techStack: ['XGBoost', 'Feature Engineering', 'Python'],
  },
]

export default function Projects() {
  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  return (
    <section className="animate-fade-in">
      <h2 className="section-heading mb-8">Featured Projects</h2>

      {/* Featured projects */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {featuredProjects.map((project, idx) => (
          <div
            key={idx}
            className="glass-card p-6 card-hover border-gradient group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-bold text-white group-hover:text-accent transition-colors">
                {project.title}
              </h3>
              <span className="px-3 py-1 text-xs font-medium bg-accent/20 text-accent rounded-full">
                {project.type}
              </span>
            </div>
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 hover:text-accent transition-colors mb-3 block"
            >
              {project.link.replace('https://', '')}
            </a>
            <p className="text-gray-300 mb-3">{project.description}</p>
            {project.features && (
              <p className="text-sm text-gray-400 mb-4">
                <strong className="text-gray-300">Key Features:</strong> {project.features}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Other projects */}
      <h3 className="text-xl font-bold text-white mb-6">More Projects</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {otherProjects.map((project, idx) => (
          <a
            key={idx}
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-card p-5 card-hover group"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-bold text-white group-hover:text-accent transition-colors">
                {project.title}
              </h4>
              <i className="fas fa-external-link-alt text-gray-600 group-hover:text-accent transition-colors" />
            </div>
            <span className="inline-block px-2 py-0.5 text-xs font-medium bg-dark-tertiary text-gray-500 rounded mb-2">
              {project.type}
            </span>
            <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 3).map((tech) => (
                <span key={tech} className="text-xs text-gray-500">
                  {tech}
                </span>
              ))}
              {project.techStack.length > 3 && (
                <span className="text-xs text-gray-600">+{project.techStack.length - 3}</span>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
