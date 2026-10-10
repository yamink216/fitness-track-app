/**
 * FitTrack Pro — Curated Fitness Imagery
 * High-performance, CDN-cached photography for athletic aesthetics.
 */

export const FITNESS_IMAGES = {
  hero: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&auto=format&fit=crop&q=80",
  loginBanner: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&auto=format&fit=crop&q=80",
  registerBanner: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1000&auto=format&fit=crop&q=80",
  workoutHeader: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1000&auto=format&fit=crop&q=80",
  plansHeader: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=1000&auto=format&fit=crop&q=80",
  nutritionHeader: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1000&auto=format&fit=crop&q=80",
  hydrationHeader: "https://images.unsplash.com/photo-1559839914-1b396e6790f9?w=1000&auto=format&fit=crop&q=80",
  progressHeader: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1000&auto=format&fit=crop&q=80",
  goalsHeader: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1000&auto=format&fit=crop&q=80",
  challengesHeader: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=1000&auto=format&fit=crop&q=80",
  achievementsHeader: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1000&auto=format&fit=crop&q=80",
  
  categories: {
    Running: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=500&auto=format&fit=crop&q=80",
    Gym: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80",
    Cycling: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=500&auto=format&fit=crop&q=80",
    Swimming: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&auto=format&fit=crop&q=80",
    Yoga: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&auto=format&fit=crop&q=80",
    Cardio: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80",
    "Strength Training": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=80",
    Walking: "https://images.unsplash.com/photo-1502224562085-639556652f33?w=500&auto=format&fit=crop&q=80",
    Other: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80"
  },

  placeholder: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80"
};

export const getCategoryPhoto = (type) => FITNESS_IMAGES.categories[type] || FITNESS_IMAGES.placeholder;
