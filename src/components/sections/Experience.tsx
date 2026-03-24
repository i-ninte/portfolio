const experiences = [
  {
    company: 'Phrontlyne Technologies Limited',
    role: 'AI/ML Engineer & Software Developer',
    type: 'Hybrid',
    duration: 'Oct 2024 - Present',
    highlights: [
      {
        title: 'AI/ML Solutions',
        items: [
          'Accelerated claims processing by 40% through custom OCR and object detection models integrated into SnapInsure app',
          'Increased claims validation accuracy by 45% via RAG model using FAISS and LangChain for real-time document analysis',
          'Built electronic signature model integrated into core application enabling seamless document signing with YoloV8',
          'Developed claim cause-to-loss validation system using damage detection models to verify reported damages',
          'Built cost estimator for damaged car parts with instant web scraping for price comparison',
          'Implemented Ghana Card OCR system for automated identity verification with paddleOCR',
          'Developed object tracking model for vehicle inspection to prevent fraud during claim uploads',
          'Built ASR models using OpenAI Whisper and PyAnnote for speech diarization and multi-language translation',
          'Developed trash classifier model using YOLOv11 for deployment on robotic arm systems',
          'Built face recognition-based attendance system with anti-spoofing capabilities',
        ],
      },
      {
        title: 'AI Agent Development',
        items: [
          'Built fully autonomous AI Claims Agent with conversational chat interface and Claude API integration',
          'Developed RAG engine with Claude Vision OCR for document upload and intelligent Q&A',
          'Implemented comprehensive fraud detection system with image metadata analysis and AI-generated image detection',
          'Built intelligent web scraping system for real-time market price lookup',
          'Developed adaptive learning engine that improves agent performance through feedback collection',
        ],
      },
      {
        title: 'Software Development',
        items: [
          'Developed comprehensive investment management module for Phrontlyne ERP system',
          'Built memo management module for internal document workflows',
          'Automated critical business processes, improving operational efficiency by 50%',
          'Architected interactive Reinsurance Dashboard using Metabase',
        ],
      },
    ],
    techStack: ['Python', 'LangChain', 'Computer Vision', 'NLP', 'FastAPI', 'Laravel', 'YOLOv11', 'OpenAI Whisper', 'FAISS', 'Claude API'],
  },
  {
    company: 'Sikasense',
    role: 'Backend Engineer & ML Engineer',
    type: 'Remote',
    duration: 'Dec 2024 - Present',
    highlights: [
      {
        items: [
          'Built end-to-end ML system for Ghana Enterprise Agency to analyze ~109,000 female applicant profiles across 4 Mastercard-funded programs',
          'Developed ML eligibility predictor using Logistic Regression, Random Forest, and Gradient Boosting models',
          'Created application screening dashboard with priority scoring (0-100) for efficient high-volume processing',
          'Built viability and resilience prediction models analyzing 28+ financial features',
        ],
      },
    ],
    techStack: ['Python', 'Scikit-learn', 'Random Forest', 'Gradient Boosting', 'FastAPI', 'SQL Server'],
  },
  {
    company: 'EcoScan AI',
    role: 'Backend Engineer & ML Engineer',
    type: 'Remote',
    duration: 'Jan 2025 - Present',
    link: 'https://ecoscan.academicsuccessfdn.org/',
    highlights: [
      {
        items: [
          "Built Ghana's AI-powered environmental monitoring platform for detecting illegal mining, deforestation, and pollution",
          'Developed computer vision models for real-time threat detection analyzing satellite imagery',
          'Implemented backend infrastructure with authentication system and real-time data processing pipelines',
          'Integrated platform with Ghana Police Service, EPA, and local agencies for coordinated environmental protection',
        ],
      },
    ],
    techStack: ['Python', 'Computer Vision', 'Satellite Imagery Analysis', 'FastAPI', 'PostgreSQL', 'Real-time Processing'],
  },
  {
    company: 'Dev2Win',
    role: 'AI/ML Engineer',
    type: 'Remote',
    duration: 'Nov 2023 - Present',
    highlights: [
      {
        items: [
          'Fine-tuned Mistral model for AI mentorship platform, improving interaction quality by 15%',
          'Developed mentor-mentee matching algorithm using cosine similarity, achieving 30% better matching accuracy',
        ],
      },
    ],
    techStack: ['Python', 'LangChain', 'Machine Learning', 'NLP'],
  },
  {
    company: 'RadicalX',
    role: 'Data Analyst Intern',
    type: 'Remote (New York, USA)',
    duration: 'Sep 2023 - Oct 2023',
    highlights: [
      {
        items: [
          'Standardized and documented data protocols to maintain high-quality, consistent data across diverse sources',
          'Managed and integrated large, multi-source datasets for data-driven decision-making',
          'Created impactful data visualizations and conducted advanced statistical analyses using Matplotlib',
        ],
      },
    ],
    techStack: ['Python', 'Matplotlib', 'Data Analysis', 'Statistical Analysis'],
  },
  {
    company: 'MeriSkill',
    role: 'Data Analyst Intern',
    type: 'Remote',
    duration: 'Sep 2023 - Oct 2023',
    highlights: [
      {
        items: [
          'Developed diabetes prediction models achieving 85% accuracy using diverse patient attributes',
          'Created interactive Tableau dashboards, improving stakeholder engagement by 25%',
        ],
      },
    ],
    techStack: ['Power BI', 'Python', 'Machine Learning', 'Tableau'],
  },
]

export default function Experience() {
  return (
    <section className="animate-fade-in">
      <h2 className="section-heading mb-8">Work Experience</h2>

      <div className="space-y-8">
        {experiences.map((exp, idx) => (
          <div
            key={idx}
            className="glass-card p-6 card-hover border-gradient"
          >
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h3 className="text-xl font-bold text-white">
                {exp.company}
                {exp.link && (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-accent hover:underline font-normal"
                  >
                    {exp.link.replace('https://', '')}
                  </a>
                )}
              </h3>
              <span className="px-3 py-1 text-xs font-medium bg-dark-tertiary text-gray-400 rounded-full">
                {exp.type}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-accent/20 text-accent rounded-full">
                {exp.duration}
              </span>
            </div>

            <h4 className="text-lg font-semibold text-gray-200 mb-4">{exp.role}</h4>

            {/* Highlights */}
            <div className="space-y-4">
              {exp.highlights.map((section, sIdx) => (
                <div key={sIdx} className="pl-4 border-l-2 border-dark-border">
                  {section.title && (
                    <h5 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      {section.title}
                    </h5>
                  )}
                  <ul className="space-y-2">
                    {section.items.map((item, iIdx) => (
                      <li key={iIdx} className="text-gray-400 text-sm flex gap-2">
                        <span className="text-accent mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-2 mt-6">
              {exp.techStack.map((tech) => (
                <span key={tech} className="tech-badge">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
