export type AircraftSeoProfile = {
  code: string;
  slug: string;
  manufacturer: "Airbus" | "Boeing";
  name: string;
  family: string;
  cabinType: "single-aisle" | "wide-body";
  typicalLayout: string;
  bestSeats: string[];
  avoidSeats: string[];
  facts: string[];
  overview: string;
  cabinDetails: string;
  seatAdvice: string;
  routeUse: string;
  searchPhrases: string[];
};

export const aircraftSeoProfiles: AircraftSeoProfile[] = [
  {
    code: "A320",
    slug: "airbus-a320-seat-map",
    manufacturer: "Airbus",
    name: "Airbus A320",
    family: "Airbus A320 family",
    cabinType: "single-aisle",
    typicalLayout: "3-3 economy cabin with A and F as window seats, C and D as aisle seats.",
    bestSeats: ["Exit rows around 12 and 13 on many layouts", "Window seats A and F for views", "Forward rows for faster deplaning"],
    avoidSeats: ["Last rows near lavatories", "Middle seats B and E", "Rows directly before exit rows on some airline layouts"],
    facts: [
      "The A320 family is one of the world's most common short and medium haul aircraft families.",
      "Airlines can configure the A320 very differently, especially around premium economy, extra-legroom rows, and galley placement.",
      "The A320neo variant uses newer engines and wingtip devices for better fuel efficiency than older A320ceo aircraft.",
    ],
    overview:
      "The Airbus A320 is a workhorse narrow-body aircraft used by full-service, hybrid, and low-cost airlines across domestic and regional routes. Travelers search for A320 seat maps because the aircraft appears on everything from short city pairs to three-to-five-hour flights where seat choice can materially change comfort.",
    cabinDetails:
      "Most A320 economy cabins use a simple 3-3 layout with one aisle. Seat letters usually run A, B, C on the left and D, E, F on the right. A and F are window seats, C and D are aisle seats, and B and E are middle seats. Exit-row spacing is often better, but airline-specific rules, tray-table placement, and recline restrictions can vary.",
    seatAdvice:
      "For views, choose A or F away from the wing if the airline seat map shows wing position. For quick boarding and exit, forward aisle seats are usually more practical. For legroom, exit rows are attractive but may have fixed armrests or storage restrictions during takeoff and landing.",
    routeUse:
      "The A320 is heavily used on domestic India routes, European short haul, Southeast Asia sectors, Middle East regional flights, and US point-to-point service.",
    searchPhrases: ["Airbus A320 seat map", "A320 seating layout", "A320 best seats", "A320 window aisle seats"],
  },
  {
    code: "B737",
    slug: "boeing-737-seat-map",
    manufacturer: "Boeing",
    name: "Boeing 737",
    family: "Boeing 737 family",
    cabinType: "single-aisle",
    typicalLayout: "3-3 narrow-body cabin with A and F windows and C and D aisles.",
    bestSeats: ["Forward aisle seats", "Exit rows on many 737 layouts", "Window seats ahead of or behind the wing"],
    avoidSeats: ["Middle seats", "Rear lavatory-adjacent rows", "Non-reclining rows before some exits"],
    facts: [
      "The 737 family spans several generations, including 737NG and 737 MAX variants.",
      "The same aircraft family can have different seat counts depending on the airline's pitch, premium cabin, and exit-row design.",
      "Many airlines use the 737 on high-frequency domestic and regional routes, making it one of the most searched seat maps.",
    ],
    overview:
      "The Boeing 737 is one of aviation's most widely used aircraft families. It is common on domestic, regional, and medium-haul flights, so understanding the 737 seating layout helps travelers choose between window views, aisle access, exit-row legroom, and faster deplaning.",
    cabinDetails:
      "Most Boeing 737 economy layouts use six seats per row in a 3-3 pattern. The left side is commonly A, B, C and the right side D, E, F. A and F are windows, C and D border the aisle, and B and E are middle seats. Exact row numbers, premium cabin boundaries, and extra-legroom zones differ by airline.",
    seatAdvice:
      "Forward rows are useful when connection time is tight. Exit rows can offer more space but may have eligibility rules and fixed armrests. If you want scenery, window seats ahead of the wing often give a cleaner view; if you move often, C or D aisle seats are easier.",
    routeUse:
      "The 737 appears across North America, Europe, India, Southeast Asia, the Middle East, and many leisure routes where airlines need efficient single-aisle capacity.",
    searchPhrases: ["Boeing 737 seat map", "737 seating layout", "B737 best seats", "Boeing 737 window seats"],
  },
  {
    code: "B777",
    slug: "boeing-777-seat-map",
    manufacturer: "Boeing",
    name: "Boeing 777",
    family: "Boeing 777 family",
    cabinType: "wide-body",
    typicalLayout: "Wide-body cabin with left, center, and right seat blocks, often 3-3-3 or 3-4-3 in economy.",
    bestSeats: ["Bulkhead and exit-row economy seats where available", "A and K windows for long-haul views", "Aisle seats C, D, G, and H on common layouts"],
    avoidSeats: ["Middle center seats on dense 3-4-3 layouts", "Rows near galleys on overnight flights", "Last rows with limited recline"],
    facts: [
      "The 777 is a long-haul wide-body aircraft used on high-capacity international routes.",
      "Economy layouts vary significantly: some airlines use 3-3-3 while denser cabins use 3-4-3.",
      "The 777 often carries multiple cabin classes, so the economy row number can start much farther back than on narrow-body aircraft.",
    ],
    overview:
      "The Boeing 777 is a major long-haul aircraft used by global airlines for high-demand international routes. Seat selection matters more on the 777 because flights are often overnight or ultra-long, and economy layouts can range from comfortable to dense depending on airline configuration.",
    cabinDetails:
      "A generic 777 seat map has three cabin blocks separated by two aisles. Many airlines label windows A and K, with aisle seats at the edges of each block. The center section can have three or four seats, so passengers should check whether the airline uses a 3-3-3 or 3-4-3 arrangement before choosing.",
    seatAdvice:
      "Window seats are best for sleeping against the sidewall, while aisle seats help on long flights when you need to move. Center block aisle seats can be useful for couples or families, but center-middle seats are usually least desirable. Bulkhead and exit rows can be excellent, though they may place screens or tray tables in armrests.",
    routeUse:
      "The 777 is common on routes linking Dubai, London, Delhi, Mumbai, Singapore, Bangkok, New York, Doha, and other long-haul hubs.",
    searchPhrases: ["Boeing 777 seat map", "777 seating layout", "B777 best seats", "Boeing 777 economy seats"],
  },
  {
    code: "B787",
    slug: "boeing-787-seat-map",
    manufacturer: "Boeing",
    name: "Boeing 787 Dreamliner",
    family: "Boeing 787 family",
    cabinType: "wide-body",
    typicalLayout: "Wide-body cabin often arranged 3-3-3 in economy with large electronically dimmable windows.",
    bestSeats: ["Window seats for the Dreamliner window experience", "Forward economy rows", "Aisle seats for long-haul mobility"],
    avoidSeats: ["Middle seats in the center block", "Rows close to galley lights", "Seats near lavatory queues"],
    facts: [
      "The 787 uses composite materials and is designed for long-range efficiency.",
      "Its cabin is known for larger windows, modern lighting, and higher humidity than many older long-haul aircraft.",
      "Airlines use the 787 on both long thin routes and premium international services.",
    ],
    overview:
      "The Boeing 787 Dreamliner is popular with travelers because of its modern cabin, large windows, long-haul range, and quieter onboard feel. A 787 seat map helps passengers choose between window views, aisle freedom, and forward cabin convenience before a long flight.",
    cabinDetails:
      "Most 787 economy cabins use a 3-3-3 layout with two aisles. Window seats are usually A and J or A and K depending on airline lettering, while aisle positions sit at the edge of each seat block. Premium economy and business class layouts vary widely, so row numbers can shift between airlines.",
    seatAdvice:
      "For the signature Dreamliner view, choose a window away from the wing. For overnight flights, avoid high-traffic areas near galleys and lavatories. If you need to stand often, an aisle seat is more practical than a window even though the 787 windows are a highlight.",
    routeUse:
      "The 787 often flies long-haul and medium-long routes across India, Europe, Southeast Asia, North America, Japan, Australia, and the Middle East.",
    searchPhrases: ["Boeing 787 seat map", "787 Dreamliner seating layout", "B787 best seats", "Boeing 787 window seats"],
  },
  {
    code: "A350",
    slug: "airbus-a350-seat-map",
    manufacturer: "Airbus",
    name: "Airbus A350",
    family: "Airbus A350 family",
    cabinType: "wide-body",
    typicalLayout: "Modern wide-body cabin commonly arranged 3-3-3 in economy.",
    bestSeats: ["Forward economy aisle seats", "Window seats A and K on many layouts", "Bulkhead rows where extra space is offered"],
    avoidSeats: ["Center middle seats", "Galley-adjacent overnight rows", "Last rows with possible recline limits"],
    facts: [
      "The A350 is a newer-generation Airbus wide-body designed for long-haul efficiency and passenger comfort.",
      "Many passengers like the A350 for its quieter cabin, modern lighting, and long-range routes.",
      "Airline cabin layouts can vary widely across A350-900 and A350-1000 aircraft.",
    ],
    overview:
      "The Airbus A350 is a modern long-haul wide-body aircraft used by premium international airlines and high-capacity global networks. Because many A350 flights are long, choosing the right seat can make a meaningful difference in sleep, workspace, views, and cabin movement.",
    cabinDetails:
      "A generic A350 economy cabin usually has a 3-3-3 layout with two aisles. Window seats are often A and K, aisle seats border each block, and the middle section gives families or groups easier shared seating. Airline-specific layouts can include premium economy, different business class products, and varied lavatory or galley positions.",
    seatAdvice:
      "A350 window seats are attractive for long-haul travelers who want privacy and views. Aisle seats are better when you need frequent access. Bulkhead or extra-legroom rows may be worth choosing, but check whether the airline places bassinets, fixed armrests, or screen equipment there.",
    routeUse:
      "The A350 is commonly seen on long-haul routes through Singapore, Doha, London, Delhi, New York, Tokyo, Sydney, and major European hubs.",
    searchPhrases: ["Airbus A350 seat map", "A350 seating layout", "A350 best seats", "Airbus A350 economy seats"],
  },
];

export function getAircraftSeoProfile(input: string) {
  const normalized = input.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  return (
    aircraftSeoProfiles.find(
      (aircraft) =>
        aircraft.code === normalized ||
        aircraft.slug === input.trim().toLowerCase() ||
        aircraft.slug.replace(/-/g, "") === input.trim().toLowerCase().replace(/[^a-z0-9]/g, ""),
    ) ?? null
  );
}
