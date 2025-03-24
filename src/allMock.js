export default {
   traces: [
    {
      nodes: [
        {
          cmdbId: 'appid_1897120647464366080@0',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763235363430400@1',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@1',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763300786184192@1',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763263461072896@-1',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1902612325819564034',
          source: 'appid_1897120647464366080@0',
          target: 'appid_1891763300786184192@1',
        },
        {
          id: '1902612325827952641',
          source: 'appid_1897120647464366080@0',
          target: 'appid_1891763255118602240@1',
        },
        {
          id: '1902612325827952642',
          source: 'appid_1897120647464366080@0',
          target: 'appid_1891763235363430400@1',
        },
        {
          id: '1902612325827952643',
          source: 'appid_1891763263461072896@-1',
          target: 'appid_1897120647464366080@0',
        },
        {
          id: '1902612325827952644',
          source: 'appid_1891763235363430400@1',
          target: 'appid_1891763255118602240@2',
        },
      ],
      serviceLineConfig: {
        id: '1870767861098729474',
        name: '安全检测',
        presetLine: 3,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'application_system_1809477098664497152@0',
          systemName: '央行征信系统',  },
        {
          cmdbId: 'application_system_1809477098664497154@1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@3',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1900088151502753794',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763300786184192@2',
        },
        {
          id: '1900088151506948097',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763255118602240@2',
        },
        {
          id: '1900088151506948098',
          source: 'appid_1891763263461072896@0',
          target: 'appid_1897120647464366080@1',
        },
        {
          id: '1900088151506948099',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763235363430400@2',
        },
        {
          id: '1900088151506948100',
          source: 'appid_1891763300786184192@2',
          target: 'appid_1891763255118602240@3',
        },
        {
          id: '1900088151506948101',
          source: 'application_system_1809477098664497154@1',
          target: 'application_system_1809477098664497152@2',
        },
        {
          id: '1900088151506948102',
          source: 'application_system_1809477098664497152@2',
          target: 'application_system_1809477098664497152@3',
        },
        {
          id: '1900088151506948103',
          source: 'application_system_1809477098664497152@0',
          target: 'application_system_1809477098664497154@1',
        },
      ],
      serviceLineConfig: {
        id: '1871492894238449666',
        name: '测试-系统',
        presetLine: 5,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'appid_1809492238449381376',
          systemName: '火车票订票系统',
        },
        {
          cmdbId: 'appid_1809490723416444928',systemName: '火车票订票系统',
        },
        {
          cmdbId: 'appid_1809490723680686080',
          systemName: '火车票订票系统',
        },
        {
          cmdbId: 'appid_1817895141665599489',
          systemName: '火车票订票系统',
        },
        {
          cmdbId: 'appid_1809490725308076032',
          systemName: '行程信息系统',
        },
        {
          cmdbId: 'appid_1809491226942640128',
          systemName: '火车票订票系统',
        },
        {
          cmdbId: 'appid_1809490732618747904',
          systemName: '站台信息系统',
        },
        {
          cmdbId: 'appid_1809490724519546880',
          systemName: '火车票订票系统',
        },
      ],
      edges: [
        {
          id: '1892865610237460481',
          source: 'appid_1809490723680686080',
          target: 'appid_1809490723416444928',
        },
        {
          id: '1892865610254237697',
          source: 'appid_1817895141665599489',
          target: 'appid_1809490725308076032',
        },
        {
          id: '1892865610254237698',
          source: 'appid_1817895141665599489',
          target: 'appid_1809490723680686080',
        },
        {
          id: '1892865610254237699',
          source: 'appid_1809490723416444928',
          target: 'appid_1809492238449381376',
        },
        {
          id: '1892865610254237700',
          source: 'appid_1817895141665599489',
          target: 'appid_1809490732618747904',
        },
        {
          id: '1892865610254237701',
          source: 'appid_1809492238449381376',
          target: 'appid_1809491226942640128',
        },
        {
          id: '1892865610254237702',
          source: 'appid_1809490724519546880',
          target: 'appid_1817895141665599489',
        },
      ],
      serviceLineConfig: {
        id: '1871493564467298305',
        name: 'test',
        presetLine: 11,
      },
    },
    { nodes: [
        {
          cmdbId: 'application_system_1809477098664497154@-1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@-1',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@-2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497154@-2',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@-3',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497154@-3',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@-4',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1900110414415400961',
          source: 'appid_1897120647464366080@-1',
          target: 'appid_1891763255118602240@0',
        },
        {
          id: '1900110414415400962',
          source: 'appid_1897120647464366080@-2',
          target: 'appid_1891763300786184192@-1',
        },
        {
          id: '1900110414419595265',
          source: 'application_system_1809477098664497152@-2',
          target: 'application_system_1809477098664497154@-1',
        },
        {
          id: '1900110414419595266',
          source: 'application_system_1809477098664497152@-3',
          target: 'application_system_1809477098664497154@-2',
        },
        {
          id: '1900110414419595267',
          source: 'application_system_1809477098664497152@-4',
          target: 'application_system_1809477098664497154@-3',
        },
        {
          id: '1900110414419595268',
          source: 'appid_1891763235363430400@-2',
          target: 'appid_1897120647464366080@-1',
        },
        {
          id: '1900110414419595269',
          source: 'appid_1891763235363430400@-4',
          target: 'appid_1897120647464366080@-3', },
        {
          id: '1900110414419595270',
          source: 'appid_1891763235363430400@-3',
          target: 'appid_1897120647464366080@-2',
        },
        {
          id: '1900110414423789569',
          source: 'application_system_1809477098664497154@-1',
          target: 'application_system_1809477098664497152@0',
        },
        {
          id: '1900110414423789570',
          source: 'application_system_1809477098664497154@-2',
          target: 'application_system_1809477098664497152@-1',
        },
        {
          id: '1900110414423789571',
          source: 'application_system_1809477098664497154@-3',
          target: 'application_system_1809477098664497152@-2',
        },
        {
          id: '1900110414423789572',
          source: 'appid_1897120647464366080@-3',
          target: 'appid_1891763235363430400@-2',
        },
        {
          id: '1900110414423789573',
          source: 'appid_1891763300786184192@-1',
          target: 'appid_1891763255118602240@0',
        },
        {
          id: '1900110414423789574',
          source: 'application_system_1809477098664497152@-1',
          target: 'application_system_1809477098664497152@0',
        },
        {
          id: '1900110414427983874',
          source: 'appid_1891763263461072896@-2',
          target: 'appid_1897120647464366080@-1',
        },
        {
          id: '1900110414427983875',
          source: 'appid_1891763263461072896@-3',
          target: 'appid_1897120647464366080@-2',
        },
      ],
      serviceLineConfig: {
        id: '1891791770560290818',
        name: '11',
        presetLine: 10,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'application_system_1809477099734044672',
          systemName: '火车票订票系统',
        },
        {
          cmdbId: 'application_system_1809477099729850368',
          systemName: '行程信息系统',
        },
        {
          cmdbId: 'application_system_1809477100686151680',
          systemName: '站台信息系统',
        },
      ],
      edges: [
        { id: '1894295936838979585',
          source: 'application_system_1809477099734044672',
          target: 'appid_1809490732618747904',
        },
        {
          id: '1894295936838979586',
          source: 'appid_1817895141665599489',
          target: 'appid_1809490723680686080',
        },
        {
          id: '1894295936838979587',
          source: 'appid_1817895141665599489',
          target: 'application_system_1809477099729850368',
        },
        {
          id: '1894295936838979588',
          source: 'appid_1817895141665599489',
          target: 'appid_1809490732618747904',
        },
        {
          id: '1894295936838979589',
          source: 'appid_1817895141665599489',
          target: 'application_system_1809477100686151680',
        },
        {
          id: '1894295936838979590',
          source: 'application_system_1809477099734044672',
          target: 'application_system_1809477100686151680',
        },
        {
          id: '1894295936843173889',
          source: 'application_system_1809477099734044672',
          target: 'application_system_1809477099729850368',
        },
        {
          id: '1894295936843173890',
          source: 'appid_1809490724519546880',
          target: 'appid_1817895141665599489',
        },
        {
          id: '1894295936843173891',
          source: 'appid_1809490723680686080',
          target: 'appid_1809490723416444928',
        },
        {
          id: '1894295936843173892',
          source: 'appid_1817895141665599489',
          target: 'appid_1809490725308076032',
        },
        {
          id: '1894295936843173893',
          source: 'appid_1809490723416444928',
          target: 'appid_1809492238449381376',
        },
        {
          id: '1894295936843173894',
          source: 'application_system_1809477099734044672',
          target: 'appid_1809490725308076032',
        },
        {
          id: '1894295936843173895',
          source: 'appid_1809492238449381376',
          target: 'appid_1809491226942640128',
        },
      ],
      serviceLineConfig: {
        id: '1893856559222579202',
        name: '1111',
        presetLine: 9,
      }, },
    {
      nodes: [
        {
          cmdbId: 'appid_1891763263461072896@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1854464721076465664@1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763235363430400@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763300786184192@2',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1895356907502178305',
          source: 'appid_1854464721076465664@1',
          target: 'appid_1891763235363430400@2',
        },
        {
          id: '1895356907506372610',
          source: 'appid_1891763263461072896@0',
          target: 'appid_1854464721076465664@1',
        },
        {
          id: '1895356907506372611',
          source: 'appid_1854464721076465664@1',
          target: 'appid_1891763255118602240@2',
        },
        {
          id: '1895356907506372612',
          source: 'appid_1854464721076465664@1',
          target: 'appid_1891763300786184192@2',
        },
      ],
      serviceLineConfig: {
        id: '1894301523924537346',
        name: 'yrdy',
        presetLine: 7,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'application_system_1809477098664497152',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497154',
          systemName: 'APM内测系统',
        },
      ],
      edges: [
        {
          id: '1894301648692498434',
          source: 'application_system_1809477098664497154',
          target: 'application_system_1809477098664497152',
        },
        {
          id: '1894301648692498435',source: 'application_system_1809477098664497152',
          target: 'application_system_1809477098664497154',
        },
        {
          id: '1894301648696692737',
          source: 'appid_1891763263461072896',
          target: 'appid_1854464721076465664',
        },
        {
          id: '1894301648696692738',
          source: 'appid_1854464721076465664',
          target: 'appid_1891763300786184192',
        },
        {
          id: '1894301648696692739',
          source: 'appid_1854464721076465664',
          target: 'appid_1891763235363430400',
        },
        {
          id: '1894301648696692740',
          source: 'appid_1854464721076465664',
          target: 'appid_1891763255118602240',
        },
      ],
      serviceLineConfig: {
        id: '1894301620745850882',
        name: 'tsgdf',
        presetLine: 14,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'appid_1891763263461072896@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080@1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@1',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763235363430400@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763300786184192@2',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1900011867741417473',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763300786184192@2',
        },
        {
          id: '1900011867745611777',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763255118602240@2',
        },
        {
          id: '1900011867745611778',
          source: 'appid_1891763263461072896@0',
          target: 'appid_1897120647464366080@1',
        },
        {
          id: '1900011867745611779',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763235363430400@2',
        },
        { id: '1900011867745611780',
          source: 'appid_1891763263461072896@0',
          target: 'appid_1891763255118602240@1',
        },
      ],
      serviceLineConfig: {
        id: '1894303141940219906',
        name: 'ooo',
        presetLine: 12,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'application_system_1809477098664497152@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497154@1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@3',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1904009277341818882',
          source: 'application_system_1809477098664497154@1',
          target: 'application_system_1809477098664497152@2',
        },
        {
          id: '1904009277341818883',
          source: 'application_system_1809477098664497152@2',
          target: 'application_system_1809477098664497152@3',
        },
        {
          id: '1904009277341818884',
          source: 'application_system_1809477098664497152@0',
          target: 'application_system_1809477098664497154@1',
        },
      ],
      serviceLineConfig: {
        id: '1894319753904836609',
        name: '22',
        presetLine: 6,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'appid_1891763263461072896@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@1',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1897841195292364802',
          source: 'appid_1891763263461072896@0',
          target: 'appid_1891763255118602240@1',
        },
      ],
      serviceLineConfig: {
        id: '1894648984559980546',
        name: '核查用户',
        presetLine: 8,
      },
    }, {
      nodes: [
        {
          cmdbId: 'application_system_1809477098664497152@-1',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497154@0',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@1',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@2',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1900463813157715969',
          source: 'appid_1897120647464366080@0',
          target: 'appid_1891763300786184192@1',
        },
        {
          id: '1900463813161910273',
          source: 'appid_1897120647464366080@0',
          target: 'appid_1891763255118602240@1',
        },
        {
          id: '1900463813161910274',
          source: 'appid_1897120647464366080@0',
          target: 'appid_1891763235363430400@1',
        },
        {
          id: '1900463813170298881',
          source: 'application_system_1809477098664497154@0',
          target: 'application_system_1809477098664497152@1',
        },
        {
          id: '1900463813178687490',
          source: 'appid_1891763263461072896@-1',
          target: 'appid_1897120647464366080@0',
        },
        {
          id: '1900463813178687491',
          source: 'application_system_1809477098664497152@1',
          target: 'application_system_1809477098664497152@2',
        },
        {
          id: '1900463813178687492',
          source: 'appid_1891763235363430400@1',
          target: 'appid_1891763255118602240@2',
        },
        {
          id: '1900463813187076098',
          source: 'application_system_1809477098664497152@-1',
          target: 'application_system_1809477098664497154@0',
        },
      ],
      serviceLineConfig: {
        id: '1895319123995516930',
        name: '贷款校验',
        presetLine: 4,
      },
    },
    {
      nodes: [ {
          cmdbId: 'appid_1891763263461072896@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080@1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763235363430400@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763300786184192@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@3',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1900104242958438402',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763300786184192@2',
        },
        {
          id: '1900104242962632706',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763255118602240@2',
        },
        {
          id: '1900104242962632707',
          source: 'appid_1891763263461072896@0',
          target: 'appid_1897120647464366080@1',
        },
        {
          id: '1900104242962632708',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763235363430400@2',
        },
        {
          id: '1900104242962632709',
          source: 'appid_1891763300786184192@2',
          target: 'appid_1891763255118602240@3',
        },
      ],
      serviceLineConfig: {
        id: '1895385727571664898',
        name: '转账',
        presetLine: 2,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'appid_1891763255118602240@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080@-1',
          systemName: 'APM内测系统',
        },
        {    cmdbId: 'appid_1891763263461072896@-2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763300786184192@-1',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080@-2',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763263461072896@-3',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1899850134045364226',
          source: 'appid_1897120647464366080@-1',
          target: 'appid_1891763255118602240@0',
        },
        {
          id: '1899850134045364227',
          source: 'appid_1897120647464366080@-2',
          target: 'appid_1891763300786184192@-1',
        },
        {
          id: '1899850134045364228',
          source: 'appid_1891763300786184192@-1',
          target: 'appid_1891763255118602240@0',
        },
        {
          id: '1899850134045364229',
          source: 'appid_1891763263461072896@-2',
          target: 'appid_1897120647464366080@-1',
        },
        {
          id: '1899850134045364230',
          source: 'appid_1891763263461072896@-3',
          target: 'appid_1897120647464366080@-2',
        },
      ],
      serviceLineConfig: {
        id: '1897558782972645378',
        name: '测试路线',
        presetLine: 1,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'appid_1891763235363430400@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@1',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080@-1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763263461072896@-2',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1901890235940323330',
          source: 'appid_1891763235363430400@0',
          target: 'appid_1891763255118602240@1',
        },
        {
          id: '1901890235944517633',
          source: 'appid_1897120647464366080@-1',
          target: 'appid_1891763235363430400@0',
        },  {
          id: '1901890235944517634',
          source: 'appid_1891763263461072896@-2',
          target: 'appid_1897120647464366080@-1',
        },
      ],
      serviceLineConfig: {
        id: '1901890162921684993',
        name: '4353',
        presetLine: 13,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'appid_1891763255118602240@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080@-1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763263461072896@-2',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1901890393369329665',
          source: 'appid_1897120647464366080@-1',
          target: 'appid_1891763255118602240@0',
        },
        {
          id: '1901890393369329666',
          source: 'appid_1891763263461072896@-2',
          target: 'appid_1897120647464366080@-1',
        },
      ],
      serviceLineConfig: {
        id: '1901890308795383810',
        name: '1231',
        presetLine: 15,
      },
    },
    {
      nodes: [   {
          cmdbId: 'appid_1891763300786184192@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080@-1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763263461072896@-2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@1',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1901890515880755201',
          source: 'appid_1897120647464366080@-1',
          target: 'appid_1891763300786184192@0',
        },
        {
          id: '1901890515880755202',
          source: 'appid_1891763300786184192@0',
          target: 'appid_1891763255118602240@1',
        },
        {
          id: '1901890515880755203',
          source: 'appid_1891763263461072896@-2',
          target: 'appid_1897120647464366080@-1',
        },
      ],
      serviceLineConfig: {
        id: '1901890475334418433',
        name: '12342',
        presetLine: 16,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'appid_1891763263461072896@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080@1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763235363430400@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763300786184192@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763255118602240@3',
          systemName: '央行征信系统',
        },
      ],   edges: [
        {
          id: '1901891225527631874',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763300786184192@2',
        },
        {
          id: '1901891225527631875',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763255118602240@2',
        },
        {
          id: '1901891225527631876',
          source: 'appid_1891763263461072896@0',
          target: 'appid_1897120647464366080@1',
        },
        {
          id: '1901891225527631877',
          source: 'appid_1897120647464366080@1',
          target: 'appid_1891763235363430400@2',
        },
        {
          id: '1901891225527631878',
          source: 'appid_1891763300786184192@2',
          target: 'appid_1891763255118602240@3',
        },
        {
          id: '1901891225527631879',
          source: 'appid_1891763235363430400@2',
          target: 'appid_1891763255118602240@3',
        },
      ],
      serviceLineConfig: {
        id: '1901891189796356097',
        name: '热死人',
        presetLine: 18,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'appid_1891763255118602240@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080@-1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763263461072896@-2',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1901891411444350977',
          source: 'appid_1897120647464366080@-1',
          target: 'appid_1891763255118602240@0',
        },
        {
          id: '1901891411444350978',
          source: 'appid_1891763263461072896@-2',
          target: 'appid_1897120647464366080@-1',
        },
      ],serviceLineConfig: {
        id: '1901891378166743041',
        name: '玩儿',
        presetLine: 19,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'application_system_1809477098664497152@0',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497154@1',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@2',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'application_system_1809477098664497152@3',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1904008558089986049',
          source: 'application_system_1809477098664497154@1',
          target: 'application_system_1809477098664497152@2',
        },
        {
          id: '1904008558094180353',
          source: 'application_system_1809477098664497152@2',
          target: 'application_system_1809477098664497152@3',
        },
        {
          id: '1904008558094180354',
          source: 'application_system_1809477098664497152@0',
          target: 'application_system_1809477098664497154@1',
        },
      ],
      serviceLineConfig: {
        id: '1901891459523657730',
        name: '2134',
        presetLine: 20,
      },
    },
    {
      nodes: [
        {
          cmdbId: 'appid_1891763263461072896',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080',
          systemName: 'APM内测系统',
        },
        {
          cmdbId: 'appid_1891763255118602240',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1891763235363430400',
          systemName: '央行征信系统',
        },
        {
          cmdbId: 'appid_1897120647464366080@1',
          systemName: 'APM内测系统',
        }, {
          cmdbId: 'appid_1891763300786184192',
          systemName: '央行征信系统',
        },
      ],
      edges: [
        {
          id: '1904006277286141954',
          source: 'appid_1897120647464366080',
          target: 'appid_1891763255118602240',
        },
        {
          id: '1904006277286141955',
          source: 'appid_1897120647464366080',
          target: 'appid_1891763300786184192',
        },
        {
          id: '1904006277286141956',
          source: 'appid_1891763235363430400',
          target: 'appid_1891763255118602240',
        },
        {
          id: '1904006277294530562',
          source: 'appid_1897120647464366080',
          target: 'appid_1891763235363430400',
        },
        {
          id: '1904006277294530563',
          source: 'appid_1891763263461072896',
          target: 'appid_1897120647464366080',
        },
        {
          id: '1904006277294530564',
          source: 'appid_1891763235363430400',
          target: 'appid_1897120647464366080@1',
        },
      ],
      serviceLineConfig: {
        id: '1901891548954607617',
        name: '2',
        presetLine: 17,
      },
    },
  ],
  alarmLines: [],
}
