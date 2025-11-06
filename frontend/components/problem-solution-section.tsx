"use client"

import { motion } from "framer-motion"

interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <motion.div
    className="console-card p-6 flex flex-col items-center text-center space-y-4"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.6 }}
  >
    <div className="text-4xl text-accent">{icon}</div>
    <h3 className="text-xl font-bold text-foreground">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </motion.div>
)

export function ProblemSolutionSection() {
  const targetAudience = [
    { icon: "🏗️", title: "Construction", description: "General contractors, subcontractors, project managers, and site supervisors." },
    { icon: "🏭", title: "Industrial Maintenance", description: "Facility managers, maintenance engineers, and safety officers in industrial plants." },
    { icon: "📝", title: "Regulatory Bodies", description: "Government agencies and compliance organizations overseeing industry standards." },
    { icon: "🤝", title: "Supply Chain Partners", description: "Suppliers and contractors needing transparent and verifiable compliance records." },
  ]

  const problems = [
    { icon: "🗂️", title: "Fragmented Records", description: "Compliance data scattered across various databases or manual spreadsheets." },
    { icon: "📝", title: "Data Tampering Risk", description: "Opportunities for unauthorized alterations, missing documentation, or fraudulent entries." },
    { icon: "🔎", title: "Limited Transparency", description: "Difficulties in verifying compliance status and accountability during audits." },
  ]

  const solutionFeatures = [
    { icon: "🔗", title: "Tamper-Proof Ledger", description: "Blockchain-based time-stamped records of inspections, certifications, and logs." },
    { icon: "✍️", title: "Digital Sign-Off", description: "Verified inspectors digitally sign off on-site activities securely." },
    { icon: "⏱️", title: "Automated Compliance", description: "Smart contracts automate reminders and revoke expired certifications." },
    { icon: "🌍", title: "Decentralized Accountability", description: "Ensures data integrity, accountability, and transparency across all stakeholders." },
  ]

  return (
    <section className="py-20 md:py-32 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-20">
        {/* Target Audience */}
        <div className="text-center space-y-12">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            Who Benefits from <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AuditVault</span>?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {targetAudience.map((item, index) => (
              <FeatureCard key={index} icon={item.icon} title={item.title} description={item.description} />
            ))}
          </div>
        </div>

        {/* Our Solution */}
        <div className="text-center space-y-12 relative">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.7 }}
          >
            Our <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">Blockchain Solution</span>
          </motion.h2>

          <div className="relative w-full max-w-5xl mx-auto py-10">
            {/* Vertical Line */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary via-accent to-primary opacity-30" />

            <div className="space-y-20">
              {solutionFeatures.map((item, index) => (
                <motion.div
                  key={index}
                  className={`relative flex items-center justify-center w-full md:justify-${index % 2 === 0 ? 'start' : 'end'}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`relative z-10 p-6 rounded-lg border border-border/50 bg-background shadow-lg max-w-md w-full md:w-1/2 text-center md:text-${index % 2 === 0 ? 'right' : 'left'}`}>
                    <div className="text-5xl text-accent mb-4 md:mb-0">{item.icon}</div>
                    <h3 className="text-xl font-bold text-foreground mb-2 mt-4 md:mt-0">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
