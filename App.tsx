import React, { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import { MOCK_APPS } from './constants';

const DesignAssistant = lazy(() => import('./components/DesignAssistant'));
const BrowsePage = lazy(() => import('./pages/BrowsePage'));
const AdminObservabilityPage = lazy(() => import('./pages/AdminObservabilityPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const CollectionPage = lazy(() => import('./pages/CollectionPage'));
const ContentPage = lazy(() => import('./pages/ContentPage'));
const CreditsPage = lazy(() => import('./pages/CreditsPage'));
const DesignSystemsPage = lazy(() => import('./pages/DesignSystemsPage'));
const DictionaryPage = lazy(() => import('./pages/DictionaryPage'));
const FigmaKitDetailPage = lazy(() => import('./pages/FigmaKitDetailPage'));
const FigmaKitsPage = lazy(() => import('./pages/FigmaKitsPage'));
const KitDeliveryPage = lazy(() => import('./pages/KitDeliveryPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AppScreensPage = lazy(() => import('./pages/AppScreensPage'));
const FlowsPage = lazy(() => import('./pages/FlowsPage'));
const FlowDetailPage = lazy(() => import('./pages/FlowDetailPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const CheckoutStatusPage = lazy(() => import('./pages/CheckoutStatusPage'));

interface ContentPageConfig {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  sections: { title: string; description: string }[];
  contactDetails?: { label: string; value?: string; lines?: string[]; href?: string }[];
  primaryCtaLabel: string;
  primaryCtaPath: string;
  secondaryCtaLabel: string;
  secondaryCtaPath: string;
}

const CONTENT_PAGES: ContentPageConfig[] = [
  {
    path: '/blog',
    eyebrow: 'Insights',
    title: 'LuxuryUI Blog',
    description: 'Notes from design teams, pattern teardowns, and workflow strategies to ship high-quality interfaces faster.',
    sections: [
      { title: 'Pattern Breakdowns', description: 'Detailed analysis of onboarding, checkout, retention, and account management UX flows.' },
      { title: 'Design Critiques', description: 'Before/after audits that explain what changed and why it improved usability.' },
      { title: 'Playbooks', description: 'Frameworks for discovery, component decisions, and design review rituals.' },
      { title: 'Release Notes', description: 'Track updates across the library so your team can reuse newly added references.' },
    ],
    primaryCtaLabel: 'Join Community',
    primaryCtaPath: '/community',
    secondaryCtaLabel: 'Read Docs',
    secondaryCtaPath: '/documentation',
  },
  {
    path: '/documentation',
    eyebrow: 'Docs',
    title: 'Product Documentation',
    description: 'Everything needed to move from reference browsing to editable Figma delivery, including catalog rules, kit packaging, and team workflows.',
    sections: [
      { title: 'Reference Workflow', description: 'How to search apps, flows, and pattern families before deciding what deserves a sellable kit.' },
      { title: 'Kit Packaging', description: 'Standards for Figma-ready files, naming rules, cover pages, token systems, and delivery manifests.' },
      { title: 'Commercial Review', description: 'Guidance for originality, transformation, and readiness checks before a kit can be listed for sale.' },
      { title: 'Workflow Handoffs', description: 'How research, design, and publishing roles hand off work from source curation to storefront launch.' },
    ],
    primaryCtaLabel: 'Browse Figma Kits',
    primaryCtaPath: '/kits',
    secondaryCtaLabel: 'Contact Support',
    secondaryCtaPath: '/contact',
  },
  {
    path: '/figma-plugin',
    eyebrow: 'Integrations',
    title: 'Figma Kit Delivery',
    description: 'Turn curated references into original, editable Figma flow kits with packaging, license metadata, and commercial-ready file structure.',
    sections: [
      { title: 'Transformed Kits', description: 'Ship original Figma files inspired by strong reference sets, without selling screenshots as the product.' },
      { title: 'Component Pages', description: 'Bundle reusable sections, token styles, and notes so each kit works like a proper file handoff.' },
      { title: 'Delivery Manifests', description: 'Track what is included, how it is organized, and how commercial-use terms are attached to the file.' },
      { title: 'Own-Site Commerce', description: 'Use LuxuryUI as the storefront for kit discovery, packaging, and purchase intent before deeper plugin work.' },
    ],
    primaryCtaLabel: 'Explore Kits',
    primaryCtaPath: '/kits',
    secondaryCtaLabel: 'Top Up Credits',
    secondaryCtaPath: '/pricing',
  },
  {
    path: '/community',
    eyebrow: 'Community',
    title: 'Designer Community',
    description: 'Connect with practitioners sharing curated references, critiques, and workflow upgrades.',
    sections: [
      { title: 'Public Collections', description: 'Discover how other teams organize references by feature and customer journey.' },
      { title: 'Office Hours', description: 'Join critique sessions focused on practical design decisions and tradeoffs.' },
      { title: 'Peer Feedback', description: 'Ask for targeted reviews on pattern choices before handing off to engineering.' },
      { title: 'Resource Exchange', description: 'Share templates, flow maps, and decision docs used by active product teams.' },
    ],
    primaryCtaLabel: 'Create Account',
    primaryCtaPath: '/signup',
    secondaryCtaLabel: 'Browse Blog',
    secondaryCtaPath: '/blog',
  },
  {
    path: '/about',
    eyebrow: 'Company',
    title: 'About LuxuryUI',
    description: 'LuxuryUI helps product teams move from UI research to original Figma assets they can actually ship, adapt, and sell.',
    sections: [
      { title: 'Mission', description: 'Replace random screenshot folders with a pipeline that turns research into structured, sellable Figma kits.' },
      { title: 'Audience', description: 'Built for designers, studios, and product teams who need both inspiration and editable commercial assets.' },
      { title: 'Method', description: 'Curate production examples, extract reusable flows, and package transformed UI systems for real delivery.' },
      { title: 'Quality', description: 'Every product must pass research QA, transformation rules, and storefront readiness before it becomes commercial inventory.' },
    ],
    primaryCtaLabel: 'Explore Kits',
    primaryCtaPath: '/kits',
    secondaryCtaLabel: 'Top Up Credits',
    secondaryCtaPath: '/pricing',
  },
  {
    path: '/careers',
    eyebrow: 'Company',
    title: 'Careers at LuxuryUI',
    description: 'Join a product-focused team helping designers and builders make better interface decisions.',
    sections: [
      { title: 'Open Roles', description: 'Design, engineering, and operations positions with direct product impact.' },
      { title: 'How We Work', description: 'Small teams, fast cycles, and clear ownership from idea to shipped feature.' },
      { title: 'Culture', description: 'Pragmatic collaboration, direct feedback, and high standards for craft.' },
      { title: 'Benefits', description: 'Competitive compensation, growth support, and flexible collaboration routines.' },
    ],
    primaryCtaLabel: 'View Openings',
    primaryCtaPath: '/contact',
    secondaryCtaLabel: 'Learn About Us',
    secondaryCtaPath: '/about',
  },
  {
    path: '/contact',
    eyebrow: 'Support',
    title: 'Contact LuxuryUI',
    description: 'Reach out for product questions, credit purchase questions, partnership discussions, or support.',
    contactDetails: [
      { label: 'Company', value: 'Kinman Tech LTD' },
      { label: 'Registration', value: 'HE 490695' },
      {
        label: 'Registered office',
        lines: ['23 Boumpoulinas, Flat/Office 6', '2019 Strovolos, Nicosia', 'Cyprus'],
      },
      {
        label: 'Phone',
        value: '+44 7537 106 904',
        href: 'tel:+447537106904',
      },
      {
        label: 'Email',
        value: 'contact@luxuryuilib.com',
        href: 'mailto:contact@luxuryuilib.com',
      },
    ],
    sections: [
      { title: 'General Inquiries', description: 'Ask about platform capabilities, roadmaps, and onboarding suggestions.' },
      { title: 'Credit Questions', description: 'Get guidance on credit top-ups, kit unlock costs, and purchase flow details.' },
      { title: 'Technical Support', description: 'Troubleshoot access, billing, or integration issues with quick turnaround.' },
      { title: 'Partnerships', description: 'Collaborate on educational programs, events, and ecosystem opportunities.' },
    ],
    primaryCtaLabel: 'Create Account',
    primaryCtaPath: '/signup',
    secondaryCtaLabel: 'Read Docs',
    secondaryCtaPath: '/documentation',
  },
  {
    path: '/privacy',
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    description: 'How LuxuryUI handles data collection, processing, and protection for individuals and teams.',
    sections: [
      { title: 'Data Collection', description: 'Overview of information collected during account usage and support requests.' },
      { title: 'Usage', description: 'How data is used to improve search, recommendations, and platform reliability.' },
      { title: 'Retention', description: 'Retention windows and deletion practices for account and activity data.' },
      { title: 'Controls', description: 'Options for access, export, correction, and data removal requests.' },
    ],
    primaryCtaLabel: 'View Terms',
    primaryCtaPath: '/terms',
    secondaryCtaLabel: 'Contact Support',
    secondaryCtaPath: '/contact',
  },
  {
    path: '/terms',
    eyebrow: 'Legal',
    title: 'Terms of Service',
    description: 'Usage terms governing account access, one-time credit purchases, and permitted use of LuxuryUI content.',
    sections: [
      { title: 'Account Responsibilities', description: 'Rules for account security, sharing, and responsible platform usage.' },
      { title: 'Credit Terms', description: 'How one-time credit purchases, kit unlocks, and delivery access are handled.' },
      { title: 'Acceptable Use', description: 'Restrictions related to scraping, redistribution, or misuse of content.' },
      { title: 'Liability', description: 'Service limitations, disclaimers, and dispute resolution framing.' },
    ],
    primaryCtaLabel: 'View Privacy',
    primaryCtaPath: '/privacy',
    secondaryCtaLabel: 'Contact Us',
    secondaryCtaPath: '/contact',
  },
  {
    path: '/cookies',
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    description: 'Details on cookie usage for analytics, personalization, and service reliability.',
    sections: [
      { title: 'Essential Cookies', description: 'Required cookies that keep authentication and core functionality stable.' },
      { title: 'Analytics Cookies', description: 'Metrics cookies used to measure product quality and feature adoption.' },
      { title: 'Preference Cookies', description: 'Saved preferences such as theme mode and interface selections.' },
      { title: 'Cookie Controls', description: 'How to manage cookie choices using browser settings and platform controls.' },
    ],
    primaryCtaLabel: 'Read Privacy Policy',
    primaryCtaPath: '/privacy',
    secondaryCtaLabel: 'Read Terms',
    secondaryCtaPath: '/terms',
  },
  {
    path: '/login',
    eyebrow: 'Account',
    title: 'Welcome Back',
    description: 'Sign in to continue browsing saved collections, comments, and team workspaces.',
    sections: [
      { title: 'Email Login', description: 'Use your registered email to access your personal workspace.' },
      { title: 'SSO Support', description: 'Workspace accounts can connect single sign-on for secure access management.' },
      { title: 'Security', description: 'Session safeguards and authentication checks protect account integrity.' },
      { title: 'Account Recovery', description: 'Restore account access with secure verification when needed.' },
    ],
    primaryCtaLabel: 'Create Account',
    primaryCtaPath: '/signup',
    secondaryCtaLabel: 'Browse First',
    secondaryCtaPath: '/',
  },
  {
    path: '/signup',
    eyebrow: 'Account',
    title: 'Create Your LuxuryUI Account',
    description: 'Get started in minutes and organize references into reusable collections for your next product sprint.',
    sections: [
      { title: 'Starter Workspace', description: 'Create your workspace and begin saving high-signal references immediately.' },
      { title: 'Collections', description: 'Organize by feature, platform, or release scope to keep design work actionable.' },
      { title: 'Comments', description: 'Capture context and rationale so your team understands why references matter.' },
      { title: 'Credit Workflow', description: 'Top up credits only when you want to unlock transformed Figma kits from the storefront.' },
    ],
    primaryCtaLabel: 'Top Up Credits',
    primaryCtaPath: '/pricing',
    secondaryCtaLabel: 'Browse Library',
    secondaryCtaPath: '/',
  },
];

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') return true;
    if (storedTheme === 'light') return false;

    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    document.documentElement.style.colorScheme = isDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);

    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  const appsByPlatform = useMemo(() => {
    return {
      ios: MOCK_APPS.filter((app) => app.platform === 'iOS'),
      android: MOCK_APPS.filter((app) => app.platform === 'Android'),
      web: MOCK_APPS.filter((app) => app.platform === 'Web'),
      patterns: [...MOCK_APPS].sort((a, b) => b.screenCount - a.screenCount).slice(0, 24),
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Sidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <Header
          onOpenAssistant={() => setIsAssistantOpen(true)}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
        />

        <main className="flex-1 overflow-x-hidden">
          <Suspense
            fallback={
              <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
                <div className="rounded-3xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Loading page...
                </div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<BrowsePage isDarkMode={isDarkMode} searchQuery={searchQuery} onSearchChange={handleSearchChange} />} />
              <Route
                path="/apps"
                element={
                  <CollectionPage
                    title="All Product Apps"
                    description="A complete catalog of curated real-world app references across mobile and web products."
                    apps={MOCK_APPS}
                  />
                }
              />
              <Route
                path="/screens"
                element={
                  <CollectionPage
                    title="Screen Library"
                    description="Browse high-quality screen examples across onboarding, commerce, profile, and payment experiences."
                    apps={MOCK_APPS}
                  />
                }
              />
              <Route path="/flows" element={<FlowsPage apps={MOCK_APPS} />} />
              <Route path="/flows/:flowId" element={<FlowDetailPage apps={MOCK_APPS} />} />
              <Route path="/kits" element={<FigmaKitsPage />} />
              <Route path="/kits/:kitSlug" element={<FigmaKitDetailPage />} />
              <Route
                path="/kits/:kitSlug/delivery"
                element={
                  <ProtectedRoute>
                    <KitDeliveryPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/pricing" element={<CreditsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AccountPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminObservabilityPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/user-flows" element={<Navigate to="/flows" replace />} />
              <Route path="/dictionary" element={<DictionaryPage apps={MOCK_APPS} />} />
              <Route path="/design-systems" element={<DesignSystemsPage apps={MOCK_APPS} />} />
              <Route
                path="/ios-apps"
                element={
                  <CollectionPage
                    title="iOS App Collection"
                    description="Native iOS patterns with system-aligned layouts, interactions, and navigation conventions."
                    apps={appsByPlatform.ios}
                  />
                }
              />
              <Route
                path="/android-apps"
                element={
                  <CollectionPage
                    title="Android App Collection"
                    description="Material-oriented references and Android-first interaction models for modern app design."
                    apps={appsByPlatform.android}
                  />
                }
              />
              <Route
                path="/web-apps"
                element={
                  <CollectionPage
                    title="Web App Collection"
                    description="Responsive web product interfaces optimized for desktop and cross-device behaviors."
                    apps={appsByPlatform.web}
                  />
                }
              />
              <Route
                path="/patterns"
                element={
                  <CollectionPage
                    title="UI Pattern Collection"
                    description="High-performing interface patterns frequently used in mature digital products."
                    apps={appsByPlatform.patterns}
                  />
                }
              />
              <Route path="/apps/:appId/screens" element={<AppScreensPage />} />
              {CONTENT_PAGES.filter((page) => !['/login', '/signup'].includes(page.path)).map((page) => (
                <Route key={page.path} path={page.path} element={<ContentPage {...page} />} />
              ))}
              <Route path="/browse" element={<Navigate to="/" replace />} />
              <Route path="/plans" element={<Navigate to="/pricing" replace />} />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <CheckoutStatusPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>

      <Suspense fallback={null}>
        {isAssistantOpen && <DesignAssistant isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />}
      </Suspense>
    </div>
  );
};

export default App;
