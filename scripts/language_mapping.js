const language_mapping = {
    english: {
      reportTitle: "REPORT",
      diamonds: "DIAMONDS",
      diamondsFromMatch: "DIAMONDS FROM MATCH",
      liveDuration: "LIVE DURATION",
      newFollowers: "NEW FOLLOWERS",
      comparedToLast: "*Compared to last",
      comparisonWeek: "week",
      comparisonMonth: "month",
      liveTag: "LIVE",
      emailWeekly: `Hi \${username},
  
  Please see your last week's performance and progress in the attachment.
  
  Keep up the great work! We’re always very proud of you and what you have achieved.
  
  If you ever need support or clarification, don’t hesitate to reach out to your manager anytime.
  
  StarPower Media Creator Support 🥰`,
      emailMonthly: `Hi \${username},
  
  Please see your last month's performance and progress in the attachment.
  
  Keep up the great work! We’re always very proud of you and what you have achieved.
  
  If you ever need support or clarification, don’t hesitate to reach out to your manager anytime.
  
  StarPower Media Creator Support 🥰`
    },
    arabic: {
      reportTitle: "تقرير",
      diamonds: "جواهر",
      diamondsFromMatch: "ألماس من المباراة",
      liveDuration: "مدة البث المباشر",
      newFollowers: "متابعون جدد",
      comparedToLast: "*مقارنة بالأسبوع/الشهر الماضي",
      comparisonWeek: "الأسبوع الماضي",    // 新增
      comparisonMonth: "الشهر الماضي",      // 新增
      liveTag: "مباشر",
      emailWeekly: `مرحبًا \${username}،

      يرجى الاطلاع على أدائك وتقدمك خلال الأسبوع الماضي في المرفق.
      
      تابع العمل الرائع! نحن دائمًا فخورون بك وبما حققته.
      
      إذا كنت بحاجة إلى أي دعم أو توضيح، لا تتردد في التواصل مع مديرك في أي وقت.
      
      فريق دعم المبدعين في StarPower Media 🥰`,
      emailMonthly: `مرحبًا \${username}،
      
      يرجى الاطلاع على أدائك وتقدمك خلال الشهر الماضي في المرفق.
      
      تابع هذا العمل الرائع! نحن دائمًا فخورون بك وبما حققته.
      
      إذا كنت بحاجة إلى أي دعم أو توضيح، فلا تتردد في التواصل مع مديرك في أي وقت.
      
      فريق دعم المبدعين في StarPower Media 🥰`
      
    }
  };
  
  module.exports = { language_mapping };
  