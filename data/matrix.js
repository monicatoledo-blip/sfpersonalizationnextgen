'use strict';
// Verbatim port from experience-simulator/public/script.js (lines 3269-5782).
// Machine-generated from adaptive-copy-matrix.csv / adaptive-image-matrix.csv. Do not hand-edit.

const ADAPTIVE_MATRIX_OVERRIDES = {
  "retailBanking": {
    "useCases": {
      "studentLoanRefi": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479781/Loans_How_to_refinance_your_student_loans_in_5_steps_fosnuh.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231949/grow-small-business-1346252956_u9fcye.webp",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479140/GettyImages-2194268868_Feature-Single-R_zmffb8.webp"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Market insights and resources.",
          "cards": [
            {
              "eyebrow": "Treasury",
              "title": "Travel Rewards for Every Journey",
              "body": "Turn your daily expenses into your next dream getaway with premium travel cards."
            },
            {
              "eyebrow": "Planning",
              "title": "Planning for a Lasting Legacy",
              "body": "It is never too early to start planning for wealth preservation and family security."
            },
            {
              "eyebrow": "Auto",
              "title": "Your First Major Purchase",
              "body": "Lock in a competitive rate and search with confidence for your next vehicle."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Education",
              "title": "Student Loan Refinance Calculator",
              "body": "Model your new monthly payments and see exactly how much you can save over time."
            },
            {
              "eyebrow": "Lending",
              "title": "Starting Your Small Business",
              "body": "Explore SBA loan options and resources designed for young entrepreneurs looking to scale."
            },
            {
              "eyebrow": "Education",
              "title": "Path to Financial Independence",
              "body": "Practical advice for managing debt while building a professional foundation after graduation."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Fast Payoff",
            "title": "5-Year Fixed",
            "badgeText": "",
            "metrics": [
              {
                "label": "APR",
                "value": "4.99%"
              },
              {
                "label": "TERM",
                "value": "60 Mo"
              }
            ],
            "features": [
              "Lowest interest rate available",
              "Get out of debt faster",
              "Fixed predictable payments",
              "0.25% AutoPay discount"
            ]
          },
          {
            "smallTag": "Best Match",
            "title": "10-Year Fixed",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "APR",
                "value": "5.50%"
              },
              {
                "label": "TERM",
                "value": "120 Mo"
              }
            ],
            "features": [
              "Balanced monthly payments",
              "Standard repayment timeline",
              "Consolidate federal and private",
              "No origination fees"
            ]
          },
          {
            "smallTag": "Flexible",
            "title": "7-Year Variable",
            "badgeText": "",
            "metrics": [
              {
                "label": "EST. APR",
                "value": "4.75%"
              },
              {
                "label": "CAP",
                "value": "8.95%"
              }
            ],
            "features": [
              "Lower starting interest rate",
              "Rate capped for your protection",
              "Ideal if paying off aggressively",
              "Release co-signer after 24 months"
            ]
          }
        ]
      },
      "autoLoan": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201481/Student-Credit-Card_a8038n.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479242/1a-blogposts-When-Refinancing-an-Auto-Loan-Makes-Sense_yc7s9g.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774202333/auto-insurance-insurance-options_wtctvt.png",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479720/quarters-stacked-on-a-table-and-a-jar-with-a-growing-sprout_dgntpn.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Market insights and resources.",
          "cards": [
            {
              "eyebrow": "Education",
              "title": "Student Credit Cards for Beginners",
              "body": "Building credit early helps you qualify for better rates on future loans and major purchases."
            },
            {
              "eyebrow": "Travel",
              "title": "Maximize Your Travel Rewards",
              "body": "Premium travel cards turn everyday spending into dream vacations with points that work harder."
            },
            {
              "eyebrow": "Planning",
              "title": "Planning for Retirement Early",
              "body": "Starting retirement savings in your 20s and 30s gives compound interest decades to work in your favor."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Auto",
              "title": "Auto Loan Refinancing Benefits",
              "body": "Lower your monthly payment or shorten your loan term by refinancing when rates drop or your credit improves."
            },
            {
              "eyebrow": "Insurance",
              "title": "Auto Insurance Essentials",
              "body": "Comprehensive and collision coverage protect your investment—shop rates annually to ensure competitive pricing."
            },
            {
              "eyebrow": "Savings",
              "title": "Building an Emergency Fund",
              "body": "Three to six months of expenses in savings protects you from unexpected repairs and financial setbacks."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Fast Payoff",
            "title": "36-Month Auto Loan",
            "badgeText": "",
            "metrics": [
              {
                "label": "APR",
                "value": "5.49%"
              },
              {
                "label": "TERM",
                "value": "36 mo"
              }
            ],
            "features": [
              "Lowest interest rate",
              "Pay off your vehicle faster",
              "No prepayment penalties",
              "Same-day funding"
            ]
          },
          {
            "smallTag": "Balanced",
            "title": "60-Month Auto Loan",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "APR",
                "value": "6.25%"
              },
              {
                "label": "TERM",
                "value": "60 mo"
              }
            ],
            "features": [
              "Balanced monthly payments",
              "Competitive interest rate",
              "Rate lock for 30 days",
              "Automatic payment discount"
            ]
          },
          {
            "smallTag": "Low Payment",
            "title": "72-Month Auto Loan",
            "badgeText": "",
            "metrics": [
              {
                "label": "APR",
                "value": "6.99%"
              },
              {
                "label": "TERM",
                "value": "72 mo"
              }
            ],
            "features": [
              "Lowest monthly payment",
              "Maximum vehicle purchasing power",
              "100% digital application",
              "Skip a payment program"
            ]
          }
        ]
      },
      "creditCard": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479242/1a-blogposts-When-Refinancing-an-Auto-Loan-Makes-Sense_yc7s9g.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472577/young-woman-laptop-home_padiak.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201707/Sixty-and-Me_How-to-Live-in-Luxury-in-Retirement_-No-Matter-Your-Budget_xcg3ws.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Market insights and resources.",
          "cards": [
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            },
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            },
            {
              "eyebrow": "Planning", "title": "Financial Planning Strategies", "body": "Goal-based planning, regular reviews, and flexible strategies help you adapt to life changes and market conditions."
            },
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Best Match",
            "title": "Premium Travel Rewards",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "ANNUAL FEE",
                "value": "$95"
              },
              {
                "label": "SIGN-UP BONUS",
                "value": "50k Miles"
              }
            ],
            "features": [
              "3x miles on flights and hotels",
              "Complimentary lounge access",
              "No foreign transaction fees",
              "TSA PreCheck statement credit"
            ]
          },
          {
            "smallTag": "No Fee",
            "title": "Cash Back Plus",
            "badgeText": "",
            "metrics": [
              {
                "label": "ANNUAL FEE",
                "value": "$0"
              },
              {
                "label": "CASH BACK",
                "value": "2% Flat"
              }
            ],
            "features": [
              "2% cash back on all purchases",
              "0% Intro APR for 15 months",
              "No category tracking required",
              "Zero fraud liability"
            ]
          },
          {
            "smallTag": "Luxury",
            "title": "Platinum Reserve",
            "badgeText": "",
            "metrics": [
              {
                "label": "ANNUAL FEE",
                "value": "$450"
              },
              {
                "label": "SIGN-UP BONUS",
                "value": "100k Miles"
              }
            ],
            "features": [
              "5x miles on flights and dining",
              "$300 annual travel credit",
              "Global Entry fee credit",
              "24/7 Premium Concierge"
            ]
          }
        ]
      },
      "homeEquity": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472577/young-woman-laptop-home_padiak.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479072/young-couple-renovating-home-and-dancing-in-living-room-EIF03304_wzfeup.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478992/AdobeStock_300463851-scaled_v86hcy.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Market insights and resources.",
          "cards": [
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Home", "title": "First-Time Homebuyer Essentials", "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            },
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            },
            {
              "eyebrow": "Planning", "title": "Financial Planning Strategies", "body": "Goal-based planning, regular reviews, and flexible strategies help you adapt to life changes and market conditions."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Flexible",
            "title": "Home Equity Line of Credit",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "RATE",
                "value": "7.25%"
              },
              {
                "label": "LINE",
                "value": "Up to $100k"
              }
            ],
            "features": [
              "Draw funds only as you need them",
              "Pay interest only on what you use",
              "Reusable credit line",
              "Variable interest rate"
            ]
          },
          {
            "smallTag": "Predictable",
            "title": "Fixed Home Equity Loan",
            "badgeText": "",
            "metrics": [
              {
                "label": "RATE",
                "value": "6.99%"
              },
              {
                "label": "TERM",
                "value": "15 Years"
              }
            ],
            "features": [
              "Receive a lump sum upfront",
              "Fixed monthly payments",
              "Ideal for one-time large projects",
              "Fixed interest rate"
            ]
          },
          {
            "smallTag": "Consolidated",
            "title": "Cash-Out Refinance",
            "badgeText": "",
            "metrics": [
              {
                "label": "RATE",
                "value": "5.85%"
              },
              {
                "label": "CASH OUT",
                "value": "Up to $75k"
              }
            ],
            "features": [
              "Replace your existing mortgage",
              "Potentially lower your primary rate",
              "One single monthly payment",
              "Maximize your borrowing power"
            ]
          }
        ]
      },
      "mortgageRefi": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479639/exterior-cape-cod-house-mem-interiors-pc-r-brad-knipstein_d4kp5r.webp",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472577/young-woman-laptop-home_padiak.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201707/Sixty-and-Me_How-to-Live-in-Luxury-in-Retirement_-No-Matter-Your-Budget_xcg3ws.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479544/1-JacobWackerhausen-417d5105246c4947bc3cad2a961af80a_j8cfgh.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Market insights and resources.",
          "cards": [
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            },
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Home", "title": "First-Time Homebuyer Essentials", "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            },
            {
              "eyebrow": "Home", "title": "First-Time Homebuyer Essentials", "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            },
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Lowest Payment",
            "title": "30-Year Fixed Refi",
            "badgeText": "",
            "metrics": [
              {
                "label": "RATE",
                "value": "5.50%"
              },
              {
                "label": "APR",
                "value": "5.65%"
              }
            ],
            "features": [
              "Drop your monthly payment",
              "Improve monthly cash flow",
              "No prepayment penalty",
              "Escrow management included"
            ]
          },
          {
            "smallTag": "Best Value",
            "title": "15-Year Fixed Refi",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "RATE",
                "value": "4.99%"
              },
              {
                "label": "APR",
                "value": "5.15%"
              }
            ],
            "features": [
              "Pay off your home faster",
              "Save thousands in total interest",
              "Build equity rapidly",
              "Dedicated closing team"
            ]
          },
          {
            "smallTag": "Liquidity",
            "title": "Cash-Out Refinance",
            "badgeText": "",
            "metrics": [
              {
                "label": "RATE",
                "value": "5.85%"
              },
              {
                "label": "CASH OUT",
                "value": "Up to $50k"
              }
            ],
            "features": [
              "Fund home improvements",
              "Consolidate high-interest debt",
              "Leverage existing home equity",
              "Potential tax deductions"
            ]
          }
        ]
      },
      "depositCapture": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479329/shutterstock_1107968786_vagxeh.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479072/young-couple-renovating-home-and-dancing-in-living-room-EIF03304_wzfeup.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479720/quarters-stacked-on-a-table-and-a-jar-with-a-growing-sprout_dgntpn.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472577/young-woman-laptop-home_padiak.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Market insights and resources.",
          "cards": [
            {
              "eyebrow": "Travel", "title": "Maximize Your Travel Rewards", "body": "Premium travel cards turn everyday spending into dream vacations with points that work harder."
            },
            {
              "eyebrow": "Home", "title": "First-Time Homebuyer Essentials", "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            },
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Savings", "title": "High-Yield Savings Strategies", "body": "Automatic transfers and competitive APYs help you build emergency funds and reach short-term goals faster."
            },
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            },
            {
              "eyebrow": "Planning", "title": "Financial Planning Strategies", "body": "Goal-based planning, regular reviews, and flexible strategies help you adapt to life changes and market conditions."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Liquid",
            "title": "High-Yield Savings",
            "badgeText": "",
            "metrics": [
              {
                "label": "APY",
                "value": "4.35%"
              },
              {
                "label": "MINIMUM",
                "value": "$0"
              }
            ],
            "features": [
              "Total liquidity and easy transfers",
              "No monthly maintenance fees",
              "FDIC insured up to $250k",
              "Interest compounded daily"
            ]
          },
          {
            "smallTag": "Highest Rate",
            "title": "6-Month CD",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "APY",
                "value": "5.10%"
              },
              {
                "label": "TERM",
                "value": "6 Months"
              }
            ],
            "features": [
              "Lock in our highest guaranteed rate",
              "Short-term commitment",
              "No market risk",
              "Automatic renewal options"
            ]
          },
          {
            "smallTag": "Balanced",
            "title": "Premium Money Market",
            "badgeText": "",
            "metrics": [
              {
                "label": "APY",
                "value": "4.50%"
              },
              {
                "label": "MINIMUM",
                "value": "$25k"
              }
            ],
            "features": [
              "Check-writing privileges",
              "Debit card access",
              "Tiered interest rates",
              "Perfect for emergency funds"
            ]
          }
        ]
      },
      "mortgage": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479639/exterior-cape-cod-house-mem-interiors-pc-r-brad-knipstein_d4kp5r.webp",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472484/confident-student-in-shared-space-with-laptop_collagestyle_zeay8z.avif",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479720/quarters-stacked-on-a-table-and-a-jar-with-a-growing-sprout_dgntpn.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479544/1-JacobWackerhausen-417d5105246c4947bc3cad2a961af80a_j8cfgh.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774480084/milan2099-61cf06cdda72490bb75bb448fd03aaae_r62pz0.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479444/Livery-Insurance-Close-up-Portrait-of-a-Woman-Driver-of-a-Car-Service-Smiling-at-the-Camera_vynex8.webp"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Market insights and resources.",
          "cards": [
            {
              "eyebrow": "Education", "title": "Student Loan Management", "body": "Understanding repayment options helps you manage debt while building your career and financial foundation."
            },
            {
              "eyebrow": "Home", "title": "First-Time Homebuyer Essentials", "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            },
            {
              "eyebrow": "Savings", "title": "High-Yield Savings Strategies", "body": "Automatic transfers and competitive APYs help you build emergency funds and reach short-term goals faster."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Home", "title": "First-Time Homebuyer Essentials", "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            },
            {
              "eyebrow": "Home", "title": "First-Time Homebuyer Essentials", "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            },
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Predictable",
            "title": "30-Year Fixed Mortgage",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "RATE",
                "value": "6.50%"
              },
              {
                "label": "APR",
                "value": "6.65%"
              }
            ],
            "features": [
              "Predictable monthly payments",
              "First-time buyer grants available",
              "Lock your rate for 60 days",
              "Dedicated loan officer"
            ]
          },
          {
            "smallTag": "Fast Equity",
            "title": "15-Year Fixed Mortgage",
            "badgeText": "",
            "metrics": [
              {
                "label": "RATE",
                "value": "5.99%"
              },
              {
                "label": "APR",
                "value": "6.15%"
              }
            ],
            "features": [
              "Build equity twice as fast",
              "Lower interest rate",
              "Save thousands in total interest",
              "Fast-track closing"
            ]
          },
          {
            "smallTag": "Flexible",
            "title": "5/1 ARM",
            "badgeText": "",
            "metrics": [
              {
                "label": "INITIAL RATE",
                "value": "5.75%"
              },
              {
                "label": "APR",
                "value": "6.85%"
              }
            ],
            "features": [
              "Lowest initial payment",
              "Fixed for the first 5 years",
              "Ideal if you plan to move soon",
              "No prepayment penalties"
            ]
          }
        ]
      }
    }
  },
  "commercialBanking": {
    "useCases": {
      "treasuryServices": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481597/20190731_WeWork_SonyCenter_Berlin_008_v1_gbyy1w.webp",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482481/What-is-Treasury-Management_ygnigo.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201708/ways-to-maximize-your-retirement-life-1_okcwtq.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479639/exterior-cape-cod-house-mem-interiors-pc-r-brad-knipstein_d4kp5r.webp",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482724/calculator-1516869_1920_ipeyrd.webp",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231949/grow-small-business-1346252956_u9fcye.webp",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Business banking insights.",
          "cards": [
            {
              "eyebrow": "Travel",
              "title": "Maximize Your Travel Rewards",
              "body": "Premium travel cards turn everyday spending into dream vacations with points that work harder for you."
            },
            {
              "eyebrow": "Retirement",
              "title": "Planning for Your Golden Years",
              "body": "Retirement planning starts with understanding your timeline, risk tolerance, and income needs for the future."
            },
            {
              "eyebrow": "Real Estate",
              "title": "First-Time Homebuyer Essentials",
              "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Treasury",
              "title": "Optimize Your Cash Position",
              "body": "Real-time visibility into receivables and payables helps finance teams forecast accurately and fund operations without emergency draws."
            },
            {
              "eyebrow": "Treasury",
              "title": "Automate Reconciliation Workflows",
              "body": "Automated matching and reporting reduce manual errors and free up your team to focus on strategic priorities."
            },
            {
              "eyebrow": "Risk",
              "title": "Protect Your Business Assets",
              "body": "Property and liability coverage protects earnings as your operations scale—worth revisiting as revenue mix changes."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Payables",
            "title": "Business Payables Hub",
            "badgeText": "",
            "metrics": [
              {
                "label": "CHANNELS",
                "value": "ACH + wire"
              },
              {
                "label": "CONTROLS",
                "value": "Dual approval"
              }
            ],
            "features": [
              "Centralize vendor payments",
              "Positive pay for checks",
              "Scheduled releases",
              "Audit-friendly reporting"
            ]
          },
          {
            "smallTag": "Receivables",
            "title": "Receivables Acceleration",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "DEPOSITS",
                "value": "Same day"
              },
              {
                "label": "MATCHING",
                "value": "Auto"
              }
            ],
            "features": [
              "Faster deposit posting",
              "Remittance detail capture",
              "Receivables reporting",
              "Works with common accounting tools"
            ]
          },
          {
            "smallTag": "Liquidity",
            "title": "Liquidity & reporting snapshot",
            "badgeText": "",
            "metrics": [
              {
                "label": "VIEW",
                "value": "Multi-acct"
              },
              {
                "label": "ALERTS",
                "value": "Configurable"
              }
            ],
            "features": [
              "Cash position visibility",
              "Forecast-friendly exports",
              "Fraud monitoring hooks",
              "Scales as accounts grow"
            ]
          }
        ]
      },
      "smallBusinessTermLoan": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481597/20190731_WeWork_SonyCenter_Berlin_008_v1_gbyy1w.webp",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231949/grow-small-business-1346252956_u9fcye.webp",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479720/quarters-stacked-on-a-table-and-a-jar-with-a-growing-sprout_dgntpn.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201481/Student-Credit-Card_a8038n.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479242/1a-blogposts-When-Refinancing-an-Auto-Loan-Makes-Sense_yc7s9g.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774483106/what-is-a-small-business-loan-sba-7a-504-live-oak-bank-blog_eodueq.webp",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231949/grow-small-business-1346252956_u9fcye.webp",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482724/calculator-1516869_1920_ipeyrd.webp"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Business banking insights.",
          "cards": [
            {
              "eyebrow": "Savings",
              "title": "High-Yield Savings Strategies",
              "body": "Automatic transfers and competitive APYs help you build emergency funds and reach short-term goals faster."
            },
            {
              "eyebrow": "Education",
              "title": "Student Loan Repayment Options",
              "body": "Understanding federal vs. private loans helps you choose the right repayment strategy for your financial goals."
            },
            {
              "eyebrow": "Auto",
              "title": "Financing Your Next Vehicle",
              "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Lending",
              "title": "Small Business Term Loans Explained",
              "body": "Fixed-rate term loans provide predictable payments for equipment purchases, renovations, or working capital needs."
            },
            {
              "eyebrow": "Lending",
              "title": "Growing Your Business with Financing",
              "body": "Strategic use of debt can accelerate growth while preserving cash reserves for operations and unexpected needs."
            },
            {
              "eyebrow": "Planning",
              "title": "Understanding Business Loan Terms",
              "body": "Match your loan duration to asset life—shorter terms mean less interest, longer terms preserve monthly cash flow."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Faster payoff",
            "title": "36-Month Term Loan",
            "badgeText": "",
            "metrics": [
              {
                "label": "PAYMENT",
                "value": "Higher"
              },
              {
                "label": "INTEREST",
                "value": "Lower total"
              }
            ],
            "features": [
              "Retire debt sooner",
              "Less total interest vs longer terms",
              "Good for near-term projects",
              "Fixed payment schedule"
            ]
          },
          {
            "smallTag": "Balanced",
            "title": "60-Month Term Loan",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "PAYMENT",
                "value": "Moderate"
              },
              {
                "label": "STRUCTURE",
                "value": "Fixed"
              }
            ],
            "features": [
              "Balanced monthly cash flow",
              "Suited to expansion or refinance",
              "Dedicated closing support",
              "Covenant discussion with your team"
            ]
          },
          {
            "smallTag": "Lower payment",
            "title": "84-Month Term Loan",
            "badgeText": "",
            "metrics": [
              {
                "label": "PAYMENT",
                "value": "Lower"
              },
              {
                "label": "USE CASE",
                "value": "Capex"
              }
            ],
            "features": [
              "Smaller monthly obligation",
              "Pairs with longer-lived assets",
              "Preserves near-term liquidity",
              "Subject to credit approval"
            ]
          }
        ]
      },
      "businessLineOfCredit": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481597/20190731_WeWork_SonyCenter_Berlin_008_v1_gbyy1w.webp",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482364/istockphoto-1304746031-612x612_ccrxbd.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233012/image.20220301_ewuyt6.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774741705/life-insurance_cets0p.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774483106/what-is-a-small-business-loan-sba-7a-504-live-oak-bank-blog_eodueq.webp",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231650/Couple_Budgeting_aozhqd.webp",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231949/grow-small-business-1346252956_u9fcye.webp"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Business banking insights.",
          "cards": [
            {
              "eyebrow": "Investing",
              "title": "Building a Diversified Portfolio",
              "body": "Asset allocation across stocks, bonds, and alternatives helps balance growth potential with downside protection."
            },
            {
              "eyebrow": "Insurance",
              "title": "Life Insurance for Family Protection",
              "body": "Term and permanent life insurance options provide financial security for your loved ones."
            },
            {
              "eyebrow": "Credit",
              "title": "Travel Rewards That Work for You",
              "body": "Premium credit cards offer points, cashback, and travel perks that align with your spending habits."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Lending",
              "title": "Business Lines of Credit Explained",
              "body": "Revolving credit provides flexible access to working capital when you need it most—pay interest only on what you use."
            },
            {
              "eyebrow": "Treasury",
              "title": "Managing Seasonal Cash Flow",
              "body": "A revolving line smooths out receivables timing and covers payroll during seasonal revenue gaps."
            },
            {
              "eyebrow": "Lending",
              "title": "Growing with Working Capital",
              "body": "Flexible financing helps businesses scale operations, manage inventory, and seize opportunities without depleting reserves."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Starter",
            "title": "Secured Business Line",
            "badgeText": "",
            "metrics": [
              {
                "label": "CAPACITY",
                "value": "Up to $250k"
              },
              {
                "label": "ACCESS",
                "value": "Online"
              }
            ],
            "features": [
              "Collateral-backed capacity",
              "Lower pricing vs unsecured",
              "Renewal subject to review",
              "Good for predictable draws"
            ]
          },
          {
            "smallTag": "Growth",
            "title": "Revolving Operating Line",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "CAPACITY",
                "value": "Up to $750k"
              },
              {
                "label": "ACCESS",
                "value": "Same-day"
              }
            ],
            "features": [
              "Revolving capacity for payroll",
              "Cash sweep integration",
              "Interest on outstanding balance only",
              "Covenant package tailored in underwriting"
            ]
          },
          {
            "smallTag": "Scale",
            "title": "Asset-Based Line",
            "badgeText": "",
            "metrics": [
              {
                "label": "CAPACITY",
                "value": "Formula"
              },
              {
                "label": "COLLATERAL",
                "value": "A/R"
              }
            ],
            "features": [
              "Borrowing base tied to receivables",
              "Supports faster growth cycles",
              "Monitoring and reporting cadence",
              "Specialist onboarding"
            ]
          }
        ]
      },
      "equipmentFinance": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481597/20190731_WeWork_SonyCenter_Berlin_008_v1_gbyy1w.webp",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482562/HanmiBank-Equipment-Leasing_pgktwd.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479639/exterior-cape-cod-house-mem-interiors-pc-r-brad-knipstein_d4kp5r.webp",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479720/quarters-stacked-on-a-table-and-a-jar-with-a-growing-sprout_dgntpn.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678306/what-makes-a-contract-not-enforceable-scaled_1_eeu6xh.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774483177/what-is-equipment-leasing_j6b3db.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482724/calculator-1516869_1920_ipeyrd.webp",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231949/grow-small-business-1346252956_u9fcye.webp"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Business banking insights.",
          "cards": [
            {
              "eyebrow": "Home",
              "title": "Refinancing Your Mortgage",
              "body": "Lower rates or cash-out refinancing can reduce monthly payments or fund home improvements."
            },
            {
              "eyebrow": "Savings",
              "title": "High-Yield Savings Strategies",
              "body": "Automatic transfers and competitive APYs help you build emergency funds and reach short-term goals faster."
            },
            {
              "eyebrow": "Planning",
              "title": "Estate Planning Essentials",
              "body": "Wills, trusts, and beneficiary designations ensure your assets transfer according to your wishes."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Equipment",
              "title": "Equipment Leasing Explained",
              "body": "Leases preserve capital and offer flexibility for technology and machinery that refreshes frequently."
            },
            {
              "eyebrow": "Planning",
              "title": "Tax Benefits of Equipment Financing",
              "body": "Section 179 deductions and bonus depreciation can significantly reduce taxable income on qualifying asset purchases."
            },
            {
              "eyebrow": "Lending",
              "title": "Financing Business Growth",
              "body": "Strategic equipment financing helps businesses scale operations without depleting cash reserves needed for daily operations."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Capex",
            "title": "Equipment term financing",
            "badgeText": "",
            "metrics": [
              {
                "label": "FINANCING",
                "value": "Up to 100%"
              },
              {
                "label": "TERMS",
                "value": "Flexible"
              }
            ],
            "features": [
              "Preserve working capital",
              "Bundle equipment and soft costs",
              "Scheduled draws",
              "Amortization aligned to asset life"
            ]
          },
          {
            "smallTag": "Vehicles",
            "title": "Fleet & vehicle program",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "STRUCTURE",
                "value": "Fixed"
              },
              {
                "label": "TITLE",
                "value": "Lien"
              }
            ],
            "features": [
              "Multiple unit scheduling",
              "End-of-term options to discuss",
              "Insurance requirements apply",
              "Relationship manager coordination"
            ]
          },
          {
            "smallTag": "Tech",
            "title": "Technology & machinery lease-style",
            "badgeText": "",
            "metrics": [
              {
                "label": "UPGRADE",
                "value": "Optional"
              },
              {
                "label": "TERM",
                "value": "36–60 mo"
              }
            ],
            "features": [
              "Technology refresh flexibility",
              "Predictable payments",
              "End-of-term choices",
              "Rates subject to approval"
            ]
          }
        ]
      }
    }
  },
  "wealthManagement": {
    "useCases": {
      "retirementPlanning": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774676522/smiling-middle-aged-couple-with-laptop-studying-documents-while-working-couch-home_650366-839_ay2t1b.avif",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482228/SOSB0324009_1560x880_desktop_vpn0nd.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678306/what-makes-a-contract-not-enforceable-scaled_1_eeu6xh.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774677512/shutterstock_1414416203-600x400_sdr4my.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482724/calculator-1516869_1920_ipeyrd.webp",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774676522/smiling-middle-aged-couple-with-laptop-studying-documents-while-working-couch-home_650366-839_ay2t1b.avif"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Planning and wealth insights.",
          "cards": [
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            },
            {
              "eyebrow": "Home", "title": "First-Time Homebuyer Essentials", "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            },
            {
              "eyebrow": "Planning", "title": "Financial Planning Strategies", "body": "Goal-based planning, regular reviews, and flexible strategies help you adapt to life changes and market conditions."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Growth",
            "title": "Growth-oriented glide path",
            "badgeText": "",
            "metrics": [
              {
                "label": "HORIZON",
                "value": "15+ yr"
              },
              {
                "label": "RISK",
                "value": "Higher"
              }
            ],
            "features": [
              "Emphasis on long-term compounding",
              "Periodic rebalancing discussion",
              "Tax location awareness",
              "Rates subject to approval"
            ]
          },
          {
            "smallTag": "Balanced",
            "title": "Balanced retirement portfolio",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "MIX",
                "value": "60/40"
              },
              {
                "label": "REVIEW",
                "value": "Annual"
              }
            ],
            "features": [
              "Growth with volatility moderation",
              "Cash-flow planning checkpoints",
              "Employer plan coordination",
              "Advisor-led adjustments"
            ]
          },
          {
            "smallTag": "Income",
            "title": "Income-first approach",
            "badgeText": "",
            "metrics": [
              {
                "label": "FOCUS",
                "value": "Cash flow"
              },
              {
                "label": "DRAWDOWN",
                "value": "Planned"
              }
            ],
            "features": [
              "Steadier distribution planning",
              "Longevity and healthcare considerations",
              "Tax-aware withdrawal order",
              "Not a product recommendation"
            ]
          }
        ]
      },
      "educationSavings529": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774676522/smiling-middle-aged-couple-with-laptop-studying-documents-while-working-couch-home_650366-839_ay2t1b.avif",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201707/Sixty-and-Me_How-to-Live-in-Luxury-in-Retirement_-No-Matter-Your-Budget_xcg3ws.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479720/quarters-stacked-on-a-table-and-a-jar-with-a-growing-sprout_dgntpn.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479639/exterior-cape-cod-house-mem-interiors-pc-r-brad-knipstein_d4kp5r.webp",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479781/Loans_How_to_refinance_your_student_loans_in_5_steps_fosnuh.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774478809/GettyImages-1397579313_Feature-Single-R_fyxtza.webp",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774677689/Newborn-Care-Class-3_kymwyr.webp"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Planning and wealth insights.",
          "cards": [
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            },
            {
              "eyebrow": "Savings", "title": "High-Yield Savings Strategies", "body": "Automatic transfers and competitive APYs help you build emergency funds and reach short-term goals faster."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Education", "title": "Student Loan Management", "body": "Understanding repayment options helps you manage debt while building your career and financial foundation."
            },
            {
              "eyebrow": "Planning", "title": "Financial Planning Strategies", "body": "Goal-based planning, regular reviews, and flexible strategies help you adapt to life changes and market conditions."
            },
            {
              "eyebrow": "Education", "title": "Student Loan Management", "body": "Understanding repayment options helps you manage debt while building your career and financial foundation."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Long horizon",
            "title": "Age-based glide path",
            "badgeText": "",
            "metrics": [
              {
                "label": "STYLE",
                "value": "Auto shift"
              },
              {
                "label": "HORIZON",
                "value": "10+ yr"
              }
            ],
            "features": [
              "Equity tilt when young",
              "Gradual risk reduction",
              "Good for “set and review” savers",
              "Plan features vary—ask your advisor"
            ]
          },
          {
            "smallTag": "Balanced",
            "title": "Balanced education portfolio",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "MIX",
                "value": "Moderate"
              },
              {
                "label": "REVIEW",
                "value": "Yearly"
              }
            ],
            "features": [
              "Stocks and bonds blend",
              "Flexible for K–12 or college goals",
              "Contribution planning conversation",
              "Rates vary by property"
            ]
          },
          {
            "smallTag": "Near term",
            "title": "Capital preservation tilt",
            "badgeText": "",
            "metrics": [
              {
                "label": "VOLATILITY",
                "value": "Lower"
              },
              {
                "label": "USE",
                "value": "Soon"
              }
            ],
            "features": [
              "Emphasis on stability near enrollment",
              "Spending flexibility discussion",
              "Gift and tax topics with counsel",
              "Not tax or legal advice"
            ]
          }
        ]
      },
      "iraInvesting": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774676522/smiling-middle-aged-couple-with-laptop-studying-documents-while-working-couch-home_650366-839_ay2t1b.avif",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678050/What-Do-Clients-Want-from-Their-Financial-Advisor_zj97bu.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201707/Sixty-and-Me_How-to-Live-in-Luxury-in-Retirement_-No-Matter-Your-Budget_xcg3ws.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678008/633408_RET-107794_financial-tips-multiGeneration_vpHero_1200x628_i23bsh.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774677784/bigstock-Roth-Ira-Vs-Traditional-Ira-Wr-277133656-1024x683.jpg_hkws9f.webp",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774677938/BBVA-acciones-como-funcionan-salud-financiera_elzzqe.avif",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774677862/gettyimages-1319571139_hero_dfbiqz.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Planning and wealth insights.",
          "cards": [
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            },
            {
              "eyebrow": "Planning", "title": "Financial Planning Strategies", "body": "Goal-based planning, regular reviews, and flexible strategies help you adapt to life changes and market conditions."
            },
            {
              "eyebrow": "Planning", "title": "Financial Planning Strategies", "body": "Goal-based planning, regular reviews, and flexible strategies help you adapt to life changes and market conditions."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Simple",
            "title": "Core index allocation",
            "badgeText": "",
            "metrics": [
              {
                "label": "STYLE",
                "value": "Broad market"
              },
              {
                "label": "FEES",
                "value": "0.45%"
              }
            ],
            "features": [
              "US and international sleeves",
              "Rebalancing discipline",
              "Straightforward reporting",
              "Not a recommendation"
            ]
          },
          {
            "smallTag": "Advisory",
            "title": "Advisory mutual fund lineup",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "SUPPORT",
                "value": "Ongoing"
              },
              {
                "label": "MIX",
                "value": "Diversified"
              }
            ],
            "features": [
              "Fund selection support",
              "Risk and goal check-ins",
              "Tax-aware placement where appropriate",
              "Demo experience"
            ]
          },
          {
            "smallTag": "Stability",
            "title": "Conservative balanced IRA",
            "badgeText": "",
            "metrics": [
              {
                "label": "BONDS",
                "value": "Higher %"
              },
              {
                "label": "VOL",
                "value": "Lower"
              }
            ],
            "features": [
              "Emphasis on downside moderation",
              "Shorter horizon friendly",
              "Cash needs discussion",
              "Advisor-guided"
            ]
          }
        ]
      },
      "estatePlanning": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774676522/smiling-middle-aged-couple-with-laptop-studying-documents-while-working-couch-home_650366-839_ay2t1b.avif",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678306/what-makes-a-contract-not-enforceable-scaled_1_eeu6xh.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479140/GettyImages-2194268868_Feature-Single-R_zmffb8.webp",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481684/istockphoto-658610090-612x612_gxlzth.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482724/calculator-1516869_1920_ipeyrd.webp",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678463/iStock-1198834050-scaled_dmpoo4.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678373/shutterstock_1403807051-min_c0utpi.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Planning and wealth insights.",
          "cards": [
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            },
            {
              "eyebrow": "Education", "title": "Student Loan Management", "body": "Understanding repayment options helps you manage debt while building your career and financial foundation."
            },
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            },
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            },
            {
              "eyebrow": "Planning", "title": "Financial Planning Strategies", "body": "Goal-based planning, regular reviews, and flexible strategies help you adapt to life changes and market conditions."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Tax",
            "title": "Tax-aware planning layer",
            "badgeText": "",
            "metrics": [
              {
                "label": "FOCUS",
                "value": "Coordination"
              },
              {
                "label": "REVIEW",
                "value": "Annual"
              }
            ],
            "features": [
              "Gain and loss awareness",
              "Charitable giving timing",
              "Withholding and estimates discussion",
              "Work with your CPA"
            ]
          },
          {
            "smallTag": "Estate",
            "title": "Revocable living trust framework",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "REVIEW",
                "value": "Annual"
              },
              {
                "label": "SETUP",
                "value": "Guided"
              }
            ],
            "features": [
              "Pour-over will coordination",
              "Successor trustee roles",
              "Probate avoidance goals",
              "Attorney drafts documents"
            ]
          },
          {
            "smallTag": "Legacy",
            "title": "Heir and succession clarity",
            "badgeText": "",
            "metrics": [
              {
                "label": "HORIZON",
                "value": "Multi-gen"
              },
              {
                "label": "OUTPUT",
                "value": "Summary"
              }
            ],
            "features": [
              "Beneficiary consistency check",
              "Family meeting talking points",
              "Business succession hooks",
              "Scenarios for discussion"
            ]
          }
        ]
      }
    }
  },
  "assetManagement": {
    "useCases": {
      "globalEquitiesMandate": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678873/modern-meeting-room-tech-trends-scaled_ab5p1a.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774739285/GettyImages-154401813_va7gte.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481868/360_F_283437738_PUdyvxvDJcvplpRu587FYqz9cyrH1IUG_gjk00t.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231949/grow-small-business-1346252956_u9fcye.webp",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481684/istockphoto-658610090-612x612_gxlzth.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774739285/GettyImages-154401813_va7gte.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774739285/GettyImages-154401813_va7gte.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774679322/unnamed_1_lzm9oj.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Institutional investing insights.",
          "cards": [
            {
              "eyebrow": "Planning",
              "title": "Commercial Real Estate Trends",
              "body": "Expert perspectives on modern office and logistics trends shaping institutional portfolios."
            },
            {
              "eyebrow": "Market insight",
              "title": "Supporting Regional Development",
              "body": "Learn how commercial lending drives growth in high-opportunity urban corridors."
            },
            {
              "eyebrow": "Auto",
              "title": "Enterprise Expense Management",
              "body": "Optimize your corporate spending with integrated card programs and real-time tracking."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Scenario insight",
              "title": "Q3 Global Equity Outlook",
              "body": "Analyze the drivers behind international stock momentum and emerging growth."
            },
            {
              "eyebrow": "Scenario insight",
              "title": "Managing Geopolitical Risk",
              "body": "A deep dive into how shifting trade policies impact international equity valuations."
            },
            {
              "eyebrow": "Scenario insight",
              "title": "Quarterly Fund Summary",
              "body": "Review our latest fact sheet detailing fund performance, alpha, and sector allocations."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Developed",
            "title": "Institutional Equity Strategy",
            "badgeText": "",
            "metrics": [
              {
                "label": "STYLE",
                "value": "Active"
              },
              {
                "label": "REGION",
                "value": "Developed Intl"
              }
            ],
            "features": [
              "Bottom-up stock selection story",
              "Currency policy discussion",
              "Benchmark-relative risk framing",
              "Policy-aligned positioning"
            ]
          },
          {
            "smallTag": "Global",
            "title": "Sustainable Markets Portfolio",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "STYLE",
                "value": "Core"
              },
              {
                "label": "BENCH",
                "value": "Global benchmark"
              }
            ],
            "features": [
              "US and non-US blend",
              "Sector and factor controls",
              "Liquidity suited to plans",
              "Consultant due diligence"
            ]
          },
          {
            "smallTag": "Emerging",
            "title": "Emerging Growth Mandate",
            "badgeText": "",
            "metrics": [
              {
                "label": "ROLE",
                "value": "Satellite"
              },
              {
                "label": "VOL",
                "value": "Higher"
              }
            ],
            "features": [
              "Smaller policy weight typical",
              "Liquidity and capacity checks",
              "Governance considerations",
              "Not a recommendation"
            ]
          }
        ]
      },
      "coreFixedIncomeMandate": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678873/modern-meeting-room-tech-trends-scaled_ab5p1a.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774739827/HowtoInvestinCorporateBondsGettyImages-1125626782-01c4aa86a81d471cb93a5c017029ee0d_xifjvn.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482228/SOSB0324009_1560x880_desktop_vpn0nd.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774481684/istockphoto-658610090-612x612_gxlzth.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482724/calculator-1516869_1920_ipeyrd.webp",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774739684/gg2HHUFPh4moLTii4WfyFV_sbxlo7.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774739730/image_947361300_tkaigt.webp",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774739905/The-Allure-of-Tax-Free-Municipal-Bonds_zsyd8b.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Institutional investing insights.",
          "cards": [
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            },
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            },
            {
              "eyebrow": "Travel", "title": "Maximize Your Travel Rewards", "body": "Premium travel cards turn everyday spending into dream vacations with points that work harder."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Travel", "title": "Maximize Your Travel Rewards", "body": "Premium travel cards turn everyday spending into dream vacations with points that work harder."
            },
            {
              "eyebrow": "Institutional", "title": "Institutional Insights", "body": "Strategic planning and the right financial products help you achieve your goals faster."
            },
            {
              "eyebrow": "Institutional", "title": "Institutional Insights", "body": "Strategic planning and the right financial products help you achieve your goals faster."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Stability",
            "title": "Short duration government tilt",
            "badgeText": "",
            "metrics": [
              {
                "label": "DURATION",
                "value": "2-3 yrs"
              },
              {
                "label": "CREDIT",
                "value": "Gov bias"
              }
            ],
            "features": [
              "Lower rate sensitivity story",
              "Liquidity emphasis",
              "Capital preservation framing",
              "Estimated metrics"
            ]
          },
          {
            "smallTag": "Core",
            "title": "Core investment grade",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "DURATION",
                "value": "Intermed."
              },
              {
                "label": "CREDIT",
                "value": "IG focus"
              }
            ],
            "features": [
              "Corporate and government mix",
              "Benchmark-aware process",
              "Income versus volatility trade-off",
              "Consultant DD"
            ]
          },
          {
            "smallTag": "Plus",
            "title": "Core-plus income",
            "badgeText": "",
            "metrics": [
              {
                "label": "YIELD",
                "value": "4.5%"
              },
              {
                "label": "RISK",
                "value": "Elevated"
              }
            ],
            "features": [
              "Selective below-IG allowance",
              "Drawdown discussion",
              "Fits some return-seeking sleeves",
              "Not for all policies"
            ]
          }
        ]
      },
      "sustainableInstitutional": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678873/modern-meeting-room-tech-trends-scaled_ab5p1a.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774739942/ImageForArticle_21371_16457084545525256_wksfma.webp",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482046/managersbusiness_ntnvs5.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482724/calculator-1516869_1920_ipeyrd.webp",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482562/HanmiBank-Equipment-Leasing_pgktwd.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774739942/ImageForArticle_21371_16457084545525256_wksfma.webp",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774740040/iStock-1199905534_gttxfe.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774740083/renewable-energy-technology-defined-solar-panels_uykgdu.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Institutional investing insights.",
          "cards": [
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            },
            {
              "eyebrow": "Travel", "title": "Maximize Your Travel Rewards", "body": "Premium travel cards turn everyday spending into dream vacations with points that work harder."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Institutional", "title": "Institutional Insights", "body": "Strategic planning and the right financial products help you achieve your goals faster."
            },
            {
              "eyebrow": "Institutional", "title": "Institutional Insights", "body": "Strategic planning and the right financial products help you achieve your goals faster."
            },
            {
              "eyebrow": "Institutional", "title": "Institutional Insights", "body": "Strategic planning and the right financial products help you achieve your goals faster."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Equity",
            "title": "Global ESG-integrated equity",
            "badgeText": "",
            "metrics": [
              {
                "label": "APPROACH",
                "value": "Integration"
              },
              {
                "label": "REPORTING",
                "value": "ESG"
              }
            ],
            "features": [
              "Materiality-focused research story",
              "Engagement where permitted",
              "Benchmark-relative risk",
              "Read prospectus before investing"
            ]
          },
          {
            "smallTag": "Real assets",
            "title": "Climate infrastructure sleeve",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "ROLE",
                "value": "Illiquid"
              },
              {
                "label": "TERM",
                "value": "Long"
              },
              {
                "label": "FIT",
                "value": "Satellite"
              }
            ],
            "features": [
              "Renewables and grid themes (illustrative)",
              "Liquidity and capacity constraints",
              "Low correlation story",
              "Due diligence required"
            ]
          },
          {
            "smallTag": "Fixed income",
            "title": "Green bond emphasis",
            "badgeText": "",
            "metrics": [
              {
                "label": "CREDIT",
                "value": "IG"
              },
              {
                "label": "DURATION",
                "value": "Intermed."
              }
            ],
            "features": [
              "Use-of-proceeds focus in selection",
              "Impact reporting varies by issuer",
              "Fits some liability-aware books",
              "Not a guarantee of impact"
            ]
          }
        ]
      },
      "liquidityInstitutional": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678873/modern-meeting-room-tech-trends-scaled_ab5p1a.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774739827/HowtoInvestinCorporateBondsGettyImages-1125626782-01c4aa86a81d471cb93a5c017029ee0d_xifjvn.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482364/istockphoto-1304746031-612x612_ccrxbd.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482562/HanmiBank-Equipment-Leasing_pgktwd.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774482228/SOSB0324009_1560x880_desktop_vpn0nd.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774740166/p2p-money-transfer-800x500_q8aazz.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774740212/intro-1666566558_j3c9iu.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774740336/Investments_What_happens_to_idle_cash_in_your_portfolio__Sweep_accounts_explained_c8bbml.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Institutional investing insights.",
          "cards": [
            {
              "eyebrow": "Market insight",
              "title": "Optimizing Supply Chain Finance",
              "body": "Financial strategies for logistics managers to maximize inventory and cash cycles."
            },
            {
              "eyebrow": "Market insight",
              "title": "Institutional Infrastructure Debt",
              "body": "Supporting large-scale industrial projects with tailored long-term financing solutions."
            },
            {
              "eyebrow": "Market insight",
              "title": "Global Business Scaling",
              "body": "Explore resources designed to help your enterprise scale efficiently across borders."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Scenario insight",
              "title": "Real-Time Cash Analytics",
              "body": "Gain visibility into your working capital with automated liquidity tracking and forecasting."
            },
            {
              "eyebrow": "Scenario insight",
              "title": "Liquidity in High-Rate Markets",
              "body": "Strategies for balancing immediate capital access with yield optimization for treasurers."
            },
            {
              "eyebrow": "Scenario insight",
              "title": "Overnight Sweep Account Model",
              "body": "See how our automated daily sweep ensures your excess capital earns interest while you sleep."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Cash",
            "title": "Automated Overnight Sweep",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "STABILITY",
                "value": "High"
              },
              {
                "label": "YIELD",
                "value": "Modest"
              }
            ],
            "features": [
              "Same-day liquidity typical",
              "Rule 2a-7 style framing",
              "Fits operational cash",
              "Read fund documents"
            ]
          },
          {
            "smallTag": "Ultra-short",
            "title": "Enhanced Cash Strategy",
            "badgeText": "",
            "metrics": [
              {
                "label": "DURATION",
                "value": "Very low"
              },
              {
                "label": "YIELD",
                "value": "Step-up"
              }
            ],
            "features": [
              "Slightly more yield than pure cash",
              "Mark-to-market fluctuation possible",
              "Minimum time horizon discussion",
              "Not FDIC insured"
            ]
          },
          {
            "smallTag": "Short IG",
            "title": "Institutional Money Market",
            "badgeText": "",
            "metrics": [
              {
                "label": "CREDIT",
                "value": "IG"
              },
              {
                "label": "VOL",
                "value": "Low–mod"
              }
            ],
            "features": [
              "Income over pure cash",
              "Rate and spread sensitivity",
              "Fits some reserve sleeves",
              "Policy limits apply"
            ]
          }
        ]
      }
    }
  },
  "insurance": {
    "useCases": {
      "auto": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479847/sports-car-insurance_mstufu.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479072/young-couple-renovating-home-and-dancing-in-living-room-EIF03304_wzfeup.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479444/Livery-Insurance-Close-up-Portrait-of-a-Woman-Driver-of-a-Car-Service-Smiling-at-the-Camera_vynex8.webp",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Financial planning and protection resources.",
          "cards": [
            {
              "eyebrow": "Home", "title": "First-Time Homebuyer Essentials", "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            },
            {
              "eyebrow": "Travel", "title": "Maximize Your Travel Rewards", "body": "Premium travel cards turn everyday spending into dream vacations with points that work harder."
            },
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            },
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            },
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Basic",
            "title": "State-aware essentials",
            "badgeText": "",
            "metrics": [
              {
                "label": "LIABILITY",
                "value": "Standard"
              },
              {
                "label": "DEDUCTIBLE",
                "value": "$750"
              }
            ],
            "features": [
              "Bodily injury and property damage",
              "Uninsured motorist options to discuss",
              "Digital ID cards",
              "Not a quote"
            ]
          },
          {
            "smallTag": "Balanced",
            "title": "Higher liability comfort",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "LIABILITY",
                "value": "Elevated"
              },
              {
                "label": "DEDUCTIBLE",
                "value": "$500"
              }
            ],
            "features": [
              "Increased liability limits",
              "Rental reimbursement option",
              "Accident forgiveness where available",
              "Licensed agent review"
            ]
          },
          {
            "smallTag": "Premium",
            "title": "Roadside & new-car extras",
            "badgeText": "",
            "metrics": [
              {
                "label": "ROADSIDE",
                "value": "Included"
              },
              {
                "label": "GLASS",
                "value": "No deductible"
              }
            ],
            "features": [
              "24/7 roadside and towing",
              "New car replacement discussion",
              "Gap coverage where applicable",
              "For illustration only"
            ]
          }
        ]
      },
      "home": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479639/exterior-cape-cod-house-mem-interiors-pc-r-brad-knipstein_d4kp5r.webp",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232099/homepage_personal_article_04_img_j78ibb.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479072/young-couple-renovating-home-and-dancing-in-living-room-EIF03304_wzfeup.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774677512/shutterstock_1414416203-600x400_sdr4my.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774741762/1000_F_430014652_BWwgK7W0VZztRlL24S13kii5aJh7XX6Z_me4qqa.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774741833/new-roof-buyer-discount-selling-home_tbaufv.png"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Insights and resources for homeowners.",
          "cards": [
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            },
            {
              "eyebrow": "Travel", "title": "Maximize Your Travel Rewards", "body": "Premium travel cards turn everyday spending into dream vacations with points that work harder."
            },
            {
              "eyebrow": "Home", "title": "First-Time Homebuyer Essentials", "body": "From pre-approval to closing, understanding the mortgage process helps you make confident decisions."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Home Insurance", "title": "Understanding Coverage Options for New Homes", "body": "Replacement cost versus actual cash value affects how claims are paid and what you'll receive after a loss."
            },
            {
              "eyebrow": "Property", "title": "What Home Inspections Reveal About Risk", "body": "Roof age, electrical systems, and plumbing condition impact both insurability and premium costs."
            },
            {
              "eyebrow": "Claims", "title": "How Deductibles Affect Your Premium", "body": "Higher deductibles lower monthly costs but increase out-of-pocket expense when you file a claim."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Core",
            "title": "Dwelling essentials",
            "badgeText": "",
            "metrics": [
              {
                "label": "COVERAGE",
                "value": "Basic protection"
              },
              {
                "label": "DEDUCTIBLE",
                "value": "$1k"
              }
            ],
            "features": [
              "Dwelling and other structures",
              "Personal property baseline",
              "Loss of use discussion",
              "Renters parallel available"
            ]
          },
          {
            "smallTag": "Replacement",
            "title": "Replacement cost emphasis",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "REBUILD",
                "value": "125% covered"
              },
              {
                "label": "DEDUCTIBLE",
                "value": "$1.5k"
              }
            ],
            "features": [
              "Rebuild cost check-ins",
              "Water backup rider option",
              "Scheduled jewelry conversation",
              "Agent verifies details"
            ]
          },
          {
            "smallTag": "High value",
            "title": "Premier home program",
            "badgeText": "",
            "metrics": [
              {
                "label": "COVERAGE",
                "value": "$500k liability"
              },
              {
                "label": "DEDUCTIBLE",
                "value": "$2k"
              }
            ],
            "features": [
              "Higher liability coordination",
              "Flood and quake referrals",
              "Appraisal workflow",
              "Not available everywhere"
            ]
          }
        ]
      },
      "life": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774676522/smiling-middle-aged-couple-with-laptop-studying-documents-while-working-couch-home_650366-839_ay2t1b.avif",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479639/exterior-cape-cod-house-mem-interiors-pc-r-brad-knipstein_d4kp5r.webp",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479847/sports-car-insurance_mstufu.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774741643/0270_638156165196814228_e7ni19.avif",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774678008/633408_RET-107794_financial-tips-multiGeneration_vpHero_1200x628_i23bsh.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201705/retirement-income-planning-gi2190459889-hero_1.jpg_m30krr.webp"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Financial planning and family protection.",
          "cards": [
            {
              "eyebrow": "Travel", "title": "Maximize Your Travel Rewards", "body": "Premium travel cards turn everyday spending into dream vacations with points that work harder."
            },
            {
              "eyebrow": "Investing", "title": "Understanding Market Trends", "body": "Economic indicators, sector rotation, and diversification help you make informed investment decisions."
            },
            {
              "eyebrow": "Auto", "title": "Financing Your Next Vehicle", "body": "Compare loan rates and terms to find the right balance between monthly payment and total interest cost."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Lending", "title": "Business Lending Options", "body": "Term loans, lines of credit, and equipment financing each serve different business needs and growth stages."
            },
            {
              "eyebrow": "Planning", "title": "Financial Planning Strategies", "body": "Goal-based planning, regular reviews, and flexible strategies help you adapt to life changes and market conditions."
            },
            {
              "eyebrow": "Insurance", "title": "Life Insurance for Families", "body": "Term and permanent life insurance options provide financial security for your loved ones."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Short bridge",
            "title": "10-year level term",
            "badgeText": "",
            "metrics": [
              {
                "label": "FACE",
                "value": "$500k"
              },
              {
                "label": "PREM",
                "value": "Illustrative"
              }
            ],
            "features": [
              "Income bridge during a loan payoff window",
              "Convertibility to discuss",
              "Exam may be required",
              "Subject to underwriting"
            ]
          },
          {
            "smallTag": "Family",
            "title": "20-year level term",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "FACE",
                "value": "$1M"
              },
              {
                "label": "PREM",
                "value": "Illustrative"
              }
            ],
            "features": [
              "Common horizon for young families",
              "Fixed premium during term",
              "Rider options with agent",
              "Beneficiary review"
            ]
          },
          {
            "smallTag": "Longer",
            "title": "30-year level term",
            "badgeText": "",
            "metrics": [
              {
                "label": "FACE",
                "value": "$750k"
              },
              {
                "label": "PREM",
                "value": "Illustrative"
              }
            ],
            "features": [
              "Longer mortgage alignment story",
              "Higher total premium vs shorter term",
              "Permanent options separate conversation",
              "Final rates via underwriting"
            ]
          }
        ]
      },
      "bundleHomeAuto": {
        "heroAssets": {
          "coldHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
          "warmHero": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774479847/sports-car-insurance_mstufu.jpg",
          "insight1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774472484/confident-student-in-shared-space-with-laptop_collagestyle_zeay8z.avif",
          "insight2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201707/Sixty-and-Me_How-to-Live-in-Luxury-in-Retirement_-No-Matter-Your-Budget_xcg3ws.jpg",
          "insight3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
          "warmTile1": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774741705/life-insurance_cets0p.jpg",
          "warmTile2": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
          "warmTile3": "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774202333/auto-insurance-insurance-options_wtctvt.png"
        },
        "homeMarketInsights": {
          "sectionSubtitle": "Protection and savings strategies.",
          "cards": [
            {
              "eyebrow": "Education", "title": "Student Loan Management", "body": "Understanding repayment options helps you manage debt while building your career and financial foundation."
            },
            {
              "eyebrow": "Retirement", "title": "Planning for Your Golden Years", "body": "Start retirement savings early to give compound interest decades to work in your favor."
            },
            {
              "eyebrow": "Travel", "title": "Maximize Your Travel Rewards", "body": "Premium travel cards turn everyday spending into dream vacations with points that work harder."
            }
          ]
        },
        "warmMarketInsights": {
          "cards": [
            {
              "eyebrow": "Life Insurance", "title": "Term Life Coverage for Growing Families", "body": "Term policies provide affordable protection during peak earning years when dependents rely on your income."
            },
            {
              "eyebrow": "Home", "title": "Protecting Your Property Investment", "body": "Comprehensive homeowners coverage shields your largest asset from fire, weather, theft, and liability claims."
            },
            {
              "eyebrow": "Auto", "title": "Choosing the Right Auto Coverage Limits", "body": "Liability limits protect your assets if you're at fault, while collision and comprehensive cover your vehicle."
            }
          ]
        },
        "cards": [
          {
            "smallTag": "Core Coverage",
            "title": "Essential Bundle",
            "badgeText": "",
            "metrics": [
              {
                "label": "SAVINGS",
                "value": "10%"
              },
              {
                "label": "DEDUCTIBLE",
                "value": "Split"
              }
            ],
            "features": [
              "State minimum auto limits",
              "Standard dwelling protection",
              "Digital claims tracking",
              "Affordable monthly premiums"
            ]
          },
          {
            "smallTag": "Recommended",
            "title": "Enhanced Protection Bundle",
            "badgeText": "Best Match",
            "metrics": [
              {
                "label": "SAVINGS",
                "value": "15%"
              },
              {
                "label": "DEDUCTIBLE",
                "value": "Single"
              }
            ],
            "features": [
              "Single deductible for shared events",
              "Replacement cost plus for home",
              "Accident forgiveness",
              "24/7 roadside assistance"
            ]
          },
          {
            "smallTag": "High Limit",
            "title": "Premier Shield Bundle",
            "badgeText": "",
            "metrics": [
              {
                "label": "SAVINGS",
                "value": "18%"
              },
              {
                "label": "UMBRELLA",
                "value": "Included"
              }
            ],
            "features": [
              "Maximum liability limits",
              "$1M Personal Umbrella included",
              "Valuable items rider",
              "Priority concierge claims support"
            ]
          }
        ]
      }
    }
  }
};

module.exports = { ADAPTIVE_MATRIX_OVERRIDES };
