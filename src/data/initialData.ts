import { Story, User, StoryCategory } from '../types';
import heroMosaicBanner from '../assets/images/hero_mosaic_banner_1792407604170.jpg';
import storyAhmedabadHeritage from '../assets/images/story_ahmedabad_heritage_1792407604646.jpg';
import storyMumbaiStartup from '../assets/images/story_mumbai_startup_1792407605199.jpg';
import storyDehradunMountains from '../assets/images/story_dehradun_mountains_1792407605221.jpg';

export const CATEGORIES: StoryCategory[] = [
  'Student Life',
  'Travel',
  'Culture',
  'Career & Growth',
  'Technology',
  'Business & Entrepreneurship',
  'Personal Stories',
  'Lifestyle'
];

export const CITIES = [
  'All Cities',
  'Dehradun',
  'Delhi NCR',
  'Mumbai',
  'Bengaluru',
  'Ahmedabad',
  'Pune',
  'Hyderabad'
];

const RAW_USERS: User[] = [
  {
    id: 'user-dharini',
    name: 'Dharini Singh',
    username: 'dharini',
    email: 'dharini.0251mba021@dgu.ac.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Founder of Mosaic. Passionate about creating an accessible space where diverse Indian voices and meaningful stories can be discovered and shared.',
    city: 'Dehradun',
    role: 'Founder of Mosaic',
    interests: ['Student Life', 'Personal Stories', 'Culture', 'Business & Entrepreneurship'],
    joinedDate: 'September 2026',
    savedStoryIds: ['story-2', 'story-3', 'story-7'],
    likedStoryIds: ['story-1', 'story-2', 'story-3', 'story-4']
  },
  {
    id: 'user-priya',
    name: 'Priya Desai',
    username: 'priyadesai',
    email: 'priya.desai@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'Heritage enthusiast and architectural documentarian exploring community living in western India.',
    city: 'Ahmedabad',
    role: 'Culture & Travel Contributor',
    interests: ['Culture', 'Travel', 'Lifestyle'],
    joinedDate: 'August 2026',
    savedStoryIds: ['story-4'],
    likedStoryIds: ['story-2', 'story-6']
  },
  {
    id: 'user-kabir',
    name: 'Kabir Mehra',
    username: 'kabir_m',
    email: 'kabir.mehra@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Early-stage tech founder, curious observer of urban subcultures and coffee shop entrepreneurship.',
    city: 'Mumbai',
    role: 'Startup Founder & Writer',
    interests: ['Business & Entrepreneurship', 'Technology', 'Career & Growth'],
    joinedDate: 'August 2026',
    savedStoryIds: ['story-5'],
    likedStoryIds: ['story-1', 'story-3']
  },
  {
    id: 'user-aarav',
    name: 'Aarav Sharma',
    username: 'aarav_sharma',
    email: 'aarav.sharma@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    bio: 'College senior, railway travel lover, and amateur street photographer documenting everyday India.',
    city: 'Delhi NCR',
    role: 'Student & Storyteller',
    interests: ['Student Life', 'Travel', 'Personal Stories'],
    joinedDate: 'September 2026',
    savedStoryIds: ['story-1', 'story-4'],
    likedStoryIds: ['story-1', 'story-5']
  },
  {
    id: 'user-ananya',
    name: 'Ananya Iyer',
    username: 'ananya_iyer',
    email: 'ananya.iyer@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    bio: 'Associate product manager in Koramangala. Writing on navigation through early career imposter syndrome.',
    city: 'Bengaluru',
    role: 'Product Specialist',
    interests: ['Career & Growth', 'Technology', 'Personal Stories'],
    joinedDate: 'July 2026',
    savedStoryIds: ['story-3'],
    likedStoryIds: ['story-5', 'story-7']
  }
];

const RAW_STORIES: any[] = [
  {
    id: 'story-1',
    title: 'What College Taught Me Beyond the Classroom Walls',
    excerpt: 'Syllabi teach equations and case studies, but late-night hostel terrace debates and organizing college festivals taught me how humans actually connect.',
    content: `When I entered university, I carried a neat planner and an expectation that success was measured by grade point averages and library checkouts. Three years later, sitting under the chinar trees as graduation approaches, I realize that the most formative lessons never appeared in any textbook.

College is an informal laboratory of human friction and resilience. It is where you learn how to disagree with someone at 2:00 AM over cups of lukewarm tea in the hostel mess, and still wake up at 8:00 AM to present a group project together without harboring resentment.

The classrooms taught us theories of leadership, but the college festival taught us logistics: what to do when a sound vendor vanishes two hours before curtain call, or how to negotiate with six different student committees when egos run high.

Perhaps the deepest lesson was unlearning the need for neat certainty. In school, every question had a defined answer in the back of the book. In university life, you watch your peers navigate family expectations, career anxiety, and questions of self-identity in real time.

You realize that everyone is figuring it out as they go. Once you understand that truth, compassion replaces comparison, and curiosity replaces fear.`,
    category: 'Student Life',
    coverImage: heroMosaicBanner,
    author: {
      id: 'user-dharini',
      name: 'Dharini Singh',
      username: 'dharini',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Founder of Mosaic. Passionate about creating an accessible space for diverse Indian voices.',
      city: 'Dehradun',
      role: 'Founder of Mosaic'
    },
    publishedAt: 'October 14, 2026',
    readTimeMinutes: 5,
    likes: 42,
    bookmarks: 18,
    views: 312,
    isFeatured: true,
    isTrending: true,
    city: 'Dehradun',
    tags: ['Education', 'Campus', 'Reflections', 'Personal Growth'],
    status: 'published'
  },
  {
    id: 'story-2',
    title: 'The Walled City’s Whispers: Walking the Carved Pols of Ahmedabad',
    excerpt: 'Behind the bustling traffic of modern Gujarat lies centuries of shared courtyards, communal bird feeders, and wooden balconies that preserve the rhythm of slow living.',
    content: `Stepping into the pols of old Ahmedabad is like stepping into an acoustic chamber of collective memory. The transition from the blaring horns of Relief Road into the narrow brick alleys of Mandvi ni Pol happens within ten paces, yet the shift in temporal tempo feels like centuries.

These pols were not designed by modern urban planners with transit flow charts; they evolved organically from kinship, climate, and collective security. The homes lean inward toward shared chowks (courtyards). Intricate wooden brackets—known as todlas—depict peacocks, elephants, and floral motifs carved by Gujarati artisans over four hundred years ago.

In a pol, private life and communal life bleed into one another in the most tender ways. Elders sit on the otlas (raised verandas), greeting neighbors by name as vegetable vendors push carts through lanes so narrow two bicycles can barely pass.

At noon, the chabootras—elevated wooden towers built specifically to feed pigeons and sparrows—attract clouds of wings. It reminds you that here, coexistence was an architectural principle, not a buzzword.

As our cities rush toward glass skyscrapers and gated isolation, walking through Ahmedabad’s pols offers an enduring masterclass in how human density can foster empathy rather than alienation.`,
    category: 'Travel',
    coverImage: storyAhmedabadHeritage,
    author: {
      id: 'user-priya',
      name: 'Priya Desai',
      username: 'priyadesai',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      bio: 'Heritage enthusiast and architectural documentarian exploring community living in western India.',
      city: 'Ahmedabad',
      role: 'Culture & Travel Contributor'
    },
    publishedAt: 'October 10, 2026',
    readTimeMinutes: 6,
    likes: 38,
    bookmarks: 24,
    views: 285,
    isFeatured: true,
    isTrending: true,
    city: 'Ahmedabad',
    tags: ['Heritage', 'Architecture', 'Urban Living', 'Gujarat'],
    status: 'published'
  },
  {
    id: 'story-3',
    title: 'Chai, Code, and Grit: Building a Venture from a Bandra Café',
    excerpt: 'We didn’t have venture backing or a shiny glass cabin. All we had were two rickety chairs, unstable Wi-Fi, and an obsession with solving a real problem.',
    content: `There is a specific smell to Mumbai startup optimism: roasted Arabica beans mingling with damp monsoon asphalt and the sharp aroma of freshly fried samosas from the corner stall outside.

For the first six months of our venture, our boardroom was a wooden table next to a rattling plug point in a Pali Hill café. We paid for our rent with two flat whites every three hours and made friends with the barista so he wouldn’t ask us to vacate during the afternoon lull.

Founding something in your early twenties carries equal parts audacity and terror. When you pitch to potential clients who have twenty years more industry experience than you, every email draft undergoes four revisions.

The hardest part is not writing the code or setting up the payment rails—it is managing the internal psychology of uncertainty. There are Tuesdays when an early adopter writes a glowing testimonial, making you feel invincible. By Thursday, two key pilot users drop off, and you question your judgment entirely.

What keeps you going is radical focus on the end-user. Not vanity metrics or social media posturing, but asking: did our tool make someone’s day twenty minutes easier today? If the answer is yes, you order another cutting chai and keep building.`,
    category: 'Business & Entrepreneurship',
    coverImage: storyMumbaiStartup,
    author: {
      id: 'user-kabir',
      name: 'Kabir Mehra',
      username: 'kabir_m',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Early-stage tech founder, curious observer of urban subcultures and coffee shop entrepreneurship.',
      city: 'Mumbai',
      role: 'Startup Founder & Writer'
    },
    publishedAt: 'October 8, 2026',
    readTimeMinutes: 7,
    likes: 56,
    bookmarks: 31,
    views: 450,
    isFeatured: true,
    isTrending: true,
    city: 'Mumbai',
    tags: ['Startups', 'Bootstrapping', 'Founder Journey', 'Mumbai'],
    status: 'published'
  },
  {
    id: 'story-4',
    title: 'In the Shadow of the Pines: Solitude on the Mussoorie Ridge',
    excerpt: 'Escaping the drone of digital notifications, I took a solo morning trek into the cedar woods of Dehradun’s foothills to rediscover what silence sounds like.',
    content: `We live in an age where silence has become so rare that it initially feels alarming. Our brains are conditioned to expect notification pings, email pings, and the incessant hum of highway transit.

Last weekend, leaving my phone on airplane mode inside my backpack, I set off at 5:30 AM on the old bridal path that climbs up from Rajpur toward the lower ridge above Dehradun. The mist hung dense between the blue pines, dampening every footstep on the bed of dried needles.

Halfway up the trail, as the sun broke through the Himalayan canopy in golden diagonal rays, I stopped. There was no engine hum. No algorithmic feed telling me what to think or who to admire. Only the high, clear call of a Himalayan whistling thrush and the gentle creak of aged cedars swaying in the mountain breeze.

Walking alone in the mountains does something profound to human perspective. Your anxieties, which seemed monumental inside a four-walled room, shrink into proper proportion against geological time.

I returned to my desk with muddy boots and a quiet mind. You do not need a three-week retreat to reset; you just need forty minutes of unfiltered sky and the courage to leave the screen behind.`,
    category: 'Travel',
    coverImage: storyDehradunMountains,
    author: {
      id: 'user-dharini',
      name: 'Dharini Singh',
      username: 'dharini',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Founder of Mosaic. Passionate about creating an accessible space for diverse Indian voices.',
      city: 'Dehradun',
      role: 'Founder of Mosaic'
    },
    publishedAt: 'October 6, 2026',
    readTimeMinutes: 4,
    likes: 31,
    bookmarks: 19,
    views: 240,
    isFeatured: false,
    isTrending: false,
    city: 'Dehradun',
    tags: ['Nature', 'Himalayas', 'Mindfulness', 'Solo Travel'],
    status: 'published'
  },
  {
    id: 'story-5',
    title: 'My First 90 Days as an Associate in Bengaluru: What No One Tells You',
    excerpt: 'Transitioning from student council president to an entry-level corporate hire taught me the painful difference between academic praise and organizational impact.',
    content: `In university, feedback loops are swift: submit an assignment on Friday, receive an A-grade and professor praise by Tuesday. In a high-growth tech organization in Bengaluru, however, you can work sixty hours on a project only for leadership to pivot strategy on Thursday morning, leaving your work obsolete.

My first month was defined by imposter syndrome. In meetings, jargon like "flywheel effect," "GTM alignment," and "CAC amortization" flew across the glass boardrooms. I nodded along while frantically searching definitions beneath the conference table.

The breakthrough came when a senior mentor pulled me aside after a presentation. "Stop trying to sound smart," she said kindly. "Focus on asking the one unasked question that saves the team three days of rework."

That single piece of advice changed my mindset. I stopped treating work like an exam where I needed to prove my personal brilliance. Instead, I started treating it as a collaborative puzzle.

By day 90, the imposter syndrome hadn't disappeared entirely, but I had learned to coexist with it. Being an early-career professional is not about knowing everything—it is about having the humility to learn fast and the grit to follow through.`,
    category: 'Career & Growth',
    coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    author: {
      id: 'user-ananya',
      name: 'Ananya Iyer',
      username: 'ananya_iyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: 'Associate product manager in Koramangala. Writing on navigation through early career imposter syndrome.',
      city: 'Bengaluru',
      role: 'Product Specialist'
    },
    publishedAt: 'October 3, 2026',
    readTimeMinutes: 6,
    likes: 49,
    bookmarks: 28,
    views: 380,
    isFeatured: false,
    isTrending: true,
    city: 'Bengaluru',
    tags: ['Career', 'Corporate Life', 'Young Professional', 'Bengaluru'],
    status: 'published'
  },
  {
    id: 'story-6',
    title: 'Finding Your Voice: Why Emerging Indian Writers Remain Silent',
    excerpt: 'We have endless opinions on family WhatsApp groups and Twitter threads, but writing an honest long-form reflection feels terrifying. Here is why we must break that barrier.',
    content: `Talk to any group of college students or young professionals in India today, and you will discover a treasure trove of nuanced observations. They notice the subtle shifts in family dynamics during Diwali visits, the unwritten codes of metro commutes, the bittersweet negotiations between traditional values and global ambitions.

Yet, ask them why they don’t publish these stories online, and the answers are universal: "Who am I to write about this?", "Everyone else is smarter than me," or "My thoughts are too mundane to share."

We have been conditioned by algorithmic feeds to believe that only extraordinary feats—raising five million dollars or scaling Everest—merit a story. But the literature that moves us most is almost always ordinary experiences captured with extraordinary honesty.

When you write about the quiet anxiety of moving away from your hometown, or the bittersweet pride in your father’s eyes when you buy him dinner with your first salary, you are not writing vanity—you are creating a mirror.

A story does not need to offer a grand philosophical solution. Sometimes, simply giving a name to a shared feeling is the greatest contribution a writer can make.`,
    category: 'Culture',
    coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    author: {
      id: 'user-dharini',
      name: 'Dharini Singh',
      username: 'dharini',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Founder of Mosaic. Passionate about creating an accessible space for diverse Indian voices.',
      city: 'Delhi NCR',
      role: 'Founder of Mosaic'
    },
    publishedAt: 'September 28, 2026',
    readTimeMinutes: 5,
    likes: 64,
    bookmarks: 45,
    views: 520,
    isFeatured: true,
    isTrending: false,
    city: 'Delhi NCR',
    tags: ['Writing', 'Storytelling', 'Vulnerability', 'Expression'],
    status: 'published'
  },
  {
    id: 'story-7',
    title: 'How UPI and WhatsApp Rewrote the Rules for India’s Micro-Enterprises',
    excerpt: 'From street-corner florist stalls in Pune to artisanal handloom weavers in Maheshwar, the true digital revolution in India happened at the grassroots.',
    content: `Silicon Valley likes to imagine technological disruption through self-driving vehicles and quantum chips. But if you want to witness the most radical digital democratization on Earth, visit a sabzi mandi (vegetable market) in Pune on a Saturday morning.

There, an elderly woman selling fresh coriander leaves for twenty rupees has a laminated QR code hanging from a jute string around her stall. A customer taps their phone, a small audio soundbox announces "Payment of twenty rupees received," and both parties move on without exchanging a single paper rupee or ledger entry.

This is not just financial convenience; it is institutional inclusion. For decades, informal traders were shut out of formal banking because credit rating agencies could not track cash flows. Today, verifiable digital transaction logs turn street vendors into bankable borrowers.

Combined with WhatsApp Business catalogs, local bakeries and independent pottery makers can run end-to-end commerce operations from their living rooms with zero capital expenditure on software infrastructure.

India’s technological leap was never about copying Western blueprints—it was about solving our own friction with indigenous simplicity.`,
    category: 'Technology',
    coverImage: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
    author: {
      id: 'user-kabir',
      name: 'Kabir Mehra',
      username: 'kabir_m',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Early-stage tech founder, curious observer of urban subcultures and coffee shop entrepreneurship.',
      city: 'Pune',
      role: 'Startup Founder & Writer'
    },
    publishedAt: 'September 24, 2026',
    readTimeMinutes: 6,
    likes: 52,
    bookmarks: 33,
    views: 410,
    isFeatured: false,
    isTrending: false,
    city: 'Pune',
    tags: ['Fintech', 'Digital India', 'Grassroots', 'Economy'],
    status: 'published'
  },
  {
    id: 'story-8',
    title: 'The Art of Slow Sundays in Hauz Khas: A Student’s Guide to Respite',
    excerpt: 'Surrounded by 14th-century stone ruins and modern designer boutiques, Hauz Khas Village offers a rare refuge where you can sit with a book for four hours undisturbed.',
    content: `Delhi is a city of ferocious ambition. The metro trains rush at three-minute intervals, the ring roads roar with relentless traffic, and the air crackles with competitive energy.

That is why Sunday mornings inside the historic precinct of Hauz Khas feel like a sacred indulgence. If you arrive by 8:30 AM, before the café patios fill with selfie sticks, the stone arches of Firoz Shah’s madrasa stand silent over the green lake reservoir.

You will see college students curled up with battered paperbacks on stone ledges, stray dogs basking in the winter sun, and watercolorists sketching the Islamic arches.

In a hyper-productive culture where rest is constantly pathologized as laziness, carving out intentional slowness is an act of gentle rebellion. Spending an afternoon watching duck ripples on an ancient reservoir doesn't take away from your goals—it restores the mental clarity you need to pursue them.`,
    category: 'Lifestyle',
    coverImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    author: {
      id: 'user-aarav',
      name: 'Aarav Sharma',
      username: 'aarav_sharma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'College senior, railway travel lover, and amateur street photographer documenting everyday India.',
      city: 'Delhi NCR',
      role: 'Student & Storyteller'
    },
    publishedAt: 'September 20, 2026',
    readTimeMinutes: 4,
    likes: 35,
    bookmarks: 20,
    views: 290,
    isFeatured: false,
    isTrending: false,
    city: 'Delhi NCR',
    tags: ['Delhi', 'Slow Living', 'Heritage', 'Weekends'],
    status: 'published'
  },
  {
    id: 'story-9',
    title: 'Balancing Ambition and Well-being: Unlearning the 24/7 Hustle Myth',
    excerpt: 'At twenty-three, I thought sleeping four hours and skipping meals was a badge of honour. An ER visit forced me to recalibrate what sustainable success truly looks like.',
    content: `We have romanticized the martyrdom of exhaustion. LinkedIn timelines and YouTube motivational videos celebrate eighteen-hour workdays, cold showers at 4:30 AM, and bragging about how many weekends you sacrificed for the mission.

Last year, while juggling an engineering final project and a client freelance contract, my body staged a revolt. What started as persistent migraines culminated in severe dehydration and physical burnout in a Hyderabad emergency room.

Lying beneath fluorescent hospital tubes with an IV drip, none of my GitHub commits or client spreadsheets seemed important. The doctor didn’t ask about my quarterly deliverables; he asked when I last ate a proper warm meal with my family.

Recovering was not just physical—it was philosophical. I had to decouple my self-worth from my productivity metrics. I learned that rest is not a reward you earn only after complete collapse; it is an essential maintenance requirement.

True ambition is long-term. You cannot build a meaningful fifty-year career on a foundation of chronic depletion.`,
    category: 'Personal Stories',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    author: {
      id: 'user-dharini',
      name: 'Dharini Singh',
      username: 'dharini',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Founder of Mosaic. Passionate about creating an accessible space for diverse Indian voices.',
      city: 'Hyderabad',
      role: 'Founder of Mosaic'
    },
    publishedAt: 'September 16, 2026',
    readTimeMinutes: 5,
    likes: 58,
    bookmarks: 40,
    views: 470,
    isFeatured: false,
    isTrending: true,
    city: 'Hyderabad',
    tags: ['Mental Health', 'Wellness', 'Burnout', 'Self Care'],
    status: 'published'
  },
  {
    id: 'story-10',
    title: 'From Campus Project to First Client: Lessons in Starting Without Capital',
    excerpt: 'You don’t need fifty lakhs or an angel investor to launch. How we validated our student service using free tools, cold emails, and genuine customer care.',
    content: `The most dangerous myth in university entrepreneurship clubs is that you cannot start until you raise money. We see headlines about twenty-two-year-olds raising millions and assume that capital is step one.

When we built our campus design collective in Pune, our bank balance was literally ₹4,200 collected from four classmates. We used open-source software, free tiers of web builders, and student discounts.

Our marketing was purely boots-on-the-ground. We walked into thirty local bakeries, fitness studios, and coaching centres on Ferguson College Road. We didn't pitch complex branding retainer packages—we identified one specific flaw in their social presence or menu card and offered to fix it for ₹3,000.

Twenty-four said no. Six said yes. Those six clients became our learning laboratory. Because we had no budget margin, our only competitive moat was obsessive attention to customer satisfaction.

Constraint is the greatest catalyst for innovation. When you don't have money to throw at problems, you are forced to use empathy, speed, and creative resourcefulness.`,
    category: 'Business & Entrepreneurship',
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80',
    author: {
      id: 'user-kabir',
      name: 'Kabir Mehra',
      username: 'kabir_m',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      bio: 'Early-stage tech founder, curious observer of urban subcultures and coffee shop entrepreneurship.',
      city: 'Pune',
      role: 'Startup Founder & Writer'
    },
    publishedAt: 'September 12, 2026',
    readTimeMinutes: 6,
    likes: 44,
    bookmarks: 29,
    views: 360,
    isFeatured: false,
    isTrending: false,
    city: 'Pune',
    tags: ['Bootstrapping', 'Small Business', 'Pune', 'Sales'],
    status: 'published'
  },
  {
    id: 'story-11',
    title: 'Night Trains, Cutting Chai, and the Philosophy of Indian Railways',
    excerpt: 'There is no equalizer in modern India quite like an overnight Sleeper coach. A tribute to 3-tier berths, vendors shouting garam chai, and conversations with strangers.',
    content: `Boarding the Konkan Kanya Express at CSMT station in Mumbai as twilight falls is a sensory ritual that cannot be matched by any sterile airport lounge.

Inside the carriage, families unpack stainless steel tiffin carriers revealing lemon rice, thepla, and mango pickle. Within forty minutes of the train pulling out past Thane, the artificial boundaries of caste, social class, and language soften. The uncle on the lower berth offers you a paratha; you help the college kid opposite locate a charging point.

Indian Railways is not merely transportation infrastructure; it is the physical circulatory system of our shared social fabric. You watch the landscape transform through open barred windows—from the industrial outskirts of Maharashtra into the lush betel-nut groves of coastal Goa.

In an era of hyper-curated, isolated algorithmic bubbles, an overnight train reminds you that you are fundamentally woven into a collective tapestry of 1.4 billion lives.`,
    category: 'Travel',
    coverImage: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1200&q=80',
    author: {
      id: 'user-aarav',
      name: 'Aarav Sharma',
      username: 'aarav_sharma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      bio: 'College senior, railway travel lover, and amateur street photographer documenting everyday India.',
      city: 'Mumbai',
      role: 'Student & Storyteller'
    },
    publishedAt: 'September 8, 2026',
    readTimeMinutes: 5,
    likes: 67,
    bookmarks: 39,
    views: 580,
    isFeatured: false,
    isTrending: true,
    city: 'Mumbai',
    tags: ['Railways', 'Travel', 'India', 'Nostalgia'],
    status: 'published'
  },
  {
    id: 'story-12',
    title: 'Decoding the Generational Shift in Indian Workplaces',
    excerpt: 'Gen Z and millennial professionals are redefining loyalty, hierarchy, and work-life boundaries in corporate India. Here is what managers need to understand.',
    content: `For our parents' generation, job stability was the ultimate professional virtue. Staying with a single public sector enterprise or conglomerate for thirty years symbolized loyalty, financial prudence, and social respect.

For the cohort entering workplaces between 2022 and 2026, the psychological contract has fundamentally shifted. Young professionals do not view employment as a paternalistic lifelong bond, but as a reciprocal value exchange.

They question performative presenteeism: why must an employee sit in traffic for two hours to send emails that could be written from home? They reject respect born purely out of seniority titles, demanding psychological safety and transparency instead.

This is not entitlement; it is a healthy recalibration. When organizations prioritize clear deliverables, personal autonomy, and open dialogue over outdated office rituals, engagement skyrockets.

The future belongs to companies that realize employee well-being is not a CSR expense—it is your single most important operational advantage.`,
    category: 'Career & Growth',
    coverImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    author: {
      id: 'user-ananya',
      name: 'Ananya Iyer',
      username: 'ananya_iyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      bio: 'Associate product manager in Koramangala. Writing on navigation through early career imposter syndrome.',
      city: 'Bengaluru',
      role: 'Product Specialist'
    },
    publishedAt: 'September 4, 2026',
    readTimeMinutes: 6,
    likes: 41,
    bookmarks: 23,
    views: 340,
    isFeatured: false,
    isTrending: false,
    city: 'Bengaluru',
    tags: ['Workplace', 'Culture', 'Leadership', 'GenZ'],
    status: 'published'
  }
];

export const INITIAL_USERS: User[] = RAW_USERS;

export const INITIAL_STORIES: Story[] = RAW_STORIES.map((s, index) => ({
  ...s,
  authorId: s.author.id,
  createdAt: `2026-09-${String(index + 1).padStart(2, '0')}T10:00:00.000Z`,
  updatedAt: `2026-10-14T12:00:00.000Z`
}));

export const INITIAL_METRICS = {
  totalVisitors: 842,
  registeredUsers: 48, // Targeting 50 validation goal
  activeUsers: 22,     // Target 20 exceeded
  storiesPublished: 16,// Target 15 exceeded
  totalReads: 3820,
  totalLikes: 482,
  totalBookmarks: 298
};

