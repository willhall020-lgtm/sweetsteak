const TEST_MATCHES = [
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Spain",
      "tla": "SPA"
    },
    "awayTeam": {
      "name": "Iran",
      "tla": "IRA"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Sweden",
      "tla": "SWE"
    },
    "awayTeam": {
      "name": "Uzbekistan",
      "tla": "UZB"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Spain",
      "tla": "SPA"
    },
    "awayTeam": {
      "name": "Sweden",
      "tla": "SWE"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Iran",
      "tla": "IRA"
    },
    "awayTeam": {
      "name": "Uzbekistan",
      "tla": "UZB"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Spain",
      "tla": "SPA"
    },
    "awayTeam": {
      "name": "Uzbekistan",
      "tla": "UZB"
    },
    "score": {
      "fullTime": {
        "home": 4,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Sweden",
      "tla": "SWE"
    },
    "awayTeam": {
      "name": "Iran",
      "tla": "IRA"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Argentina",
      "tla": "ARG"
    },
    "awayTeam": {
      "name": "Australia",
      "tla": "AUS"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Norway",
      "tla": "NOR"
    },
    "awayTeam": {
      "name": "Jordan",
      "tla": "JOR"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Argentina",
      "tla": "ARG"
    },
    "awayTeam": {
      "name": "Norway",
      "tla": "NOR"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Australia",
      "tla": "AUS"
    },
    "awayTeam": {
      "name": "Jordan",
      "tla": "JOR"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Argentina",
      "tla": "ARG"
    },
    "awayTeam": {
      "name": "Jordan",
      "tla": "JOR"
    },
    "score": {
      "fullTime": {
        "home": 5,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Australia",
      "tla": "AUS"
    },
    "awayTeam": {
      "name": "Norway",
      "tla": "NOR"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "France",
      "tla": "FRA"
    },
    "awayTeam": {
      "name": "Japan",
      "tla": "JAP"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Ivory Coast",
      "tla": "IVO"
    },
    "awayTeam": {
      "name": "Haiti",
      "tla": "HAI"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "France",
      "tla": "FRA"
    },
    "awayTeam": {
      "name": "Ivory Coast",
      "tla": "IVO"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Japan",
      "tla": "JAP"
    },
    "awayTeam": {
      "name": "Haiti",
      "tla": "HAI"
    },
    "score": {
      "fullTime": {
        "home": 4,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "France",
      "tla": "FRA"
    },
    "awayTeam": {
      "name": "Haiti",
      "tla": "HAI"
    },
    "score": {
      "fullTime": {
        "home": 6,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Japan",
      "tla": "JAP"
    },
    "awayTeam": {
      "name": "Ivory Coast",
      "tla": "IVO"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "England",
      "tla": "ENG"
    },
    "awayTeam": {
      "name": "South Korea",
      "tla": "SOU"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Algeria",
      "tla": "ALG"
    },
    "awayTeam": {
      "name": "Ghana",
      "tla": "GHA"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "England",
      "tla": "ENG"
    },
    "awayTeam": {
      "name": "Algeria",
      "tla": "ALG"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "South Korea",
      "tla": "SOU"
    },
    "awayTeam": {
      "name": "Ghana",
      "tla": "GHA"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "England",
      "tla": "ENG"
    },
    "awayTeam": {
      "name": "Ghana",
      "tla": "GHA"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Algeria",
      "tla": "ALG"
    },
    "awayTeam": {
      "name": "South Korea",
      "tla": "SOU"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Brazil",
      "tla": "BRA"
    },
    "awayTeam": {
      "name": "Austria",
      "tla": "AUS"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Canada",
      "tla": "CAN"
    },
    "awayTeam": {
      "name": "Cape Verde",
      "tla": "CAP"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Brazil",
      "tla": "BRA"
    },
    "awayTeam": {
      "name": "Canada",
      "tla": "CAN"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Austria",
      "tla": "AUS"
    },
    "awayTeam": {
      "name": "Cape Verde",
      "tla": "CAP"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Brazil",
      "tla": "BRA"
    },
    "awayTeam": {
      "name": "Cape Verde",
      "tla": "CAP"
    },
    "score": {
      "fullTime": {
        "home": 5,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Austria",
      "tla": "AUS"
    },
    "awayTeam": {
      "name": "Canada",
      "tla": "CAN"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Portugal",
      "tla": "POR"
    },
    "awayTeam": {
      "name": "Senegal",
      "tla": "SEN"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Qatar",
      "tla": "QAT"
    },
    "awayTeam": {
      "name": "Cura\u00e7ao",
      "tla": "CUR"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Portugal",
      "tla": "POR"
    },
    "awayTeam": {
      "name": "Qatar",
      "tla": "QAT"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Senegal",
      "tla": "SEN"
    },
    "awayTeam": {
      "name": "Cura\u00e7ao",
      "tla": "CUR"
    },
    "score": {
      "fullTime": {
        "home": 4,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Portugal",
      "tla": "POR"
    },
    "awayTeam": {
      "name": "Cura\u00e7ao",
      "tla": "CUR"
    },
    "score": {
      "fullTime": {
        "home": 5,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Senegal",
      "tla": "SEN"
    },
    "awayTeam": {
      "name": "Qatar",
      "tla": "QAT"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Netherlands",
      "tla": "NET"
    },
    "awayTeam": {
      "name": "Mexico",
      "tla": "MEX"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Panama",
      "tla": "PAN"
    },
    "awayTeam": {
      "name": "New Zealand",
      "tla": "NEW"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Netherlands",
      "tla": "NET"
    },
    "awayTeam": {
      "name": "Panama",
      "tla": "PAN"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Mexico",
      "tla": "MEX"
    },
    "awayTeam": {
      "name": "New Zealand",
      "tla": "NEW"
    },
    "score": {
      "fullTime": {
        "home": 4,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Netherlands",
      "tla": "NET"
    },
    "awayTeam": {
      "name": "New Zealand",
      "tla": "NEW"
    },
    "score": {
      "fullTime": {
        "home": 6,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Mexico",
      "tla": "MEX"
    },
    "awayTeam": {
      "name": "Panama",
      "tla": "PAN"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Belgium",
      "tla": "BEL"
    },
    "awayTeam": {
      "name": "Switzerland",
      "tla": "SWI"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Scotland",
      "tla": "SCO"
    },
    "awayTeam": {
      "name": "Iraq",
      "tla": "IRA"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Belgium",
      "tla": "BEL"
    },
    "awayTeam": {
      "name": "Scotland",
      "tla": "SCO"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Switzerland",
      "tla": "SWI"
    },
    "awayTeam": {
      "name": "Iraq",
      "tla": "IRA"
    },
    "score": {
      "fullTime": {
        "home": 4,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Belgium",
      "tla": "BEL"
    },
    "awayTeam": {
      "name": "Iraq",
      "tla": "IRA"
    },
    "score": {
      "fullTime": {
        "home": 5,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Switzerland",
      "tla": "SWI"
    },
    "awayTeam": {
      "name": "Scotland",
      "tla": "SCO"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Germany",
      "tla": "GER"
    },
    "awayTeam": {
      "name": "United States",
      "tla": "UNI"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Tunisia",
      "tla": "TUN"
    },
    "awayTeam": {
      "name": "DR Congo",
      "tla": "DR "
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Germany",
      "tla": "GER"
    },
    "awayTeam": {
      "name": "Tunisia",
      "tla": "TUN"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "United States",
      "tla": "UNI"
    },
    "awayTeam": {
      "name": "DR Congo",
      "tla": "DR "
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Germany",
      "tla": "GER"
    },
    "awayTeam": {
      "name": "DR Congo",
      "tla": "DR "
    },
    "score": {
      "fullTime": {
        "home": 4,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "United States",
      "tla": "UNI"
    },
    "awayTeam": {
      "name": "Tunisia",
      "tla": "TUN"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Colombia",
      "tla": "COL"
    },
    "awayTeam": {
      "name": "T\u00fcrkiye",
      "tla": "T\u00dcR"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Czechia",
      "tla": "CZE"
    },
    "awayTeam": {
      "name": "South Africa",
      "tla": "SOU"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Colombia",
      "tla": "COL"
    },
    "awayTeam": {
      "name": "Czechia",
      "tla": "CZE"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "T\u00fcrkiye",
      "tla": "T\u00dcR"
    },
    "awayTeam": {
      "name": "South Africa",
      "tla": "SOU"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Colombia",
      "tla": "COL"
    },
    "awayTeam": {
      "name": "South Africa",
      "tla": "SOU"
    },
    "score": {
      "fullTime": {
        "home": 4,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "T\u00fcrkiye",
      "tla": "T\u00dcR"
    },
    "awayTeam": {
      "name": "Czechia",
      "tla": "CZE"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Croatia",
      "tla": "CRO"
    },
    "awayTeam": {
      "name": "Ecuador",
      "tla": "ECU"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Egypt",
      "tla": "EGY"
    },
    "awayTeam": {
      "name": "Bosnia & Herzegovina",
      "tla": "BOS"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Croatia",
      "tla": "CRO"
    },
    "awayTeam": {
      "name": "Egypt",
      "tla": "EGY"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Ecuador",
      "tla": "ECU"
    },
    "awayTeam": {
      "name": "Bosnia & Herzegovina",
      "tla": "BOS"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Croatia",
      "tla": "CRO"
    },
    "awayTeam": {
      "name": "Bosnia & Herzegovina",
      "tla": "BOS"
    },
    "score": {
      "fullTime": {
        "home": 4,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Ecuador",
      "tla": "ECU"
    },
    "awayTeam": {
      "name": "Egypt",
      "tla": "EGY"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Morocco",
      "tla": "MOR"
    },
    "awayTeam": {
      "name": "Uruguay",
      "tla": "URU"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Paraguay",
      "tla": "PAR"
    },
    "awayTeam": {
      "name": "Saudi Arabia",
      "tla": "SAU"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Morocco",
      "tla": "MOR"
    },
    "awayTeam": {
      "name": "Paraguay",
      "tla": "PAR"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Uruguay",
      "tla": "URU"
    },
    "awayTeam": {
      "name": "Saudi Arabia",
      "tla": "SAU"
    },
    "score": {
      "fullTime": {
        "home": 4,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Morocco",
      "tla": "MOR"
    },
    "awayTeam": {
      "name": "Saudi Arabia",
      "tla": "SAU"
    },
    "score": {
      "fullTime": {
        "home": 5,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "GROUP_STAGE",
    "homeTeam": {
      "name": "Uruguay",
      "tla": "URU"
    },
    "awayTeam": {
      "name": "Paraguay",
      "tla": "PAR"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Spain",
      "tla": "SPA"
    },
    "awayTeam": {
      "name": "Iran",
      "tla": "IRA"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Sweden",
      "tla": "SWE"
    },
    "awayTeam": {
      "name": "Japan",
      "tla": "JAP"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Argentina",
      "tla": "ARG"
    },
    "awayTeam": {
      "name": "Egypt",
      "tla": "EGY"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Australia",
      "tla": "AUS"
    },
    "awayTeam": {
      "name": "South Korea",
      "tla": "SOU"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "France",
      "tla": "FRA"
    },
    "awayTeam": {
      "name": "Qatar",
      "tla": "QAT"
    },
    "score": {
      "fullTime": {
        "home": 4,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Ivory Coast",
      "tla": "IVO"
    },
    "awayTeam": {
      "name": "Algeria",
      "tla": "ALG"
    },
    "score": {
      "fullTime": {
        "home": 0,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "England",
      "tla": "ENG"
    },
    "awayTeam": {
      "name": "Scotland",
      "tla": "SCO"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Canada",
      "tla": "CAN"
    },
    "awayTeam": {
      "name": "Austria",
      "tla": "AUS"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Brazil",
      "tla": "BRA"
    },
    "awayTeam": {
      "name": "Senegal",
      "tla": "SEN"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Tunisia",
      "tla": "TUN"
    },
    "awayTeam": {
      "name": "Switzerland",
      "tla": "SWI"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Portugal",
      "tla": "POR"
    },
    "awayTeam": {
      "name": "Panama",
      "tla": "PAN"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "T\u00fcrkiye",
      "tla": "T\u00dcR"
    },
    "awayTeam": {
      "name": "Mexico",
      "tla": "MEX"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Netherlands",
      "tla": "NET"
    },
    "awayTeam": {
      "name": "Uruguay",
      "tla": "URU"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Ecuador",
      "tla": "ECU"
    },
    "awayTeam": {
      "name": "Morocco",
      "tla": "MOR"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Belgium",
      "tla": "BEL"
    },
    "awayTeam": {
      "name": "Colombia",
      "tla": "COL"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_32",
    "homeTeam": {
      "name": "Germany",
      "tla": "GER"
    },
    "awayTeam": {
      "name": "Croatia",
      "tla": "CRO"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_16",
    "homeTeam": {
      "name": "Spain",
      "tla": "SPA"
    },
    "awayTeam": {
      "name": "Japan",
      "tla": "JAP"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_16",
    "homeTeam": {
      "name": "Argentina",
      "tla": "ARG"
    },
    "awayTeam": {
      "name": "South Korea",
      "tla": "SOU"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_16",
    "homeTeam": {
      "name": "France",
      "tla": "FRA"
    },
    "awayTeam": {
      "name": "Algeria",
      "tla": "ALG"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_16",
    "homeTeam": {
      "name": "England",
      "tla": "ENG"
    },
    "awayTeam": {
      "name": "Canada",
      "tla": "CAN"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_16",
    "homeTeam": {
      "name": "Brazil",
      "tla": "BRA"
    },
    "awayTeam": {
      "name": "Tunisia",
      "tla": "TUN"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_16",
    "homeTeam": {
      "name": "Portugal",
      "tla": "POR"
    },
    "awayTeam": {
      "name": "Mexico",
      "tla": "MEX"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_16",
    "homeTeam": {
      "name": "Netherlands",
      "tla": "NET"
    },
    "awayTeam": {
      "name": "Morocco",
      "tla": "MOR"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "ROUND_OF_16",
    "homeTeam": {
      "name": "Germany",
      "tla": "GER"
    },
    "awayTeam": {
      "name": "Colombia",
      "tla": "COL"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "QUARTER_FINALS",
    "homeTeam": {
      "name": "Spain",
      "tla": "SPA"
    },
    "awayTeam": {
      "name": "Argentina",
      "tla": "ARG"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 1
      },
      "penalties": {
        "home": 2,
        "away": 4
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "QUARTER_FINALS",
    "homeTeam": {
      "name": "France",
      "tla": "FRA"
    },
    "awayTeam": {
      "name": "England",
      "tla": "ENG"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "QUARTER_FINALS",
    "homeTeam": {
      "name": "Brazil",
      "tla": "BRA"
    },
    "awayTeam": {
      "name": "Portugal",
      "tla": "POR"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 0
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "QUARTER_FINALS",
    "homeTeam": {
      "name": "Netherlands",
      "tla": "NET"
    },
    "awayTeam": {
      "name": "Germany",
      "tla": "GER"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "SEMI_FINALS",
    "homeTeam": {
      "name": "Argentina",
      "tla": "ARG"
    },
    "awayTeam": {
      "name": "France",
      "tla": "FRA"
    },
    "score": {
      "fullTime": {
        "home": 3,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "SEMI_FINALS",
    "homeTeam": {
      "name": "Germany",
      "tla": "GER"
    },
    "awayTeam": {
      "name": "Brazil",
      "tla": "BRA"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 2
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "THIRD_PLACE",
    "homeTeam": {
      "name": "France",
      "tla": "FRA"
    },
    "awayTeam": {
      "name": "Germany",
      "tla": "GER"
    },
    "score": {
      "fullTime": {
        "home": 2,
        "away": 1
      },
      "penalties": {
        "home": null,
        "away": null
      }
    }
  },
  {
    "status": "FINISHED",
    "stage": "FINAL",
    "homeTeam": {
      "name": "Argentina",
      "tla": "ARG"
    },
    "awayTeam": {
      "name": "Brazil",
      "tla": "BRA"
    },
    "score": {
      "fullTime": {
        "home": 1,
        "away": 1
      },
      "penalties": {
        "home": 2,
        "away": 4
      }
    }
  }
];

export default async function handler(req, res) {
  const key = process.env.FOOTBALL_API_KEY;
  if (!key) return res.status(500).json({ error: 'FOOTBALL_API_KEY not set' });

  try {
    const r = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
      headers: { 'X-Auth-Token': key }
    });
    if (!r.ok) {
      const text = await r.text();
      return res.status(r.status).json({ error: `API ${r.status}`, detail: text });
    }
    const data = await r.json();
    const realMatches = (data.matches || []).filter(m => m.status === 'FINISHED');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    res.json({ matches: [...TEST_MATCHES, ...realMatches], lastUpdated: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}