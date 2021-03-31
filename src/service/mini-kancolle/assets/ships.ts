const shipsConfig = [
  {
    id: 1000,
    name: 'まるゆ',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 1,
  },
  {
    id: 1001,
    name: '武蔵',
    resource: [3500, 4500, 4000, 2000],
    seceretary: null,
    weight: 50,
  },
  {
    id: 1002,
    name: '大和',
    resource: [3500, 4500, 4000, 2000],
    seceretary: null,
    weight: 50,
  },
  {
    id: 1003,
    name: 'Bismarck',
    resource: [3500, 4500, 4000, 2000],
    seceretary: [1003, 2000, 2001, 2002],
    weight: 60,
  },
  {
    id: 1004,
    name: '大鳳',
    resource: [3000, 3000, 3000, 4000],
    seceretary: null,
    weight: 65,
  },
  {
    id: 1005,
    name: 'Saratoga',
    resource: [3000, 3000, 3000, 4000],
    seceretary: [1005, 1010, 1033, 2006, 2009, 2011, 2012],
    weight: 65,
  },
  {
    id: 1006,
    name: 'Zara',
    resource: [3000, 4000, 4000, 2000],
    seceretary: [2003, 1007],
    weight: 40,
  },
  {
    id: 1007,
    name: 'あきつ丸',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1008,
    name: 'Pola',
    resource: [3000, 4000, 4000, 2000],
    seceretary: [2003, 1006],
    weight: 40,
  },
  {
    id: 1009,
    name: '瑞穂',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 25,
  },
  {
    id: 1010,
    name: '神威',
    resource: [3000, 2000, 5000, 3500],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1011,
    name: '阿賀野',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 30,
  },
  {
    id: 1012,
    name: '能代',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 25,
  },
  {
    id: 1013,
    name: '矢矧',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1014,
    name: '伊401',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 10,
  },
  {
    id: 1015,
    name: '伊400',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 10,
  },
  {
    id: 1016,
    name: '三隈',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 25,
  },
  {
    id: 1017,
    name: '鈴谷',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1018,
    name: '熊野',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1019,
    name: '長門',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1020,
    name: '陸奥',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1021,
    name: '金剛',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1022,
    name: '比叡',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1023,
    name: '榛名',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1024,
    name: '霧島',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1025,
    name: '日向',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1026,
    name: '伊勢',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 40,
  },
  {
    id: 1027,
    name: '飛龍',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1028,
    name: '蒼龍',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1029,
    name: '赤城',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1030,
    name: '加賀',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1031,
    name: '扶桑',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1032,
    name: '山城',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 35,
  },
  {
    id: 1033,
    name: 'Iowa',
    resource: [3500, 4500, 4000, 2000],
    seceretary: [1033, 1005, 1010, 2006, 2009, 2011, 2012],
    weight: 330,
  },
  {
    id: 1034,
    name: '明石',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 25,
  },
  {
    id: 1035,
    name: 'Roma',
    resource: [3500, 4500, 4000, 2000],
    seceretary: [1036, 1037, 2003, 2004],
    weight: 50,
  },
  {
    id: 1036,
    name: 'Littorio',
    resource: [3500, 4500, 4000, 2000],
    seceretary: [1035, 1037, 2003, 2004],
    weight: 50,
  },
  {
    id: 1037,
    name: 'Vittorio Veneto',
    resource: [3500, 4500, 4000, 2000],
    seceretary: [1035, 1036, 2003, 2004],
    weight: 25,
  },
  {
    id: 1038,
    name: '信濃',
    resource: [3500, 4500, 4000, 4000],
    seceretary: null,
    weight: 30,
  },
  {
    id: 1039,
    name: 'Warspite',
    resource: [3500, 4000, 4500, 2000],
    seceretary: [2007, 2008],
    weight: 65,
  },
  {
    id: 1040,
    name: 'Queen Elizabeth',
    resource: [3500, 4000, 4500, 2000],
    seceretary: [2007, 2008],
    weight: 65,
  },
  {
    id: 1041,
    name: 'Гангут',
    resource: [3500, 4000, 4500, 2000],
    seceretary: [2010],
    weight: 65,
  },
  {
    id: 1042,
    name: 'Nelson',
    resource: [3500, 4000, 4500, 2000],
    seceretary: [2007, 2008],
    weight: 65,
  },
  {
    id: 1043,
    name: 'Richelieu',
    resource: [3500, 4000, 4500, 2000],
    seceretary: null,
    weight: 30,
  },
  {
    id: 1044,
    name: 'Rodney',
    resource: [3500, 4000, 4500, 2000],
    seceretary: [2007, 2008, 1003],
    weight: 65,
  },
  {
    id: 1045,
    name: '翔鶴',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 50,
  },
  {
    id: 1046,
    name: '瑞鹤',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 50,
  },
  {
    id: 1047,
    name: '雲龍',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 50,
  },
  {
    id: 1048,
    name: '天城',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 50,
  },
  {
    id: 1049,
    name: '葛城',
    resource: [1500, 1500, 2000, 3000],
    seceretary: null,
    weight: 50,
  },
  {
    id: 1050,
    name: '酒匂',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1051,
    name: 'Graf Zeppelin',
    resource: [3500, 4500, 4000, 3000],
    seceretary: [2000, 2001, 2002, 1003],
    weight: 50,
  },
  {
    id: 1052,
    name: 'Gambier Bay',
    resource: [1500, 1500, 2000, 1000],
    seceretary: [2005, 2006, 2009, 2011, 2012],
    weight: 30,
  },
  {
    id: 1053,
    name: '伊26',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1054,
    name: '伊504',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1055,
    name: 'U-511',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1056,
    name: 'Houston',
    resource: [3000, 4000, 4000, 2000],
    seceretary: [2006, 2009, 1010],
    weight: 50,
  },
  {
    id: 1057,
    name: 'イオナ',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1058,
    name: 'タカオ',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1059,
    name: 'マヤ',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1060,
    name: 'ハルナ',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1061,
    name: 'コンゴウ',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 1062,
    name: 'ヒュウガ',
    resource: [2000, 2000, 2000, 1000],
    seceretary: null,
    weight: 20,
  },
  {
    id: 2000,
    name: 'Z1',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2001,
    name: 'Z3',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2002,
    name: 'Prinz Eugen',
    resource: [1500, 1500, 2000, 2500],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2003,
    name: 'Maestrale',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2004,
    name: 'Libeccio',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2005,
    name: 'Samuel B.Roberts',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2006,
    name: 'Johnston',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2007,
    name: 'Jervis',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2008,
    name: 'Janus',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2009,
    name: 'Fletcher',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2010,
    name: 'Ташкент',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2011,
    name: 'Atlanta',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2012,
    name: 'Cleveland',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 2013,
    name: '丹阳',
    resource: [1500, 1500, 2000, 1000],
    seceretary: null,
    weight: 0,
  },
  {
    id: 3000,
    name: 'Colorado',
    resource: [3500, 4500, 4000, 1500],
    seceretary: [2006, 2009, 2011, 2012, 1010, 1033],
    weight: 333,
  },
  {
    id: 3001,
    name: 'Maryland',
    resource: [3500, 4500, 4000, 1500],
    seceretary: [2006, 2009, 2011, 2012, 1010, 1033],
    weight: 333,
  },
  {
    id: 3002,
    name: 'West Virginia',
    resource: [3500, 4500, 4000, 1500],
    seceretary: [2006, 2009, 2011, 2012, 1010, 1033],
    weight: 333,
  },
  {
    id: 3003,
    name: 'Belfast',
    resource: [2000, 2000, 2500, 1000],
    seceretary: [2007, 2008, 1039, 1040],
    weight: 1,
  },
  {
    id: 3004,
    name: 'Gneisenau',
    resource: [3500, 4500, 4000, 2000],
    seceretary: [2000, 2001, 2002, 1003],
    weight: 5,
  },
];

export default shipsConfig;