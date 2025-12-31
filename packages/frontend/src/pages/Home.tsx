import { Users, Code, Video, Zap, Star, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

const features = [
  {
    icon: <Code className="w-6 h-6" />,
    title: "Real-time Collaboration",
    description: "Code together with live editing, voice, and video calls.",
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Voice & Video Calls",
    description: "Communicate seamlessly while coding with built-in calls.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI-powered Assistance",
    description: "Get smart code suggestions and instant help while coding.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Multi-file Projects",
    description: "Work on complex projects with full file tree support.",
  },
];

const testimonials = [
  {
    text: "RN Live has transformed how our team collaborates on code. The real-time editing with voice calls is a game-changer.",
    author: "Sarah Chen",
    role: "Lead Developer",
    company: "TechCorp",
  },
  {
    text: "Finally, a platform where we can code together seamlessly. The AI assistance is incredibly helpful too.",
    author: "Mike Johnson",
    role: "Full Stack Developer",
    company: "StartupXYZ",
  },
  {
    text: "The video calls while coding feature saves us so much time. No more switching between tools.",
    author: "Emily Rodriguez",
    role: "Software Engineer",
    company: "DevStudio",
  },
];

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="relative z-10 glass-dark border-b border-white/10 animate-slide-in-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 via-lime-500 to-green-400 rounded-xl flex items-center justify-center shadow-glow-green animate-glow">
                <span className="text-white text-lg font-bold">RN</span>
              </div>
              <div>
                <span className="text-white text-2xl font-bold gradient-text-green">RN Live</span>
                <div className="text-xs text-gray-400 font-medium">Next-Gen Playground</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-all duration-300 font-medium hover:scale-105">
                Features
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition-all duration-300 font-medium hover:scale-105">
                Testimonials
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-all duration-300 font-medium hover:scale-105">
                Pricing
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <a href="/signin">
                <Button variant="ghost" className="text-white hover:bg-white/10 glass px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                  Sign In
                </Button>
              </a>
              <a href="/signup">
                <Button className="bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-500 hover:to-lime-500 text-black px-6 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-glow-green">
                  Get Started
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-40">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-green-600/30 to-lime-600/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-lime-600/20 to-green-600/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-green-600/10 to-lime-600/10 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 leading-tight">
              Code Together in
              <br />
              <span className="gradient-text-green animate-glow">
                Real-Time
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Collaborate seamlessly with voice, video, and live code editing. Build amazing projects together with the most advanced React Native playground.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <a href="/playground">
              <Button size="lg" className="bg-gradient-to-r from-green-600 via-lime-600 to-green-500 hover:from-green-500 hover:via-lime-500 hover:to-green-400 text-black px-10 py-5 text-xl font-bold rounded-2xl shadow-glow-green interactive flex items-center gap-3">
                Start Coding Now
               
              </Button>
            </a>
            <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="glass border-white/20 text-white hover:bg-white/10 px-10 py-5 text-xl font-bold rounded-2xl interactive flex items-center gap-3">
             
                View on GitHub
              </Button>
            </a>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text-green mb-2">10k+</div>
              <div className="text-gray-400">Active Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text-green mb-2">50k+</div>
              <div className="text-gray-400">Projects Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-text-green mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-blue-900/10 to-gray-900/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 gradient-text-blue">
              Collaborate Like Never Before
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience seamless real-time collaboration with voice calls, video chat, live code editing, and instant previews.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass card-hover p-8 rounded-2xl border border-white/10 shadow-2xl interactive group relative overflow-hidden"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-lime-600/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                    index === 0 ? 'bg-gradient-to-br from-green-500/20 to-lime-500/20 text-green-400' :
                    index === 1 ? 'bg-gradient-to-br from-lime-500/20 to-green-500/20 text-lime-400' :
                    index === 2 ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/20 text-emerald-400' :
                    'bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-400'
                  } shadow-glow group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:gradient-text-green transition-all duration-300">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Loved by Developers
            </h2>
            <p className="text-xl text-gray-300">See what developers are saying about RN Live</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-gray-400 text-sm">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">Simple Pricing</h2>
            <p className="text-xl text-gray-300">Choose the plan that fits your team</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
              <p className="text-gray-300 mb-6">Perfect for personal projects</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  Up to 3 collaborators
                </li>
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  Basic voice calls
                </li>
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  Public projects
                </li>
              </ul>
              <Button className="w-full bg-gray-700 hover:bg-gray-600 text-white">
                Get Started
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-b from-green-600/20 to-lime-600/20 rounded-lg p-8 border border-green-500/50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-green-500 to-lime-500 text-black px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
              <p className="text-gray-300 mb-6">For professional teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">$20</span>
                <span className="text-gray-300">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  Unlimited collaborators
                </li>
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  HD video calls
                </li>
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  Private projects
                </li>
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  Advanced AI features
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Start Free Trial
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-gray-300 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  Everything in Pro
                </li>
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  SSO & SAML
                </li>
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  Dedicated support
                </li>
                <li className="text-gray-300 flex items-center">
                  <span className="w-2 h-2 bg-lime-500 rounded-full mr-3"></span>
                  Custom integrations
                </li>
              </ul>
              <Button variant="outline" className="w-full border-gray-600 text-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Start Collaborating Today
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of developers who build amazing projects together with real-time collaboration.
          </p>
          <a href="/playground">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg flex items-center gap-2">
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-lime-600 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">RN</span>
                </div>
                <span className="text-white text-xl font-semibold">RN Live</span>
              </div>
              <p className="text-gray-400">
                Real-time collaborative coding platform with voice and video calls.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/playground" className="text-gray-400 hover:text-white transition-colors">
                    Playground
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2025 RN Live. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
