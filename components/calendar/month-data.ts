type EventType = "holiday" | "vacation" | "event";

export type CalendarEvent = {
  day: number;
  label: string;
  type: EventType;
};

type MonthTheme = {
  subtitle: string;
  image: string;
  events: CalendarEvent[];
};

const CALENDAR_REFERENCE_IMAGE = "/image.png";

function svgDataUri(svg: string) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function sceneSvg({
  monthTitle,
  subtitle,
  skyTop,
  skyBottom,
  glow,
  farRange,
  midRange,
  nearRange,
  snow,
  accent,
  terrain,
  weather,
  figure,
  sunX = 1230,
  sunY = 150,
  ridgeShape = "mountain",
  foreground = ""
}: {
  monthTitle: string;
  subtitle: string;
  skyTop: string;
  skyBottom: string;
  glow: string;
  farRange: string;
  midRange: string;
  nearRange: string;
  snow: string;
  accent: string;
  terrain: string;
  weather: string;
  figure: string;
  sunX?: number;
  sunY?: number;
  ridgeShape?: "mountain" | "river" | "valley";
  foreground?: string;
}) {
  const ridgePaths = {
    mountain: `
      <path d="M210 760C384 670 526 580 770 478C856 442 924 398 1004 346C1070 396 1144 426 1212 450C1300 480 1400 516 1600 568V980H210V760Z" fill="url(#rockA)"/>
      <path d="M448 862C736 732 960 610 1186 468C1280 410 1374 368 1600 324V980H448V862Z" fill="url(#rockB)"/>
      <path d="M738 646C836 604 928 554 1054 482C1140 434 1260 374 1446 314L1330 382L1186 466L1082 524L948 602L842 660L772 680L738 646Z" fill="${snow}" fill-opacity="0.95"/>
      <path d="M526 840C770 730 954 644 1208 504L1226 556L1020 648L890 718L750 786L620 846L526 840Z" fill="#20313F" fill-opacity="0.38"/>
    `,
    river: `
      <path d="M0 710C196 620 394 572 582 544C770 516 930 500 1130 522C1320 543 1454 586 1600 624V980H0V710Z" fill="url(#rockA)"/>
      <path d="M0 790C182 722 340 696 522 704C690 712 844 750 976 738C1122 726 1236 660 1392 650C1490 644 1548 658 1600 676V980H0V790Z" fill="url(#rockB)"/>
      <path d="M368 980C428 900 482 834 592 784C738 718 872 724 1008 670C1162 608 1244 514 1396 460C1472 434 1532 418 1600 412V980H368Z" fill="${accent}" fill-opacity="0.25"/>
      <path d="M590 980C684 922 790 866 880 820C968 776 1026 732 1088 666C1162 588 1236 518 1368 442L1600 392V980H590Z" fill="#E8F6FF" fill-opacity="0.9"/>
      <path d="M636 980C732 916 834 852 916 798C1002 742 1054 692 1114 632C1186 560 1266 494 1392 424" stroke="#B9E5FF" stroke-width="28" stroke-linecap="round" opacity="0.65"/>
    `,
    valley: `
      <path d="M0 734C160 654 312 620 488 610C690 598 846 640 1026 592C1200 546 1356 448 1600 376V980H0V734Z" fill="url(#rockA)"/>
      <path d="M0 820C186 760 340 748 528 766C714 784 842 838 1028 806C1236 770 1380 654 1600 550V980H0V820Z" fill="url(#rockB)"/>
      <path d="M704 668C788 634 862 620 948 594C1026 570 1096 520 1188 454C1258 404 1362 340 1490 286L1428 344L1324 410L1228 476L1120 550L1010 614L886 664L780 690L704 668Z" fill="${snow}" fill-opacity="0.8"/>
      <path d="M844 980C946 900 1014 834 1082 758C1164 666 1226 578 1360 478L1600 404V980H844Z" fill="${accent}" fill-opacity="0.18"/>
    `
  };

  return svgDataUri(`
    <svg width="1600" height="980" viewBox="0 0 1600 980" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sky" x1="800" y1="0" x2="800" y2="980" gradientUnits="userSpaceOnUse">
          <stop stop-color="${skyTop}"/>
          <stop offset="1" stop-color="${skyBottom}"/>
        </linearGradient>
        <linearGradient id="rockA" x1="800" y1="300" x2="760" y2="920" gradientUnits="userSpaceOnUse">
          <stop stop-color="${farRange}"/>
          <stop offset="1" stop-color="${midRange}"/>
        </linearGradient>
        <linearGradient id="rockB" x1="1180" y1="360" x2="760" y2="940" gradientUnits="userSpaceOnUse">
          <stop stop-color="${midRange}"/>
          <stop offset="1" stop-color="${nearRange}"/>
        </linearGradient>
        <linearGradient id="snowline" x1="1020" y1="430" x2="860" y2="690" gradientUnits="userSpaceOnUse">
          <stop stop-color="${snow}"/>
          <stop offset="1" stop-color="rgba(255,255,255,0.2)"/>
        </linearGradient>
        <filter id="grain" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="2" stitchTiles="stitch"/>
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.07"/>
          </feComponentTransfer>
        </filter>
      </defs>

      <rect width="1600" height="980" fill="url(#sky)"/>
      <circle cx="${sunX}" cy="${sunY}" r="118" fill="${glow}" fill-opacity="0.75"/>
      <ellipse cx="1180" cy="160" rx="270" ry="92" fill="#FFFFFF" fill-opacity="0.1"/>
      <ellipse cx="360" cy="230" rx="240" ry="96" fill="#FFFFFF" fill-opacity="0.16"/>

      ${weather}

      <path d="M0 714C280 650 470 594 728 540C980 487 1260 464 1600 454V980H0V714Z" fill="${accent}" fill-opacity="0.22"/>
      <path d="M0 780C260 724 486 664 748 590C950 534 1160 510 1600 520V980H0V780Z" fill="${terrain}" fill-opacity="0.18"/>

      ${ridgePaths[ridgeShape]}
      ${foreground}

      <path d="M980 452C1006 442 1030 450 1050 472L1062 490L1082 454C1096 426 1118 412 1148 414C1174 416 1198 434 1208 458L1222 490C1226 500 1232 506 1242 512L1282 536C1296 544 1302 560 1294 576C1288 586 1278 592 1266 594L1240 598L1224 668L1190 660L1202 598L1168 590L1120 642L1092 620L1138 566L1110 542L1068 590L1038 570L1078 508L1064 492C1054 482 1038 478 1022 480L1000 482L980 452Z" fill="${figure}"/>
      <path d="M1198 640L1268 786" stroke="#111A22" stroke-width="8" stroke-linecap="round"/>
      <path d="M1158 632L1104 824" stroke="#111A22" stroke-width="8" stroke-linecap="round"/>
      <path d="M1174 676L1240 676" stroke="#EAF0F5" stroke-width="6" stroke-linecap="round" stroke-dasharray="10 14" opacity="0.85"/>

      <text x="92" y="154" fill="white" fill-opacity="0.72" font-family="Arial, sans-serif" font-size="34" font-weight="700" letter-spacing="8">${subtitle}</text>
      <text x="92" y="878" fill="white" fill-opacity="0.34" font-family="Arial, sans-serif" font-size="88" font-weight="700" letter-spacing="10">${monthTitle}</text>
      <rect width="1600" height="980" fill="#fff" filter="url(#grain)" opacity="0.52"/>
    </svg>
  `);
}

const cloudBand = `
  <ellipse cx="320" cy="192" rx="180" ry="58" fill="#FFFFFF" fill-opacity="0.12"/>
  <ellipse cx="460" cy="168" rx="120" ry="42" fill="#FFFFFF" fill-opacity="0.1"/>
`;

const mistBand = `
  <rect y="392" width="1600" height="96" fill="white" fill-opacity="0.08"/>
`;

const rainBand = `
  <rect width="1600" height="980" fill="url(#rainMask)" opacity="0"/>
  <g opacity="0.12" stroke="#E7EEF6" stroke-width="3" stroke-linecap="round">
    <path d="M210 120L160 260"/><path d="M320 84L270 224"/><path d="M458 142L408 282"/>
    <path d="M620 118L570 258"/><path d="M776 92L726 232"/><path d="M948 132L898 272"/>
    <path d="M1128 84L1078 224"/><path d="M1280 110L1230 250"/><path d="M1428 144L1378 284"/>
  </g>
`;

const MONTH_THEMES: MonthTheme[] = [
  {
    subtitle: "Snow ridge expedition",
    image: sceneSvg({
      monthTitle: "JANUARY",
      subtitle: "SNOW RIDGE EXPEDITION",
      skyTop: "#EAF0F7",
      skyBottom: "#AAB9CA",
      glow: "#FFFFFF",
      farRange: "#8CA0B5",
      midRange: "#61778B",
      nearRange: "#304352",
      snow: "#F9FCFF",
      accent: "#84A5C4",
      terrain: "#6E8799",
      weather: cloudBand,
      figure: "#D44939",
      ridgeShape: "mountain"
    }),
    events: [
      { day: 1, label: "New Year", type: "holiday" },
      { day: 14, label: "Winter Break", type: "vacation" },
      { day: 26, label: "Republic Day", type: "holiday" }
    ]
  },
  {
    subtitle: "Blue frost morning",
    image: sceneSvg({
      monthTitle: "FEBRUARY",
      subtitle: "BLUE FROST MORNING",
      skyTop: "#E4EBF4",
      skyBottom: "#93A8BF",
      glow: "#FFF0C8",
      farRange: "#7E95A8",
      midRange: "#5B7287",
      nearRange: "#2E4353",
      snow: "#F0F7FC",
      accent: "#7798BA",
      terrain: "#6E8297",
      weather: mistBand,
      figure: "#E06A45",
      ridgeShape: "valley",
      sunX: 1180
    }),
    events: [
      { day: 10, label: "School Trip", type: "vacation" },
      { day: 14, label: "Foundation Day", type: "event" },
      { day: 26, label: "Festival Leave", type: "holiday" }
    ]
  },
  {
    subtitle: "Spring thaw ascent",
    image: sceneSvg({
      monthTitle: "MARCH",
      subtitle: "SPRING THAW ASCENT",
      skyTop: "#DBF1F0",
      skyBottom: "#8FBFBE",
      glow: "#FFF5C8",
      farRange: "#7AA5A4",
      midRange: "#557C7D",
      nearRange: "#2D4E4D",
      snow: "#F3FFFD",
      accent: "#7AB8BA",
      terrain: "#74A0A1",
      weather: cloudBand,
      figure: "#D85A49",
      ridgeShape: "valley",
      foreground:
        '<path d="M0 862C138 812 266 786 386 800C482 812 572 846 688 844C780 842 852 822 934 770L1000 742L1034 790L944 842C850 896 728 932 582 944C396 960 224 938 0 980V862Z" fill="#F2E8D8" fill-opacity="0.82"/>'
    }),
    events: [
      { day: 8, label: "Spring Camp", type: "vacation" },
      { day: 25, label: "Holiday", type: "holiday" },
      { day: 31, label: "Quarter End", type: "event" }
    ]
  },
  {
    subtitle: "Clear sky summit wall",
    image: sceneSvg({
      monthTitle: "APRIL",
      subtitle: "CLEAR SKY SUMMIT WALL",
      skyTop: "#D7EBFF",
      skyBottom: "#74ABD8",
      glow: "#FFF0BC",
      farRange: "#73A4CF",
      midRange: "#4B7291",
      nearRange: "#233F51",
      snow: "#EEF8FF",
      accent: "#5AA2DA",
      terrain: "#7AB3D9",
      weather: "",
      figure: "#D1493B",
      ridgeShape: "mountain",
      sunX: 1320
    }),
    events: [
      { day: 1, label: "Annual Leave", type: "holiday" },
      { day: 10, label: "Vacation", type: "vacation" },
      { day: 21, label: "Govt Holiday", type: "holiday" }
    ]
  },
  {
    subtitle: "Golden hour granite",
    image: sceneSvg({
      monthTitle: "MAY",
      subtitle: "GOLDEN HOUR GRANITE",
      skyTop: "#F8E7C8",
      skyBottom: "#D59C60",
      glow: "#FFF3CF",
      farRange: "#B98557",
      midRange: "#7B5A3E",
      nearRange: "#483323",
      snow: "#FFF6E8",
      accent: "#C98A49",
      terrain: "#C59564",
      weather: "",
      figure: "#D84B35",
      ridgeShape: "river",
      sunX: 1160,
      sunY: 132
    }),
    events: [
      { day: 1, label: "Labour Day", type: "holiday" },
      { day: 12, label: "Summer Break", type: "vacation" },
      { day: 28, label: "Travel Day", type: "event" }
    ]
  },
  {
    subtitle: "Monsoon edge route",
    image: sceneSvg({
      monthTitle: "JUNE",
      subtitle: "MONSOON EDGE ROUTE",
      skyTop: "#CEDAE7",
      skyBottom: "#6A8298",
      glow: "#E5EEF7",
      farRange: "#7C90A5",
      midRange: "#536B82",
      nearRange: "#2B4050",
      snow: "#E9F2F9",
      accent: "#6084A4",
      terrain: "#6B879D",
      weather: rainBand,
      figure: "#DE614B",
      ridgeShape: "river"
    }),
    events: [
      { day: 7, label: "Retreat", type: "vacation" },
      { day: 17, label: "Public Holiday", type: "holiday" },
      { day: 30, label: "Half Year", type: "event" }
    ]
  },
  {
    subtitle: "Storm line traverse",
    image: sceneSvg({
      monthTitle: "JULY",
      subtitle: "STORM LINE TRAVERSE",
      skyTop: "#CDD7E1",
      skyBottom: "#71879C",
      glow: "#F0F5F8",
      farRange: "#738A9F",
      midRange: "#4D6477",
      nearRange: "#283C4B",
      snow: "#E8F2FB",
      accent: "#6382A1",
      terrain: "#728B9D",
      weather: `${cloudBand}${rainBand}`,
      figure: "#D24A3A",
      ridgeShape: "river",
      foreground:
        '<path d="M0 874C146 826 278 808 406 816C554 826 662 872 796 874C940 876 1048 818 1206 738L1352 664L1600 614V980H0V874Z" fill="#C5D9E5" fill-opacity="0.26"/>'
    }),
    events: [
      { day: 6, label: "Monsoon Break", type: "vacation" },
      { day: 15, label: "Govt Holiday", type: "holiday" },
      { day: 27, label: "Team Trek", type: "event" }
    ]
  },
  {
    subtitle: "Blue summit light",
    image: sceneSvg({
      monthTitle: "AUGUST",
      subtitle: "BLUE SUMMIT LIGHT",
      skyTop: "#D1ECFF",
      skyBottom: "#63AEE1",
      glow: "#FFF5C1",
      farRange: "#6AA7D2",
      midRange: "#467390",
      nearRange: "#214355",
      snow: "#F3FBFF",
      accent: "#469BD3",
      terrain: "#77BCE8",
      weather: "",
      figure: "#D54738",
      ridgeShape: "river",
      foreground:
        '<path d="M0 830C130 792 248 788 360 810C474 832 572 874 698 882C860 892 1010 826 1126 754C1242 682 1362 598 1600 520V980H0V830Z" fill="#D8EEF7" fill-opacity="0.22"/>'
    }),
    events: [
      { day: 15, label: "Independence", type: "holiday" },
      { day: 19, label: "Family Vacation", type: "vacation" },
      { day: 30, label: "Field Visit", type: "event" }
    ]
  },
  {
    subtitle: "Dry trail season",
    image: sceneSvg({
      monthTitle: "SEPTEMBER",
      subtitle: "DRY TRAIL SEASON",
      skyTop: "#F2E0C4",
      skyBottom: "#C68E51",
      glow: "#FFE4AA",
      farRange: "#B77A45",
      midRange: "#775235",
      nearRange: "#452F23",
      snow: "#FFF6EC",
      accent: "#A76A39",
      terrain: "#BC8453",
      weather: "",
      figure: "#C94637",
      ridgeShape: "valley"
    }),
    events: [
      { day: 5, label: "Teacher's Day", type: "event" },
      { day: 16, label: "Holiday", type: "holiday" },
      { day: 24, label: "Vacation", type: "vacation" }
    ]
  },
  {
    subtitle: "Autumn cliff glow",
    image: sceneSvg({
      monthTitle: "OCTOBER",
      subtitle: "AUTUMN CLIFF GLOW",
      skyTop: "#F4D7BD",
      skyBottom: "#D3784F",
      glow: "#FFF0C7",
      farRange: "#C16E45",
      midRange: "#7D4B39",
      nearRange: "#4C2E25",
      snow: "#FFF2E6",
      accent: "#BE6A45",
      terrain: "#D19167",
      weather: "",
      figure: "#BE4032",
      ridgeShape: "valley",
      foreground:
        '<path d="M0 854C126 820 286 782 430 786C584 790 680 832 842 828C1040 824 1188 718 1314 650C1418 594 1494 566 1600 538V980H0V854Z" fill="#F3D1AE" fill-opacity="0.2"/>'
    }),
    events: [
      { day: 2, label: "Gandhi Jayanti", type: "holiday" },
      { day: 11, label: "Festival Break", type: "vacation" },
      { day: 24, label: "Office Event", type: "event" }
    ]
  },
  {
    subtitle: "Cold paper light",
    image: sceneSvg({
      monthTitle: "NOVEMBER",
      subtitle: "COLD PAPER LIGHT",
      skyTop: "#E0E9F0",
      skyBottom: "#92A7B8",
      glow: "#FFF8D8",
      farRange: "#7C93A6",
      midRange: "#546C7D",
      nearRange: "#2D4250",
      snow: "#F4F8FB",
      accent: "#6E90A9",
      terrain: "#8EA7BA",
      weather: mistBand,
      figure: "#D35040",
      ridgeShape: "mountain",
      sunX: 1280
    }),
    events: [
      { day: 1, label: "Public Holiday", type: "holiday" },
      { day: 14, label: "Children's Day", type: "event" },
      { day: 25, label: "Vacation", type: "vacation" }
    ]
  },
  {
    subtitle: "Year end climb",
    image: sceneSvg({
      monthTitle: "DECEMBER",
      subtitle: "YEAR END CLIMB",
      skyTop: "#E6EDF5",
      skyBottom: "#A0B1C4",
      glow: "#FFFFFF",
      farRange: "#8A9DB2",
      midRange: "#617489",
      nearRange: "#324554",
      snow: "#FBFDFF",
      accent: "#7D97B0",
      terrain: "#90A3B8",
      weather: cloudBand,
      figure: "#D84334",
      ridgeShape: "mountain",
      foreground:
        '<path d="M0 868C156 830 290 824 432 844C566 862 698 898 820 900C1006 904 1164 824 1318 728C1414 668 1494 624 1600 590V980H0V868Z" fill="#F4F8FB" fill-opacity="0.3"/>'
    }),
    events: [
      { day: 8, label: "Winter Vacation", type: "vacation" },
      { day: 25, label: "Christmas", type: "holiday" },
      { day: 31, label: "Year End", type: "event" }
    ]
  }
];

export function getMonthTheme(monthIndex: number) {
  return {
    ...MONTH_THEMES[monthIndex],
    image: CALENDAR_REFERENCE_IMAGE
  };
}
