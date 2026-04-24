"use client";

/**
 * Footer Component
 * Placeholder footer for the main layout
 * Can be extended with links, social icons, and additional content
 */
export const Footer = () => {
  return (
    <footer className="w-full bg-deep-dark-900 border-t border-deep-dark-800 text-deep-dark-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-neon-cyan tracking-wider mb-4">
              Deploy
            </h2>
            <p className="text-sm text-deep-dark-400">
              High-performance web platform built with Next.js and GSAP.
            </p>
          </div>

          {/* Links - Placeholder */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-deep-dark-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-deep-dark-400">
          <p>&copy; 2024 Deploy. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-neon-cyan transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-neon-cyan transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-neon-cyan transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
