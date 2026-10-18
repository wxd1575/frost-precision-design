export interface Review {
  name: string;
  text: string;
  rating: number;
  when: string;
}

// Verbatim from the Frosty Ice Aircon Google Business profile.
export const GOOGLE_REVIEWS: Review[] = [
  {
    name: "George",
    text: "They fixed my air conditioner and my cold room. Very professional and nice service",
    rating: 5,
    when: "a year ago",
  },
  {
    name: "Michael",
    text: "Great service and professional work.",
    rating: 5,
    when: "4 months ago",
  },
  {
    name: "Remigio",
    text: "They fixed my aircon diligently",
    rating: 5,
    when: "a year ago",
  },
];

export const GOOGLE_RATING = 5.0;
export const GOOGLE_REVIEW_COUNT = 3;
export const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/Frosty+Ice+Aircon";
