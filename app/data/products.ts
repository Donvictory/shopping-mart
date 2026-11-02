export type ProductColor = {
    name: string;
    hex: string;
};

export type Product = {
    id: string;
    name: string;
    price: number;
    category: string;
    image: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
    ageRange?: string;
    badge?: string;
    gallery?: string[];
    galleryCaption?: string;
    fabricNote?: string;
    colors?: ProductColor[];
    sizes?: string[];
};

export const categories = ["Tops", "Bottoms", "Dresses"] as const;

const KID_SIZES = ["2–3", "4–5", "6–7"];
const BIG_KID_SIZES = ["4–5", "6–7", "8–9", "10–11"];
const BABY_SIZES = ["0–6m", "6–12m", "12–24m"];

/** Unsplash photo URL, cropped and compressed for product cards. */
function unsplash(photoId: string, extra = ""): string {
    return `https://images.unsplash.com/${photoId}?w=800&q=75&auto=format&fit=crop${extra}`;
}

/** Main photo plus a closer crop of the same photo for the gallery thumbnail. */
function photoSet(photoId: string) {
    return {
        image: unsplash(photoId, "&h=1000"),
        gallery: [unsplash(photoId, "&h=1000"), unsplash(photoId, "&w=900&h=900&crop=entropy")],
    };
}

export const products: Product[] = [
    {
        id: "product-1",
        name: "Sunny stripe tee",
        price: 12000,
        category: "Tops",
        image: "https://www.figma.com/api/mcp/asset/540ad6bb-9918-4a6e-b0e6-8d30c2ee14da.png",

        description:
            "A little sunshine for their everyday. Our softest organic cotton tee, with happy stripes and an easy, roomy fit for all the important business of being little.",

        rating: 4.9,
        reviewCount: 38,
        ageRange: "Ages 2–8",
        badge: "Little bestseller",

        gallery: [
            "https://www.figma.com/api/mcp/asset/540ad6bb-9918-4a6e-b0e6-8d30c2ee14da.png",
            "https://www.figma.com/api/mcp/asset/f0bd4f0e-9fc6-49c7-9174-217598d79699.png",
        ],

        galleryCaption: "Made for repeat adventures.",
        fabricNote: "100% organic cotton. 100% ready to play.",

        colors: [
            {
                name: "Honey",
                hex: "#D4A346",
            },
            {
                name: "Sage",
                hex: "#8F9D79",
            },
        ],

        sizes: ["2–3", "4–5", "6–7"],
    },

    // MOCK CATALOGUE (product-2 onwards): names, prices, ratings, review
    // counts, badges, fabric notes, colours and sizes are sample values, and
    // photos are Unsplash stock images (unsplash.com/license). Replace them
    // with real product data and photos before launch.
    {
        id: "product-2",
        name: "Everyday play shorts",
        price: 14000,
        category: "Bottoms",
        ...photoSet("photo-1632337950445-ba446cb0e26f"),
        description:
            "Comfy bottoms made for climbing, crawling and cartwheeling. An easy, roomy fit with a soft elastic waist that keeps up with every adventure.",
        rating: 4.8,
        reviewCount: 24,
        ageRange: "Ages 2–8",
        badge: "Everyday essential",
        galleryCaption: "Built for big days of play.",
        fabricNote: "Soft washed chambray. Easy on, easy off.",
        colors: [{ name: "Chambray", hex: "#A9C1DA" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-3",
        name: "Meadow day dress",
        price: 22000,
        category: "Dresses",
        ...photoSet("photo-1724891793770-49b41a5c9731"),
        description:
            "A twirl-ready dress for special days and ordinary ones too. Light and easy to move in, with contrast trim and little straps that stay put.",
        rating: 4.9,
        reviewCount: 31,
        ageRange: "Ages 2–8",
        badge: "New to the orbit",
        galleryCaption: "Made for twirling.",
        fabricNote: "Lightweight breathable cotton. Made for all-day comfort.",
        colors: [{ name: "Meadow green", hex: "#7FB79A" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-4",
        name: "Cloud knit cardigan",
        price: 26000,
        category: "Tops",
        ...photoSet("photo-1739660223481-cd22f4219a86"),
        description:
            "A soft, happy cardigan with playful embroidered details. Buttons up for chilly mornings and comes off easily when the sun comes out.",
        rating: 4.7,
        reviewCount: 19,
        ageRange: "Ages 2–8",
        galleryCaption: "Cosy, colourful, and ready for outside.",
        fabricNote: "Soft cotton knit. Gentle on little skin.",
        colors: [{ name: "Mint", hex: "#BFE3D6" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-5",
        name: "Everyday organic tee",
        price: 9000,
        category: "Tops",
        ...photoSet("photo-1622290291468-a28f7a7dc6a8"),
        description:
            "The plain white tee they'll reach for every day. Soft organic cotton, a relaxed fit and a neckline that won't scratch.",
        rating: 4.8,
        reviewCount: 52,
        ageRange: "Ages 2–8",
        badge: "Little bestseller",
        galleryCaption: "The tee that goes with everything.",
        fabricNote: "100% organic cotton jersey.",
        colors: [{ name: "Cloud white", hex: "#F7F5F0" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-6",
        name: "Little cloud bodysuit",
        price: 8000,
        category: "Tops",
        ...photoSet("photo-1622290291165-d341f1938b8a"),
        description:
            "A gentle everyday bodysuit with easy snaps for quick changes. Soft, stretchy and made for wriggly little ones.",
        rating: 4.9,
        reviewCount: 41,
        ageRange: "Ages 0–2",
        galleryCaption: "Snaps for speedy changes.",
        fabricNote: "Organic cotton rib. Nickel-free snaps.",
        colors: [{ name: "Cloud white", hex: "#F7F5F0" }],
        sizes: BABY_SIZES,
    },
    {
        id: "product-7",
        name: "Garden party dress",
        price: 21000,
        category: "Dresses",
        ...photoSet("photo-1572005658511-783ef941af3b"),
        description:
            "Flutter sleeves and a pretty floral print for birthdays, picnics and every garden party in between.",
        rating: 4.8,
        reviewCount: 17,
        ageRange: "Ages 0–2",
        badge: "New to the orbit",
        galleryCaption: "Picnic-ready from the first wear.",
        fabricNote: "Light cotton voile with a soft lining.",
        colors: [{ name: "Lilac floral", hex: "#C9B6D9" }],
        sizes: BABY_SIZES,
    },
    {
        id: "product-8",
        name: "Strawberry picnic dress",
        price: 23000,
        category: "Dresses",
        ...photoSet("photo-1572005700111-a96a2cb503c2"),
        description:
            "Sweet strawberries on soft cotton with frilled little sleeves. A summer favourite that washes as well as it twirls.",
        rating: 4.9,
        reviewCount: 28,
        ageRange: "Ages 2–8",
        galleryCaption: "Berry sweet, every day.",
        fabricNote: "100% cotton poplin.",
        colors: [
            { name: "Strawberry", hex: "#D9534F" },
            { name: "Cherry red", hex: "#B3262E" },
        ],
        sizes: KID_SIZES,
    },
    {
        id: "product-9",
        name: "Eyelet collar dress",
        price: 25000,
        category: "Dresses",
        ...photoSet("photo-1572005673041-035dec825e2d"),
        description:
            "A crisp Peter Pan collar and delicate eyelet sleeves. Smart enough for special days, soft enough for all of them.",
        rating: 4.7,
        reviewCount: 12,
        ageRange: "Ages 2–8",
        galleryCaption: "Little details, big smiles.",
        fabricNote: "Cotton with broderie anglaise trim.",
        colors: [{ name: "Powder white", hex: "#EEF0F2" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-10",
        name: "Flutter sleeve sky dress",
        price: 22000,
        category: "Dresses",
        ...photoSet("photo-1572005901620-75fdc3a40941"),
        description:
            "Sky-blue cotton with a playful print and ruffled flutter sleeves. Made for running, spinning and lots of cartwheels.",
        rating: 4.8,
        reviewCount: 22,
        ageRange: "Ages 2–8",
        galleryCaption: "Light as a summer sky.",
        fabricNote: "Soft cotton jersey. Easy pull-on fit.",
        colors: [{ name: "Sky", hex: "#8CC3E8" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-11",
        name: "Sunday lace dress",
        price: 28000,
        category: "Dresses",
        ...photoSet("photo-1684244160171-97f5dac39204"),
        description:
            "A soft cream dress with lace panels and little bows, made for celebrations, family photos and Sunday best.",
        rating: 4.9,
        reviewCount: 15,
        ageRange: "Ages 2–8",
        badge: "Special occasion",
        galleryCaption: "For the days worth remembering.",
        fabricNote: "Cotton lace with a soft cotton lining.",
        colors: [{ name: "Cream", hex: "#F3EBDD" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-12",
        name: "Rust knit jumper",
        price: 24000,
        category: "Tops",
        ...photoSet("photo-1773747203295-dc002c421c33"),
        description:
            "A warm, hand-finished knit in a rich rust colour. Raglan sleeves give plenty of room to move and grow.",
        rating: 4.9,
        reviewCount: 26,
        ageRange: "Ages 4–11",
        badge: "Little bestseller",
        galleryCaption: "Snug from the first chilly morning.",
        fabricNote: "Soft wool-blend knit.",
        colors: [{ name: "Rust", hex: "#A65A3E" }],
        sizes: BIG_KID_SIZES,
    },
    {
        id: "product-13",
        name: "Cobalt crew jumper",
        price: 20000,
        category: "Tops",
        ...photoSet("photo-1773238582974-9c0aea55e842"),
        description:
            "A bright, classic crew-neck jumper that layers over shirts and polos. Ready for school days and weekends alike.",
        rating: 4.7,
        reviewCount: 14,
        ageRange: "Ages 4–11",
        galleryCaption: "A classic in their favourite blue.",
        fabricNote: "Cotton-blend knit. Machine washable.",
        colors: [{ name: "Cobalt", hex: "#2346B8" }],
        sizes: BIG_KID_SIZES,
    },
    {
        id: "product-14",
        name: "Berry rib cardigan",
        price: 19000,
        category: "Tops",
        ...photoSet("photo-1710426657844-19a6b285149f"),
        description:
            "A soft ribbed cardigan in a happy berry pink. Easy buttons make it simple for little hands to do up themselves.",
        rating: 4.8,
        reviewCount: 18,
        ageRange: "Ages 2–8",
        galleryCaption: "Bright, soft and easy to wear.",
        fabricNote: "Cotton rib knit.",
        colors: [{ name: "Berry", hex: "#C8285E" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-15",
        name: "Teddy fleece jacket",
        price: 27000,
        category: "Tops",
        ...photoSet("photo-1773672826956-f530157406a2"),
        description:
            "A cuddly teddy-fleece jacket for cooler days and harmattan mornings. Warm, light and soft as a hug.",
        rating: 4.9,
        reviewCount: 21,
        ageRange: "Ages 2–8",
        badge: "New to the orbit",
        galleryCaption: "Like wearing a hug.",
        fabricNote: "Soft recycled-polyester fleece.",
        colors: [{ name: "Blush", hex: "#EBC6C9" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-16",
        name: "Buttercup rain jacket",
        price: 28000,
        category: "Tops",
        ...photoSet("photo-1775886904676-89aab7e33e13"),
        description:
            "A cheerful yellow jacket that keeps the drizzle off on rainy-season walks. Easy to spot, easy to zip.",
        rating: 4.6,
        reviewCount: 9,
        ageRange: "Ages 2–8",
        galleryCaption: "Puddles welcome.",
        fabricNote: "Water-resistant shell with a soft lining.",
        colors: [{ name: "Buttercup", hex: "#F2C230" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-17",
        name: "Checkerboard flannel shirt",
        price: 16000,
        category: "Tops",
        ...photoSet("photo-1641745921163-f37a8b734c90"),
        description:
            "A soft brushed flannel shirt in a bold black-and-white check. Wear it buttoned up or open over a tee.",
        rating: 4.7,
        reviewCount: 11,
        ageRange: "Ages 4–11",
        galleryCaption: "Weekend layers, sorted.",
        fabricNote: "Brushed cotton flannel.",
        colors: [{ name: "Black check", hex: "#2B2B2B" }],
        sizes: BIG_KID_SIZES,
    },
    {
        id: "product-18",
        name: "Flamingo party tee",
        price: 11000,
        category: "Tops",
        ...photoSet("photo-1528145203756-0ed7f01ee120"),
        description:
            "Pink flamingos and tropical leaves on soft cotton. A holiday mood for every day of the week.",
        rating: 4.8,
        reviewCount: 16,
        ageRange: "Ages 2–8",
        galleryCaption: "Holiday vibes, all year.",
        fabricNote: "100% cotton jersey.",
        colors: [{ name: "Tropical print", hex: "#F29BB5" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-19",
        name: "Home run play set",
        price: 23000,
        category: "Bottoms",
        ...photoSet("photo-1759313560181-de61e7235355"),
        description:
            "A sporty button-up shirt and matching shorts with contrast piping. One easy outfit for big days out.",
        rating: 4.7,
        reviewCount: 13,
        ageRange: "Ages 2–8",
        galleryCaption: "Ready for the big game.",
        fabricNote: "Breathable cotton twill.",
        colors: [{ name: "Navy", hex: "#22336B" }],
        sizes: KID_SIZES,
    },
    {
        id: "product-20",
        name: "Denim play shorts",
        price: 13000,
        category: "Bottoms",
        ...photoSet("photo-1764662366872-f8fc4a4f72d2"),
        description:
            "Classic stretch-denim shorts that go with everything. Soft enough for climbing frames, tough enough for every day.",
        rating: 4.6,
        reviewCount: 10,
        ageRange: "Ages 2–8",
        galleryCaption: "Every-day, every-way denim.",
        fabricNote: "Stretch cotton denim with an elastic back waist.",
        colors: [{ name: "Mid blue", hex: "#5B7DB1" }],
        sizes: KID_SIZES,
    },
];
