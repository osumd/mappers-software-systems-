// pages/index.js

import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to another page
    router.push('/User/signup');
  }, []);

  return (
    // Your component JSX
    <div>
      <h1>Golden Mappers!</h1>
    </div>
  );
};

export default Home;
