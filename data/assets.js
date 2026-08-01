'use strict';
// Verbatim port from experience-simulator/public/script.js (lines 3092-3153).

const CUMULUS_ASSET_LIBRARY = {
  retailBanking: {
    coldHero:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231650/Couple_Budgeting_aozhqd.webp",
    warmHero:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201534/Hero_-_Woman_with_Credit_Card_nwnxhd.jpg",
    insight1:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201482/Travel-Credit-Card_qz9owg.jpg",
    insight2:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201481/Student-Credit-Card_a8038n.jpg",
    insight3:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
  },
  commercialBanking: {
    coldHero:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201669/S-Corp-Payroll-586_vmwlfq.jpg",
    warmHero:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231949/grow-small-business-1346252956_u9fcye.webp",
    insight1:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233491/economic-trends-as-interest-rates-move-2x-jpg_cmufdc.webp",
    insight2:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232863/Screenshot_2026-03-22_at_9.27.23_PM_bzbibz.png",
    insight3:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232863/Screenshot_2026-03-22_at_9.27.23_PM_bzbibz.png",
  },
  wealthManagement: {
    coldHero:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232720/RGB-JPG-GS_VM_Photo_WS_NYC_00276_bviiz1.avif",
    warmHero:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774231728/Rollover_IRAs_qmvvmo.webp",
    insight1:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201708/ways-to-maximize-your-retirement-life-1_okcwtq.jpg",
    insight2:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201707/Sixty-and-Me_How-to-Live-in-Luxury-in-Retirement_-No-Matter-Your-Budget_xcg3ws.jpg",
    insight3:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233421/how-to-choose-IRA-investments-2x-jpg_ybft7q.jpg",
  },
  assetManagement: {
    coldHero:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201514/Hero_-_Business_Meeting_junktj.png",
    warmHero:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232679/GS_VM_Photo_SH_NYC3_11375_RGB_uuyclk.webp",
    insight1:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233012/image.20220301_ewuyt6.jpg",
    insight2:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233219/asset-management-2x-jpg_hmxhkr.webp",
    insight3:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233150/professional-investment-advisory-intro-2x-jpg_uflsrq.jpg",
  },
  insurance: {
    coldHero:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201645/Gemini_Generated_Image_3kok5s3kok5s3kok_kyl5ne.png",
    warmHero:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774232320/property-insurance_bgwmxn.jpg",
    insight1:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774201646/Gemini_Generated_Image_o412gao412gao412_p0e0to.png",
    insight2:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774233587/business-auto-insurance-intro-2x-jpg_myb7kd.jpg",
    insight3:
      "https://res.cloudinary.com/dfx98jgdc/image/upload/v1774202333/auto-insurance-insurance-options_wtctvt.png",
  },
};

module.exports = { CUMULUS_ASSET_LIBRARY };
