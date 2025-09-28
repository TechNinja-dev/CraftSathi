// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../App.jsx';
// import { Loader2, Trash2 } from 'lucide-react';

// const MyStuff = () => {
//   const { user } = useAuth();
//   const [generatedImages, setGeneratedImages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [imageToDelete, setImageToDelete] = useState(null);

//   const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

//   const fetchImages = async () => {
//     if (!user) {
//       setLoading(false);
//       return;
//     }
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${API_URL}/api/mystuff?userId=${user.uid}`);
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to fetch images from backend.');
//       }
//       const data = await response.json();
//       setGeneratedImages(data.images);
//     } catch (err) {
//       console.error('Error fetching images:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchImages();
//   }, [user, API_URL]);

//   const handleDeleteClick = (image) => {
//     setImageToDelete(image);
//     setShowModal(true);
//   };

//   const confirmDelete = async () => {
//     if (!imageToDelete || !user) {
//       return;
//     }

//     setShowModal(false);
//     setLoading(true);
    
//     try {
//       // You will provide the backend endpoint for this
//       const response = await fetch(`${API_URL}/api/delete-image?imageId=${imageToDelete.id}&userId=${user.uid}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.detail || 'Failed to delete image.');
//       }

//       // Refresh the image list after successful deletion
//       await fetchImages();
//     } catch (err) {
//       console.error('Error deleting image:', err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//       setImageToDelete(null);
//     }
//   };

//   if (!user) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-brand-bg pt-20">
//         <h1 className="text-4xl font-bold text-brand-text mb-4">You need to be logged in.</h1>
//         <p className="text-lg text-gray-600 mb-6">
//           Please sign in to save and view your generated images.
//         </p>
//         <Link 
//           to="/auth" 
//           className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
//         >
//           Sign In
//         </Link>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-brand-bg pt-20">
//         <Loader2 className="animate-spin text-brand-primary" size={48} />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-brand-bg pt-20">
//         <p className="text-xl text-red-600">Error: {error}</p>
//       </div>
//     );
//   }

//   if (generatedImages.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-brand-bg pt-20">
//         <h1 className="text-4xl font-bold text-brand-text mb-4">Nothing to see here yet.</h1>
//         <p className="text-lg text-gray-600 mb-6">
//           You haven't generated any images. Get started now!
//         </p>
//         <Link 
//           to="/photo" 
//           className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
//         >
//           Generate Images
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-brand-bg p-8 pt-20">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-5xl md:text-6xl font-bold font-display text-brand-text mb-8 text-center">
//           My Creations
//         </h1>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {generatedImages.map((image) => (
//             <div key={image.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col relative">
//               <img src={image.image_url} alt={image.prompt} className="w-full h-64 object-cover" />
//               <div className="p-4 bg-gray-50 flex-grow relative">
//                 <p className="text-gray-700 text-sm font-semibold">
//                   {new Date(image.created_at.split(".")[0]).toLocaleDateString("en-US",
//                   {weekday: "long",
//                   year: "numeric",
//                   month: "long",
//                   day: "numeric",})}
//                 </p>
//                 <button
//                   onClick={() => handleDeleteClick(image)}
//                   className="absolute bottom-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
      
//       {/* Confirmation Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
//           <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
//             <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
//             <p className="text-gray-700 mb-6">
//               Are you sure you want to delete this image? This action cannot be undone.
//             </p>
//             <div className="flex justify-center gap-4">
//               <button
//                 onClick={confirmDelete}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
//               >
//                 Delete
//               </button>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyStuff;


import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../App.jsx';
import { Loader2, Trash2 } from 'lucide-react';

const MyStuff = () => {
  const { user } = useAuth();
  const [generatedImages, setGeneratedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const fetchImages = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/mystuff?userId=${user.uid}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to fetch images from backend.');
      }
      const data = await response.json();
      setGeneratedImages(data.images);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [user, API_URL]);

  const handleDeleteClick = (image) => {
    setImageToDelete(image);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!imageToDelete || !user) {
      return;
    }

    setShowModal(false);
    setLoading(true);
    
    try {
      // You will provide the backend endpoint for this
      const response = await fetch(`${API_URL}/api/delete-image?imageId=${imageToDelete.id}&userId=${user.uid}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to delete image.');
      }

      // Refresh the image list after successful deletion
      await fetchImages();
    } catch (err) {
      console.error('Error deleting image:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      setImageToDelete(null);
    }
  };

  // UI-only: group images by formatted date and sort groups so latest date is first
  const groupImagesByDate = (images) => {
    const groups = {};
    images.forEach((image) => {
      // Keep same parsing method as before for consistency
      const dateObj = new Date(image.created_at.split(".")[0]);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!groups[formattedDate]) {
        groups[formattedDate] = {
          dateObj,
          images: [],
        };
      }

      groups[formattedDate].images.push(image);

      // keep the latest dateObj within the group (in case multiple images same formatted day)
      if (dateObj > groups[formattedDate].dateObj) {
        groups[formattedDate].dateObj = dateObj;
      }
    });

    // Convert to array and sort by dateObj desc (newest first)
    return Object.entries(groups)
      .map(([dateLabel, value]) => ({
        dateLabel,
        dateObj: value.dateObj,
        images: value.images,
      }))
      .sort((a, b) => b.dateObj - a.dateObj);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-brand-bg pt-20">
        <h1 className="text-4xl font-bold text-brand-text mb-4">You need to be logged in.</h1>
        <p className="text-lg text-gray-600 mb-6">
          Please sign in to save and view your generated images.
        </p>
        <Link 
          to="/auth" 
          className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg pt-20">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg pt-20">
        <p className="text-xl text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (generatedImages.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-brand-bg pt-20">
        <h1 className="text-4xl font-bold text-brand-text mb-4">Nothing to see here yet.</h1>
        <p className="text-lg text-gray-600 mb-6">
          You haven't generated any images. Get started now!
        </p>
        <Link 
          to="/photo" 
          className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg shadow-md hover:bg-brand-primary-hover transition-colors"
        >
          Generate Images
        </Link>
      </div>
    );
  }

  const groupedSections = groupImagesByDate(generatedImages);

  return (
    <div className="min-h-screen bg-brand-bg p-8 pt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold font-display text-brand-text mb-8 text-center">
          My Creations
        </h1>

        {groupedSections.map((section) => (
          <div key={section.dateLabel} className="mb-12">
            <h2 className="text-2xl font-semibold text-brand-text mb-4 border-b-2 border-gray-700 pb-2">
              {section.dateLabel}
            </h2>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {section.images.map((image) => (
                <div key={image.id} className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col relative">
                  <img src={image.image_url} alt={image.prompt} className="w-full h-64 object-cover" />
                  <div className="p-4 bg-gray-50 flex-grow relative">
                    {/* Date moved to section header per UI requirement; keep card footer minimal */}
                    <button
                      onClick={() => handleDeleteClick(image)}
                      className="absolute bottom-4 right-4 p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyStuff;
