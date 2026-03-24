import { memo } from 'react';

interface AlgorithmInfoProps {
  title: string;
  description: React.ReactNode;
  characteristics: string[];
  applications: string[];
}

export const AlgorithmInfo = memo(({ title, description, characteristics, applications }: AlgorithmInfoProps) => {
  return (
    <section className="info-section">
      <div className="info-content">
        <h2 className="heading-1">{title}</h2>
        <p className="text-body">
          {description}
        </p>
        <div className="info-grid">
          <div className="card-box">
            <h3 className="heading-2">Características</h3>
            <ul className="list-bullets">
              {characteristics.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>
          <div className="card-box">
            <h3 className="heading-2">Aplicaciones</h3>
            <ul className="list-bullets">
              {applications.map((app, index) => (
                <li key={index}>{app}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
});
