import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export function SunIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <circle cx='12' cy='12' r='4.2' />
      <path d='M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6' />
    </svg>
  );
}

export function MoonIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='M20 14.2A8.4 8.4 0 1 1 9.8 4a7 7 0 0 0 10.2 10.2z' />
    </svg>
  );
}

export function SystemIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <rect x='3' y='4.5' width='18' height='12.5' rx='2' />
      <path d='M8.5 20h7M12 17v3' />
    </svg>
  );
}

export function AlertCircleIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <circle cx='12' cy='12' r='9' />
      <path d='M12 8v5M12 16h.01' />
    </svg>
  );
}

export function InboxIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='M3 13.5V5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v8' />
      <path d='M3 13.5h5l2 3h4l2-3h5V18a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3z' />
    </svg>
  );
}

export function SpinnerIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='M21 12a9 9 0 1 1-9-9' />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <circle cx='12' cy='12' r='9' />
      <path d='m8.3 12.4 2.4 2.4 5-5' />
    </svg>
  );
}

export function WifiOffIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='M2.5 8.2A16.8 16.8 0 0 1 21.5 8M5.6 11.6a12 12 0 0 1 12.8 0M9 15a6.8 6.8 0 0 1 6 0M12 18.5h.01' />
      <path d='M3 3l18 18' />
    </svg>
  );
}

export function FlagIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='M5 3v18' />
      <path d='M5 4h10l-2.3 3L15 10H5' />
    </svg>
  );
}

export function MapPinIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11z' />
      <circle cx='12' cy='10' r='2.1' />
    </svg>
  );
}

export function UsersIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='M16.5 19v-1.4a3.1 3.1 0 0 0-3.1-3.1H8.6a3.1 3.1 0 0 0-3.1 3.1V19' />
      <circle cx='11' cy='8.4' r='2.8' />
      <path d='M20.6 19v-1a2.5 2.5 0 0 0-2.5-2.5h-1' />
      <path d='M16.7 5.9a2.3 2.3 0 0 1 0 4.5' />
    </svg>
  );
}

export function ChevronLeftIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='m14.5 6.5-5 5.5 5 5.5' />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='m9.5 6.5 5 5.5-5 5.5' />
    </svg>
  );
}

export function TargetIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <circle cx='12' cy='12' r='8' />
      <circle cx='12' cy='12' r='4' />
      <circle cx='12' cy='12' r='1.2' />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='m6.5 9.5 5.5 5 5.5-5' />
    </svg>
  );
}

export function TrophyIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='M8 4h8v2a4 4 0 0 1-8 0z' />
      <path d='M8 6H5.5A2.5 2.5 0 0 0 3 8.5 4.5 4.5 0 0 0 7.5 13H8' />
      <path d='M16 6h2.5A2.5 2.5 0 0 1 21 8.5a4.5 4.5 0 0 1-4.5 4.5H16' />
      <path d='M12 10v6M9 20h6M10 16h4' />
    </svg>
  );
}

export function LogOutIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <path d='M14.5 17.5 20 12l-5.5-5.5' />
      <path d='M20 12H9.5' />
      <path d='M10.5 20H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4.5' />
    </svg>
  );
}

export function LockIcon(props: IconProps): JSX.Element {
  return (
    <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' {...props}>
      <rect x='5' y='10' width='14' height='10' rx='2' />
      <path d='M8.5 10V8a3.5 3.5 0 1 1 7 0v2' />
    </svg>
  );
}
