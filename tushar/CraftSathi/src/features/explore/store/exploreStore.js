import { create } from 'zustand';

// Dummy Data
const initialPosts = [
  {
    id: 'post_1',
    artisanName: 'Maya Sharma',
    username: '@maya_ceramics',
    location: 'Jaipur, India',
    profileImage: 'https://i.pravatar.cc/150?img=47',
    craftImage: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=2070&auto=format&fit=crop',
    caption: 'Just finished this 12-inch ceremonial bowl. The indigo depth came out exactly how I imagined after the second firing. #bluepottery #jaipurcrafts',
    likes: 2400,
    comments: 128,
    category: 'Pottery',
    hasAIAudio: true,
    aiStory: "The blue glaze of Jaipur isn't just color; it's the captured sky of a thousand summers. This piece mirrors the tranquility of an empty desert palace at dawn."
  },
  {
    id: 'post_2',
    artisanName: 'Elena Rossi',
    username: '@rossi_glass',
    location: 'Venice, Italy',
    profileImage: 'https://i.pravatar.cc/150?img=33',
    craftImage: 'https://images.unsplash.com/photo-1543886733-4cc0ed2bcdd2?q=80&w=2070&auto=format&fit=crop',
    caption: 'Breath and heat. The dance of Murano glass is never the same twice. My latest "Liquid Fire" series is now live on my profile.',
    likes: 1800,
    comments: 84,
    category: 'Jewelry',
    hasAIAudio: false,
    aiStory: null
  },
  {
    id: 'post_3',
    artisanName: 'Ahmed Yilmaz',
    username: '@yilmaz_wood',
    location: 'Istanbul, Turkey',
    profileImage: 'https://i.pravatar.cc/150?img=11',
    craftImage: 'https://images.unsplash.com/photo-1605649487212-4dcb186f9f59?q=80&w=2070&auto=format&fit=crop',
    caption: 'Olive wood from a centuries-old tree. Respecting the grain means letting the wood tell its own story where to curve and where to stay straight. #woodworking',
    likes: 3105,
    comments: 215,
    category: 'Woodwork',
    hasAIAudio: true,
    aiStory: "From a seed planted before empires fell, the rings in this wood have seen rainfall of forgotten centuries. Feel the history carved into submission."
  },
  {
    id: 'post_4',
    artisanName: 'Sakura Tanaka',
    username: '@sakura.textiles',
    location: 'Kyoto, Japan',
    profileImage: 'https://i.pravatar.cc/150?img=20',
    craftImage: 'https://images.unsplash.com/photo-1596440265738-9bf42416c805?q=80&w=2070&auto=format&fit=crop',
    caption: 'Preparing threads for an upcoming Shibori exhibition. The indigo vat is finally ripe. #shibori #indigo',
    likes: 5420,
    comments: 310,
    category: 'Textiles',
    hasAIAudio: false,
    aiStory: null
  },
  {
    id: 'post_5',
    artisanName: 'Sarah Jenkins',
    username: '@sarahj.potts',
    location: 'Portland, USA',
    prefix: '',
    profileImage: 'https://i.pravatar.cc/150?img=5',
    craftImage: 'https://images.unsplash.com/photo-1565193566173-7a0ce3d5e825?q=80&w=2070&auto=format&fit=crop',
    caption: 'My first foray into raku firing. Complete unpredictability. Complete surrender. Loving these wild metallic flashes.',
    likes: 902,
    comments: 45,
    category: 'Pottery',
    hasAIAudio: true,
    aiStory: "Born from earth and baptized in flame, the random cracks of raku are the signatures of fire itself playing on the clay."
  }
];

export const useExploreStore = create((set) => ({
  posts: initialPosts,
  likedPosts: new Set(),
  savedPosts: new Set(),
  filters: [],
  selectedCategory: 'All Crafts',
  
  toggleLike: (postId) => set((state) => {
    const newLikedPosts = new Set(state.likedPosts);
    const newPosts = [...state.posts];
    const postIndex = newPosts.findIndex(p => p.id === postId);
    
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
      if (postIndex !== -1) newPosts[postIndex].likes -= 1;
    } else {
      newLikedPosts.add(postId);
      if (postIndex !== -1) newPosts[postIndex].likes += 1;
    }
    
    return { likedPosts: newLikedPosts, posts: newPosts };
  }),
  
  toggleSave: (postId) => set((state) => {
    const newSaved = new Set(state.savedPosts);
    if (newSaved.has(postId)) {
      newSaved.delete(postId);
    } else {
      newSaved.add(postId);
    }
    return { savedPosts: newSaved };
  }),
  
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
