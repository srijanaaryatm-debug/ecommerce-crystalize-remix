import { useEffect, useMemo, useState } from 'react';
import { Link } from '@remix-run/react';

const services = [
    'Custom Website Design',
    'E-commerce Development',
    'CMS Integration',
    'SEO & Performance Optimization',
];

export default function HomePage() {
    const [visitorName, setVisitorName] = useState('');
    const [greeting, setGreeting] = useState('Welcome to your next digital experience.');
    const [currentTime, setCurrentTime] = useState(() => new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const launchYear = useMemo(() => currentTime.getFullYear(), [currentTime]);

    const handlePreview = () => {
        if (!visitorName.trim()) {
            setGreeting('Tell us your name to generate a personalized preview.');
            return;
        }

        setGreeting(`Hi ${visitorName.trim()}, Raptor Webcraft Technologies can build your dynamic website this week.`);
    };

    return (
        <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)', color: '#f8fafc' }}>
            <section style={{ maxWidth: '900px', margin: '0 auto', padding: '4rem 1.25rem' }}>
                <p style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38bdf8', marginBottom: '0.75rem' }}>
                    Locally Hostable Dynamic Website
                </p>
                <h1 style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', marginBottom: '1rem' }}>Raptor Webcraft Technologies</h1>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '48rem', color: '#cbd5e1' }}>{greeting}</p>

                <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                    {services.map((service) => (
                        <article key={service} style={{ border: '1px solid #334155', borderRadius: '0.75rem', padding: '1rem', backgroundColor: '#0b1220' }}>
                            <h2 style={{ fontSize: '1.05rem' }}>{service}</h2>
                        </article>
                    ))}
                </div>

                <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #334155', backgroundColor: '#0b1220' }}>
                    <label htmlFor="visitor" style={{ display: 'block', marginBottom: '0.5rem', color: '#e2e8f0' }}>
                        See a personalized launch message
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                        <input
                            id="visitor"
                            value={visitorName}
                            onChange={(event) => setVisitorName(event.target.value)}
                            placeholder="Enter your name"
                            style={{ flex: '1 1 240px', borderRadius: '0.5rem', border: '1px solid #475569', padding: '0.65rem 0.75rem', background: '#020617', color: '#f8fafc' }}
                        />
                        <button
                            type="button"
                            onClick={handlePreview}
                            style={{ border: 'none', borderRadius: '0.5rem', padding: '0.65rem 1rem', backgroundColor: '#0ea5e9', color: '#082f49', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Generate Preview
                        </button>
                    </div>
                </div>

                <p style={{ marginTop: '2rem', color: '#94a3b8' }}>
                    Local server time: <strong>{currentTime.toLocaleString()}</strong>
                </p>
                <p style={{ marginTop: '0.75rem', color: '#94a3b8' }}>
                    Looking for the full storefront demo? Visit <Link to="/en" style={{ color: '#38bdf8' }}>/en</Link>.
                </p>
                <p style={{ marginTop: '2rem', fontSize: '0.95rem', color: '#64748b' }}>
                    Developed By- Raptor Webcraft Technologies, {launchYear}-Copyright
                </p>
            </section>
        </main>
    );
}
