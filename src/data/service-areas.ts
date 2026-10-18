export interface ServiceRegion {
  region: string;
  suburbs: string[];
}

/**
 * Ordered by the corridors the Google Ads campaign targets: the
 * Sandton–Midrand–Centurion triangle first, then the Kempton Park–Edenvale–Boksburg
 * route, then the rest of the East Rand around the Germiston base.
 */
const REGIONS: ServiceRegion[] = [
  {
    region: "Sandton & Bryanston",
    suburbs: [
      "Sandton", "Sandown", "Bryanston", "Rivonia", "Morningside", "Sunninghill", "Woodmead",
      "Benmore Gardens", "Strathavon", "Wierda Valley", "Illovo", "Hurlingham", "Atholl",
      "Melrose Arch", "Parkmore", "River Club", "Marlboro", "Kramerville", "Wynberg",
      "Gallo Manor", "Kelvin", "Buccleuch",
    ],
  },
  {
    region: "Midrand & Kyalami",
    suburbs: [
      "Midrand", "Halfway House", "Vorna Valley", "Noordwyk", "Carlswald", "Randjespark",
      "Erand Gardens", "Kyalami", "Barbeque Downs", "Waterfall", "Waterfall City", "Blue Hills",
      "Glen Austin", "Crowthorne", "President Park", "Country View", "Summerset",
    ],
  },
  {
    region: "Centurion & Irene",
    suburbs: [
      "Centurion", "Irene", "Midstream", "Midstream Estate", "Highveld", "Eldoraigne",
      "Wierdapark", "Lyttelton", "Lyttelton Manor", "Clubview", "Doringkloof", "Rooihuiskraal",
      "Thatchfield", "Celtisdal", "Amberfield", "Mnandi", "Olievenhoutbosch", "Zwartkop",
      "Valhalla", "Pierre van Ryneveld", "Kosmosdal", "Raslouw", "The Reeds", "Sunderland Ridge",
    ],
  },
  {
    region: "Kempton Park & Edenvale",
    suburbs: [
      "Kempton Park", "Kempton Park Central", "Kempton Park West", "Kempton Park CBD", "Rhodesfield",
      "Spartan", "Glen Marais", "Terenure", "Birch Acres", "Nimrod Park", "Norkem Park",
      "Allen Grove", "Van Riebeeck Park", "Edleen", "Chloorkop", "Bredell", "Pomona", "Klipfontein",
      "Esselen Park", "Tembisa", "Tembisa Central", "Ivory Park", "Winnie Mandela", "Phola Park",
      "Rabie Ridge", "Kaalfontein", "Allandale", "Clayville", "Olifantsfontein", "Edenvale",
      "Eastleigh", "Greenstone", "Hurlyvale", "Illiondale", "Modderfontein", "Sebenza", "Dowerglen",
      "Meadowdale", "Isando", "OR Tambo International Airport",
    ],
  },
  {
    region: "Boksburg & Germiston",
    suburbs: [
      "Boksburg", "Boksburg North", "Bardene", "Beyers Park", "Freeway Park", "Sunward Park",
      "Parkrand", "Croydon", "Hughes", "Comet", "Ravenswood", "Impala Park", "Farrar Park",
      "Klippoortjie", "Villa Liza", "Germiston", "Primrose", "Elsburg", "Lambton", "Delville",
      "Roodekop", "Rondebult", "Union", "Dukathole", "Katlehong", "Katlehong North", "Thokoza",
      "Vosloorus", "Vosloorus Ext.", "Zonkizizwe", "Dawn Park", "Windmill Park", "Ramaphosa",
      "Reiger Park",
    ],
  },
  {
    region: "Benoni, Springs & Brakpan",
    suburbs: [
      "Benoni", "Lakefield", "Rynfield", "Northmead", "Farrarmere", "Fairlead", "Benoni Central",
      "Norton’s Home Estate", "Daveyton", "Etwatwa", "Wattville", "Actonville", "Crystal Park",
      "Putfontein", "Cloverdene", "Benoni AH", "Brakpan", "Brakpan North", "Brenthurst", "Anzac",
      "Leachville", "Dalpark", "Rand Collieries", "Geluksdal", "Tsakane", "Springs",
      "Springs Central", "Anerley", "Casseldale", "Modder East", "Selection Park", "Strubenvale",
      "Nuffield", "Kwa-Thema", "Payneville", "Bakerton", "Duduza", "Nigel", "Nigel Ext.",
      "Alrapark", "Ferryvale", "Simpson", "Dunnottar", "Welbekend", "Langaville",
      "Chief A. Luthuli Park",
    ],
  },
  {
    region: "Alberton & Surrounds",
    suburbs: [
      "Alberton", "Alberton North", "Albertsdal", "Alberante", "Florentia", "Randhart",
      "Verwoerdpark", "Brackenhurst", "Brackendowns", "Mayberry Park", "Palm Ridge",
      "New Market Park", "New Redruth", "Raceview",
    ],
  },
  {
    region: "Outlying areas",
    suburbs: [
      "Bapsfontein", "Holfontein", "Breswol", "Kanana", "Lindelani Village", "Thinasonke",
      "Elandsfontein", "Rietfontein",
    ],
  },
];

// Suburbs can repeat across regions (for example Thokoza); show each only once, under the first region.
const seen = new Set<string>();
export const SERVICE_REGIONS: ServiceRegion[] = REGIONS.map(({ region, suburbs }) => ({
  region,
  suburbs: suburbs.filter((name) => {
    const key = name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }),
}));

/** Every served suburb once, A to Z. Used for autocomplete in the quote form. */
export const SERVICE_SUBURBS: string[] = SERVICE_REGIONS.flatMap((r) => r.suburbs).sort((a, b) =>
  a.localeCompare(b, "en"),
);
