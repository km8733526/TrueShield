
import Layout from "@/components/layout/Layout";
import UserProfile from "@/components/profile/UserProfile";

const Profile = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-trueshield-primary mb-1">My Profile</h2>
          <p className="text-trueshield-muted">Manage your personal information and emergency contacts</p>
        </div>
        
        <UserProfile />
      </div>
    </Layout>
  );
};

export default Profile;
