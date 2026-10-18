export interface ServiceRegion {
  region: string;
  suburbs: string[];
}

const REGIONS: ServiceRegion[] = [
  {
    region: "Central Ekurhuleni",
    suburbs: [
      "Germiston", "Primrose", "Elsburg", "Lambton", "Delville", "Roodekop", "Rondebult", "Union",
      "Dukathole", "Katlehong", "Katlehong North", "Thokoza", "Vosloorus", "Vosloorus Ext.",
      "Zonkizizwe", "Dawn Park", "Windmill Park", "Ramaphosa", "Reiger Park", "Boksburg",
      "Boksburg North", "Bardene", "Beyers Park", "Freeway Park", "Sunward Park", "Parkrand",
      "Croydon", "Hughes", "Comet", "Ravenswood", "Impala Park", "Farrar Park", "Klippoortjie",
      "Villa Liza",
    ],
  },
  {
    region: "East Rand",
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
    region: "North Ekurhuleni",
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
    region: "South Ekurhuleni",
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
