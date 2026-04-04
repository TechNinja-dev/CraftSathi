import React from 'react';
import { useExploreStore } from '../store/exploreStore';
import PostCard from './PostCard';
import CategoryTabs from './CategoryTabs';

export default function ExploreFeed() {
  const posts = useExploreStore((state) => state.posts);
  
  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      {/* Scrollable Filter Tabs */}
      <div className="sticky top-0 z-20 bg-[#080211]/80 backdrop-blur-xl pb-2 pt-1 border-b border-transparent">
         <CategoryTabs />
      </div>

      {/* Post List */}
      <div className="flex flex-col gap-6 mt-6 pb-24 lg:pb-8">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
