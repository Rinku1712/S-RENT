import { Link } from 'react-router-dom';

/**
 * S-RENT Official Brand Logo Component
 * 
 * Features:
 * - Geometric "SR" Monogram inside a modern squircle (#E93636)
 * - Startup-grade typography with "S" and red "-RENT"
 * - Official Tagline ("Sab Rent Par, Saste Rent Par" or custom)
 * - Highly responsive: supports sm, md, lg, xl sizes
 * - Light and dark themes for navbar, footer, sidebar, and hero cards
 */
const BrandLogo = ({
  size = 'md',
  variant = 'full',
  theme = 'light',
  tagline = 'Sab Rent Par, Saste Rent Par',
  clickable = true,
  className = '',
  onClick,
}) => {
  // Dimensions map based on size
  const dimensions = {
    sm: { iconSize: 32, rx: 9, fontSize: 15, titleSize: 18, tagSize: 9, gap: 8 },
    md: { iconSize: 42, rx: 12, fontSize: 19, titleSize: 22, tagSize: 10, gap: 10 },
    lg: { iconSize: 52, rx: 15, fontSize: 24, titleSize: 26, tagSize: 11, gap: 12 },
    xl: { iconSize: 64, rx: 18, fontSize: 30, titleSize: 32, tagSize: 12.5, gap: 14 },
  };

  const dim = dimensions[size] || dimensions.md;
  const isDark = theme === 'dark';

  // SVG Icon element
  const iconElement = (
    <div
      className="brand-icon-squircle"
      style={{
        width: dim.iconSize,
        height: dim.iconSize,
        minWidth: dim.iconSize,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        viewBox="0 0 64 64"
        width={dim.iconSize}
        height={dim.iconSize}
        style={{ display: 'block', overflow: 'visible' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`srIconGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF4D4D" />
            <stop offset="55%" stopColor="#E93636" />
            <stop offset="100%" stopColor="#C62828" />
          </linearGradient>
          <filter id={`srShadow-${size}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#E93636" floodOpacity="0.32" />
          </filter>
        </defs>

        {/* Outer Squircle */}
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx={dim.rx * 1.5}
          fill={`url(#srIconGrad-${size})`}
          filter={`url(#srShadow-${size})`}
        />

        {/* Subtle Top Inner Highlight */}
        <rect
          x="3"
          y="3"
          width="58"
          height="58"
          rx={dim.rx * 1.5 - 1}
          fill="none"
          stroke="#FFFFFF"
          strokeOpacity="0.28"
          strokeWidth="1.2"
        />

        {/* "SR" Monogram Lettering */}
        <text
          x="32"
          y="35"
          fontFamily="'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fontSize="28"
          fontWeight="900"
          letterSpacing="-0.06em"
          fill="#FFFFFF"
          textAnchor="middle"
          dominantBaseline="central"
        >
          SR
        </text>
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    if (clickable) {
      return (
        <Link
          to="/"
          className={`brand-logo-link ${className}`}
          onClick={onClick}
          aria-label="S-RENT Home"
          style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
        >
          {iconElement}
        </Link>
      );
    }
    return (
      <div className={`brand-logo-wrap ${className}`} style={{ display: 'inline-flex' }}>
        {iconElement}
      </div>
    );
  }

  // Content with text block
  const content = (
    <div
      className={`brand-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dim.gap,
        textDecoration: 'none',
        userSelect: 'none',
      }}
    >
      {iconElement}
      <div
        className="brand-text-stack"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          lineHeight: 1.15,
        }}
      >
        <span
          className="brand-wordmark"
          style={{
            fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            fontWeight: 900,
            fontSize: dim.titleSize,
            letterSpacing: '-0.03em',
            color: isDark ? '#FFFFFF' : '#171717',
            display: 'inline-flex',
            alignItems: 'baseline',
          }}
        >
          S<span style={{ color: '#E93636' }}>-RENT</span>
        </span>
        {variant === 'full' && tagline && (
          <span
            className="brand-tagline-text"
            style={{
              fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
              fontSize: dim.tagSize,
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: isDark ? '#94A3B8' : '#737373',
              marginTop: 2,
              whiteSpace: 'nowrap',
            }}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );

  if (clickable) {
    return (
      <Link
        to="/"
        className={`brand-logo-link ${className}`}
        onClick={onClick}
        aria-label="S-RENT Homepage"
        style={{ textDecoration: 'none' }}
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default BrandLogo;

