tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                mono: ['JetBrains Mono', 'monospace'],
                tech: ['Rajdhani', 'sans-serif']
            },
            colors: {
                cyber: {
                    black: '#050505',
                    dark: '#0a0a0a',
                    panel: 'rgba(15, 15, 20, 0.85)',
                    border: 'rgba(100, 255, 218, 0.2)',
                    primary: '#00ff9d',
                    secondary: '#00d2ff',
                    accent: '#ff0055',
                    text: '#e0e0e0',
                    dim: '#505050'
                }
            },
            animation: {
                scan: 'scan 4s linear infinite',
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                glitch: 'glitch 1s linear infinite'
            },
            keyframes: {
                scan: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' }
                },
                glitch: {
                    '2%, 64%': { transform: 'translate(2px, 0) skew(0deg)' },
                    '4%, 60%': { transform: 'translate(-2px, 0) skew(0deg)' },
                    '62%': { transform: 'translate(0, 0) skew(5deg)' }
                }
            }
        }
    }
};
