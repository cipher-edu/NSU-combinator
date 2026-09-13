import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  INITIAL_STARTUPS, 
  INITIAL_STORIES, 
  INITIAL_EVENTS, 
  INITIAL_VACANCIES, 
  INITIAL_MENTORS, 
  INITIAL_APPLICATIONS,
  INITIAL_NEWS 
} from './data/mockData';
import { 
  Startup, 
  Story, 
  EventItem, 
  CoFounderVacancy, 
  Mentor, 
  IncubationApplication, 
  Comment,
  NewsItem
} from './types';

// Ambient Backgrounds & Animations
import { AuroraBackground } from './components/AuroraBackground';
import { LatticeField } from './components/LatticeField';
import { cmsApi, FullLayoutResponse } from './api/cmsApi';
import { startupsApi } from './api/startupsApi';
import { eventsApi } from './api/eventsApi';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSlider } from './components/HeroSlider';
import { HeroSection } from './components/HeroSection';
import { ProgramSection } from './components/ProgramSection';
import { PortfolioSection } from './components/PortfolioSection';
import { DemoDaySection } from './components/DemoDaySection';
import { NewsSection } from './components/NewsSection';
import { PartnersMarquee } from './components/PartnersMarquee';
import { PlatformMetrics } from './components/PlatformMetrics';
import { TalentPoolSection } from './components/TalentPoolSection';
import { PlaybookSection } from './components/PlaybookSection';
import { StoriesSection } from './components/StoriesSection';
import { EventsSection } from './components/EventsSection';
import { CoFounderSection } from './components/CoFounderSection';
import { MentorsSection } from './components/MentorsSection';
import { ApplySection } from './components/ApplySection';
import { BottomNav } from './components/BottomNav';
import { CommandPalette } from './components/CommandPalette';

// Detail Pages
import { StartupDetailPage } from './pages/StartupDetailPage';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { MentorDetailPage } from './pages/MentorDetailPage';
import { VacancyDetailPage } from './pages/VacancyDetailPage';
import { NewsPage } from './pages/NewsPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { PlaybookPage } from './pages/PlaybookPage';

// Modals
import { StartupDetailModal } from './components/StartupDetailModal';
import { StoryDetailModal } from './components/StoryDetailModal';
import { CreateStoryModal } from './components/CreateStoryModal';
import { EventRegisterModal } from './components/EventRegisterModal';
import { CreateVacancyModal } from './components/CreateVacancyModal';
import { MentorBookingModal } from './components/MentorBookingModal';
import { StatusCheckModal } from './components/StatusCheckModal';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  // Persistent States
  const [startups, setStartups] = useState<Startup[]>(() => {
    const saved = localStorage.getItem('uzc_startups');
    return saved ? JSON.parse(saved) : INITIAL_STARTUPS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('uzc_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    const saved = localStorage.getItem('uzc_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [vacancies, setVacancies] = useState<CoFounderVacancy[]>(() => {
    const saved = localStorage.getItem('uzc_vacancies');
    return saved ? JSON.parse(saved) : INITIAL_VACANCIES;
  });

  const [mentors] = useState<Mentor[]>(INITIAL_MENTORS);

  const [applications, setApplications] = useState<IncubationApplication[]>(() => {
    const saved = localStorage.getItem('uzc_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem('uzc_news');
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  // CMS Server-Driven UI Layout State
  const [cmsLayout, setCmsLayout] = useState<FullLayoutResponse | null>(null);

  // Live backend data hydration
  useEffect(() => {
    // 1. CMS Server-Driven UI Layout
    cmsApi.getFullLayout()
      .then(data => {
        if (data && data.slides && data.slides.length > 0) {
          setCmsLayout(data);
        }
        if (data && data.news && data.news.length > 0) {
          setNews(data.news.map((n: any) => ({
            id: String(n.id),
            title: n.title,
            slug: n.slug,
            excerpt: n.excerpt,
            content: n.content,
            category: n.category,
            date: n.date_str,
            readTime: n.read_time,
            author: {
              name: n.author_name,
              role: n.author_role,
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120',
            },
            coverImage: n.cover_image,
            featured: n.featured,
            tags: n.tags || [],
            viewsCount: n.views_count || 0,
            likesCount: n.likes_count || 0,
          })));
        }
        if (data && data.vacancies && data.vacancies.length > 0) {
          setVacancies(data.vacancies.map((v: any) => ({
            id: String(v.id),
            startupName: v.startup_name,
            startupLogo: v.startup_logo,
            category: v.category,
            roleTitle: v.role_title,
            requiredSkills: v.required_skills || [],
            description: v.description,
            commitmentType: v.commitment_type,
            faculty: v.faculty,
            contactTelegram: v.contact_telegram,
            createdAt: 'Yaqinda',
          })));
        }
        if (data && data.stories && data.stories.length > 0) {
          setStories(data.stories.map((s: any) => ({
            id: String(s.id),
            title: s.title,
            excerpt: s.excerpt,
            content: s.content,
            authorName: s.author_name,
            authorRole: s.author_role,
            authorAvatar: s.author_avatar,
            startupName: s.startup_name,
            date: s.date_str,
            readTime: s.read_time,
            likes: s.likes || 0,
            commentsCount: s.comments_count || 0,
            comments: [],
            tags: s.tags || [],
          })));
        }
      })
      .catch(() => {});

    // 2. Startups & Leaderboard (FastAPI service)
    startupsApi.getStartups()
      .then(liveStartups => {
        if (liveStartups && liveStartups.length > 0) {
          setStartups(liveStartups);
        }
      })
      .catch(() => {});

    // 3. Events & Hackathons (Django Event service)
    eventsApi.getEvents()
      .then(liveEvents => {
        if (liveEvents && liveEvents.length > 0) {
          const mappedEvents: EventItem[] = liveEvents.map(e => ({
            id: String(e.id),
            title: e.title,
            type: e.type,
            date: e.date,
            time: e.time,
            location: e.location,
            mode: e.mode,
            prize: e.prize || '',
            registrationDeadline: e.registration_deadline || '',
            description: e.description,
            agenda: [],
            registeredCount: e.registered_count || 0,
            isRegistrationOpen: e.is_registration_open ?? true,
            featured: true,
          }));
          setEvents(mappedEvents);
        }
      })
      .catch(() => {});
  }, []);

  // One-time zero demo data reset
  useEffect(() => {
    if (localStorage.getItem('uzc_v2_clean') !== 'true') {
      localStorage.setItem('uzc_applications', JSON.stringify([]));
      localStorage.setItem('uzc_v2_clean', 'true');
      setApplications([]);
    }
  }, []);

  const isSectionVisible = (key: string) => {
    if (!cmsLayout || !cmsLayout.sections || cmsLayout.sections.length === 0) return true;
    const found = cmsLayout.sections.find(s => s.section_key === key);
    return found ? found.is_visible : true;
  };

  useEffect(() => {
    localStorage.setItem('uzc_startups', JSON.stringify(startups));
  }, [startups]);

  useEffect(() => {
    localStorage.setItem('uzc_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('uzc_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('uzc_vacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('uzc_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('uzc_news', JSON.stringify(news));
  }, [news]);

  // Modals state
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
  const [selectedEventForRegister, setSelectedEventForRegister] = useState<EventItem | null>(null);
  const [isCreateVacancyOpen, setIsCreateVacancyOpen] = useState(false);
  const [selectedMentorForBooking, setSelectedMentorForBooking] = useState<Mentor | null>(null);
  const [isStatusCheckOpen, setIsStatusCheckOpen] = useState(false);

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('uzc_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('uzc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('uzc_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // Command Palette Spotlight state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Upvote Handler
  const handleUpvote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStartups(prev => prev.map(s => {
      if (s.id === id) {
        const isUpvoted = s.upvotedByUser;
        return {
          ...s,
          upvotes: isUpvoted ? Math.max(0, s.upvotes - 1) : s.upvotes + 1,
          upvotedByUser: !isUpvoted
        };
      }
      return s;
    }));

    // Sync with live FastAPI backend
    startupsApi.upvote(id).catch(err => {
      console.warn('Backend upvote sync skipped:', err);
    });

    if (selectedStartup && selectedStartup.id === id) {
      setSelectedStartup(prev => {
        if (!prev) return null;
        const isUpvoted = prev.upvotedByUser;
        return {
          ...prev,
          upvotes: isUpvoted ? prev.upvotes - 1 : prev.upvotes + 1,
          upvotedByUser: !isUpvoted
        };
      });
    }
  };

  // Like Story Handler
  const handleLikeStory = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setStories(prev => prev.map(st => {
      if (st.id === id) {
        const isLiked = st.likedByUser;
        return {
          ...st,
          likes: isLiked ? st.likes - 1 : st.likes + 1,
          likedByUser: !isLiked
        };
      }
      return st;
    }));

    if (selectedStory && selectedStory.id === id) {
      setSelectedStory(prev => {
        if (!prev) return null;
        const isLiked = prev.likedByUser;
        return {
          ...prev,
          likes: isLiked ? prev.likes - 1 : prev.likes + 1,
          likedByUser: !isLiked
        };
      });
    }
  };

  // Add Comment Handler
  const handleAddComment = (storyId: string, comment: Comment) => {
    setStories(prev => prev.map(s => {
      if (s.id === storyId) {
        return {
          ...s,
          commentsCount: s.commentsCount + 1,
          comments: [comment, ...s.comments]
        };
      }
      return s;
    }));

    if (selectedStory && selectedStory.id === storyId) {
      setSelectedStory(prev => {
        if (!prev) return null;
        return {
          ...prev,
          commentsCount: prev.commentsCount + 1,
          comments: [comment, ...prev.comments]
        };
      });
    }
  };

  const handleRegisterEventSuccess = (eventId: string) => {
    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return { ...evt, registeredCount: evt.registeredCount + 1 };
      }
      return evt;
    }));
  };

  const handleCreateStory = (newStory: Story) => {
    setStories(prev => [newStory, ...prev]);
  };

  const handleCreateVacancy = (newVac: CoFounderVacancy) => {
    setVacancies(prev => [newVac, ...prev]);
  };

  const handleSubmitApplication = (newApp: IncubationApplication) => {
    setApplications(prev => [newApp, ...prev]);
  };

  const handleLikeNews = (id: string) => {
    setNews(prev => prev.map(n => {
      if (n.id === id) {
        return {
          ...n,
          likesCount: (n.likesCount || 0) + 1
        };
      }
      return n;
    }));
  };

  const handleAddNewsComment = (newsId: string, comment: Comment) => {
    setNews(prev => prev.map(n => {
      if (n.id === newsId) {
        return {
          ...n,
          comments: [comment, ...(n.comments || [])]
        };
      }
      return n;
    }));
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Sync activeTab with URL pathname
  useEffect(() => {
    const rawPath = location.pathname.replace('/', '');
    if (['home', 'program', 'portfolio', 'demoday', 'news', 'yangiliklar', 'playbook', 'stories', 'events', 'team', 'mentors', 'apply'].includes(rawPath)) {
      setActiveTab(rawPath === 'yangiliklar' ? 'news' : rawPath);
    } else if (location.pathname === '/') {
      setActiveTab('home');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'home') {
      navigate('/');
    } else {
      navigate(`/${tab}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenApply = () => {
    setActiveTab('apply');
    navigate('/apply');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-slate-950 text-ink-text dark:text-slate-100 selection:bg-brand selection:text-white flex flex-col relative overflow-x-hidden">
      
      {/* UzCombinator Ambient Aurora Background */}
      <AuroraBackground />

      {/* Interactive Canvas Particle Mesh */}
      <LatticeField />

      {/* Navbar with smooth active tab glide */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenApply={handleOpenApply}
        onOpenStatusCheck={() => setIsStatusCheckOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
        customTicker={cmsLayout?.ticker}
      />

      {/* Main Container */}
      <main className={`flex-1 pb-20 md:pb-0 ${activeTab === 'home' && (location.pathname === '/' || location.pathname === '/home') ? 'pt-0' : 'pt-24 sm:pt-28'}`}>
        <Routes>
          {/* Dedicated Full Pages with direct URLs */}
          <Route 
            path="/startup/:id" 
            element={
              <StartupDetailPage 
                startups={startups} 
                onUpvote={handleUpvote} 
              />
            } 
          />

          <Route 
            path="/story/:id" 
            element={
              <StoryDetailPage 
                stories={stories} 
                onLikeStory={handleLikeStory} 
                onAddComment={handleAddComment} 
              />
            } 
          />

          <Route 
            path="/event/:id" 
            element={
              <EventDetailPage 
                events={events} 
                onRegisterSuccess={handleRegisterEventSuccess} 
              />
            } 
          />

          <Route 
            path="/mentor/:id" 
            element={
              <MentorDetailPage 
                mentors={mentors} 
              />
            } 
          />

          <Route 
            path="/vacancy/:id" 
            element={
              <VacancyDetailPage 
                vacancies={vacancies} 
              />
            } 
          />

          {/* Dedicated News Pages with direct URLs */}
          <Route 
            path="/news" 
            element={<NewsPage news={news} />} 
          />

          <Route 
            path="/news/:id" 
            element={
              <NewsDetailPage 
                news={news} 
                onLikeNews={handleLikeNews}
                onAddComment={handleAddNewsComment}
              />
            } 
          />

          <Route 
            path="/yangiliklar" 
            element={<NewsPage news={news} />} 
          />

          <Route 
            path="/yangiliklar/:id" 
            element={
              <NewsDetailPage 
                news={news} 
                onLikeNews={handleLikeNews}
                onAddComment={handleAddNewsComment}
              />
            } 
          />

          {/* Dedicated Playbook Page with direct URL */}
          <Route 
            path="/playbook" 
            element={<PlaybookPage />} 
          />

          {/* Main Views */}
          <Route 
            path="*" 
            element={
              <>
                {activeTab === 'home' && (
                  <>
                    {/* Full-Page Modern Slider - NavDU Startap Klubi & Inkubatsiya Markazi */}
                    {isSectionVisible('hero_slider') && (
                      <HeroSlider 
                        customSlides={cmsLayout?.slides}
                        onOpenApply={handleOpenApply}
                        setActiveTab={handleTabChange}
                      />
                    )}

                    {/* Official Partners & Industry Marquee */}
                    {isSectionVisible('partners_marquee') && <PartnersMarquee />}

                    <HeroSection
                      onOpenApply={handleOpenApply}
                      setActiveTab={handleTabChange}
                      startups={startups}
                    />

                    {/* Live Platform Metrics Bar */}
                    <PlatformMetrics />

                    {isSectionVisible('program_stages') && <ProgramSection onOpenApply={handleOpenApply} />}
                    {isSectionVisible('portfolio_section') && (
                      <PortfolioSection
                        startups={startups}
                        onSelectStartup={(s) => {
                          navigate(`/startup/${s.id}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onUpvote={handleUpvote}
                        onOpenApply={handleOpenApply}
                      />
                    )}
                    {isSectionVisible('demo_day_section') && (
                      <DemoDaySection startups={startups} setActiveTab={handleTabChange} />
                    )}
                    {isSectionVisible('news_section') && <NewsSection news={news} />}
                    {isSectionVisible('playbook_section') && (
                      <PlaybookSection onNavigatePlaybook={() => handleTabChange('playbook')} />
                    )}
                    <StoriesSection
                      stories={stories}
                      onSelectStory={(s) => {
                        navigate(`/story/${s.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      onLike={handleLikeStory}
                      onOpenCreateStory={() => setIsCreateStoryOpen(true)}
                    />
                    {isSectionVisible('events_section') && (
                      <EventsSection
                        events={events}
                        onOpenRegister={(e) => {
                          navigate(`/event/${e.id}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    )}
                    {isSectionVisible('talent_pool_section') && <TalentPoolSection />}
                    <CoFounderSection
                      vacancies={vacancies}
                      onOpenCreateVacancy={() => setIsCreateVacancyOpen(true)}
                    />
                    <MentorsSection
                      mentors={mentors}
                      onOpenBooking={(m) => {
                        navigate(`/mentor/${m.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                    <ApplySection
                      onSubmitApplication={handleSubmitApplication}
                      onOpenStatusCheck={() => setIsStatusCheckOpen(true)}
                    />
                  </>
                )}

                {activeTab === 'program' && (
                  <ProgramSection onOpenApply={handleOpenApply} />
                )}

                {activeTab === 'portfolio' && (
                  <PortfolioSection
                    startups={startups}
                    onSelectStartup={(s) => {
                      navigate(`/startup/${s.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onUpvote={handleUpvote}
                    onOpenApply={handleOpenApply}
                  />
                )}

                {activeTab === 'demoday' && (
                  <DemoDaySection startups={startups} setActiveTab={handleTabChange} />
                )}

                {(activeTab === 'news' || activeTab === 'yangiliklar') && (
                  <NewsPage news={news} />
                )}

                {activeTab === 'stories' && (
                  <StoriesSection
                    stories={stories}
                    onSelectStory={(s) => {
                      navigate(`/story/${s.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onLike={handleLikeStory}
                    onOpenCreateStory={() => setIsCreateStoryOpen(true)}
                  />
                )}

                {activeTab === 'events' && (
                  <EventsSection
                    events={events}
                    onOpenRegister={(e) => {
                      navigate(`/event/${e.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {activeTab === 'playbook' && (
                  <PlaybookPage />
                )}

                {activeTab === 'team' && (
                  <>
                    <TalentPoolSection />
                    <CoFounderSection
                      vacancies={vacancies}
                      onOpenCreateVacancy={() => setIsCreateVacancyOpen(true)}
                    />
                  </>
                )}

                {activeTab === 'mentors' && (
                  <MentorsSection
                    mentors={mentors}
                    onOpenBooking={(m) => {
                      navigate(`/mentor/${m.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}

                {activeTab === 'apply' && (
                  <ApplySection
                    onSubmitApplication={handleSubmitApplication}
                    onOpenStatusCheck={() => setIsStatusCheckOpen(true)}
                  />
                )}
              </>
            } 
          />
        </Routes>
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={handleTabChange}
        onOpenApply={handleOpenApply}
      />

      {/* Modals */}
      <StartupDetailModal
        startup={selectedStartup}
        onClose={() => setSelectedStartup(null)}
        onUpvote={handleUpvote}
      />

      <StoryDetailModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        onLike={(id) => handleLikeStory(id)}
        onAddComment={handleAddComment}
      />

      <CreateStoryModal
        isOpen={isCreateStoryOpen}
        onClose={() => setIsCreateStoryOpen(false)}
        onSubmit={handleCreateStory}
      />

      <EventRegisterModal
        event={selectedEventForRegister}
        onClose={() => setSelectedEventForRegister(null)}
        onSuccess={handleRegisterEventSuccess}
      />

      <CreateVacancyModal
        isOpen={isCreateVacancyOpen}
        onClose={() => setIsCreateVacancyOpen(false)}
        onSubmit={handleCreateVacancy}
      />

      <MentorBookingModal
        mentor={selectedMentorForBooking}
        onClose={() => setSelectedMentorForBooking(null)}
      />

      <StatusCheckModal
        isOpen={isStatusCheckOpen}
        onClose={() => setIsStatusCheckOpen(false)}
        applications={applications}
      />

      {/* Global Spotlight / Command Palette (Ctrl+K / Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        startups={startups}
        news={news}
        setActiveTab={handleTabChange}
        onOpenApply={handleOpenApply}
        onOpenStatusCheck={() => setIsStatusCheckOpen(true)}
        isDark={isDark}
        toggleTheme={toggleTheme}
      />

      {/* Sleek Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        onOpenApply={handleOpenApply}
      />

    </div>
  );
}

export default App;
