import { useParams } from 'react-router-dom';

export default function Achievements() {
  const { year } = useParams();
  const currentYear = year || new Date().getFullYear();

  return (
    <div className="min-h-screen">
      <h1 className="text-4xl font-bold text-center py-20">
        {currentYear} Achievements
      </h1>
      <p className="text-center text-gray-400">
        This page will display achievements for {currentYear} with photo gallery
      </p>
    </div>
  );
}
