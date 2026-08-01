'use strict';
// Verbatim port from experience-simulator/public/script.js (lines 72-73, 75-3090).
// ADAPTIVE_GENERIC_AGENT_GREETING + ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY. Do not hand-edit copy.

const ADAPTIVE_GENERIC_AGENT_GREETING =
  "Hi ${firstName}, welcome back! I'm Penny, your ${brandName} AI assistant.";

/** Default copy per sub-industry for the Adaptive Web downloadable simulation */
const ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY = {
  retailBanking: {
    coldHeroEyebrow: "Life simplified",
    coldHeroHeading: "Comprehensive financial solutions for every stage of life.",
    coldHeroParagraph1: "From everyday banking and insurance to enterprise commercial lending and wealth management, ${brandName} is your trusted partner.",
    coldHeroParagraph2: "Life, it's one less thing to worry about. Open a free account with ${brandName} today — explore services and see how checking, savings, borrowing, and investing fit together.",
    homepageCtaText: "Explore Everyday Banking",
    homeMarketInsights: {
      sectionSubtitle:
        "Short reads on saving, credit, and investing—informational only, not advice.",
      cards: [
        {
          eyebrow: "Saving",
          title: "Build savings habits that stick",
          body: "Automatic transfers, clear goals, and the right account mix make progress steady—small steps beat an all-or-nothing approach.",
        },
        {
          eyebrow: "Credit cards",
          title: "Choose rewards that match how you spend",
          body: "Travel points, cash back, or a low-rate card each fit different habits. Comparing fees and perks helps you earn more on purchases you already make.",
        },
        {
          eyebrow: "Investing",
          title: "How to think about IRA investments",
          body: "Time horizon, diversification, and comfort with volatility usually matter more than timing the market—a disciplined plan supports long-term goals.",
        },
      ],
    },
    categoryPage: {
      heroBgImage:
        "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?auto=format&fit=crop&w=2400&q=80",
      catHeroTitle: "Personal Banking, Elevated.",
      catHeroSubtitle: "Everything you need to manage, save, and borrow in one integrated platform.",
      marketInsightsIntro:
        "Timely ideas for budgeting, borrowing, and planning. When you want next steps for your situation, open the chat and ask Penny—your ${brandName} assistant in this demo.",
      services: [
        {
          iconClass: "fa-building-columns",
          title: "Checking & Savings",
          description: "Fee-free accounts with high-yield options",
        },
        {
          iconClass: "fa-credit-card",
          title: "Credit Cards",
          description: "Cashback and travel rewards tailored to your lifestyle",
        },
        {
          iconClass: "fa-car",
          title: "Borrowing",
          description: "Auto, Home, and Personal loans with rapid decisions",
        },
      ],
      whyChooseUsTitle: "Award-Winning Digital Banking",
      whyChooseUsText:
        "Manage your entire financial life from the palm of your hand. Deposit checks, track credit scores, and apply for loans instantly through our top-rated mobile app.",
      whyChooseUsImage:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
      article1Title: "Before you refinance: questions worth asking",
      article2Title: "Everyday steps that strengthen digital banking security",
    },
    useCases: {
      autoLoan: {
        name: "Auto Loan Pre-Approval",
        heroAssets: {
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472484/confident-student-in-shared-space-with-laptop_collagestyle_zeay8z.avif",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479242/1a-blogposts-When-Refinancing-an-Auto-Loan-Makes-Sense_yc7s9g.jpg",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479847/sports-car-insurance_mstufu.jpg",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479444/Livery-Insurance-Close-up-Portrait-of-a-Woman-Driver-of-a-Car-Service-Smiling-at-the-Camera_vynex8.webp",
        },
        vanillaHeroTitle: "Finance your next vehicle with confidence.",
        vanillaHeroSubtext:
          "Compare term lengths and payment paths for your auto loan, then continue with a lending specialist.",
        userIntentString: "I want an auto loan.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three auto loan structures to review—rates shown; a specialist confirms your final offer.",
        adaptiveOverlayTitle: "Options tailored to your session",
        adaptiveOverlaySubtitle:
          "Review three starting points below, then continue in chat or with a specialist.",
        adaptiveFooterNote: "Retail Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can finalize your request.",
        homeMarketInsights: {
          sectionSubtitle:
            "Resources for everyday money management.",
          cards: [
            {
              eyebrow: "Student loans",
              title: "Student loan planning for graduates starting repayment",
              body: "The image of a student with a backpack supports this topic on payment planning and early repayment choices.",
            },
            {
              eyebrow: "Credit cards",
              title: "Travel credit card value for frequent trip spending",
              body: "The beach travel card image matches this card-comparison topic around points, fees, and redemption value.",
            },
            {
              eyebrow: "Retirement",
              title: "Retirement income planning across family stages",
              body: "The grandparent reading with grandkids image supports this retirement planning topic on long-term household goals.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(415) 234-5678",
          company: "Acme Corp",
          zipCode: "94105",
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Auto financing",
              title: "When auto refinancing can lower total cost",
              body: "The auto-financing article image supports this topic on rate changes, term resets, and monthly payment tradeoffs.",
            },
            {
              eyebrow: "Insurance",
              title: "Sports car insurance and premium drivers",
              body: "The sports car image matches this insurance topic on coverage levels, deductibles, and premium risk factors.",
            },
            {
              eyebrow: "Rates",
              title: "Locking your rate before final vehicle selection",
              body: "The smiling driver image reflects this rate-lock topic around pre-approval timing and document readiness.",
            },
          ],
        },
        cards: [
          {
            recommended: false,
            smallTag: "Fast Payoff",
            title: "36-Month Auto Loan",
            iconClass: "fa-car",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "APR", value: "5.49%" }, { label: "TERM", value: "36 mo" }],
            features: [
              "Lowest interest rate",
              "Pay off your vehicle faster",
              "No prepayment penalties",
              "Same-day funding",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Balanced",
            title: "60-Month Auto Loan",
            iconClass: "fa-car",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "APR", value: "6.25%" }, { label: "TERM", value: "60 mo" }],
            features: [
              "Balanced monthly payments",
              "Competitive interest rate",
              "Rate lock for 30 days",
              "Automatic payment discount",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Low Payment",
            title: "72-Month Auto Loan",
            iconClass: "fa-car",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "APR", value: "6.99%" }, { label: "TERM", value: "72 mo" }],
            features: [
              "Lowest monthly payment",
              "Maximum vehicle purchasing power",
              "100% digital application",
              "Skip a payment program",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      mortgage: {
        name: "First-Time Homebuyer",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479639/exterior-cape-cod-house-mem-interiors-pc-r-brad-knipstein_d4kp5r.webp",
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472484/confident-student-in-shared-space-with-laptop_collagestyle_zeay8z.avif",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479720/quarters-stacked-on-a-table-and-a-jar-with-a-growing-sprout_dgntpn.jpg",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479544/1-JacobWackerhausen-417d5105246c4947bc3cad2a961af80a_j8cfgh.jpg",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774480084/milan2099-61cf06cdda72490bb75bb448fd03aaae_r62pz0.jpg",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479444/Livery-Insurance-Close-up-Portrait-of-a-Woman-Driver-of-a-Car-Service-Smiling-at-the-Camera_vynex8.webp",
        },
        vanillaHeroTitle: "Your dream home, within reach.",
        vanillaHeroSubtext:
          "Explore competitive mortgage rates and first-time buyer programs designed to get you the keys faster.",
        userIntentString: "I am looking to buy my first home and need a mortgage.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Congratulations! That's a huge milestone. I see your savings are healthy for a down payment. Let me pull up our current mortgage rates.",
        adaptiveOverlayTitle: "Mortgage options for your first home",
        adaptiveOverlaySubtitle:
          "Compare fixed-rate, accelerated payoff, and adjustable programs with a lending specialist.",
        adaptiveFooterNote: "Retail Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can finalize your request.",
        homeMarketInsights: {
          sectionSubtitle:
            "Mortgage and home financing resources.",
          cards: [
            {
              eyebrow: "Student loans",
              title: "Student debt planning while preparing for homeownership",
              body: "The student-with-backpack image supports this topic on balancing loan repayment with future home goals.",
            },
            {
              eyebrow: "Rate planning",
              title: "Why early rate planning matters for first-time buyers",
              body: "The family-at-home image matches this lock-rate topic around payment certainty before purchase.",
            },
            {
              eyebrow: "Savings",
              title: "Building cash reserves before home purchase",
              body: "The growing-money image supports this savings-rate topic for down payment and closing-cost readiness.",
            },
          ],
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Mortgage trends",
              title: "Mortgage rate trends for first-time buyers",
              body: "The mortgage-rates article image supports this topic on affordability, payment changes, and timing choices.",
            },
            {
              eyebrow: "First-time buyer",
              title: "Checklist milestones before making an offer",
              body: "The first-time buyer checklist image matches this topic on pre-approval, inspection, and closing steps.",
            },
            {
              eyebrow: "Rate strategy",
              title: "Rate lock planning before closing",
              body: "The smiling driver image is used here for the lock-rate note and supports payment certainty and timing decisions.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(415) 234-5678",
          company: "Acme Corp",
          zipCode: "94105",
        },
        cards: [
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Predictable",
            title: "30-Year Fixed Mortgage",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "RATE", value: "6.50%" }, { label: "APR", value: "6.65%" }],
            features: [
              "Predictable monthly payments",
              "First-time buyer grants available",
              "Lock your rate for 60 days",
              "Dedicated loan officer",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Fast Equity",
            title: "15-Year Fixed Mortgage",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "RATE", value: "5.99%" }, { label: "APR", value: "6.15%" }],
            features: [
              "Build equity twice as fast",
              "Lower interest rate",
              "Save thousands in total interest",
              "Fast-track closing",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Flexible",
            title: "5/1 ARM",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "INITIAL RATE", value: "5.75%" }, { label: "APR", value: "6.85%" }],
            features: [
              "Lowest initial payment",
              "Fixed for the first 5 years",
              "Ideal if you plan to move soon",
              "No prepayment penalties",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      creditCard: {
        name: "Credit Card Match",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479242/1a-blogposts-When-Refinancing-an-Auto-Loan-Makes-Sense_yc7s9g.jpg",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472577/young-woman-laptop-home_padiak.jpg",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201707/Sixty-and-Me_How-to-Live-in-Luxury-in-Retirement_-No-Matter-Your-Budget_xcg3ws.jpg",
        },
        vanillaHeroTitle: "Rewarding your everyday.",
        vanillaHeroSubtext:
          "From cash back to travel perks, find the card that fits your lifestyle and maximizes your spending.",
        userIntentString: "I travel frequently and want a new rewards credit card.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three cards that often fit travel-heavy spend—compare perks and fees, then continue with a specialist.",
        adaptiveOverlayTitle: "Cards matched to your spend",
        adaptiveOverlaySubtitle:
          "Compare travel rewards, flat cash back, and premium benefits—then continue in chat or with a specialist.",
        adaptiveFooterNote: "Retail Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can finalize your request.",
        homeMarketInsights: {
          sectionSubtitle:
            "Credit and borrowing insights.",
          cards: [
            {
              eyebrow: "Auto lending",
              title: "Auto loan options and pre-approval basics",
              body: "The driver-with-keys image supports this topic on loan setup, term choices, and purchase readiness.",
            },
            {
              eyebrow: "Auto refinancing",
              title: "When refinancing an auto loan can help",
              body: "The auto-refinance article image matches this topic on rate review and payment reduction opportunities.",
            },
            {
              eyebrow: "Student loans",
              title: "Student loan consolidation and monthly payment relief",
              body: "The young professional phone image supports this consolidation topic and repayment simplification.",
            },
          ],
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Travel rewards",
              title: "Travel rewards card fit for frequent trips",
              body: "The travel card image supports this topic on annual fee value, miles structure, and redemption flexibility.",
            },
            {
              eyebrow: "Everyday spend",
              title: "Everyday spend patterns that build rewards",
              body: "The coffee shop checkout image matches this topic on routine spend, statement credits, and reward accumulation.",
            },
            {
              eyebrow: "Lifestyle planning",
              title: "Premium card perks and long-term lifestyle goals",
              body: "The older couple on a yacht image supports this topic on premium benefits and retirement travel priorities.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(415) 234-5678",
          company: "Acme Corp",
          zipCode: "94105",
        },
        cards: [
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Best Match",
            title: "Premium Travel Rewards",
            iconClass: "fa-plane",
            iconBgClass: "bg-sky-50",
            metrics: [
              { label: "ANNUAL FEE", value: "$95" },
              { label: "SIGN-UP BONUS", value: "50k Miles" },
            ],
            features: [
              "3x miles on flights and hotels",
              "Complimentary lounge access",
              "No foreign transaction fees",
              "TSA PreCheck statement credit",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "No Fee",
            title: "Cash Back Plus",
            iconClass: "fa-credit-card",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [
              { label: "ANNUAL FEE", value: "$0" },
              { label: "CASH BACK", value: "2% Flat" },
            ],
            features: [
              "2% cash back on all purchases",
              "0% Intro APR for 15 months",
              "No category tracking required",
              "Zero fraud liability",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Luxury",
            title: "Platinum Reserve",
            iconClass: "fa-gem",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [
              { label: "ANNUAL FEE", value: "$450" },
              { label: "SIGN-UP BONUS", value: "100k Miles" },
            ],
            features: [
              "5x miles on flights and dining",
              "$300 annual travel credit",
              "Global Entry fee credit",
              "24/7 Premium Concierge",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      mortgageRefi: {
        name: "Mortgage Refinance",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479639/exterior-cape-cod-house-mem-interiors-pc-r-brad-knipstein_d4kp5r.webp",
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472577/young-woman-laptop-home_padiak.jpg",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201707/Sixty-and-Me_How-to-Live-in-Luxury-in-Retirement_-No-Matter-Your-Budget_xcg3ws.jpg",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479544/1-JacobWackerhausen-417d5105246c4947bc3cad2a961af80a_j8cfgh.jpg",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
        },
        vanillaHeroTitle: "Optimize your mortgage strategy",
        vanillaHeroSubtext:
          "Take advantage of changing rates to lower your monthly payment, pay off your loan faster, or get cash out for renovations.",
        userIntentString: "Rates are dropping and I want to refinance my mortgage.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Great timing! Based on your current home equity and loan balance, I've run three different refinance scenarios for you to compare.",
        adaptiveOverlayTitle: "Refinance options for your home",
        adaptiveOverlaySubtitle:
          "Compare payment reduction, faster payoff, and cash-out structures with a mortgage specialist.",
        adaptiveFooterNote: "Retail Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can finalize your request.",
        homeMarketInsights: {
          sectionSubtitle:
            "Refinancing and financial planning resources.",
          cards: [
            {
              eyebrow: "Savings habits",
              title: "Daily spending habits and long-term savings progress",
              body: "The coffee shop image supports this topic on budgeting behavior and building savings over time.",
            },
            {
              eyebrow: "Retirement planning",
              title: "Retirement lifestyle planning and income confidence",
              body: "The older couple on a yacht image matches this topic on retirement goals and future income planning.",
            },
            {
              eyebrow: "Student loan consolidation",
              title: "Consolidation strategies for simpler repayment",
              body: "The young professional phone image supports this topic on combining loans and managing monthly payments.",
            },
          ],
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Mortgage rates",
              title: "Mortgage rate trends and refinance timing",
              body: "The mortgage-rates article image supports this topic on timing a refinance and comparing payment outcomes.",
            },
            {
              eyebrow: "Rate lock",
              title: "Rate lock planning for stable monthly payments",
              body: "The family-at-home image matches this lock-rate topic focused on payment stability and closing readiness.",
            },
            {
              eyebrow: "Credit strategy",
              title: "Credit card debt and refinance tradeoffs",
              body: "The credit card image supports this topic on debt structure, consolidation choices, and total borrowing cost.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(415) 234-5678",
          company: "Acme Corp",
          zipCode: "94105",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Lowest Payment",
            title: "30-Year Fixed Refi",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "RATE", value: "5.50%" }, { label: "APR", value: "5.65%" }],
            features: [
              "Drop your monthly payment",
              "Improve monthly cash flow",
              "No prepayment penalty",
              "Escrow management included",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Best Value",
            title: "15-Year Fixed Refi",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "RATE", value: "4.99%" }, { label: "APR", value: "5.15%" }],
            features: [
              "Pay off your home faster",
              "Save thousands in total interest",
              "Build equity rapidly",
              "Dedicated closing team",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Liquidity",
            title: "Cash-Out Refinance",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "RATE", value: "5.85%" }, { label: "CASH OUT", value: "Up to $50k" }],
            features: [
              "Fund home improvements",
              "Consolidate high-interest debt",
              "Leverage existing home equity",
              "Potential tax deductions",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      homeEquity: {
        name: "Home Equity (HELOC)",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472577/young-woman-laptop-home_padiak.jpg",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479072/young-couple-renovating-home-and-dancing-in-living-room-EIF03304_wzfeup.jpg",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478992/AdobeStock_300463851-scaled_v86hcy.jpg",
        },
        vanillaHeroTitle: "Invest in your home's future.",
        vanillaHeroSubtext:
          "Leverage your home's equity to fund renovations, consolidate debt, or cover major life expenses with flexible borrowing options.",
        userIntentString: "I want to remodel my kitchen and need to tap into my home equity.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "A kitchen remodel is a fantastic investment! Based on your current estimated home value, I've pulled three different ways you can leverage your equity.",
        adaptiveOverlayTitle: "Ways to use your home equity",
        adaptiveOverlaySubtitle:
          "Compare a revolving line, a fixed lump-sum loan, and cash-out refinance with a home lending specialist.",
        adaptiveFooterNote: "Retail Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can finalize your request.",
        homeMarketInsights: {
          sectionSubtitle:
            "Home equity and savings strategies.",
          cards: [
            {
              eyebrow: "Retirement planning",
              title: "Retirement planning across generations",
              body: "The grandparent reading with grandkids image supports this topic on long-term family financial planning.",
            },
            {
              eyebrow: "Student loans",
              title: "Consolidation options for monthly payment relief",
              body: "The young professional phone image matches this student loan consolidation topic and repayment planning.",
            },
            {
              eyebrow: "Savings habits",
              title: "Everyday savings behaviors that support larger goals",
              body: "The coffee shop image supports this topic on routine spending choices and steady savings progress.",
            },
          ],
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Home repair",
              title: "Using a HELOC for renovation and repair projects",
              body: "The renovating-couple image supports this topic on project funding, staged draws, and repayment planning.",
            },
            {
              eyebrow: "Credit cards",
              title: "How card usage affects household borrowing strategy",
              body: "The travel credit card image matches this topic on card balances, rates, and total monthly debt planning.",
            },
            {
              eyebrow: "Rate planning",
              title: "Locking rates before larger home upgrade spend",
              body: "The kitchen renovation couple image supports this note on rate timing before major improvement costs.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(415) 234-5678",
          company: "Acme Corp",
          zipCode: "94105",
        },
        cards: [
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Flexible",
            title: "Home Equity Line of Credit",
            iconClass: "fa-chart-line",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "RATE", value: "7.25%" }, { label: "LINE", value: "Up to $100k" }],
            features: [
              "Draw funds only as you need them",
              "Pay interest only on what you use",
              "Reusable credit line",
              "Variable interest rate",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Predictable",
            title: "Fixed Home Equity Loan",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "RATE", value: "6.99%" }, { label: "TERM", value: "15 Years" }],
            features: [
              "Receive a lump sum upfront",
              "Fixed monthly payments",
              "Ideal for one-time large projects",
              "Fixed interest rate",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Consolidated",
            title: "Cash-Out Refinance",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "RATE", value: "5.85%" }, { label: "CASH OUT", value: "Up to $75k" }],
            features: [
              "Replace your existing mortgage",
              "Potentially lower your primary rate",
              "One single monthly payment",
              "Maximize your borrowing power",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      depositCapture: {
        name: "Deposit Capture / High-Yield",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479329/shutterstock_1107968786_vagxeh.jpg",
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479072/young-couple-renovating-home-and-dancing-in-living-room-EIF03304_wzfeup.jpg",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479720/quarters-stacked-on-a-table-and-a-jar-with-a-growing-sprout_dgntpn.jpg",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472577/young-woman-laptop-home_padiak.jpg",
        },
        vanillaHeroTitle: "Make your money work harder.",
        vanillaHeroSubtext:
          "Grow your savings with industry-leading rates on high-yield accounts and certificates of deposit designed for your timeline.",
        userIntentString: "I have $50k sitting in a standard checking account and want to earn more interest.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "You should absolutely be earning a yield on that balance. Here are three secure options to maximize your return while maintaining the liquidity you need.",
        adaptiveOverlayTitle: "Savings and CD options",
        adaptiveOverlaySubtitle:
          "Compare high-yield savings, a short-term CD, and a money market tier—then continue with a specialist.",
        adaptiveFooterNote: "Retail Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can finalize your request.",
        homeMarketInsights: {
          sectionSubtitle:
            "Savings and financial education.",
          cards: [
            {
              eyebrow: "Travel rewards",
              title: "Travel credit card product highlights",
              body: "The travel card and beach image supports this topic on rewards features and card fit by spending style.",
            },
            {
              eyebrow: "Home equity",
              title: "HELOC and home repair funding basics",
              body: "The home renovation image matches this topic on repair planning and flexible borrowing options.",
            },
            {
              eyebrow: "Auto lending",
              title: "Auto loan pre-approval and borrowing setup",
              body: "The driver-with-keys image supports this topic on pre-approval steps and loan structure choices.",
            },
          ],
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Savings rates",
              title: "Savings rates and account growth basics",
              body: "The growing money image supports this topic on APY, balance growth, and account selection.",
            },
            {
              eyebrow: "Long-term goals",
              title: "Connecting current savings to retirement goals",
              body: "The grandparent reading image matches this topic on linking short-term savings with long-term retirement planning.",
            },
            {
              eyebrow: "Everyday habits",
              title: "Daily spending habits that support savings",
              body: "The coffee shop checkout image supports this topic on routine behavior, transfer habits, and steady progress.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(415) 234-5678",
          company: "Acme Corp",
          zipCode: "94105",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Liquid",
            title: "High-Yield Savings",
            iconClass: "fa-piggy-bank",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "APY", value: "4.35%" }, { label: "MINIMUM", value: "$0" }],
            features: [
              "Total liquidity and easy transfers",
              "No monthly maintenance fees",
              "FDIC insured up to $250k",
              "Interest compounded daily",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Highest Rate",
            title: "6-Month CD",
            iconClass: "fa-certificate",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "APY", value: "5.10%" }, { label: "TERM", value: "6 Months" }],
            features: [
              "Lock in our highest guaranteed rate",
              "Short-term commitment",
              "No market risk",
              "Automatic renewal options",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Balanced",
            title: "Premium Money Market",
            iconClass: "fa-money-bill-wave",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "APY", value: "4.50%" }, { label: "MINIMUM", value: "$25k" }],
            features: [
              "Check-writing privileges",
              "Debit card access",
              "Tiered interest rates",
              "Perfect for emergency funds",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      studentLoanRefi: {
        name: "Student Loan Refinance",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479781/Loans_How_to_refinance_your_student_loans_in_5_steps_fosnuh.jpg",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231949/grow-small-business-1346252956_u9fcye.webp",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479140/GettyImages-2194268868_Feature-Single-R_zmffb8.webp",
        },
        vanillaHeroTitle: "Simplify your student debt.",
        vanillaHeroSubtext:
          "Lower your interest rate and combine multiple student loans into one easy monthly payment so you can reach your goals faster.",
        userIntentString: "I want to consolidate my student loans to lower my monthly payment.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three refinance structures to compare—starting rates; a specialist walks through eligibility and savings.",
        adaptiveOverlayTitle: "Student loan refinance options",
        adaptiveOverlaySubtitle:
          "Compare shorter fixed terms, balanced repayment, and variable-rate paths with a lending specialist.",
        adaptiveFooterNote: "Retail Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can finalize your request.",
        homeMarketInsights: {
          sectionSubtitle:
            "Debt management and lifestyle finance.",
          cards: [
            {
              eyebrow: "Travel rewards",
              title: "Travel credit card value and redemption planning",
              body: "The beach travel card image supports this topic on reward design and card value by travel frequency.",
            },
            {
              eyebrow: "Retirement",
              title: "Retirement planning through a family lens",
              body: "The grandparent reading image matches this topic on long-term planning and household priorities.",
            },
            {
              eyebrow: "Auto lending",
              title: "Auto loan planning before major purchases",
              body: "The driver-with-keys image supports this topic on loan setup, payment structure, and purchase timing.",
            },
          ],
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Refinance strategy",
              title: "Student loan refinance steps and calculator planning",
              body: "The student loan calculator image supports this topic on term comparison, rates, and projected payment changes.",
            },
            {
              eyebrow: "Career growth",
              title: "Balancing loan repayment with small business goals",
              body: "The woman opening her business image matches this cross-sell topic on cash flow choices during growth.",
            },
            {
              eyebrow: "Student life",
              title: "Repayment planning for recent graduates",
              body: "The students in a coffee shop image supports this topic on payment flexibility and early-career budget stability.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(415) 234-5678",
          company: "Acme Corp",
          zipCode: "94105",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Fast Payoff",
            title: "5-Year Fixed",
            iconClass: "fa-graduation-cap",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "APR", value: "4.99%" }, { label: "TERM", value: "60 Mo" }],
            features: [
              "Lowest interest rate available",
              "Get out of debt faster",
              "Fixed predictable payments",
              "0.25% AutoPay discount",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Best Match",
            title: "10-Year Fixed",
            iconClass: "fa-graduation-cap",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "APR", value: "5.50%" }, { label: "TERM", value: "120 Mo" }],
            features: [
              "Balanced monthly payments",
              "Standard repayment timeline",
              "Consolidate federal and private",
              "No origination fees",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Flexible",
            title: "7-Year Variable",
            iconClass: "fa-graduation-cap",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "EST. APR", value: "4.75%" }, { label: "CAP", value: "8.95%" }],
            features: [
              "Lower starting interest rate",
              "Rate capped for your protection",
              "Ideal if paying off aggressively",
              "Release co-signer after 24 months",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
    },
    warmInsights: [
      {
        image:
          "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Saving",
        title: "Build savings habits that stick",
        body: "Automatic transfers, clear goals, and the right account mix make progress steady—small steps beat an all-or-nothing approach.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Credit cards",
        title: "Choose rewards that match how you spend",
        body: "Travel points, cash back, or a low-rate card each fit different habits. Comparing fees and perks helps you earn more on purchases you already make.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Investing",
        title: "How to think about IRA investments",
        body: "Time horizon, diversification, and comfort with volatility usually matter more than timing the market—a disciplined plan supports long-term goals.",
      },
    ],
  },
  commercialBanking: {
    coldHeroEyebrow: "Business banking reimagined",
    coldHeroHeading: "Enterprise lending, treasury, and advisory—all in one platform.",
    coldHeroParagraph1: "From credit facilities and cash management to international expansion, ${brandName} partners with growing businesses.",
    coldHeroParagraph2: "Complex needs. Clear solutions. Explore how ${brandName} Commercial Banking brings efficiency to corporate finance.",
    homepageCtaText: "View Lending Solutions",
    homeMarketInsights: {
      sectionSubtitle:
        "Themes for treasury, credit, and risk—informational only, not advice.",
      cards: [
        {
          eyebrow: "Cash management",
          title: "Liquidity that supports growth",
          body: "Clear visibility into receivables, payables, and idle balances helps finance teams fund payroll and capex without over-relying on emergency draws.",
        },
        {
          eyebrow: "Credit",
          title: "Term debt vs. a revolving line",
          body: "Match the facility to the use case: term loans for long-lived assets, lines for seasonal working capital—so pricing and covenants fit how cash actually moves.",
        },
        {
          eyebrow: "Risk",
          title: "Insurance as part of the balance sheet",
          body: "Property, liability, and specialty coverages can protect earnings when operations scale—worth revisiting as revenue mix and vendors change.",
        },
      ],
    },
    categoryPage: {
      heroBgImage:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=80",
      catHeroTitle: "Enterprise Commercial Banking",
      catHeroSubtitle: "Strategic treasury and lending solutions to scale your operations.",
      marketInsightsIntro:
        "Practical perspectives for finance and operations leaders. For guidance tailored to ${company}, continue in chat with Penny—your ${brandName} assistant.",
      services: [
        {
          iconClass: "fa-money-bill-transfer",
          title: "Treasury Management",
          description: "Optimize liquidity with advanced receivables and payables",
        },
        {
          iconClass: "fa-handshake",
          title: "Commercial Lending",
          description: "Lines of credit and equipment financing",
        },
        {
          iconClass: "fa-chart-line",
          title: "Capital Markets",
          description: "Syndications, FX, and interest rate risk management",
        },
      ],
      whyChooseUsTitle: "Dedicated Industry Expertise",
      whyChooseUsText:
        "You aren't just getting a bank; you are getting a strategic partner. Our relationship managers specialize in your exact vertical, from manufacturing to healthcare.",
      whyChooseUsImage:
        "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1200&q=80",
      article1Title: "Interest rates and middle-market borrowing: what to watch",
      article2Title: "Fraud prevention: why positive pay still matters",
    },
    useCases: {
      treasuryServices: {
        name: "Treasury & cash management",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482481/What-is-Treasury-Management_ygnigo.jpg",
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481597/20190731_WeWork_SonyCenter_Berlin_008_v1_gbyy1w.webp",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481684/istockphoto-658610090-612x612_gxlzth.jpg",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481868/360_F_283437738_PUdyvxvDJcvplpRu587FYqz9cyrH1IUG_gjk00t.jpg",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482046/managersbusiness_ntnvs5.jpg",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482724/calculator-1516869_1920_ipeyrd.webp",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774483257/Zz1kNGM2Yjk2NDNmNzcxMWVkYTgwZDkyZTAzNTEyNDM1Mw_c0icrz.png",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482228/SOSB0324009_1560x880_desktop_vpn0nd.jpg",
        },
        vanillaHeroTitle: "Cash flow you can see and steer.",
        vanillaHeroSubtext:
          "Payables, receivables, and liquidity tools that help small businesses fund payroll, vendors, and growth with fewer surprises.",
        userIntentString: "I want better payables, receivables, and cash visibility for my business.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three treasury starting points many small businesses review with their relationship team—compare flows, then continue in chat.",
        adaptiveOverlayTitle: "Treasury & cash management options",
        adaptiveOverlaySubtitle:
          "Review payables, receivables, and liquidity snapshots below, then connect with a specialist for your workflow.",
        adaptiveFooterNote: "Commercial Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details for a specialist callback.",
        homeMarketInsights: {
          sectionSubtitle:
            "Treasury and operations insights.",
          cards: [
            {
              eyebrow: "Corporate cards",
              title: "Corporate card controls for client and travel spend",
              body: "The image of a business dinner payment supports this card-focused topic: spend visibility, policy controls, and reconciliation discipline.",
            },
            {
              eyebrow: "Commercial real estate",
              title: "Financing and cash planning for commercial property needs",
              body: "The modern office building visual reflects this CRE theme and highlights how property costs affect liquidity planning.",
            },
            {
              eyebrow: "Treasury operations",
              title: "How finance managers use dashboards to monitor cash position",
              body: "The manager-at-laptop image supports this treasury operations topic: daily visibility across balances, inflows, and outflows.",
            },
          ],
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Working capital",
              title: "Working capital planning in practice",
              body: "The close-up of a spreadsheet and calculator supports this working-capital note: tighten forecasting, payment timing, and liquidity planning.",
            },
            {
              eyebrow: "Payments",
              title: "ACH transfers with stronger controls",
              body: "The digital money-transfer graphic matches your ACH guide note and reinforces setup, approval routing, and reconciliation controls.",
            },
            {
              eyebrow: "Growth",
              title: "Treasury support for growth moments",
              body: "The image of two executives shaking hands reflects your business-growth note and highlights treasury readiness for expansion decisions.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(617) 555-0140",
          company: "Acme Corp",
          zipCode: "02110",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Payables",
            title: "Business Payables Hub",
            iconClass: "fa-money-bill-transfer",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "CHANNELS", value: "ACH + wire" }, { label: "CONTROLS", value: "Dual approval" }],
            features: [
              "Centralize vendor payments",
              "Positive pay for checks",
              "Scheduled releases",
              "Audit-friendly reporting",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Receivables",
            title: "Receivables Acceleration",
            iconClass: "fa-arrow-trend-up",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "DEPOSITS", value: "Same day" }, { label: "MATCHING", value: "Auto" }],
            features: [
              "Faster deposit posting",
              "Remittance detail capture",
              "Receivables reporting",
              "Works with common accounting tools",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Liquidity",
            title: "Liquidity & reporting snapshot",
            iconClass: "fa-chart-line",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "VIEW", value: "Multi-acct" }, { label: "ALERTS", value: "Configurable" }],
            features: [
              "Cash position visibility",
              "Forecast-friendly exports",
              "Fraud monitoring hooks",
              "Scales as accounts grow",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      smallBusinessTermLoan: {
        name: "Small business term loan",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231949/grow-small-business-1346252956_u9fcye.webp",
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481597/20190731_WeWork_SonyCenter_Berlin_008_v1_gbyy1w.webp",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481868/360_F_283437738_PUdyvxvDJcvplpRu587FYqz9cyrH1IUG_gjk00t.jpg",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482228/SOSB0324009_1560x880_desktop_vpn0nd.jpg",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481684/istockphoto-658610090-612x612_gxlzth.jpg",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482800/AdobeStock_83752801-700x467_uih0vk.jpg",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482046/managersbusiness_ntnvs5.jpg",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482925/industrial-oven_ywbhrr.jpg",
        },
        vanillaHeroTitle: "Borrow for the next chapter of your business.",
        vanillaHeroSubtext:
          "Fixed-term financing can fund expansion, equipment, or one-time needs with predictable payments—your team can help size the right structure.",
        userIntentString: "I need a small business term loan for expansion.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Below are three illustrative term structures to compare—rates and terms are illustrative; discuss specifics with lending.",
        adaptiveOverlayTitle: "Term loan structures to review",
        adaptiveOverlaySubtitle:
          "Compare shorter payoff, balanced term, and longer amortization—then continue with your relationship manager.",
        adaptiveFooterNote: "Commercial Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details for a specialist callback.",
        homeMarketInsights: {
          sectionSubtitle:
            "Business lending resources.",
          cards: [
            {
              eyebrow: "Commercial real estate",
              title: "Commercial property expansion and term-loan fit",
              body: "The office-building image supports this expansion topic by framing how term debt can align with longer-lived property investments.",
            },
            {
              eyebrow: "Business growth",
              title: "Growth planning through partnership and capital access",
              body: "The executive handshake visual reflects your growth note and introduces financing as a tool for expansion planning.",
            },
            {
              eyebrow: "Corporate cards",
              title: "Managing card-based operating expenses while scaling",
              body: "The business payment image supports this topic by connecting spend controls to broader borrowing and cash-flow planning.",
            },
          ],
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Loan readiness",
              title: "First business loan readiness checklist",
              body: "The step-by-step document visual aligns to your '5 steps' note and frames documentation and underwriting preparation clearly.",
            },
            {
              eyebrow: "Operations",
              title: "Operating discipline after funding",
              body: "The business manager smiling at a laptop mirrors your note and supports a conversation about tracking performance after capital is deployed.",
            },
            {
              eyebrow: "Expansion",
              title: "Expansion capital in action",
              body: "The bakery owner showing a new commercial oven matches your success-story note and illustrates capital tied to visible capacity upgrades.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(617) 555-0140",
          company: "Acme Corp",
          zipCode: "02110",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Faster payoff",
            title: "36-Month Term Loan",
            iconClass: "fa-handshake",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "PAYMENT", value: "Higher" }, { label: "INTEREST", value: "Lower total" }],
            features: [
              "Retire debt sooner",
              "Less total interest vs longer terms",
              "Good for near-term projects",
              "Fixed payment schedule",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Balanced",
            title: "60-Month Term Loan",
            iconClass: "fa-handshake",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "PAYMENT", value: "Moderate" }, { label: "STRUCTURE", value: "Fixed" }],
            features: [
              "Balanced monthly cash flow",
              "Suited to expansion or refinance",
              "Dedicated closing support",
              "Covenant discussion with your team",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Lower payment",
            title: "84-Month Term Loan",
            iconClass: "fa-handshake",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "PAYMENT", value: "Lower" }, { label: "USE CASE", value: "Capex" }],
            features: [
              "Smaller monthly obligation",
              "Pairs with longer-lived assets",
              "Preserves near-term liquidity",
              "Subject to credit approval",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      businessLineOfCredit: {
        name: "Business line of credit",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482364/istockphoto-1304746031-612x612_ccrxbd.jpg",
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481597/20190731_WeWork_SonyCenter_Berlin_008_v1_gbyy1w.webp",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482046/managersbusiness_ntnvs5.jpg",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481684/istockphoto-658610090-612x612_gxlzth.jpg",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481868/360_F_283437738_PUdyvxvDJcvplpRu587FYqz9cyrH1IUG_gjk00t.jpg",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482228/SOSB0324009_1560x880_desktop_vpn0nd.jpg",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774483106/what-is-a-small-business-loan-sba-7a-504-live-oak-bank-blog_eodueq.webp",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774483004/farmer-using-laptop-in-the-farm-business-NQQUMHA-1024x688_vaerve.jpg",
        },
        vanillaHeroTitle: "Flexible credit for everyday operations.",
        vanillaHeroSubtext:
          "A revolving line helps cover payroll, inventory, and seasonal swings—you draw when you need it and pay interest on what you use.",
        userIntentString: "I need a business line of credit for working capital.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three line-of-credit profiles to compare—limits and pricing are illustrative for your lending conversation.",
        adaptiveOverlayTitle: "Line of credit options",
        adaptiveOverlaySubtitle:
          "Compare capacity, access, and covenant posture with your relationship team.",
        adaptiveFooterNote: "Commercial Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details for a specialist callback.",
        homeMarketInsights: {
          sectionSubtitle:
            "Working capital management.",
          cards: [
            {
              eyebrow: "Business operations",
              title: "Cash oversight for day-to-day operating decisions",
              body: "The manager-at-laptop image supports this operations note: balancing payables, receivables, and near-term liquidity needs.",
            },
            {
              eyebrow: "Corporate cards",
              title: "Card spend governance as part of working-capital management",
              body: "The payment-at-dinner visual reflects this control topic and highlights policy, approvals, and expense visibility.",
            },
            {
              eyebrow: "Commercial real estate",
              title: "Property commitments and their impact on credit capacity",
              body: "The office-building image supports this planning theme by linking occupancy costs with line-of-credit flexibility.",
            },
          ],
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Growth",
              title: "Growth planning with revolving credit",
              body: "The executive handshake image reflects your growth note and supports planning line usage around expansion timing and execution.",
            },
            {
              eyebrow: "Cash flow",
              title: "Managing seasonal cash flow gaps",
              body: "The seasonal cash-flow article visual matches your note and reinforces draw timing, repayment cadence, and smoother operating cycles.",
            },
            {
              eyebrow: "Line utilization",
              title: "How to use a revolving line of credit in day-to-day operations",
              body: "The business-owner-at-laptop image aligns with your revolving-credit note and highlights practical short-term uses with disciplined paydown.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(617) 555-0140",
          company: "Acme Corp",
          zipCode: "02110",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Starter",
            title: "Secured Business Line",
            iconClass: "fa-chart-line",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "CAPACITY", value: "Up to $250k" }, { label: "ACCESS", value: "Online" }],
            features: [
              "Collateral-backed capacity",
              "Lower pricing vs unsecured",
              "Renewal subject to review",
              "Good for predictable draws",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Growth",
            title: "Revolving Operating Line",
            iconClass: "fa-chart-line",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "CAPACITY", value: "Up to $750k" }, { label: "ACCESS", value: "Same-day" }],
            features: [
              "Revolving capacity for payroll",
              "Cash sweep integration",
              "Interest on outstanding balance only",
              "Covenant package tailored in underwriting",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Scale",
            title: "Asset-Based Line",
            iconClass: "fa-chart-line",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "CAPACITY", value: "Formula" }, { label: "COLLATERAL", value: "A/R" }],
            features: [
              "Borrowing base tied to receivables",
              "Supports faster growth cycles",
              "Monitoring and reporting cadence",
              "Specialist onboarding",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      equipmentFinance: {
        name: "Business equipment financing",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482562/HanmiBank-Equipment-Leasing_pgktwd.jpg",
          coldHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481597/20190731_WeWork_SonyCenter_Berlin_008_v1_gbyy1w.webp",
          insight1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482228/SOSB0324009_1560x880_desktop_vpn0nd.jpg",
          insight2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482046/managersbusiness_ntnvs5.jpg",
          insight3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481684/istockphoto-658610090-612x612_gxlzth.jpg",
          warmTile1:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482605/29307149891_b1b36235fb_b_pbmuvy.jpg",
          warmTile2:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774483177/what-is-equipment-leasing_j6b3db.jpg",
          warmTile3:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481868/360_F_283437738_PUdyvxvDJcvplpRu587FYqz9cyrH1IUG_gjk00t.jpg",
        },
        vanillaHeroTitle: "Equip your business without draining cash.",
        vanillaHeroSubtext:
          "Finance vehicles, machinery, or technology with structures aligned to how long the asset serves your operations.",
        userIntentString: "I need financing for business equipment or vehicles.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three equipment financing starting points to review—starting terms; your specialist can match structure to asset life.",
        adaptiveOverlayTitle: "Equipment financing options",
        adaptiveOverlaySubtitle:
          "Compare standard, accelerated, and flexible structures with your lending team.",
        adaptiveFooterNote: "Commercial Banking · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details for a specialist callback.",
        homeMarketInsights: {
          sectionSubtitle:
            "Equipment financing and capital planning.",
          cards: [
            {
              eyebrow: "Business growth",
              title: "Expansion timing and equipment investment priorities",
              body: "The executive handshake visual supports this growth note and frames equipment financing as part of broader scaling plans.",
            },
            {
              eyebrow: "Operations",
              title: "Operational readiness before major equipment purchases",
              body: "The manager-at-laptop image reflects this planning topic: cash visibility, utilization forecasts, and implementation sequencing.",
            },
            {
              eyebrow: "Corporate cards",
              title: "Short-term spend controls around capital projects",
              body: "The business payment image supports this controls topic and highlights card policy discipline during project rollouts.",
            },
          ],
        },
        warmMarketInsights: {
          cards: [
            {
              eyebrow: "Tax strategy",
              title: "Section 179 deduction considerations for heavy machinery",
              body: "The tractor-in-field image directly reflects your Section 179 note and supports timing and eligibility discussions with tax advisors.",
            },
            {
              eyebrow: "Structure",
              title: "Lease versus buy equipment analysis",
              body: "The lease-versus-buy analysis visual matches your note and supports a clear comparison of ownership, flexibility, and lifecycle cost.",
            },
            {
              eyebrow: "Asset planning",
              title: "Equipment financing in the context of broader facilities planning",
              body: "The modern office-building image ties to your commercial real-estate note and connects equipment decisions to broader capital planning.",
            },
          ],
        },
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(617) 555-0140",
          company: "Acme Corp",
          zipCode: "02110",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Capex",
            title: "Equipment term financing",
            iconClass: "fa-truck",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "FINANCING", value: "Up to 100%" }, { label: "TERMS", value: "Flexible" }],
            features: [
              "Preserve working capital",
              "Bundle equipment and soft costs",
              "Scheduled draws",
              "Amortization aligned to asset life",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Vehicles",
            title: "Fleet & vehicle program",
            iconClass: "fa-truck",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "STRUCTURE", value: "Fixed" }, { label: "TITLE", value: "Lien" }],
            features: [
              "Multiple unit scheduling",
              "End-of-term options to discuss",
              "Insurance requirements apply",
              "Relationship manager coordination",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Tech",
            title: "Technology & machinery lease-style",
            iconClass: "fa-cogs",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "UPGRADE", value: "Optional" }, { label: "TERM", value: "36–60 mo" }],
            features: [
              "Technology refresh flexibility",
              "Predictable payments",
              "End-of-term choices",
              "Rates subject to approval",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
    },
    warmInsights: [
      {
        image:
          "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Cash management",
        title: "Liquidity that supports growth",
        body: "Clear visibility into receivables, payables, and idle balances helps finance teams fund payroll and capex without over-relying on emergency draws.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Credit",
        title: "Term debt vs. a revolving line",
        body: "Match the facility to the use case: term loans for long-lived assets, lines for seasonal working capital—so pricing and covenants fit how cash actually moves.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Risk",
        title: "Insurance as part of the balance sheet",
        body: "Property, liability, and specialty coverages can protect earnings when operations scale—worth revisiting as revenue mix and vendors change.",
      },
    ],
  },
  wealthManagement: {
    coldHeroEyebrow: "Legacy. Growth. Peace of mind.",
    coldHeroHeading: "Private wealth strategies that evolve with you.",
    coldHeroParagraph1: "Estate planning, tax optimization, and investment management—${brandName} provides personalized guidance for high-net-worth families.",
    coldHeroParagraph2: "Your goals, your timeline, your legacy. See how ${brandName} Wealth Management helps protect and grow what matters most.",
    homepageCtaText: "Explore Wealth Strategies",
    homeMarketInsights: {
      sectionSubtitle:
        "Planning-focused perspectives for families and business owners—informational only.",
      cards: [
        {
          eyebrow: "Planning",
          title: "Financial planning fundamentals to revisit each year",
          body: "Goals, cash flow, and risk tolerance should stay in sync as life changes—regular check-ins beat a set-and-forget plan.",
        },
        {
          eyebrow: "Retirement",
          title: "Balancing growth and income before major milestones",
          body: "As timelines shorten, many investors shift toward steadier income and tax-aware withdrawals—without abandoning growth entirely.",
        },
        {
          eyebrow: "Legacy",
          title: "Estate and trust topics worth discussing early",
          body: "Clarity on titles, beneficiaries, and successor roles can prevent surprises for heirs and simplify coordination with your advisory team.",
        },
      ],
    },
    categoryPage: {
      heroBgImage:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=2400&q=80",
      catHeroTitle: "Private Wealth Services",
      catHeroSubtitle: "Protecting your legacy and optimizing your financial future.",
      marketInsightsIntro:
        "Ideas spanning planning, retirement, and legacy. When you want a personalized view, continue in chat with Penny—your ${brandName} assistant.",
      services: [
        {
          iconClass: "fa-chart-pie",
          title: "Investment Management",
          description: "Discretionary portfolios and alternative assets",
        },
        {
          iconClass: "fa-scroll",
          title: "Trust & Estate",
          description: "Multi-generational wealth transfer structuring",
        },
        {
          iconClass: "fa-calculator",
          title: "Tax Optimization",
          description: "Tax-loss harvesting and philanthropic planning",
        },
      ],
      whyChooseUsTitle: "A Fiduciary Standard of Care",
      whyChooseUsText:
        "We operate with complete transparency. Our advisory teams act strictly as fiduciaries, ensuring every recommendation is made solely in your best interest, free from proprietary conflicts.",
      whyChooseUsImage:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
      article1Title: "Estate tax changes on the horizon: planning conversations to start now",
      article2Title: "Private markets in a diversified portfolio: fit and trade-offs",
    },
    useCases: {
      retirementPlanning: {
        name: "Retirement planning",
        heroAssets: {
          warmHero:
            "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1600&q=80",
          coldHero:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1554200876-56c2f25224d81?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Retirement on your terms, step by step.",
        vanillaHeroSubtext:
          "Savings rate, tax-aware accounts, and drawdown timing work best when they match your horizon—your advisor can help stress-test the plan.",
        userIntentString: "I want help planning for retirement.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three retirement planning starting points to review with your advisor—these are starting points for discussion.",
        adaptiveOverlayTitle: "Retirement planning paths",
        adaptiveOverlaySubtitle:
          "Compare accumulation focus, balanced growth and income, and conservative income—then continue in chat or with your team.",
        adaptiveFooterNote: "Wealth Management · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details to schedule time with an advisor.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(212) 555-0198",
          company: "Acme Corp",
          zipCode: "10012",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Growth",
            title: "Growth-oriented glide path",
            iconClass: "fa-chart-line",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "HORIZON", value: "15+ yr" }, { label: "RISK", value: "Higher" }],
            features: [
              "Emphasis on long-term compounding",
              "Periodic rebalancing discussion",
              "Tax location awareness",
              "Rates subject to approval",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Balanced",
            title: "Balanced retirement portfolio",
            iconClass: "fa-scale-balanced",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "MIX", value: "60/40" }, { label: "REVIEW", value: "Annual" }],
            features: [
              "Growth with volatility moderation",
              "Cash-flow planning checkpoints",
              "Employer plan coordination",
              "Advisor-led adjustments",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Income",
            title: "Income-first approach",
            iconClass: "fa-piggy-bank",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "FOCUS", value: "Cash flow" }, { label: "DRAWDOWN", value: "Planned" }],
            features: [
              "Steadier distribution planning",
              "Longevity and healthcare considerations",
              "Tax-aware withdrawal order",
              "Not a product recommendation",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      educationSavings529: {
        name: "529 & education savings",
        heroAssets: {
          warmHero:
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=80",
          coldHero:
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1588072432836-1004d9785a72?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Save for school with a clear plan.",
        vanillaHeroSubtext:
          "Education accounts can pair discipline with flexibility—your advisor can explain trade-offs across account types and timelines.",
        userIntentString: "I want to start saving for a child's education.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Below are three education-savings profiles to discuss—rules vary by state and plan.",
        adaptiveOverlayTitle: "Education savings options",
        adaptiveOverlaySubtitle:
          "Compare age-based, balanced, and stable allocation illustrations with your advisor.",
        adaptiveFooterNote: "Wealth Management · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details to schedule time with an advisor.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(212) 555-0198",
          company: "Acme Corp",
          zipCode: "10012",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Long horizon",
            title: "Age-based glide path",
            iconClass: "fa-graduation-cap",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "STYLE", value: "Auto shift" }, { label: "HORIZON", value: "10+ yr" }],
            features: [
              "Equity tilt when young",
              "Gradual risk reduction",
              "Good for “set and review” savers",
              "Plan features vary—ask your advisor",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Balanced",
            title: "Balanced education portfolio",
            iconClass: "fa-graduation-cap",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "MIX", value: "Moderate" }, { label: "REVIEW", value: "Yearly" }],
            features: [
              "Stocks and bonds blend",
              "Flexible for K–12 or college goals",
              "Contribution planning conversation",
              "Rates vary by property",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Near term",
            title: "Capital preservation tilt",
            iconClass: "fa-graduation-cap",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "VOLATILITY", value: "Lower" }, { label: "USE", value: "Soon" }],
            features: [
              "Emphasis on stability near enrollment",
              "Spending flexibility discussion",
              "Gift and tax topics with counsel",
              "Not tax or legal advice",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      iraInvesting: {
        name: "IRA investments",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          coldHero:
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "IRAs that match how you save.",
        vanillaHeroSubtext:
          "Traditional and Roth trade-offs, contribution limits, and investment mix are easier to compare with a simple framework—your advisor fills in the details.",
        userIntentString: "I want to invest through an IRA.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three IRA investment approaches to review—starting points; eligibility and limits change over time.",
        adaptiveOverlayTitle: "IRA investment profiles",
        adaptiveOverlaySubtitle:
          "Compare index-oriented, actively managed, and balanced illustrations with your advisor.",
        adaptiveFooterNote: "Wealth Management · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details to schedule time with an advisor.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(212) 555-0198",
          company: "Acme Corp",
          zipCode: "10012",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Simple",
            title: "Core index allocation",
            iconClass: "fa-layer-group",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "STYLE", value: "Broad market" }, { label: "FEES", value: "0.45%" }],
            features: [
              "US and international sleeves",
              "Rebalancing discipline",
              "Straightforward reporting",
              "Not a recommendation",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Advisory",
            title: "Advisory mutual fund lineup",
            iconClass: "fa-chart-pie",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "SUPPORT", value: "Ongoing" }, { label: "MIX", value: "Diversified" }],
            features: [
              "Fund selection support",
              "Risk and goal check-ins",
              "Tax-aware placement where appropriate",
              "Demo experience",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Stability",
            title: "Conservative balanced IRA",
            iconClass: "fa-shield-halved",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "BONDS", value: "Higher %" }, { label: "VOL", value: "Lower" }],
            features: [
              "Emphasis on downside moderation",
              "Shorter horizon friendly",
              "Cash needs discussion",
              "Advisor-guided",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      estatePlanning: {
        name: "Estate & trust planning",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231728/Rollover_IRAs_qmvvmo.webp",
          coldHero:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Private wealth, disciplined planning.",
        vanillaHeroSubtext:
          "Estate, tax-aware investing, and portfolio management aligned to your objectives—your attorney and advisor should coordinate on documents and titles.",
        userIntentString: "I need help with tax optimization and estate planning.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are estate and trust topics many families review next—nothing here replaces personalized legal or tax advice.",
        adaptiveOverlayTitle: "Wealth strategies for review",
        adaptiveOverlaySubtitle:
          "Estate planning, tax optimization, and portfolio support—discuss with your advisor.",
        adaptiveFooterNote: "Wealth Management · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details to schedule time with an advisor.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(212) 555-0198",
          company: "Acme Corp",
          zipCode: "10012",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Tax",
            title: "Tax-aware planning layer",
            iconClass: "fa-calculator",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "FOCUS", value: "Coordination" }, { label: "REVIEW", value: "Annual" }],
            features: [
              "Gain and loss awareness",
              "Charitable giving timing",
              "Withholding and estimates discussion",
              "Work with your CPA",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Estate",
            title: "Revocable living trust framework",
            iconClass: "fa-scroll",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "REVIEW", value: "Annual" }, { label: "SETUP", value: "Guided" }],
            features: [
              "Pour-over will coordination",
              "Successor trustee roles",
              "Probate avoidance goals",
              "Attorney drafts documents",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Legacy",
            title: "Heir and succession clarity",
            iconClass: "fa-diagram-project",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "HORIZON", value: "Multi-gen" }, { label: "OUTPUT", value: "Summary" }],
            features: [
              "Beneficiary consistency check",
              "Family meeting talking points",
              "Business succession hooks",
              "Scenarios for discussion",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
    },
    warmInsights: [
      {
        image:
          "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Planning",
        title: "Financial planning fundamentals to revisit each year",
        body: "Goals, cash flow, and risk tolerance should stay in sync as life changes—regular check-ins beat a set-and-forget plan.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Retirement",
        title: "Balancing growth and income before major milestones",
        body: "As timelines shorten, many investors shift toward steadier income and tax-aware withdrawals—without abandoning growth entirely.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Legacy",
        title: "Estate and trust topics worth discussing early",
        body: "Clarity on titles, beneficiaries, and successor roles can prevent surprises for heirs and simplify coordination with your advisory team.",
      },
    ],
  },
  assetManagement: {
    coldHeroEyebrow: "Institutional excellence",
    coldHeroHeading: "Asset management solutions built for scale and performance.",
    coldHeroParagraph1: "From pension funds to endowments, ${brandName} delivers research-driven strategies and rigorous risk management.",
    coldHeroParagraph2: "Institutional discipline. Forward-thinking approach. Discover how ${brandName} Asset Management drives results for complex portfolios.",
    homepageCtaText: "View Institutional Funds",
    homeMarketInsights: {
      sectionSubtitle:
        "Research-led themes for institutional investors—informational only.",
      cards: [
        {
          eyebrow: "Markets",
          title: "Diversification when correlations move together",
          body: "When asset classes sync up, intentional sleeves—by region, factor, or duration—can still spread risk across scenarios, not just tickers.",
        },
        {
          eyebrow: "Process",
          title: "What fundamental research adds in noisy markets",
          body: "Disciplined underwriting and scenario analysis help teams separate narrative from cash-flow durability before sizing positions.",
        },
        {
          eyebrow: "Sustainable",
          title: "ESG integration beyond the headline score",
          body: "Materiality, engagement, and reporting standards differ widely—useful analysis focuses on what affects long-term value, not labels alone.",
        },
      ],
    },
    categoryPage: {
      heroBgImage:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2400&q=80",
      catHeroTitle: "Institutional Asset Management",
      catHeroSubtitle: "High-conviction strategies driven by fundamental research.",
      marketInsightsIntro:
        "Themes for mandates and consultants. For materials aligned to your policy, continue in chat with Penny—your ${brandName} assistant.",
      services: [
        {
          iconClass: "fa-globe",
          title: "Global Equities",
          description: "Active management across emerging and developed markets",
        },
        {
          iconClass: "fa-scale-balanced",
          title: "Fixed Income",
          description: "Core, high yield, and municipal bond strategies",
        },
        {
          iconClass: "fa-leaf",
          title: "Sustainable Investing",
          description: "Deep ESG integration and active engagement",
        },
      ],
      whyChooseUsTitle: "Proprietary Research Engine",
      whyChooseUsText:
        "Our advantage is our perspective. With over 200 analysts globally, our bottom-up research uncovers opportunities that passive strategies and algorithmic models simply miss.",
      whyChooseUsImage:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
      article1Title: "Duration and rates: stress tests for core fixed income",
      article2Title: "ESG integration and alpha: what engagement can add",
    },
    useCases: {
      globalEquitiesMandate: {
        name: "Global equities mandate",
        heroAssets: {
          warmHero:
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80",
          coldHero:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Global equities for institutional sleeves.",
        vanillaHeroSubtext:
          "Compare regional emphasis, active versus indexed approaches, and risk budgets with your consultant before sizing a mandate.",
        userIntentString: "We need global equity exposure for our plan.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Below are three global equity mandate illustrations—illustrative metrics; your consultant can align them to policy and benchmark.",
        adaptiveOverlayTitle: "Equity mandate profiles",
        adaptiveOverlaySubtitle:
          "Review developed international tilt, broad global, and emerging-markets allocation sketches.",
        adaptiveFooterNote: "Asset Management · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can send the right prospectus packet.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(312) 555-0142",
          company: "Acme Corp",
          zipCode: "60606",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Developed",
            title: "International developed sleeve",
            iconClass: "fa-globe",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "STYLE", value: "Active" }, { label: "REGION", value: "Developed Intl" }],
            features: [
              "Bottom-up stock selection story",
              "Currency policy discussion",
              "Benchmark-relative risk framing",
              "Policy-aligned positioning",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Global",
            title: "Broad global core equity",
            iconClass: "fa-globe",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "STYLE", value: "Core" }, { label: "BENCH", value: "Global benchmark" }],
            features: [
              "US and non-US blend",
              "Sector and factor controls",
              "Liquidity suited to plans",
              "Consultant due diligence",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Emerging",
            title: "Emerging markets satellite",
            iconClass: "fa-chart-line",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "ROLE", value: "Satellite" }, { label: "VOL", value: "Higher" }],
            features: [
              "Smaller policy weight typical",
              "Liquidity and capacity checks",
              "Governance considerations",
              "Not a recommendation",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      coreFixedIncomeMandate: {
        name: "Core fixed income",
        heroAssets: {
          warmHero:
            "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1600&q=80",
          coldHero:
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Fixed income that fits the liability picture.",
        vanillaHeroSubtext:
          "Core, short duration, and core-plus sketches help teams talk about credit quality, duration, and income needs with consultants.",
        userIntentString: "We need a core bond mandate for stability.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three core fixed income illustrations—yields and durations are demo placeholders for policy discussion.",
        adaptiveOverlayTitle: "Fixed income mandate profiles",
        adaptiveOverlaySubtitle:
          "Compare short government-biased, core investment grade, and core-plus sketches.",
        adaptiveFooterNote: "Asset Management · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can send the right prospectus packet.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(312) 555-0142",
          company: "Acme Corp",
          zipCode: "60606",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Stability",
            title: "Short duration government tilt",
            iconClass: "fa-scale-balanced",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "DURATION", value: "2-3 yrs" }, { label: "CREDIT", value: "Gov bias" }],
            features: [
              "Lower rate sensitivity story",
              "Liquidity emphasis",
              "Capital preservation framing",
              "Estimated metrics",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Core",
            title: "Core investment grade",
            iconClass: "fa-scale-balanced",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "DURATION", value: "Intermed." }, { label: "CREDIT", value: "IG focus" }],
            features: [
              "Corporate and government mix",
              "Benchmark-aware process",
              "Income versus volatility trade-off",
              "Consultant DD",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Plus",
            title: "Core-plus income",
            iconClass: "fa-scale-balanced",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "YIELD", value: "4.5%" }, { label: "RISK", value: "Elevated" }],
            features: [
              "Selective below-IG allowance",
              "Drawdown discussion",
              "Fits some return-seeking sleeves",
              "Not for all policies",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      sustainableInstitutional: {
        name: "Sustainable / ESG mandate",
        heroAssets: {
          warmHero:
            "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80",
          coldHero:
            "https://images.unsplash.com/photo-1497435334941-636c87ea4eda?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Sustainable mandates, clearly framed.",
        vanillaHeroSubtext:
          "ESG integration, thematic sleeves, and green-bond allocations mean different things—your consultant can map each to policy language.",
        userIntentString: "Show me sustainable investment options.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "You asked about sustainable options—here are three mandate profiles to compare with your consultant; these are starting points.",
        adaptiveOverlayTitle: "Fund profiles for your mandate",
        adaptiveOverlaySubtitle:
          "Review integrated ESG equity, real-assets climate tilt, and green-bond sleeve illustrations.",
        adaptiveFooterNote: "Asset Management · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can send the right prospectus packet.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(312) 555-0142",
          company: "Acme Corp",
          zipCode: "60606",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Equity",
            title: "Global ESG-integrated equity",
            iconClass: "fa-leaf",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "APPROACH", value: "Integration" }, { label: "REPORTING", value: "ESG" }],
            features: [
              "Materiality-focused research story",
              "Engagement where permitted",
              "Benchmark-relative risk",
              "Read prospectus before investing",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Real assets",
            title: "Climate infrastructure sleeve",
            iconClass: "fa-solar-panel",
            metrics: [
              { label: "ROLE", value: "Illiquid" },
              { label: "TERM", value: "Long" },
              { label: "FIT", value: "Satellite" },
            ],
            features: [
              "Renewables and grid themes (illustrative)",
              "Liquidity and capacity constraints",
              "Low correlation story",
              "Due diligence required",
            ],
            bundleText: "",
            ctaLabel: "View materials",
          },
          {
            recommended: false,
            smallTag: "Fixed income",
            title: "Green bond emphasis",
            iconClass: "fa-seedling",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "CREDIT", value: "IG" }, { label: "DURATION", value: "Intermed." }],
            features: [
              "Use-of-proceeds focus in selection",
              "Impact reporting varies by issuer",
              "Fits some liability-aware books",
              "Not a guarantee of impact",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      liquidityInstitutional: {
        name: "Liquidity & cash strategies",
        heroAssets: {
          warmHero:
            "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1600&q=80",
          coldHero:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Institutional liquidity, disciplined.",
        vanillaHeroSubtext:
          "Government money market, ultra-short bond, and short-duration sleeves serve different cash roles—policy and prospectuses define the details.",
        userIntentString: "We need a stable place for plan cash balances.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three liquidity sleeve illustrations—stable value and money market rules vary; review with counsel and your consultant.",
        adaptiveOverlayTitle: "Liquidity sleeve comparisons",
        adaptiveOverlaySubtitle:
          "Compare government money market, ultra-short bond, and short-duration credit sketches.",
        adaptiveFooterNote: "Asset Management · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details so we can send the right prospectus packet.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(312) 555-0142",
          company: "Acme Corp",
          zipCode: "60606",
        },
        cards: [
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Cash",
            title: "Government money market",
            iconClass: "fa-coins",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "STABILITY", value: "High" }, { label: "YIELD", value: "Modest" }],
            features: [
              "Same-day liquidity typical",
              "Rule 2a-7 style framing",
              "Fits operational cash",
              "Read fund documents",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Ultra-short",
            title: "Ultra-short bond",
            iconClass: "fa-wave-square",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "DURATION", value: "Very low" }, { label: "YIELD", value: "Step-up" }],
            features: [
              "Slightly more yield than pure cash",
              "Mark-to-market fluctuation possible",
              "Minimum time horizon discussion",
              "Not FDIC insured",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Short IG",
            title: "Short investment grade",
            iconClass: "fa-chart-line",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "CREDIT", value: "IG" }, { label: "VOL", value: "Low–mod" }],
            features: [
              "Income over pure cash",
              "Rate and spread sensitivity",
              "Fits some reserve sleeves",
              "Policy limits apply",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
    },
    warmInsights: [
      {
        image:
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Markets",
        title: "Diversification when correlations move together",
        body: "When asset classes sync up, intentional sleeves—by region, factor, or duration—can still spread risk across scenarios, not just tickers.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Process",
        title: "What fundamental research adds in noisy markets",
        body: "Disciplined underwriting and scenario analysis help teams separate narrative from cash-flow durability before sizing positions.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Sustainable",
        title: "ESG integration beyond the headline score",
        body: "Materiality, engagement, and reporting standards differ widely—useful analysis focuses on what affects long-term value, not labels alone.",
      },
    ],
  },
  insurance: {
    coldHeroEyebrow: "Protection. Confidence. Security.",
    coldHeroHeading: "Comprehensive coverage for life's most important moments.",
    coldHeroParagraph1: "Auto, home, life, and umbrella policies—${brandName} Insurance helps you protect what matters most.",
    coldHeroParagraph2: "Peace of mind starts with the right coverage. Explore ${brandName} Insurance solutions designed for your needs.",
    homepageCtaText: "Get a Quote",
    homeMarketInsights: {
      sectionSubtitle:
        "Coverage and protection topics to explore—informational only, not a quote or recommendation.",
      cards: [
        {
          eyebrow: "Home",
          title: "Review replacement cost as values change",
          body: "Construction and material costs move over time; an annual policy check helps limits keep pace so a claim does not fall short of rebuild reality.",
        },
        {
          eyebrow: "Auto",
          title: "Liability limits that match how you drive and what you own",
          body: "Higher limits can matter after a serious accident—especially if you commute often, carry passengers, or have growing assets to protect.",
        },
        {
          eyebrow: "Protection",
          title: "When an umbrella policy is worth a conversation",
          body: "An umbrella can add an extra layer above auto and home liability—useful if you host often, own rental property, or serve on a board.",
        },
      ],
    },
    categoryPage: {
      heroBgImage:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=2400&q=80",
      catHeroTitle: "Personal Insurance Solutions",
      catHeroSubtitle: "Comprehensive coverage for the people and assets that matter most.",
      marketInsightsIntro:
        "Straightforward reads on home, auto, and liability coverage. For options suited to your household, continue in chat with Penny—your ${brandName} assistant.",
      services: [
        {
          iconClass: "fa-car",
          title: "Auto & Vehicle",
          description: "Coverage for cars, motorcycles, and recreational vehicles",
        },
        {
          iconClass: "fa-house-chimney",
          title: "Home & Property",
          description: "Homeowners, renters, and valuable items protection",
        },
        {
          iconClass: "fa-shield-heart",
          title: "Life & Umbrella",
          description: "Term life and extended liability coverage",
        },
      ],
      whyChooseUsTitle: "Seamless, 24/7 Claims Processing",
      whyChooseUsText:
        "When the unexpected happens, we are here. File, track, and resolve claims instantly through our digital portal or speak directly to your dedicated concierge team.",
      whyChooseUsImage:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
      article1Title: "Personal umbrella coverage: who it helps most",
      article2Title: "Bundling home and auto: savings and simplicity",
    },
    useCases: {
      auto: {
        name: "Auto insurance",
        heroAssets: {
          warmHero:
            "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80",
          coldHero:
            "https://images.unsplash.com/photo-1449965408861-eb3a11764c7d?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1449965408861-eb3a11764c7d?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Auto coverage that fits how you drive.",
        vanillaHeroSubtext:
          "Limits, deductibles, and add-ons should match your commute, passengers, and assets—compare starting points, then talk to a licensed agent.",
        userIntentString: "I want to review my auto insurance.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three auto coverage tiers to review—a licensed specialist confirms eligibility and final pricing.",
        adaptiveOverlayTitle: "Auto coverage options",
        adaptiveOverlaySubtitle:
          "Compare standard, enhanced liability, and premium roadside bundles with a licensed agent.",
        adaptiveFooterNote: "Insurance · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details to connect with a licensed specialist.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(503) 555-0167",
          company: "Acme Corp",
          zipCode: "97205",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Basic",
            title: "State-aware essentials",
            iconClass: "fa-car",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "LIABILITY", value: "Standard" }, { label: "DED", value: "$750" }],
            features: [
              "Bodily injury and property damage",
              "Uninsured motorist options to discuss",
              "Digital ID cards",
              "Not a quote",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Balanced",
            title: "Higher liability comfort",
            iconClass: "fa-car",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "LIABILITY", value: "Elevated" }, { label: "DED", value: "$500" }],
            features: [
              "Increased liability limits",
              "Rental reimbursement option",
              "Accident forgiveness where available",
              "Licensed agent review",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Premium",
            title: "Roadside & new-car extras",
            iconClass: "fa-car",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "ROADSIDE", value: "Included" }, { label: "GLASS", value: "No deductible" }],
            features: [
              "24/7 roadside and towing",
              "New car replacement discussion",
              "Gap coverage where applicable",
              "For illustration only",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      home: {
        name: "Homeowners / renters",
        heroAssets: {
          warmHero:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
          coldHero:
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Home protection that keeps pace with value.",
        vanillaHeroSubtext:
          "Replacement cost, deductibles, and riders change as markets move—use these tiers as a conversation starter with a licensed agent.",
        userIntentString: "I need homeowners or renters coverage.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Below are three home policy sketches—illustrative; an agent validates limits, discounts, and exclusions for your address.",
        adaptiveOverlayTitle: "Home and property options",
        adaptiveOverlaySubtitle:
          "Compare core, replacement-cost plus, and high-value home illustrations.",
        adaptiveFooterNote: "Insurance · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details to connect with a licensed specialist.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(503) 555-0167",
          company: "Acme Corp",
          zipCode: "97205",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Core",
            title: "Dwelling essentials",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "FORM", value: "HO-3" }, { label: "DED", value: "$1k" }],
            features: [
              "Dwelling and other structures",
              "Personal property baseline",
              "Loss of use discussion",
              "Renters parallel available",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Replacement",
            title: "Replacement cost emphasis",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "RC", value: "Extended RCV" }, { label: "DED", value: "$1.5k" }],
            features: [
              "Rebuild cost check-ins",
              "Water backup rider option",
              "Scheduled jewelry conversation",
              "Agent verifies details",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "High value",
            title: "Premier home program",
            iconClass: "fa-house-chimney",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "VALUABLES", value: "Scheduled" }, { label: "SERVICE", value: "Concierge" }],
            features: [
              "Higher liability coordination",
              "Flood and quake referrals",
              "Appraisal workflow",
              "Not available everywhere",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      life: {
        name: "Life insurance",
        heroAssets: {
          warmHero:
            "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1600&q=80",
          coldHero:
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Life coverage sized to your responsibilities.",
        vanillaHeroSubtext:
          "Term lengths and face amounts depend on income replacement, debts, and goals—these are illustrative tiers for agent discussion.",
        userIntentString: "I want term life insurance for my family.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "Here are three term-life illustrations—health class and state rules affect pricing; a licensed specialist underwrites the real offer.",
        adaptiveOverlayTitle: "Life insurance illustrations",
        adaptiveOverlaySubtitle:
          "Compare 10-year term, 20-year level term, and longer protection sketches.",
        adaptiveFooterNote: "Insurance · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details to connect with a licensed specialist.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(503) 555-0167",
          company: "Acme Corp",
          zipCode: "97205",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Short bridge",
            title: "10-year level term",
            iconClass: "fa-shield-heart",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "FACE", value: "$500k" }, { label: "EST. PREM", value: "$42/mo" }],
            features: [
              "Income bridge during a loan payoff window",
              "Convertibility to discuss",
              "Exam may be required",
              "Subject to underwriting",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Family",
            title: "20-year level term",
            iconClass: "fa-shield-heart",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "FACE", value: "$1M" }, { label: "EST. PREM", value: "$78/mo" }],
            features: [
              "Common horizon for young families",
              "Fixed premium during term",
              "Rider options with agent",
              "Beneficiary review",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "Longer",
            title: "30-year level term",
            iconClass: "fa-shield-heart",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "FACE", value: "$750k" }, { label: "EST. PREM", value: "$115/mo" }],
            features: [
              "Longer mortgage alignment story",
              "Higher total premium vs shorter term",
              "Permanent options separate conversation",
              "Final rates via underwriting",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
      bundleHomeAuto: {
        name: "Bundle home & auto",
        heroAssets: {
          warmHero:
            "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
          coldHero:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
          insight1:
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
          insight2:
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
          insight3:
            "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=80",
        },
        vanillaHeroTitle: "Protection for what drives you and what you call home.",
        vanillaHeroSubtext:
          "Bundle auto and home, review life coverage, and add umbrella liability with licensed specialists.",
        userIntentString: "I need to bundle my home and auto insurance.",
        agentChatMessage: ADAPTIVE_GENERIC_AGENT_GREETING,
        chatWidgetTitle: "Penny (${brandName} AI Agent)",
        agentAdaptiveResponse:
          "If you are bundling policies, here are three package tiers to compare—final pricing and discounts come from a licensed agent.",
        adaptiveOverlayTitle: "Bundle and coverage options",
        adaptiveOverlaySubtitle:
          "Compare Essential, Enhanced, and Premier home-and-auto bundle tiers with a licensed specialist.",
        adaptiveFooterNote: "Insurance · Demo experience",
        landingPageTitle: "Secure your details",
        landingPageSubtitle: "Confirm your details to connect with a licensed specialist.",
        mockProfile: {
          firstName: "Rachel",
          lastName: "Morris",
          email: "rachel.morris@example.com",
          phone: "(503) 555-0167",
          company: "Acme Corp",
          zipCode: "97205",
        },
        cards: [
          {
            recommended: false,
            smallTag: "Core Coverage",
            title: "Essential Bundle",
            iconClass: "fa-shield",
            iconBgClass: "bg-slate-100",
            iconColorClass: "text-slate-600",
            metrics: [{ label: "SAVINGS", value: "10%" }, { label: "DEDUCTIBLE", value: "Split" }],
            features: [
              "State minimum auto limits",
              "Standard dwelling protection",
              "Digital claims tracking",
              "Affordable monthly premiums",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: true,
            badgeText: "Best Match",
            smallTag: "Recommended",
            title: "Enhanced Protection Bundle",
            iconClass: "fa-shield-halved",
            iconBgClass: "bg-sky-50",
            metrics: [{ label: "SAVINGS", value: "15%" }, { label: "DEDUCTIBLE", value: "Single" }],
            features: [
              "Single deductible for shared events",
              "Replacement cost plus for home",
              "Accident forgiveness",
              "24/7 roadside assistance",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
          {
            recommended: false,
            smallTag: "High Limit",
            title: "Premier Shield Bundle",
            iconClass: "fa-umbrella",
            iconBgClass: "bg-emerald-50",
            iconColorClass: "text-emerald-600",
            metrics: [{ label: "SAVINGS", value: "18%" }, { label: "UMBRELLA", value: "Included" }],
            features: [
              "Maximum liability limits",
              "$1M Personal Umbrella included",
              "Valuable items rider",
              "Priority concierge claims support",
            ],
            bundleText: "",
            ctaLabel: "Learn more",
          },
        ],
      },
    },
    warmInsights: [
      {
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Home",
        title: "Review replacement cost as values change",
        body: "Construction and material costs move over time; an annual policy check helps limits keep pace so a claim does not fall short of rebuild reality.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Auto",
        title: "Liability limits that match how you drive and what you own",
        body: "Higher limits can matter after a serious accident—especially if you commute often, carry passengers, or have growing assets to protect.",
      },
      {
        image:
          "https://images.unsplash.com/photo-1449965408861-eb3a11764c7d?auto=format&fit=crop&w=900&q=80",
        eyebrow: "Protection",
        title: "When an umbrella policy is worth a conversation",
        body: "An umbrella can add an extra layer above auto and home liability—useful if you host often, own rental property, or serve on a board.",
      },
    ],
  },
};

module.exports = { ADAPTIVE_GENERIC_AGENT_GREETING, ADAPTIVE_WEB_COPY_BY_SUB_INDUSTRY };
