import React, { useEffect, useState } from "react";
import BASE_URL from "../api";
import { useAuth } from "../context/authcontext";

function Profile() {
  const [profile, setProfile] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      fetch(`${BASE_URL}/api/profile?userId=${currentUser.uid}`)
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(err => console.log(err));
    }
  }, [currentUser]);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      {profile ? (
        <div className="bg-gray-800 p-4 rounded-lg shadow">
          <pre className="whitespace-pre-wrap">{JSON.stringify(profile, null, 2)}</pre>
        </div>
      ) : (
        <p className="animate-pulse">Loading profile data...</p>
      )}
    </div>
  );
}

export default Profile;
